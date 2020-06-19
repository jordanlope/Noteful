import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import ValidationError from './ValidationError';
import PropTypes from 'prop-types';
var uniqid = require('uniqid');

class NoteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: '',
                touched: false
            },
            content: {
                value: '',
                touched: false
            },
            folder: {
                id: '',
                name: '',
                touched: false
            }
        }
    }



    updateName(name) {
        this.setState({name: {value: name, touched: true}});
    }

    updateContent(content) {
        this.setState({content: {value: content, touched: true}})
    }

    updateFolder(folderId) {
        console.log("Folder ID", folderId)
        const folder = this.props.folders.find(folder => folder.id === folderId)
        this.setState({folder: {id: folder.id, name: folder.name, touched: true}})
        console.log("Folder ID", this.state.folder.name, this.state.folder.id)
    }

    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
            return "Name is required";
        } else if (name.length < 5) {
            return "Name must be at least 5 characters long";
        }
    }

    validateContent() {
        const content = this.state.content.value.trim();
        if (content.length === 0) {
            return "Content is required";
        } else if (content.length < 10) {
            return "Content must be at least 10 characters long";
        }
    }

    validateFolder() {
        const folder = this.state.folder.name;
        if (folder === '') {
            return "Folder is required";
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        // process form values here
        const uniqueId = uniqid('', '-ffaf-11e8-8eb2-f2801f1b9fd1');
        console.log("This is NoteForm Component")

        if (this.state.name.value.length === 0) {
            return "Name is required";
        } else if (this.state.name.value.length < 5) {
            return "Name must be at least 5 characters long";
        }

        if (this.state.content.value.length === 0) {
            return "Content is required";
        } else if (this.state.content.value.length < 10) {
            return "Content must be at least 10 characters long";
        }

        if (this.state.folder.name === '') {
            return "Folder is required";
        }

        console.log(this.state.name.value, this.state.content.value, this.state.folder.id)
        const note = {
            "name": this.state.name.value,
            "id": uniqueId, 
            "modified": Date.now(),
            "content": this.state.content.value,
            "folderId": this.state.folder.id
        }

        fetch('http://localhost:9090/notes', {
            method: 'POST',
            body: JSON.stringify(note),
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
            this.props.addNote(note)
            this.props.history.push('/')
        })
        .catch(err => {
          this.setState({
            error: err.message
          });
        });
    }

    render() {
        const nameError = this.validateName()
        const contentError = this.validateContent()
        const folderError = this.validateFolder()

        console.log("Folders: ", this.props.folders)
        return (
        <form className="registration" onSubmit={e => this.handleSubmit(e)} >
            <h2>Register</h2>
            <div className="registration__hint">* required field</div>  
            <div className="form-group">
                <label htmlFor="name">Name of Note *</label>
                <input type="text" className="folder__control"
                    name="name" id="name" onChange={e => this.updateName(e.target.value)}/>
            </div>
            {this.state.name.touched && <ValidationError message={nameError}/>}
            <div className="form-group">
                <label htmlFor="content">Content *</label>
                <input type="text" className="folder__control"
                    name="content" id="content" size={500} onChange={e => this.updateContent(e.target.value)}/>
            </div>
            {this.state.content.touched && <ValidationError message={contentError}/>}
            {this.props.folders.map((folder, index) => {
                return (
                    <div className="form-group" id={index}>
                        <input type="radio" id={folder.name}  name="folder" value={folder.id} onChange={e => this.updateFolder(e.target.value)}/>
                        <label htmlFor={folder.name}>{folder.name}</label>
                    </div>
                )
            })}

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

NoteForm.propTypes = {
    folders: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })),
    addNote: PropTypes.func.isRequired
}

export default NoteForm