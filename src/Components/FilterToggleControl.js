import React from 'react';

module.exports = (props) => {
    let handleToggle = function(e) {
        e.preventDefault();
        props.onToggleFilter(e.target.innerHTML)
    }

    let filterControls = null;
    // To do. Bind a filter function through props passed
    if (props.allOptions.length > 1) {
        let filterOptions = props.allOptions.map(function(element) {

            let className = (props.offOptions.indexOf(element) > -1) ? "off" : null;

            return (
                <li key={element} className={className}>
                    <a href="#" onClick={handleToggle}>{element}</a>
                </li>
            );
        });

        filterControls = (
            <div>
                <ul>
                    {filterOptions}
                </ul>
            </div>
        );
    }

    return filterControls;
}
