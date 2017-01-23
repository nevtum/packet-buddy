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

    let classname = data.validCRC == true ? 
        "packet" : "packet invalid";

    let configTabulated = Object.keys(data.configData).map(function(key, index) {
        return data.configData[key];
    });

    return (
        <div className={classname}>
            <div className="summary">
                <h4>{data.type}</h4>
            </div>
            <hr />
            <div className="config">
                <h5>Configuration data</h5>
                <table>
                    <tbody>
                        <tr>
                            <th>Byte Range</th>
                            <th>Hex</th>
                            <th>Interpretation</th>
                        </tr>
                        {configTabulated.map(function(element, index) {
                            return (
                                <tr key={index}>
                                    <td>{element.byteRange}</td>
                                    <td>{element.hex}</td>
                                    <td>{element.value}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <hr />            
            <div className="config">
                <h5>Meters</h5>
                <pre>{JSON.stringify(data.meterData, null, 2)}</pre>
            </div>
        </div>
    );
}

module.exports = Packet;