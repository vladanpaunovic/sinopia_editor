// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import InputLang from './InputLang'
import { languageSelected } from 'actions/index'
import { findNode } from 'selectors/resourceSelectors'
import { languageLabel } from 'selectors/entitySelectors'

const LanguageButton = (props) => {
  const [langPayload, setLang] = useState(null)
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
  }

  const handleLangSubmit = () => {
    props.languageSelected(langPayload)
    handleClose()
  }

  const dispModal = () => (
    <div className="modal fade" data-show={true} onHide={(handleClose)}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Languages</h4>
         </div>
         <div className="modal-body">
          <InputLang reduxPath={props.reduxPath} handleLangChange={setLang}/>
        </div>
        <div className="modal-footer">
          <button className="btn btn-default" onClick={handleLangSubmit}>Submit</button>
          <button className="btn btn-default" onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
   </div>
  )

  return (
    <React.Fragment>
      <button
        id="language"
        onClick = { () => setShow(true) }
        className="btn btn-sm btn-default btn-literal">
        Language: {props.language}
      </button>
      { show ? dispModal() : '' }
    </React.Fragment>
  )
}

LanguageButton.propTypes = {
  languageSelected: PropTypes.func,
  reduxPath: PropTypes.array.isRequired,
  language: PropTypes.string.isRequired,
}

const mapStateToProps = (state, ourProps) => {
  const language = languageLabel(state, findNode(state, ourProps.reduxPath).lang)
  return {
    language,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ languageSelected }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LanguageButton)
