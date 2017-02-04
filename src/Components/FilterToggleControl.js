import React from 'react';
import _ from 'lodash';

module.exports = (props) => {
    let filterControls = null;
    // To do. Bind a filter function through props passed
    if (props.allOptions.length > 1) {
        let filterOptions = props.allOptions.map(function(element) {

            let className = (props.offOptions.indexOf(element) > -1) ? "off" : null;

            return (
                <li key={element} className={className}>
                    <a href="#">{element}</a>
                </li>
            );
        });

        filterControls = (
            <div>
                <p>Packets displayed</p>
                <ul>
                    {filterOptions}
                </ul>
            </div>
        );
    }

    return filterControls;
}
