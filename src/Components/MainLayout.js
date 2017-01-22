import React from 'react';
import decoder from '../xseries/decoder';

class MainLayout extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            editMode: true,
            raw: "",
            rawCache: "",
            decoded: [],
        }

        this.setContent = this.setContent.bind(this);
        this.showReadMode = this.showReadMode.bind(this);
        this.showEditMode = this.showEditMode.bind(this);
    }

    setContent(e) {
        this.setState({ raw: e.target.value });
    }

    showEditMode(e) {
        e.preventDefault();
        this.setState({ editMode: true });
    }

    showReadMode(e) {
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

    renderControls() {
        if (this.state.editMode == true) {
            return (
                <div id="controls">
                    <a href="#" onClick={this.showReadMode}>Parse datablocks</a>
                </div>
            );
        }
        return (
            <div id="controls">
                <a href="#" onClick={this.showEditMode}>Edit data</a>
            </div>
        );
    }

    renderContent() {
        if (this.state.editMode == true) {
            return(
                <div id="content">
                    <textarea
                        onChange={this.setContent}
                        placeholder="paste datablocks here..."
                        value={this.state.raw}>
                    </textarea>
                </div>
            );
        }

        return <pre>{JSON.stringify(this.state.decoded, null, 2)}</pre>   
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