import React from 'react';

const ViewControls = (props) => {
    let viewControls;
    if (props.decoded.length > 1) {
        viewControls = (
            <div>
                <a href="#" onClick={props.onSwitchEditMode}>Switch to edit mode</a>
                | <a href="#" onClick={props.onAllCollapsed}>Collapse All</a>
                | <a href="#" onClick={props.onAllExpanded}>Expand All</a>
            </div>);
    }
    else {
        viewControls = (
            <div>
                <a href="#" onClick={props.onSwitchEditMode}>Switch to edit mode</a>
            </div>
        );
    }

    let filterControls;
    // To do. Bind a filter function through props passed
    if (props.filterOptions.length > 1) {
        let options = [...props.filterOptions, "All"];
        let filterOptions = options.map(function(element) {
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

    return (
        <div id="controls">
            {viewControls}
            {filterControls}
        </div>
    );
}

module.exports = ViewControls;

