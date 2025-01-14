// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
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
    <Modal show={true} onHide={(handleClose)}>
      <Modal.Header closeButton>
        <Modal.Title>Languages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputLang reduxPath={props.reduxPath} handleLangChange={setLang}/>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleLangSubmit}>Submit</Button>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )

  return (
    <React.Fragment>
      <Button
        id="language"
        bsSize="small"
        bsStyle="default"
        onClick = { () => setShow(true) }
        className="btn-literal">
        Language: {props.language}
      </Button>
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
