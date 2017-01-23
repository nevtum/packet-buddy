import React from 'react';

const Packet = function(props) {
    let { data } = props;

    if (data.error) {
        return (
        <div className="packet error">
            <p>{data.error}</p>
        </div>
        );
    }
    return (
        <div className="packet">
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

module.exports = Packet;