/**
 * Is the answer class
 * @class Answer
 */

class Answer {
  constructor() {
    this._summary;
    this._description;
    this._callback;
    this._qabove;
  }
  /**
  * Sets the label for the button the user will click to choose this answer
  *
  *
  * @method setSummary
  * @param {String} summary The button label
  * @return {Answer} Returns itself for easy chaining
  */
  setSummary(summary) {
    this._summary = summary;
    return this;
  }
  /**
  * Is the label (see setSummary)
  *
  * @property summary
  * @type {String} The button label
  */
  set summary(summary) {
    this.setSummary(summary);
  }
  get summary() {
    return this._summary;
  }
  /**
  * Sets the long markdown description giving information about the button the user will click to choose this answer
  *
  * @method setDescription
  * @param {String} description The long markdown description of this answer
  * @return {Answer} Returns itself for easy chaining
  */
  setDescription(description) {
    this._description = description;
    return this;
  }
  /**
  * Is the description (see setDescription)
  *
  * @property description
  * @type {String} The description
  */
  set description(description) {
    this.setDescription(description);
  }
  get description() {
    return this._description;
  }
  /**
  * Sets the callback method for when the answer is chosen
  *
  * @method setCallback
  * @param {() => {}} callback The method that will be called. No arguments passed.
  * @return {Answer} Returns itself for easy chaining
  */
  setCallback(callback) {
    this._callback = callback;
    return this;
  }
  __tellQuestionAbove(qabove) {
    this._qabove = qabove;
  }
  /**
  * Picks this answer.
  *
  * @method choose
  */
  choose() {
    if(this._callback) this._callback();
    if(this._qabove) this._qabove.__tellAnswered(this);
  }
}

module.exports = Answer;
