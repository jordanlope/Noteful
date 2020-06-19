import React, { Component } from 'react'

export default class FoldersError extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error) {
        console.log(error)
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <h2>Could not display folder list</h2>
            );
        }

        return this.props.children;
    }
}