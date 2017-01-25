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

        this.onAllCollapsed = this.onAllCollapsed.bind(this);
        this.onAllExpanded = this.onAllExpanded.bind(this);
        this.onRawContentChanged = this.onRawContentChanged.bind(this);
        this.onSwitchReadMode = this.onSwitchReadMode.bind(this);
        this.onSwitchEditMode = this.onSwitchEditMode.bind(this);
        this.onItemCollapsed = this.onItemCollapsed.bind(this);
        this.onItemExpanded = this.onItemExpanded.bind(this);
    }

    onAllCollapsed(e) {
        e.preventDefault();
        let { decoded } = this.state;
        decoded.forEach(function(element) {
            element.expanded = false;
        });
        this.setState({ decoded: decoded });
    }

    onAllExpanded(e) {
        e.preventDefault();
        let { decoded } = this.state;
        decoded.forEach(function(element) {
            element.expanded = true;
        });
        this.setState({ decoded: decoded });
    }

    onItemCollapsed(id) {
        let { decoded } = this.state;
        decoded[id].expanded = false;
        this.setState({ decoded: decoded });
    }

    onItemExpanded(id) {
        let { decoded } = this.state;
        decoded[id].expanded = true;
        this.setState({ decoded: decoded });
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

        let decoded = decoder
            .parseAll(this.state.raw)
            .map(function(element, index) {
                return {
                    id: index,
                    expanded: true,
                    data: element
                }
            })

        this.setState({ 
            editMode: false,
            rawCache: this.state.raw,
            decoded: decoded,
        });
    }

    renderEditControls() {
        return (
            <div id="controls">
                <a href="#" onClick={this.onSwitchReadMode}>Switch to read mode</a>
            </div>
        );
    }

    renderViewControls() {

        if (this.state.decoded.length > 1) {
            var viewControls = (
                <div>
                    | <a href="#" onClick={this.onAllCollapsed}>Collapse All</a>
                    | <a href="#" onClick={this.onAllExpanded}>Expand All</a>
                </div>);
        }

        return (
            <div id="controls">
                <a href="#" onClick={this.onSwitchEditMode}>Switch to edit mode </a>
                {viewControls}
            </div>
        );
    }

    renderControls() {
        if (this.state.editMode == true) {
            return this.renderEditControls();
        }
        return this.renderViewControls();
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
        let { decoded } = this.state;
        var packets = decoded.map(function(element) {
            return <Packet
                        onViewCollapsed={this.onItemCollapsed}
                        onViewExpanded={this.onItemExpanded}
                        key={element.id}
                        {...element} />;
        }, this);
        
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
                <h1>Packet Buddy</h1>
                {controls}
                {content}
                <div id="footer">
                    <p>2017 - v1.0.1 - Powered by NT</p>
                </div>
            </div>
        );
    }
}

module.exports = MainLayout;