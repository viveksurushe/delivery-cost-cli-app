const { assert } = require('chai');
const { deliveryCost, discountCal } = require('../modules/shared');

describe('Delivery Cost', function () {

    it('discountCal should return 0',function () {
        const deliveryCost=175, offer_code='OFR001', pkg_weight=5, distance=5;
        const result = discountCal(deliveryCost, offer_code, pkg_weight, distance);
        assert.equal(result, 0);
    });

    it('Final Cost should return actualResult',async function () {
        const input = ['100 3', 'PKG1 5 5 OFR001', 'PKG2 15 5 OFR002', 'PKG3 10 100 OFR003'];
        const actualResult = [[ 'PKG1', 0, 175, '\n' ], [ 'PKG2', 0, 275, '\n' ], [ 'PKG3', 35, 665, '\n' ]]
        const result = await deliveryCost(input)
        
        assert.deepEqual(result, actualResult);
    });


});