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
            throw new Error("endByte param must be larger than startByte!");
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
                throw new Error("Unknown packet type!");
        }
    }
    
    _percentage(startByte, endByte) {
        let bytesObj = this.getBytes(startByte, endByte);
        let start = startByte + 1;
        let end = endByte + 1;

        return {
            byteRange: start + '-' + end,
            hex: bytesObj.rawData(),
            value: bytesObj.asPercentage(),
        };
    }

    _ASCII(startByte, endByte) {
        let bytesObj = this.getBytes(startByte, endByte);
        let start = startByte + 1;
        let end = endByte + 1;

        return {
            byteRange: start + '-' + end,             
            hex: bytesObj.rawData(),
            value: bytesObj.asASCII(),
        };
    }

    _currency(startByte, endByte) {
        let bytesObj = this.getBytes(startByte, endByte);
        let start = startByte + 1;
        let end = endByte + 1;

        return {
            byteRange: start + '-' + end,            
            hex: bytesObj.rawData(),
            value: bytesObj.asCurrency(),
        };
    }

    _version(startByte, endByte) {
        let bytesObj = this.getBytes(startByte, endByte);
        let start = startByte + 1;
        let end = endByte + 1;

        return {
            byteRange: start + '-' + end,            
            hex: bytesObj.rawData(),
            value: bytesObj.asVersion(),
        };
    }

    _digits(startByte, endByte) {
        let bytesObj = this.getBytes(startByte, endByte);
        let start = startByte + 1;
        let end = endByte + 1;

        let byteRange;
        if (endByte == undefined) byteRange = start;
        else byteRange = start + '-' + end;

        return {
            byteRange: byteRange,            
            hex: bytesObj.rawData(),
            value: bytesObj.asDigits(),
        };
    }

    _SDBData() {
        return {
            configData: {
                Version: this._version(2, 3),
                MultiGameIndication: {
                    byteRange: 15 + '-' + 16,
                    hex: this.getBytes(14, 15).rawData(),
                    value: this.getBytes(14, 15).asBCD().join(""),
                },
                BCV: this._currency(84, 85),
                PID1: this._ASCII(87, 94),
                PID2: this._ASCII(95, 102),
                PID3: this._ASCII(103, 110),
                PID4: this._ASCII(111, 118),
                RTP: this._percentage(119, 120),
                SecondaryFunction: {
                    byteRange: "122",
                    hex: this.getBytes(121).rawData(),
                    value: this.getBytes(121).rawData()
                }
            },
            meterData: {
                SeqNr: this._digits(4),
                GMID: this._digits(5, 7),
                Turnover: this._currency(16, 20),
                Totalwins: this._currency(21, 25),
                Cashbox: this._currency(26, 30),
                CancelledCredits : this._currency(31, 35),
                MoneyIn: this._currency(41, 45),
                MoneyOut: this._currency(46, 50),
                CashIn: this._currency(51, 55),
                CashOut: this._currency(56, 60),
                Credits: this._currency(61, 65),
                MiscAccrual: this._currency(66, 70),
                TotalPowerUps: this._digits(71, 74),
                GamesSinceLastPowerUp: this._digits(75, 78),
                GamesSinceLastDoorOpen: this._digits(79, 82)
            }
        };
    }

    _PDB1Data() {
        return {
            configData: {
                Version: this._version(2, 3),
                NrLevels: this._digits(14),
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
                SeqNr: this._digits(4),
                GMID: this._digits(5, 7),
                ConnectedEGMS: this._digits(35, 36),
                DisconnectedEGMS: this._digits(38, 39),
                CurrentAmountLvl1: this._currency(41, 45),
                CurrentAmountLvl2: this._currency(46, 50),
                CurrentAmountLvl3: this._currency(51, 55),
                CurrentAmountLvl4: this._currency(56, 60),
                CurrentLevelWon: this._digits(61),
                CurrentGMIDWon: this._digits(62, 64),
                WinAmountPendingReset: this._currency(65, 69),
                NrJackpotsPendingReset: this._digits(70)
            }
        };
    }

    _PDB2Data() {
        return {
            configData: {
                Version: this._version(2, 3),
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
                SeqNr: this._digits(4),
                GMID: this._digits(5, 7),

                ResetAmountLvl1: this._currency(10, 14),
                ResetAmountLvl2: this._currency(15, 19),
                ResetAmountLvl3: this._currency(20, 24),
                ResetAmountLvl4: this._currency(25, 29),
                CeilingValueLvl1: this._currency(30, 34),
                CeilingValueLvl2: this._currency(35, 39),
                CeilingValueLvl3: this._currency(40, 44),
                CeilingValueLvl4: this._currency(45, 49),
                HiddenAmountLvl1: this._currency(50, 54),
                HiddenAmountLvl2: this._currency(55, 59),
                HiddenAmountLvl3: this._currency(60, 64),
                HiddenAmountLvl4: this._currency(65, 69),
                NrResetsLvl1: this._digits(70, 74),
                NrResetsLvl2: this._digits(75, 79),
                NrResetsLvl3: this._digits(80, 84),
                NrResetsLvl4: this._digits(85, 89),
                AmountWonLvl1: this._digits(90, 94),
                AmountWonLvl2: this._digits(95, 99),
                AmountWonLvl3: this._digits(100, 104),
                AmountWonLvl4: this._digits(105, 109),
                TurnoverSinceStartup: this._currency(110, 114),
                TurnoverSinceConfigChange: this._currency(115, 119)
            }
        };
    }

    _MDBData() {
        return {
            configData: {
                ManufacturerID: this._digits(2),
                DataBlockVersion: {
                    byteRange: "8 - 9",
                    hex: this.getBytes(7, 8).rawData(),
                    value: this.getBytes(7, 8).rawData()
                },
                Version: this._version(9, 10)
            },
            meterData: {
                GMID: this._digits(4, 6),
                Nr5DollarBills: this._digits(15, 19),
                Nr10DollarBills: this._digits(20, 24),
                Nr20DollarBills: this._digits(25, 29),
                Nr50DollarBills: this._digits(30, 34),
                Nr100DollarBills: this._digits(35, 39),
                NrTicketsAccepted: this._digits(40, 44),
                NrTicketsRejected: this._digits(45, 49),
                NrSpareBills: this._digits(50, 54),
                TotalBillValue: this._currency(55, 59),
                TotalBillsAccepted: this._digits(60, 64),
                DateTicketPrinted: {
                    byteRange: "67 - 70",
                    hex: this.getBytes(66, 69).asDate(),
                    value: this.getBytes(66, 69).rawData()
                },
                TimeTicketPrinted: {
                    byteRange: "71 - 73",
                    hex: this.getBytes(70, 72).asTime(),
                    value: this.getBytes(70, 72).rawData()
                },
                TicketID: this._digits(73, 82),
                TicketValue: this._currency(83, 87),
                TicketSeqNr: this._digits(88, 92)
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