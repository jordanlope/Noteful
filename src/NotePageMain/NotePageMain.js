import React from 'react'
import Note from '../Note/Note'
import './NotePageMain.css'
import PropTypes from 'prop-types'
import AppContext from '../context'

export default function NotePageMain(props) {
  return (
    <AppContext.Consumer>
      {(value) => {
        return (
          <section className='NotePageMain'>
          <Note
            id={props.note.id}
            name={props.note.name}
            modified={props.note.modified}
            deleteNote={value.removeNote}
          />
          <div className='NotePageMain__content'>
            {props.note.content.split(/\n \r|\n/).map((para, i) =>
              <p key={i}>{para}</p>
            )}
          </div>
        </section>
        )
      }}
    </AppContext.Consumer>
  )
}

NotePageMain.defaultProps = {
  note: {
    content: '',
  }
}

NotePageMain.propTypes = {
  note: PropTypes.object.isRequired
};
