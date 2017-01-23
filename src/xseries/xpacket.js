var _ = require('lodash');
var XBytes = require('./xbytes');
var calc = require('../xseries/utilities');

class XPacket {
    constructor(byteArray) {
        if (byteArray == undefined) {
            throw new Error("byteArray is null or undefined");        
        }

        if(byteArray.length < 2) {
            throw new Error("length must be larger than 2");
        }

        if (byteArray[0] != 0xFF) {
            throw new Error("array must start with 0xFF");
        }

        if (!_.isMatch([0x00, 0x10, 0x11, 0x22], byteArray[1])) {
            throw new Error("unknown datablock type")
        }

        this.byteArray = byteArray;
        this.validCRC = this.CalculateValidCRC(byteArray);
    }

    CalculateValidCRC(byteArray) {
        var array = this.byteArray.slice(1, 126);
        var expected = this.byteArray.slice(126, 128);
        var checksum = calc.calculateChecksum(array);
        var validCRC = _.isEqual(checksum, expected);
        // console.log(validCRC);
        return validCRC;
    }

    getBytes(startByte, endByte) {
        if (endByte == undefined) {
            endByte = startByte
        }

        if (startByte < 0) {
            throw new Error("startByte param must equal zero or more!");
        }

        if (endByte < startByte) {
            throw new Error("endByte param must be larger than startByte!")
        }

        var slice = this.byteArray.slice(startByte, endByte + 1);
        return new XBytes(slice, startByte, endByte);
    }

    getType() {
        switch (this.byteArray[1]) {
            case 0x00:
                return "SDB"
            case 0x10:
                return "PDB1"
            case 0x11:
                return "PDB2"
            case 0x22:
                return "MDB"
        
            default:
                return "UNKNOWN"
        }
    }
    
    _percentage(startByte, endByte) {
        var bytesObj = this.getBytes(startByte, endByte);

        return {
            byteRange: startByte + '-' + endByte,
            hex: bytesObj.rawData(),
            value: bytesObj.asPercentage(),
        };
    }

    _ASCII(startByte, endByte) {
        var bytesObj = this.getBytes(startByte, endByte);

        return {
            byteRange: startByte + '-' + endByte,            
            hex: bytesObj.rawData(),
            value: bytesObj.asASCII(),
        };
    }

    _currency(startByte, endByte) {
        var bytesObj = this.getBytes(startByte, endByte);

        return {
            byteRange: startByte + '-' + endByte,            
            hex: bytesObj.rawData(),
            value: bytesObj.asCurrency(),
        };
    }

    _version(startByte, endByte) {
        var bytesObj = this.getBytes(startByte, endByte);

        return {
            byteRange: startByte + '-' + endByte,            
            hex: bytesObj.rawData(),
            value: bytesObj.asVersion(),
        };
    }

    _SDBData() {
        return {
            configData: {
                version: this._version(2, 3),
                MultiGameIndication: {
                    byteRange: 14 + '-' + 15,
                    hex: this.getBytes(14, 15).rawData(),
                    value: this.getBytes(14, 15).asBCD().join(""),
                },
                BCV: this._currency(84, 85),
                PID1: this._ASCII(87, 94),
                PID2: this._ASCII(95, 102),
                PID3: this._ASCII(103, 110),
                PID4: this._ASCII(111, 118),
                RTP: this._percentage(119, 120),
            },
            meterData: {
                // To do
            }
        };
    }

    _PDB1Data() {
        return {
            configData: {
                version: this._version(2, 3),
                NrLevels: this.getBytes(14).asSingleValue(),
                IncPCTLvl1: this._percentage(15, 18),
                IncPCTLvl2: this._percentage(19, 22),
                IncPCTLvl3: this._percentage(23, 26),
                IncPCTLvl4: this._percentage(27, 30),
                JPRTP: this._percentage(31, 34),
                PID1: this._ASCII(71, 78),
                PID2: this._ASCII(79, 86),
                PID3: this._ASCII(87, 94),
                PID4: this._ASCII(95, 102),
            },
            meterData: {
                // To do
            }
        };
    }

    _PDB2Data() {
        return {
            configData: {
                version: this._version(2, 3),
                ResetLvl1: this._currency(10, 14),
                ResetLvl2: this._currency(15, 19),
                ResetLvl3: this._currency(20, 24),
                ResetLvl4: this._currency(25, 29),
                LimitLvl1: this._currency(30, 34),
                LimitLvl2: this._currency(35, 39),
                LimitLvl3: this._currency(40, 44),
                LimitLvl4: this._currency(45, 49),
            },
            meterData: {
                // To do
            }
        };
    }

    _MDBData() {
        return {
            configData: {
                ManufacturerID: {
                    byteRange: "2",
                    hex: this.getBytes(2).rawData(),
                    value: this.getBytes(2).rawData()
                } ,
            },
            meterData: {
                // To do
            }
        };
    }

    _commonData() {
        return {
            type: this.getType(),
            validCRC: this.validCRC,
        };
    }

    asJson() {
        var data = this._commonData();

        if (data.type === "SDB") {
            return Object.assign({}, data, this._SDBData());
        }

        if (data.type === "PDB1") {
            return Object.assign({}, data, this._PDB1Data());
        }

        if (data.type === "PDB2") {
            return Object.assign({}, data, this._PDB2Data());
        }

        if (data.type === "MDB") {
            return Object.assign({}, data, this._MDBData());
        }

        return data;
    }
}

module.exports = XPacket;