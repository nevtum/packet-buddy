var RTPs = [];
var BCVs = [];

module.exports = {
    record(xpacketJson) {
        if (xpacketJson.type === "SDB" && xpacketJson.validCRC === true) {
            var rtpData = xpacketJson.configData.RTP;
            var rtp = rtpData.value;

            var existingRTPvalues = RTPs.map(function(item) {
                return item.value;
            });

            if (!existingRTPvalues.includes(rtp)) {
                RTPs.push(rtpData);
            }

            var bcvData = xpacketJson.configData.BCV;
            var bcv = bcvData.value;

            var existingBCVvalues = BCVs.map(function(item) {
                return item.value;
            });

            if (!existingBCVvalues.includes(bcv)) {
                BCVs.push(bcvData);
            }
        }
    },

    RTPsFound() {
        return RTPs;
    },

    BCVsFound() {
        return BCVs;
    }
};