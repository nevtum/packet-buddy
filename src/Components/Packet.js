import React from 'react';

const PacketDetails = function(props) {

    let { data, expanded } = props;

    let configTabulated = Object.keys(data.configData).map(function(key, index) {
        return Object.assign({}, data.configData[key], { description: key });
    });

    let metersTabulated = Object.keys(data.meterData).map(function(key, element) {
        return Object.assign({}, data.meterData[key], { description: key });
    });

    if (!expanded) {
        return <div/>
    }

    return (
        <div className="details">
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

const PacketHeader = function(props) {
    let collapse = function(e) {
        e.preventDefault();
        props.onViewCollapsed(props.id);
    }

    let expand = function(e) {
        e.preventDefault();
        props.onViewExpanded(props.id);
    }

    let { id, data, expanded } = props;

    if (!expanded) {
        return <h3>{id+1}. <a href="#" onClick={expand}>{data.type}</a></h3>
    }
    else {
        return <h3>{id+1}. <a href="#" onClick={collapse}>{data.type}</a></h3>
    }
}

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

    return (
        <div className={classname}>
            <div className="summary">
                <PacketHeader {...props} />
            </div>
            <PacketDetails {...props} />
        </div>
    );
}

module.exports = Packet;