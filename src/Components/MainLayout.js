import React from 'react';
import decoder from '../xseries/decoder';
import Packet from './Packet';
import ViewControls from './ViewPageControls';
import FilterToggleControl from './FilterToggleControl';

class MainLayout extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            editMode: true,
            raw: "",
            rawCache: "",
            decoded: [],
            filter: {
                allOptions: ["SDB", "PDB1"],
                offOptions: ["SDB"]
            }
        }

        this.onAllCollapsed = this.onAllCollapsed.bind(this);
        this.onAllExpanded = this.onAllExpanded.bind(this);
        this.onRawContentChanged = this.onRawContentChanged.bind(this);
        this.onSwitchReadMode = this.onSwitchReadMode.bind(this);
        this.onSwitchEditMode = this.onSwitchEditMode.bind(this);
        this.onItemCollapsed = this.onItemCollapsed.bind(this);
        this.onItemExpanded = this.onItemExpanded.bind(this);
        this.onParseSuccess = this.onParseSuccess.bind(this);
    }

    onParseSuccess(data) {
        let decoded = data.map(function(element, index) {
            return {
                id: index,
                expanded: true,
                data: element
            }
        });

        this.setState({
            editMode: false,
            rawCache: this.state.raw,
            decoded: decoded,
        });
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

        decoder.parseAll(this.state.raw)
            .then(this.onParseSuccess);
    }

    renderEditControls() {
        return (
            <div id="controls">
                <a href="#" onClick={this.onSwitchReadMode}>Switch to read mode</a>
            </div>
        );
    }

    renderControls() {
        if (this.state.editMode == true) {
            return this.renderEditControls();
        }
        
        return (
            <div id="controls">
                <ViewControls
                    decoded={this.state.decoded}
                    onAllCollapsed={this.onAllCollapsed}
                    onAllExpanded={this.onAllExpanded}
                    onSwitchEditMode={this.onSwitchEditMode} />
                <FilterToggleControl {...this.state.filter} />
            </div>
        );
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
                        excludedPacketClasses={this.state.filter.offOptions}
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
                <pre>{JSON.stringify(this.state.filter)}</pre>
                {controls}
                {content}
                <div id="footer">
                    <p>2017 - v1.0.3 - Powered by NT</p>
                </div>
            </div>
        );
    }
}

module.exports = MainLayout;