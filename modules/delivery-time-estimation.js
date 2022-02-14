const readline = require("readline");
const { deliveryCost } = require("./shared");

const inputs = [];
let packageCombinations = [];
let vehicalsAvailableTimes = [];
let output = [];

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
  console.log("Result:");
  let result = await deliveryTimeEstimation(inputs);

  if(result) {
    // mapping output as per requirement
    result.forEach((item, index) => {
      item.splice(0, 1);
      item.splice(1, 1);
    });
    result.unshift(["PkgNo", "Discount", "Amount", "Time", "\n"]);
    const renderResult = result.map((e) => e.join(" ")).join("");
    console.log(renderResult);
  }

  process.exit(0);
});

async function deliveryTimeEstimation(inputs) {
  const [no_of_vehicles, max_speed, max_carriable_weight] =
    inputs[inputs.length - 1].split(" ");
  output = await deliveryCost(inputs.slice(0, -1), true);
  
  if(!output){
    return
  }

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

  await combinationsProcessing(combinations, Number(max_speed));

  return output;
}

// generating combination to get best package combo
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
          return { data: [[e.no, e.distance]], weightSum: e.weight };
        });
      packageCombinations = packageCombinations.concat(remainingPackages);
    }
  }
  return packageCombinations;
}

// Combinations Processing
async function combinationsProcessing(combinations, max_speed) {
  for await (combination of combinations) {
    // sorting data on distance to get long distance first
    combination.data.sort((a, b) => b[1] - a[1]);

    // if we have mutiple combinations of packages
    if (combination.data && combination.data.length == 1) {
      const pkgs = combination.data[0];
      updateVehicalTimeAndOutput(pkgs[0], pkgs[1], max_speed);
    } else if (combination.data && combination.data.length > 1) {
      combination.data.forEach((pkgs, i) => {
        // pkg with long distance
        if (i === 0) {
          updateVehicalTimeAndOutput(pkgs[0], pkgs[1], max_speed);
        } else {
          let pkgIndex = output.findIndex((e) => e[1] === pkgs[0]);
          const time = Number(pkgs[1] / max_speed).toFixed(2);
          if (time && pkgIndex >= 0) {
            output[pkgIndex].splice(5, 0, time);
          }
        }
      });
    }
  }
}

// calculating delivery time and vehical allotments
function updateVehicalTimeAndOutput(pkg_name, pkg_discount, max_speed) {
  // finding exact package to add delivery time
  let pkgIndex = output.findIndex((e) => e[1] === pkg_name);

  // calculated pakage time
  const pkgTime = Number(pkg_discount / max_speed).toFixed(2);

  vehicalsAvailableTimes.sort((a, b) => a.availableIn - b.availableIn);
  // early available vehical
  let vehical = vehicalsAvailableTimes[0];
  if (pkgIndex >= 0 && vehical && pkgTime) {
    // total time reuired to delivery package
    const totalTime = Number(vehical.availableIn) + Number(pkgTime);
    output[pkgIndex].splice(5, 0, totalTime);
    vehical.availableIn += Number(2 * pkgTime) || 0;
  }
}

module.exports = {
  deliveryTimeEstimation,
  generatePackageCombination,
  combinationsProcessing,
  updateVehicalTimeAndOutput
}