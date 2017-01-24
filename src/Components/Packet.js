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
        return Object.assign({}, data.configData[key], { description: key });
    });

    let metersTabulated = Object.keys(data.meterData).map(function(key, element) {
        return Object.assign({}, data.meterData[key], { description: key });
        
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
                            <th>Description</th>
                            <th>Byte Range</th>
                            <th>Hex</th>
                            <th>Interpretation</th>
                        </tr>
                        {configTabulated.map(function(element, index) {
                            return (
                                <tr key={index}>
                                    <td>{element.description}</td>
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
            <div className="meters">
                <h5>Meters</h5>
                <table>
                    <tbody>
                        <tr>
                            <th>Description</th>
                            <th>Byte Range</th>
                            <th>Hex</th>
                            <th>Interpretation</th>
                        </tr>
                        {metersTabulated.map(function(element, index) {
                            return (
                                <tr key={index}>
                                    <td>{element.description}</td>
                                    <td>{element.byteRange}</td>
                                    <td>{element.hex}</td>
                                    <td>{element.value}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

module.exports = Packet;