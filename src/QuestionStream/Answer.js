class Answer {
  constructor() {
    this._summary;
    this._description;
    this._callback;
    this._qabove;
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
  setDescription(description) {
    this._description = description;
    return this;
  }
  set description(description) {
    this.setDescription(description);
  }
  get description() {
    return this._description;
  }
  setCallback(callback) {
    this._callback = callback;
    return this;
  }
  __tellQuestionAbove(qabove) {
    this._qabove = qabove;
  }
  choose() {
    if(this._callback) this._callback();
    if(this._qabove) this._qabove.__tellAnswered(this);
  }
}

module.exports = Answer;
