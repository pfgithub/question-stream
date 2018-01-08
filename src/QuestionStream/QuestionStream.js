/* global Promise */
// @flow

const verifyArguments = require("../verify_arguments");
const EventEmitter = require("events");
const Question = require("./Question");

class MergeStream extends EventEmitter { // TODO a mergestream with no questions is marked incomplete fixthis
  constructor() {
    super();

    this._questions = [];
    this._children = [];
    this._completed = false;
    this._parents = [];
  }
  getFlatQuestionList() {
    const flatQuestionList = [];
    this._children.forEach(child => {
      flatQuestionList.push(...child.getFlatQuestionList());
    });
    return this._questions.concat(flatQuestionList);
  }
  _setCompleted() {
    this._completed = true;
    this.emit("completed");
    this._tellParent("__tellCompleted", this);
  }
  _tellParent(tell, ...args) {
    this._parents.forEach(parent => {
      parent[tell](...args);
    });
  }
  get completed() {
    return this._completed;
  }
  get questions() { // TODO keep array of questions so this only has to get the flat question list after a question was asked to make multiple calls to this faster
    return this.getFlatQuestionList();
  }
  /*async*/ allCompleted() {
    if(this.completed) return new Promise(resolve => resolve());
    return new Promise(resolve => {
      this.on("completed", () => resolve());
    });
  }
  addChild(stream) {
    stream.__tellParent(this);
    stream.questions.forEach(q => this.__notifyAsked(q));
    this._children.push(stream);
  }
  ask(question) {
    verifyArguments(arguments, Question);
    this._questions.push(question);
    question.__tellStreamAbove(this);
    this.__notifyAsked(question);
    return this;
  }
  __notifyAsked(question) {
    this.emit("question", question);
    this._tellParent("__notifyAsked", question);
  }
  __tellParent(stream) {
    this._parents.push(stream);
  }
  _checkCompletion() {
    let remaining = this._questions.length;
    for(let question of this._questions) {
      if(question.answered) remaining--;
    }
    let childrenRemaining = this._children.length;
    for(let child of this._children) {
      if(child.completed) childrenRemaining--;
    }
    if(!remaining &&  !childrenRemaining) {
      this._setCompleted();
      this._tellParent("__tellCompleted", this);
    }
  }
  __tellAnswered(question) {
    this._checkCompletion();
  }
  __tellCompleted(stream) {
    this._checkCompletion();
  }
}

module.exports = MergeStream;
