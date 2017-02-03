import React from 'react';

const ViewControls = (props) => {
    let viewControls;
    if (props.decoded.length > 1) {
        viewControls = (
            <div>
                | <a href="#" onClick={props.onAllCollapsed}>Collapse All</a>
                | <a href="#" onClick={props.onAllExpanded}>Expand All</a>
            </div>);
    }

    let filterControls;
    // To do. Bind a filter function through props passed
    if (props.filterOptions.length > 0) {
        filterControls = props.filterOptions.map(function(element) {
            return (
                <li key={element}>
                    <a href="#">{element}</a>
                </li>);
        })
    }

    return (
        <div id="controls">
            <a href="#" onClick={props.onSwitchEditMode}>Switch to edit mode </a>
            {viewControls}
            <ul>
                {filterControls}
            </ul>
        </div>
    );
}

module.exports = ViewControls;

