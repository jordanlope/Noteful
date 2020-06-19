import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import './Note.css'
import AppContext from '../context'


function deleteNoteRequest(noteId, deleteNote, historyCallBack) {
  fetch(`http://localhost:9090/notes/${noteId}`, {
    method: 'DELETE',
  }).then(res => {
    if (!res.ok) {
      // get the error message from the response,
      return res.json().then(error => {
        // then throw it
        throw error
      })
    }
    return res.json()
  })
  .then(data => {
    // call the callback when the request is successful
    // this is where the App component can remove it from state
    deleteNote(noteId)
    historyCallBack('/')
  })
  .catch(error => {
    console.error(error)
  })
}

function Note(props) {

  return (
    <div className='Note'>

      <h2 className='Note__title'>
        <Link to={`/note/${props.id}`}>
          {props.name}
        </Link>
      </h2>

      <div className='Note__dates'>
        <div className='Note__dates-modified'>
          Modified
          {' '}
          <span className='Date'>
            {format(props.modified, 'Do MMM YYYY')}
          </span>
        </div>
      </div>

      <button className='Note__delete' type='button' onClick={() => deleteNoteRequest(props.id, props.deleteNote, props.history.push)}>
        <FontAwesomeIcon icon='trash-alt' />
        {' '}
        remove
      </button>

    </div>
  )
}

Note.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  deleteNote: PropTypes.func.isRequired,
  // modified: (PropTypes.string || PropTypes.number),
};

export default withRouter(Note)