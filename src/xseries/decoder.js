var _ = require('lodash');
var Xpacket = require('./xpacket');

function toHexArrays(contents) {
    let lines = contents.split('\n');
        
    let cleaned = _.filter(lines, function(line) {
        return line != '';
    });

    let sanitized = _.map(cleaned, function(line) {
        let replaced = line.replace(/(\.|\s{1,4}|-)/g, ' ');
        return replaced.split(' ');
    });
    
    return sanitized;
}

function toByteArrays(contents) {
    return _.map(toHexArrays(contents), function(item) {
        return _.map(item, function(str) {
            return parseInt(str, 16);
        });
    });
}

module.exports = {
    toHexArrays,
    toByteArrays,
    parse(contents, callback) {
        toByteArrays(contents).forEach(function(item) {
            try {
                let packet = new Xpacket(item);
                callback(null, packet);
            } catch (error) {
                callback(error);
            }
        });
    },
    parseAll(contents, onSuccess) {
        return new Promise(function(resolve, reject) {
            try {
                let typesFound = [];

                let xpackets = toByteArrays(contents).map(function(element) {
                    try {
                        let xpacket = new Xpacket(element);
                        let type = xpacket.getType();

                        if (typesFound.indexOf(type) === -1) {
                            typesFound.push(type);
                        }

                        return xpacket.asJson();
                    } catch (error) {
                        return { error: error.stack }
                    }
                });

                let results = {
                    typesFound: typesFound,
                    packets: xpackets
                };

                resolve(results);
            } catch (error) {
                reject(error);
            }
        });
    }
};