import React, { Component } from 'react';
import ValidationError from './ValidationError';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
var uniqid = require('uniqid');

class FolderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: '',
                touched: false,
                valid: false
            },
        }
    }

    updateName(name) {
        this.setState({name: {value: name, touched: true}});
    }

    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
            return "Name is required";
        } else if (name.length < 5) {
            return "Name must be at least 5 characters long";
        }
        // const val = this.state.name.value;
        // this.setState({name: {value: val, valid: true, touched: true}});
    }

    handleSubmit(event) {
        event.preventDefault();
        const { name } = this.state;
        const uniqueId = uniqid('', '-ffaf-11e8-8eb2-f2801f1b9fd1');
        const folder = {
            "id": uniqueId,
            "name": name.value,
        };
        
        // Validate
        if (name.value.length === 0) {
            return "Name is required";
        } else if (name.value.length < 5) {
            return "Name must be at least 5 characters long";
        }

        JSON.stringify(folder)
        console.log("Name: ", name.value);
        console.log("This is NoteForm Component")
        fetch('http://localhost:9090/folders', {
            method: 'POST',
            body: JSON.stringify(folder),
            headers: {
                'content-type': 'application/json'
            },
        })
        .then(response => {
          if(!response.ok) {
              console.log('Something went wrong')
            throw new Error('Something went wrong, please try again later.')
          }
          return response;
        })
        .then(response => response.json())
        .then(data => {
            console.log("Successful POST", data);

            this.props.addFolder(folder)
            this.props.history.push('/')
            
        })
        .catch(err => {
          this.setState({
            error: err.message
          });
        });
    }

    render() {
        const nameError = this.validateName();
        console.log("History of FolderForm", this.props.history.push)

        return (
        <form className="registration" onSubmit={e => {
            this.handleSubmit(e);
        }}>
            <h2>Register</h2>
            <div className="registration__hint">* required field</div>  
            <div className="form-group">
                <label htmlFor="name">Name of Folder *</label>
                <input type="text" className="registration__control"
                    name="name" id="name" onChange={e => this.updateName(e.target.value)}/>
            </div>
            {this.state.name.touched && (
                <ValidationError message={nameError} />
            )}
            <div className="registration__button__group">
                <button type="reset" className="registration__button">
                    <Link to="/">Cancel</Link>
                </button>
                <button type="submit" className="registration__button">
                    Save
                </button>
            </div>
        </form>
        )
    }
}

FolderForm.propTypes = {
    addFolder: PropTypes.func.isRequired
};

export default withRouter(FolderForm)