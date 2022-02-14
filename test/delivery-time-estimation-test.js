const { assert } = require("chai");
const { deliveryTimeEstimation  } = require("../modules/delivery-time-estimation");

describe("Delivery Time Estimation", function () {
 
  it("Delivery time estimation should return actualResult", async function () {
    const inputs = [
        '100 5',
        'pkg1 50 30 OFR001',
        'pkg2 75 125 OFR00008',
        'pkg3 175 100 OFFR003',
        'pkg4 110 60 OFR002',
        'pkg5 155 95 NA',
        '2 70 200'
    ];
    const actualResult = [
      ["50", "pkg1", "30", 0, 750, 4.01, "\n"],
      ["75", "pkg2", "125", 0, 1475, 1.79, "\n"],
      ["175", "pkg3", "100", 0, 2350, 1.43, "\n"],
      ["110", "pkg4", "60", 105, 1395, "0.86", "\n"],
      ["155", "pkg5", "95", 0, 2125, 4.22, "\n"],
    ];
    const result = await deliveryTimeEstimation(inputs);

    assert.deepEqual(result, actualResult);
  });
});
