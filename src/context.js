import React from 'react'

const AppContext = React.createContext({
    selectedFolder: null,
    folders: [],
    notes: [],
    addFolder: () => {

    },
    setFolder: () => {

    },
    removeNote: () => {

    }
})

export default AppContext