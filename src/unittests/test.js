var assert = require('assert');
var calc = require('../xseries/utilities');

describe('Checksum calculator', function() {
  describe('#calculateCRC16()', function() {
    describe('when a valid array is passed in', function() {
      var result = calc.calculateCRC16([1, 2, 3, 4]);
      
      it('should return an array of length 2', function() {
        assert.equal(result.length, 2);
      });

      it('should return correct CRC', function() {
        assert.deepEqual(result, [6, 7]);      
      });
    });

    describe('when an empty array is passed in', function() {
      it('should throw an error', function() {

      })
    })
  });
});