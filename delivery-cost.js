const readline = require("readline");

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

function discountCal(offer_code, pkg_weight, distance) {
  // Offers data
  const OFFERS = [
    {
      code: "OFR001",
      weight: { min: 70, max: 200 },
      distance: { min: 0, max: 200 },
      disPer: 10,
    },
    {
      code: "OFR002",
      weight: { min: 100, max: 250 },
      distance: { min: 50, max: 150 },
      disPer: 7,
    },
    {
      code: "OFR003",
      weight: { min: 10, max: 150 },
      distance: { min: 50, max: 250 },
      disPer: 5,
    },
  ];

  const offer = OFFERS.find((e) => e.code === offer_code);
  if (offer) {
    let isConditionValid = { weight: false, distance: false };

    // checking weigth condition
    if (pkg_weight >= offer.weight.min && pkg_weight <= offer.weight.max) {
      isConditionValid.weight = true;
    }

    // checking distance condition
    if (distance >= offer.distance.min && distance <= offer.distance.max) {
      isConditionValid.distance = true;
    }

    // if both condition satifies then return discount percentage
    if (isConditionValid.weight && isConditionValid.distance) {
      return offer.disPer;
    }
    return 0;
  } else {
    return 0;
  }
}

function deliveryCostCal(base_delivery_cost, package_weight, distance) {
  return base_delivery_cost + package_weight * 10 + distance * 5;
}

ReadLine.on("close", async function (cmd) {
  console.log("Result:");
  if (inputs.length > 0) {
    const [base_delivery_cost, no_of_packges] = inputs[0].split(" ");
    if (inputs.length - 1 !== Number(no_of_packges)) {
      console.log(
        `Oops!, Please enter all packages details, Total ${no_of_packges} packages required`
      );
      process.exit(0);
    }
    const packages = inputs.slice(1, inputs.length);
    let output = [];
    for await (let pkg of packages) {
      // filter added to trim empty space in between
      const [pkg_id, pkg_weight, distance, offer_code] = pkg
        .split(" ")
        .filter((e) => e.trim());

      if (!pkg_weight.trim() || !distance.trim()) {
        return `${pkg_id} Weight or Distance not available for package`;
      } else {
        let discountPercentage = 0;
        // calculate delivery cost fun
        const deliveryCost = deliveryCostCal(
          Number(base_delivery_cost),
          Number(pkg_weight),
          Number(distance)
        );

        if (offer_code.trim()) {
          // calculate discount
          discountPercentage = discountCal(offer_code, pkg_weight, distance);
        }

        if (discountPercentage > 0) {
          const discountAmount = (deliveryCost * discountPercentage) / 100;
          const finalCost = deliveryCost - discountAmount;
          output.push(`${pkg_id}  ${distance}  ${finalCost}\n`);
        } else {
          output.push(`${pkg_id}  ${distance}  ${deliveryCost}\n`);
        }
      }
    }
    console.log(output.join(""));
  } else {
    console.log("Oops!, Please enter valid inputs");
  }
  process.exit(0);
});
