import React, { Component } from 'react'

export default class NotesError extends Component {
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
                <h2>Could not display note list</h2>
            );
        }

        return this.props.children;
    }
}