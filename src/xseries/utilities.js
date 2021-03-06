
let ChecksumCalculator = {
    calculateChecksum(array) {
        let mod = 0x00;

        array.forEach(function(element) {
            mod = mod ^ element;
        }, this);
        
        return [0x0F & mod, 0xF0 & mod];
    }
}

module.exports = ChecksumCalculator;