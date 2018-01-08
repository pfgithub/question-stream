/* global Symbol describe it */ /* should test functions */

const assert = require("assert");

const verifyArguments = require("../src/verify_arguments");

class ClassSuper { constructor(name) {} }
class ClassA extends ClassSuper {}
class ClassB extends ClassSuper {}
class ClassA1 extends ClassA {}
class ClassB1 extends ClassB {}

describe("verifyArguments", () => {
  it("should require builtin types with constant values provided", () => {
    assert.equal(verifyArguments(["test", false, 392, Symbol()], "String", true, 10, Symbol("symbol")), undefined);
    /**/assert.throws(() => verifyArguments(["test", false, 392, false], "String", true, 10, Symbol("symbol")), TypeError);
    assert.equal(verifyArguments(["test", false], "String", true), undefined);
    /**/assert.throws(() => verifyArguments(["test", 0], "String", true), TypeError);
    /**/assert.throws(() => verifyArguments(["test"], "String", true), TypeError);
    assert.equal(verifyArguments(["test", 0, "other", "arguments", "don't", "matter"], "String", 0), undefined);
  });
  it("should work when provided an arguments array rather than a normal array", () => {
    assert.equal(((...args) => verifyArguments(args, false, "String"))(true, "teststring"), undefined);
    /**/assert.throws(() => ((...args) => verifyArguments(args, false, "String"))(true, false), TypeError);
    /**/assert.throws(() => ((...args) => verifyArguments(args, false, "String"))("Hello", "website"), TypeError);
    /**/assert.throws(() => ((...args) => verifyArguments(args, false, "String"))("Hello", 0), TypeError);
  });
  it("should require types to be instanceof typeof function types provided", () => {
    assert.equal(verifyArguments([new ClassB1, new ClassB1], ClassSuper, ClassB1), undefined);
    /**/assert.throws(() => verifyArguments(["A string", new ClassB1], ClassSuper, ClassB1), TypeError);
  });
  it("should be able to mix the two", () => {
    assert.equal(verifyArguments(["test", new ClassB1], "String", ClassB1), undefined);
    /**/assert.throws(() =>  verifyArguments([new ClassA1, new ClassB1], "String", ClassB1), TypeError);
  });
  it("should allow typed optional arguments with []", () => {
    assert.equal(verifyArguments(["test", new ClassB1], "String", [ClassB1]), undefined);
    assert.equal(verifyArguments(["test", undefined], "String", [ClassB1]), undefined);
    assert.equal(verifyArguments(["test"], "String", [ClassB1]), undefined);
    /**/assert.throws(() =>  verifyArguments(["String", new ClassA1], "String", [ClassB1]), TypeError);
    /**/assert.throws(() =>  verifyArguments(["String", new ClassSuper], "String", [ClassB1]), TypeError);
  });
  it("should not care with null", () => {
    assert.equal(verifyArguments(["test", new ClassB1], "String", null), undefined);
    assert.equal(verifyArguments(["test", new ClassB1], null, null), undefined);
    /**/assert.throws(() =>  verifyArguments(["test", new ClassB1], "String", undefined), TypeError);
  });
});
