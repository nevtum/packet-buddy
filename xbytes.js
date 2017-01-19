var toHex = function(value) {
    return value.toString(16);
}

var toBCD = function(value) {
    var converted = toHex(value)
    if (converted.length < 2) {
        converted = '0' + converted;
    }
    return converted.toUpperCase();
}

class XBytes {
    constructor(byteArray, startByte, endByte) {
        this.byteArray = byteArray.reverse();
        this.startByte = startByte;
        this.endByte = endByte;
    }

    asSingleValue() {
        if (this.startByte != this.endByte) {
            throw new Error("startByte != endByte");
        }

        return this.byteArray[0];
    }

    asStatusBit(bit) {
        if (this.startByte != this.endByte) {
            throw new Error("startByte != endByte");
        }

        if (bit < 0 || bit > 7) {
            throw new Error("bit parameter out of range: " + bit);
        }

        return 0x1 & this.byteArray[0] >> bit;
    }

    asVersion() {
        var array = this.byteArray.map(function(byte) {
            return toBCD(byte);
        });

        array[0] = toHex(this.byteArray[0])
        array[0] += ".";

        return array.join("");
    }

    asBCD() {
        return this.byteArray.map(function(byte) {
            return toBCD(byte);
        });
    }

    asPercentage() {
        var array = this.asBCD();

        array[0] = toHex(this.byteArray[0])
        array[0] += ".";

        return array.join("") + "%";
    }

    asCurrency() {
        var array = this.byteArray.map(function(byte) {
            return toBCD(byte);
        });

        var firstElems = array.slice(0, array.length - 1);
        var cents = array[array.length - 1];

        var dollars = parseInt(firstElems.join(""));

        return "$" + dollars + "." + cents;
    }

    asASCII() {
        return this.byteArray.map(function(byte) {
            return String.fromCharCode(byte);
        }).join("")
    }

    rawData() {
        return this.byteArray
            .slice()
            .reverse()
            .map(toBCD)
            .join(" ");
    }
}

module.exports = XBytes;