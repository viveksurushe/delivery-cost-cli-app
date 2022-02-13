const { assert } = require('chai');
const { deliveryCostCal, discountCal } = require('../delivery-cost');

describe('Delivery Cost', function () {

    it('deliveryCostCal should return 175',function () {
        const base_delivery_cost= 100, package_weight=5, distance=5;
        const result = deliveryCostCal(base_delivery_cost, package_weight, distance);
        assert.equal(result, 175);
    });

    it('discountCal should return 0',function () {
        const deliveryCost=175, offer_code='OFR001', pkg_weight=5, distance=5;
        const result = discountCal(deliveryCost, offer_code, pkg_weight, distance);
        assert.equal(result, 0);
    });

    it('Final Cost should return 175',function () {
        const base_delivery_cost= 100, package_weight=5, distance=5, offer_code='OFR001';
        const deliveryCost = deliveryCostCal(base_delivery_cost, package_weight, distance);
        const discount = discountCal(deliveryCost, offer_code, package_weight, distance);
        const finalCost = deliveryCost - discount;
        assert.equal(finalCost, 175);
    });


});