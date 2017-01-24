import React from 'react';
import decoder from '../xseries/decoder';
import Packet from './Packet';

class MainLayout extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            editMode: true,
            raw: "",
            rawCache: "",
            decoded: [],
        }

        this.onRawContentChanged = this.onRawContentChanged.bind(this);
        this.onSwitchReadMode = this.onSwitchReadMode.bind(this);
        this.onSwitchEditMode = this.onSwitchEditMode.bind(this);
    }

    onRawContentChanged(e) {
        this.setState({ raw: e.target.value });
    }

    onSwitchEditMode(e) {
        e.preventDefault();
        this.setState({ editMode: true });
    }

    onSwitchReadMode(e) {
        e.preventDefault();

        // if text has not changed since last parse
        if (this.state.raw == this.state.rawCache) {
            this.setState({ editMode: false });
            return;
        }

        this.setState({ 
            editMode: false,
            rawCache: this.state.raw,
            decoded: decoder.parseAll(this.state.raw),
        });
    }

    renderViewControls() {
        return (
            <div id="controls">
                <a href="#" onClick={this.onSwitchReadMode}>Switch to read mode</a>
            </div>
        );
    }

    renderEditControls() {
        return (
            <div id="controls">
                <a href="#" onClick={this.onSwitchEditMode}>Switch to edit mode</a>
            </div>
        );
    }

    renderControls() {
        if (this.state.editMode == true) {
            return this.renderViewControls();
        }
        return this.renderEditControls();
    }

    renderContent() {
        if (this.state.editMode == true) {
            return(
                <div id="content">
                    <textarea
                        onChange={this.onRawContentChanged}
                        placeholder="paste datablocks here..."
                        value={this.state.raw}>
                    </textarea>
                </div>
            );
        }

           return this.renderDecodedPackets();
    }

    renderDecodedPackets() {
        var packets = this.state.decoded.map(function(element, index) {
            return <Packet key={index} data={element} />;
        });
        
        return (
            <div id="content">
                {packets}
            </div>
        );
    }

    render() {
        var controls = this.renderControls();
        var content = this.renderContent();

        return (
            <div id="layout">
                {controls}
                {content}
            </div>
        );
    }
}

module.exports = MainLayout;