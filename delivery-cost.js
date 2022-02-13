const readline = require("readline");
const { deliveryCost } = require('./shared');

const inputs = [];

const ReadLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Enter your input:");
ReadLine.prompt();

ReadLine.on("line", function (cmd) {
  if (cmd.trim()) {
    inputs.push(cmd);
  } else {
    console.log("Please enter valid input OR Ctrl + c for result");
  }
});

ReadLine.on("close", async function (cmd) {
  console.log("\nResult: #1");
  const result = await deliveryCost(inputs);
  const renderResult = result.map((e) => e.join(' ')).join('');
  console.log(renderResult);
  process.exit(0);
});