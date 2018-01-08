const verifyArguments = require("../verify_arguments");
const Answer = require("./Answer");

class Question {
  constructor() {
    this._summary;
    this._description;
    this._answers = [];
    this._answered = false;
    this._streabove;
  }
  addAnswer(answer) {
    verifyArguments(arguments, Answer);
    this._answers.push(answer);
    answer.__tellQuestionAbove(this);
    return this;
  }
  getAnswers() {
    return this._answers;
  }
  get answers() {
    return this._answers;
  }
  setSummary(summary) {
    this._summary = summary;
    return this;
  }
  set summary(summary) {
    this.setSummary(summary);
  }
  get summary() {
    return this._summary;
  }
  _setAnswered(value) {
    if(this.answered) throw new Error("Cannot answer a question twice");
    this._answered = value;
  }
  get answered() {
    return this._answered;
  }
  __tellAnswered(answer) {
    this._setAnswered(true);
    if(this._streabove) this._streabove.__tellAnswered(this); // this._streabove?.__tellAnswered(this)
  }
  __tellStreamAbove(streabove) {
    this._streabove = streabove;
  }
}

module.exports = Question;
