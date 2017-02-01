var _ = require('lodash');
var Xpacket = require('./xpacket');

module.exports = {
    toHexArrays(contents) {
        let lines = contents.split('\n');
        
        let cleaned = _.filter(lines, function(line) {
            return line != '';
        });

        let sanitized = _.map(cleaned, function(line) {
            let replaced = line.replace(/(\.|\s{1,4}|-)/g, ' ');
            return replaced.split(' ');
        });
        
        return sanitized;
    },
    toByteArrays(contents) {
        return _.map(this.toHexArrays(contents), function(item) {
            return _.map(item, function(str) {
                return parseInt(str, 16);
            });
        });
    },
    parse(contents, callback) {
        this.toByteArrays(contents).forEach(function(item) {
            try {
                let packet = new Xpacket(item);
                callback(null, packet);
            } catch (error) {
                callback(error);
            }
        });
    },
    parseAll(contents, onSuccess) {
        let xpackets = this.toByteArrays(contents).map(function(element) {
            try {
                return new Xpacket(element).asJson();
            } catch (error) {
                return { error: "Unable to process datablock!" }
            }
        });

        onSuccess(xpackets);
    }
};