import React from 'react';

module.exports = (props) => {
    let filterControls = null;
    // To do. Bind a filter function through props passed
    if (props.filterOptions.length > 1) {
        let filterOptions = props.filterOptions.map(function(element) {
            return (
                <li key={element}>
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
