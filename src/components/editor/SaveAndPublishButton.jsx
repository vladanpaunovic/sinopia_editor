// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { update } from 'actionCreators/resources'
import { rootResourceId, resourceHasChangesSinceLastSave } from 'selectors/resourceSelectors'
import { getCurrentUser } from 'authSelectors'
import { showGroupChooser } from 'actions/index'

const SaveAndPublishButton = (props) => {
  const save = () => {
    if (props.isSaved) {
      props.update(props.currentUser)
    }
  }

  return (
    <button id={ props.id }
            className="btn btn-primary"
            onClick={ save }
            data-toggle="modal"
            data-target="#group-choice-modal"
            disabled={ props.isDisabled }>
      Save
    </button>
  )
}

SaveAndPublishButton.propTypes = {
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  update: PropTypes.func,
  showGroupChooser: PropTypes.func,
  isSaved: PropTypes.bool,
  currentUser: PropTypes.object,
}

const mapStateToProps = state => ({
  isSaved: !!rootResourceId(state),
  currentUser: getCurrentUser(state),
  isDisabled: !resourceHasChangesSinceLastSave(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({ update, showGroupChooser }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SaveAndPublishButton)
