import React from 'react';
import BlockTypes from '../xseries/blocktypes';

const PacketDetails = (props) => {

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

let getHeaderStyle = function(packetType) {
    switch (packetType) {
        case BlockTypes.SDB:
            return { background: '#4bdcdc' };

        case BlockTypes.MDB:
            return { background: 'gold' };

        case BlockTypes.PDB1:
            return { background: '#a284dc' };

        case BlockTypes.PDB2:
            return { background: '#838ede' };

        default:
            break;
    }
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

    let style = getHeaderStyle(data.type);

    let onClickHandler = expanded ? collapse : expand;

    return (
        <div className="summary" style={style} onClick={onClickHandler}>
            <h3>{id+1}. {data.type}</h3>
        </div>
    );
}

const Packet = function(props) {
    let { data } = props;

    if (data.error) {
        return (
            <div className="packet error">
                <pre>{data.error}</pre>
            </div>
        );
    }

    let classname = data.validCRC == true ? 
        "packet" : "packet invalid";

    return (
        <div className={classname}>
            <PacketHeader {...props} />
            <PacketDetails {...props} />
        </div>
    );
}

module.exports = Packet;