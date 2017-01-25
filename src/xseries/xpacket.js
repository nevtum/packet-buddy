var _ = require('lodash');
var XBytes = require('./xbytes');
var calc = require('../xseries/utilities');
var BlockTypes = require('../xseries/blocktypes');

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
        let array = this.byteArray.slice(1, 126);
        let expected = this.byteArray.slice(126, 128);
        let checksum = calc.calculateChecksum(array);
        let validCRC = _.isEqual(checksum, expected);
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

        let slice = this.byteArray.slice(startByte, endByte + 1);
        return new XBytes(slice, startByte, endByte);
    }

    getType() {
        switch (this.byteArray[1]) {
            case 0x00:
                return BlockTypes.SDB;
            case 0x10:
                return BlockTypes.PDB1;
            case 0x11:
                return BlockTypes.PDB2;
            case 0x22:
                return BlockTypes.MDB;
        
            default:
                return "UNKNOWN"
        }
    }
    
    _percentage(startByte, endByte) {
        let bytesObj = this.getBytes(startByte, endByte);

        return {
            byteRange: startByte + '-' + endByte,
            hex: bytesObj.rawData(),
            value: bytesObj.asPercentage(),
        };
    }

    _ASCII(startByte, endByte) {
        let bytesObj = this.getBytes(startByte, endByte);

        return {
            byteRange: startByte + '-' + endByte,            
            hex: bytesObj.rawData(),
            value: bytesObj.asASCII(),
        };
    }

    _currency(startByte, endByte) {
        let bytesObj = this.getBytes(startByte, endByte);

        return {
            byteRange: startByte + '-' + endByte,            
            hex: bytesObj.rawData(),
            value: bytesObj.asCurrency(),
        };
    }

    _version(startByte, endByte) {
        let bytesObj = this.getBytes(startByte, endByte);

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
                turnover: this._currency(16, 20),
                totalwins: this._currency(21, 25),
                cashbox: this._currency(26, 30),
                cancelledcredits : this._currency(31, 35),
                moneyin: this._currency(41, 45),
                moneyout: this._currency(46, 50),
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
        let data = this._commonData();

        if (data.type === BlockTypes.SDB) {
            return Object.assign({}, data, this._SDBData());
        }

        if (data.type === BlockTypes.PDB1) {
            return Object.assign({}, data, this._PDB1Data());
        }

        if (data.type === BlockTypes.PDB2) {
            return Object.assign({}, data, this._PDB2Data());
        }

        if (data.type === BlockTypes.MDB) {
            return Object.assign({}, data, this._MDBData());
        }

        return data;
    }
}

module.exports = XPacket;