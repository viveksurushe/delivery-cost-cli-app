function discountCal(deliveryCost, offer_code, pkg_weight, distance) {
  if (!offer_code.trim()) {
    return 0;
  }

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

    // if both condition satifies then return discount
    if (isConditionValid.weight && isConditionValid.distance) {
      const discountAmount = (deliveryCost * offer.disPer) / 100;
      return discountAmount;
    }
    return 0;
  } else {
    return 0;
  }
}

async function deliveryCost(inputs, isWeightReq = false) {
  console.log("inputs", inputs);
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
        // calculate delivery cost fun
        const deliveryCost =
          Number(base_delivery_cost) +
          Number(pkg_weight) * 10 +
          Number(distance) * 5;

        // calculate discount
        const discount = discountCal(
          deliveryCost,
          offer_code,
          pkg_weight,
          distance
        );

        const finalCost = deliveryCost - discount;
        const mappedData = isWeightReq
          ? [pkg_weight, pkg_id, distance, discount, finalCost, "\n"]
          : [pkg_id, discount, finalCost, "\n"];
        output.push(mappedData);
      }
    }
    return output;
  } else {
    console.log("Oops!, Please enter valid inputs");
  }
}

module.exports = {
  deliveryCost,
};
