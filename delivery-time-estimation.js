const readline = require("readline");
const { deliveryCost } = require("./shared");

const inputs = [];
let packageCombinations = [];
let vehicalsAvailableTimes = [];

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

function getAvailableVehical() {}

function deliveryTime(combinations, max_speed) {
  for (combination of combinations) {
    const obj = combination.data.sort((a, b) => b.data[1] - a.data[1])[0];
    const time = Number(obj.data[1] / max_speed).toFixed(2);
  }
}

function generatePackageCombination(pkgWeights, max_carriable_weight) {
  if (pkgWeights && pkgWeights.length) {
    var result = [].concat(
      ...pkgWeights.map((v, i) =>
        pkgWeights.slice(i + 1).map((w) => {
          const weightSum = Number(v.weight) + Number(w.weight);
          return {
            data: [
              [v.no, v.distance],
              [w.no, w.distance],
            ],
            weightSum,
          };
        })
      )
    );

    const filtered = result
      .filter((e) => e.weightSum < max_carriable_weight)
      .sort((a, b) => b.weightSum - a.weightSum);

    if (filtered.length) {
      const combination = filtered[0];
      packageCombinations.push(combination);
      // removing pkg in combonation
      pkgWeights.splice(
        pkgWeights.findIndex((e) => e.no == combination.data[0][0]),
        1
      );
      pkgWeights.splice(
        pkgWeights.findIndex((e) => e.no == combination.data[1][0]),
        1
      );
      generatePackageCombination(pkgWeights);
    } else {
      const remainingPackages = pkgWeights
        .sort((a, b) => b.weight - a.weight)
        .map((e) => {
          return { data: [e.no, e.distance], weightSum: e.weight };
        });
      packageCombinations = packageCombinations.concat(remainingPackages);
    }
  }
  return packageCombinations;
}

ReadLine.on("close", async function (cmd) {
  console.log("Result:");
  const [no_of_vehicles, max_speed, max_carriable_weight] =
    inputs[inputs.length - 1].split(" ");
  const output = await deliveryCost(inputs.slice(0, -1), true);

  const mappedInput = output.map((e) => {
    return { no: e[1], weight: Number(e[0]), distance: Number(e[2]) };
  });

  if (Number(no_of_vehicles) > 0) {
    for (let i = 0; i < no_of_vehicles; i++) {
      vehicalsAvailableTimes.push({ vehicalNo: i + 1, availableIn: 0 });
    }
  }

  const combinations = generatePackageCombination(
    mappedInput,
    max_carriable_weight
  );
  console.log("combinations", combinations);
  deliveryTime(combinations, Number(max_speed));

  process.exit(0);
});
