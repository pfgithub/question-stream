/*global describe it Promise */
const assert = require("assert");
const chai = require("chai");
chai.use(require("chai-truthy"));
const expect = chai.expect;
const {QuestionStream, Question, Answer} = require("../index.js")

function mochaAsync(fn) {
  return (done) => {
    fn().then(() => done()).catch(err => done(err));
  };
}

function generateTestQuestion() {
  return (new Question)
    .setSummary(`${Math.random()}`)
    .addAnswer((new Answer).setSummary(`${Math.random()}`).setDescription(`${Math.random()}`))
    .addAnswer((new Answer).setSummary(`${Math.random()}`).setDescription(`${Math.random()}`))
    .addAnswer((new Answer).setSummary(`${Math.random()}`).setDescription(`${Math.random()}`));
}

describe("QuestionStream", () => {
  describe(".constructor", () => {

  });
});
describe("Answer", () => {
  describe(".setSummary", () => {
    it("should set the summary of the answer", () => {
      const answer = new Answer;
      answer.setSummary("testSummary");
      assert.equal(answer.summary, "testSummary");
    });
    it("should be chainable", () => {
      const answer = new Answer;
      answer.setSummary("testSummary").setSummary("testSummary2");
      assert.equal(answer.summary, "testSummary2");
    });
  });
  describe(".set summary", () => {
    it("should set the summary of the answer", () => {
      const answer = new Answer;
      answer.summary = "testSummary";
      assert.equal(answer.summary, "testSummary");
    });
  });
  describe(".setDescription", () => {
    it("should set the description of the answer", () => {
      const answer = new Answer;
      answer.setDescription("testSummary");
      assert.equal(answer.description, "testSummary");
    });
    it("should be chainable", () => {
      const answer = new Answer;
      answer.setDescription("testSummary").setDescription("testSummary2");
      assert.equal(answer.description, "testSummary2");
    });
  });
  describe(".set summary", () => {
    it("should set the summary of the answer", () => {
      const answer = new Answer;
      answer.description = "testSummary";
      assert.equal(answer.description, "testSummary");
    });
  });
  describe(".choose", () => {
    it("should be choosable", (done) => {
      const answer = (new Answer).setDescription("password: 12345 or password: 678910?").setSummary("This password!").setCallback(() => done());
      answer.choose();
    });
  });
});
describe("Question", () => {
  describe(".setSummary", () => {
    it("should set the summary of the answer", () => {
      const question = new Question;
      question.setSummary("testSummary");
      assert.equal(question.summary, "testSummary");
    });
    it("should be chainable", () => {
      const question = new Question;
      question.setSummary("testSummary").setSummary("testSummary2");
      assert.equal(question.summary, "testSummary2");
    });
  });
  describe(".set summary", () => {
    it("should set the summary of the answer", () => {
      const question = new Question;
      question.summary = "testSummary";
      assert.equal(question.summary, "testSummary");
    });
  });
  describe(".addAnswer", () => {
    it("should add an answer", () => {
      const question = (new Question).setSummary("Which one should we keep");
      question.addAnswer((new Answer).setSummary("This one").setDescription("Answer #1").setCallback());
      question.addAnswer((new Answer).setSummary("Both").setDescription("Answer #both").setCallback());
      question.addAnswer((new Answer).setSummary("That One").setDescription("Answer #thatone").setCallback());
      assert.equal(question.getAnswers()[0].summary, "This one");
      assert.equal(question.getAnswers()[1].summary, "Both");
      assert.equal(question.getAnswers()[2].summary, "That One");
    });
  });
  describe(">answer.choose", () => {
    it("should choose an answer", () => {
      const question = (new Question).setSummary("Which answer should you choose?");
      question.addAnswer((new Answer).setSummary("This one").setDescription("Choose this answer, it is better"));
      question.addAnswer((new Answer).setSummary("Mine").setDescription("Don't choose the other answer, they voted single quotes"));
      assert.ok(!question.answered);
      question.getAnswers()[1].choose();
      assert.ok(question.answered);
      assert.throws(() => question.getAnswers()[1].choose() );
    });
  });
});
describe("QuestionStream", () => {
  describe(".constructor", () => {
  });
  describe(".completed", () => {
    it("should become true when answered", () => {
      const stream = new QuestionStream;
      stream.ask(
        (new Question)
          .setSummary("A or B")
          .addAnswer((new Answer).setSummary("A").setDescription("a is the best choose a"))
          .addAnswer((new Answer).setSummary("B").setDescription("b is much better use b"))
          .addAnswer((new Answer).setSummary("Both").setDescription("get the worst of both worlds choose both"))
      );
      assert.ok(stream.questions[0]);
      assert.equal(stream.questions[0].summary, "A or B");
      assert.equal(stream.questions[0].answers[1].summary, "B");
      assert.equal(stream.completed, false);
      stream.questions[0].answers[2].choose();
      assert.ok(stream.completed);
    });
  });
  describe(".allCompleted", () => {
    it("should become true when answered", mochaAsync(async() => {
      const stream = new QuestionStream;
      stream.ask(
        generateTestQuestion()
      );
      setTimeout(() => stream.questions[0].answers[1].choose(), 10);
      assert.ok(!stream.completed);
      await stream.allCompleted();
      assert.ok(stream.completed);
    }));
  });
  describe(".addChild", () => {
    it("should allow child streams", mochaAsync(async() => {
      const stream = new QuestionStream;
      stream.ask(
        generateTestQuestion()
      );
      const parentStream = new QuestionStream;
      parentStream.addChild(stream);
      setTimeout(() => stream.questions[0].answers[1].choose(), 10);
      assert.ok(!stream.completed);
      assert.ok(!parentStream.completed);
      await parentStream.allCompleted();
      assert.ok(stream.completed);
      assert.ok(parentStream.completed);
    }));
    it("should allow child streams in eventemitter events", mochaAsync(async() => {
      const stream = new QuestionStream;
      setTimeout(() => stream.ask(
        generateTestQuestion()
      ), 10);
      const parentStream = new QuestionStream;
      parentStream.addChild(stream);
      parentStream.on("question", q => {q.answers[1].choose();});

      await parentStream.allCompleted(); // if this fails then the question was not emitted
    }));
    it("should require child streams to be completed before setting itself completed", mochaAsync(async() => {
      const stream = new QuestionStream;
      stream.ask(
        generateTestQuestion()
      );
      const parentStream = new QuestionStream;
      parentStream.ask(
        generateTestQuestion()
      );
      parentStream.addChild(stream);
      setTimeout(() => parentStream.questions[1].answers[1].choose(), 10);
      setTimeout(() => parentStream.questions[0].answers[1].choose(), 20); // top level questions are earlier in the list
      assert.ok(!stream.completed);
      assert.ok(!parentStream.completed);
      await stream.allCompleted();
      assert.ok(stream.completed);
      assert.ok(!parentStream.completed);
      await parentStream.allCompleted();
      assert.ok(stream.completed);
      assert.ok(parentStream.completed);
    }));
    it("should allow a child have two parent streams", mochaAsync(async() => {
      const stream = new QuestionStream;
      const parentStream = new QuestionStream;
      const parentParentStream = new QuestionStream;
      parentParentStream.ask(
        generateTestQuestion()
      );
      parentStream.addChild(stream);
      parentParentStream.addChild(stream);
    }));
    it("should not be completed if a child is not completed", mochaAsync(async() => {
      const stream = new QuestionStream;
      stream.ask(
        generateTestQuestion()
      );
      const parentStream = new QuestionStream;
      parentStream.ask(
        generateTestQuestion()
      );
      parentStream.addChild(stream);
      parentStream.questions[0].answers[1].choose();
      assert.ok(!parentStream.completed);
      stream.questions[0].answers[1].choose();
      assert.ok(parentStream.completed);
    }));
    it("allcompleted should wait if completion is set later", mochaAsync(async() => {
      const stream = new QuestionStream;
      stream.ask(
        generateTestQuestion()
      );
      setTimeout(() => stream.questions[0].answers[1].choose(), 10);
      assert.ok(!stream.completed);
      await stream.allCompleted();
      assert.ok(stream.completed);
    }));
    it("allcompleted complete if completed is done already", mochaAsync(async() => {
      const stream = new QuestionStream;
      stream.ask(
        generateTestQuestion()
      );
      stream.questions[0].answers[1].choose();
      assert.ok(stream.completed);
      await stream.allCompleted();
      assert.ok(stream.completed);
    }));
  });
});
