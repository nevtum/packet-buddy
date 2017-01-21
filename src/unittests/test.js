var assert = require('assert');
var calc = require('../xseries/utilities');

describe('Checksum calculator', function() {
  describe('#calculateChecksum(...)', function() {
    describe('a valid array passed in', function() {
      var result = calc.calculateChecksum([72, 34, 28, 4]);
      
      it('should return an array of length 2', function() {
        assert.equal(result.length, 2);
      });

      it('should return correct CRC', function() {
        assert.deepEqual(result, [2, 112]);      
      });
    });

    describe('an empty array passed in', function() {
      it('should throw an error', function() {
        assert.equal(false)
      });
    })
  });
});