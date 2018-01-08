function verifyArguments(args, ...values) {
  /*  verifyArguments(arguments, Array)  */

  args = Array.from(args);
  //const values = Array.from(arguments);
  //values.shift();
  values.forEach((value, i) => {
    const arg = args[i];
    if(values[i] === null) return;
    if(Array.isArray(values[i])) { // not covered
      values[i] = values[i][0];
      if(arg === null || arg === undefined) return;
    }
    if(typeof values[i] !== "function") if(typeof values[i] != typeof arg) throw new TypeError(`Expected ${typeof values[i]} but got ${typeof arg} on argument ${i}`);
    if(typeof values[i] === "function") {
      if(!(arg instanceof values[i])) throw new TypeError(`Expected instanceof ${values[i].name} but got ${arg.constructor.name} on argument ${i}`);
    }
  });
}

module.exports = verifyArguments;
