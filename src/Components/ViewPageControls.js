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

    return viewControls;
}

module.exports = ViewControls;

