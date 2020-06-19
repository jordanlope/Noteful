import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteForm from '../NotefulForm/NoteForm';
import FolderForm from '../NotefulForm/FolderForm';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import FoldersError from '../Error/FolderListError';
import NotesError from '../Error/NoteListError';
import NoteError from '../Error/NotePageError';
import AppContext from '../context';
import './App.css';

class App extends Component {
    
    state = {
        notes: [],
        folders: []
    };

    // Removes note
    removeNote = noteId => {
        const newNotes = this.state.notes.filter(note => note.id !== noteId)
        this.setState({
            notes: newNotes
        })
    }

    addFolder = folder => {
        const folders = this.state.folders
        console.log("Add folder was called", folder)
        this.setState({
            folders: [...folders, folder]
        })
    }

    addNote = note => {
        const notes = this.state.notes
        console.log("Add note was called", note)
        this.setState({
            notes: [...notes, note]
        })
    }

    // Selects folder
    handleSetFold = (selFolder) => {
        this.setState({ selectedFolder: selFolder});
    }

    componentDidMount() {
        console.log("This is AppFoldNote Component")
        fetch('http://localhost:9090/folders', {
            method: 'GET',
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
            console.log("Recieved data");
            console.log("State folders value", this.state.folders)
            this.setState({ folders: [...data] })
            console.log("State folders value", this.state.folders)
        })
        .catch(err => {
          this.setState({
            error: err.message
          });
        });

        fetch('http://localhost:9090/notes', {
            method: 'GET',
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
            console.log("Recieved data");
            console.log("State notes value", this.state.folders)
            this.setState({ notes: [...data] })
            console.log("State notes value", this.state.folders)
        })
        .catch(err => {
          this.setState({
            error: err.message
          });
        });
    }

    renderNavRoutes() {
        const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => (
                            <NotesError>
                                <NoteListNav
                                    {...routeProps}
                                    // title={{name: "Jordan"}}
                                />
                            </NotesError>
                        )}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId) || {};
                        const folder = findFolder(folders, note.folderId);
                        return (
                        <NoteError>
                            <NotePageNav 
                            {...routeProps} 
                            folder={folder}
                             />
                        </NoteError>);
                    }}
                />
                <Route path="/add-folder" render={routeProps => <FolderForm {...routeProps} addFolder={this.addFolder}/>} />
                <Route path="/add-note" render={routeProps => <NoteForm {...routeProps} addNote={this.addNote} folders={folders} />} />
            </>
        );
    }

    renderMainRoutes() {
        const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => {
                            const {folderId} = routeProps.match.params;
                            const notesForFolder = getNotesForFolder(
                                notes,
                                folderId
                            );
                            return (
                                <FoldersError>
                                    <NoteListMain
                                        {...routeProps}
                                        notes={notesForFolder}
                                        // deleteNote={this.removeNote}
                                    />
                                </FoldersError>
                            );
                        }}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId);
                        return (
                            <NoteError>
                                <NotePageMain 
                                {...routeProps} 
                                note={note} 
                                />
                            </NoteError>
                        );
                    }}
                />
            </>
        );
    }

    render() {
        const contextValue = {
            notes: this.state.notes,
            folders: this.state.folders,
            addFolder: this.addFolder,
            removeNote: this.removeNote
        }

        return (
            <AppContext.Provider value={contextValue}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </AppContext.Provider>
        );
    }
}

export default App;