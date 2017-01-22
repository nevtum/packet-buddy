var _ = require('lodash');
var Xpacket = require('./xpacket');

module.exports = {
    toHexArrays(contents) {
        var lines = contents.split('\n');
        
        var cleaned = _.filter(lines, function(line) {
            return line != '';
        });

        var sanitized = _.map(cleaned, function(line) {
            var replaced = line.replace(/(\.|\s{1,4})/g, ' ');
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
                var packet = new Xpacket(item);
                callback(null, packet);
            } catch (error) {
                callback(error);
            }
        });
    },
    parseAll(contents) {
        return this.toByteArrays(contents).map(function(element) {
            try {
                return new Xpacket(element).asJson();
            } catch (error) {
                return { error: "Unable to process datablock!" }
            }
        });
    }
};