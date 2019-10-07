// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Config from 'Config'
import { closeGroupChooser } from 'actions/index'
import { getCurrentUser } from 'authSelectors'
import { publishResource } from 'actionCreators/resources'
import ModalWrapper from './ModalWrapper'

const GroupChoiceModal = (props) => {
  // The ld4p group is only for templates
  const groups = Object.entries(Config.groupsInSinopia)
    .filter(([groupSlug]) => groupSlug !== 'ld4p')
    .sort(([, groupLabelA], [, groupLabelB]) => groupLabelA.localeCompare(groupLabelB))

  const [selectedValue, setSelectedValue] = useState(groups[0][0])

  const updateSelectedValue = (event) => {
    setSelectedValue(event.target.value)
  }

  const saveAndClose = (event) => {
    event.preventDefault()
    props.publishResource(props.currentUser, selectedValue)
  }

  const modal = (
    <div>
      <div className="modal modal-lg"
           role="dialog"
           tabIndex="-1"
           id="group-choice-modal">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header prop-heading">
              <h4 className="modal-title">
                Which group do you want to save to?
              </h4>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body group-panel">
              <div className="group-select-label">
                Which group do you want to associate this record to?
              </div>
              <div>
                <form className="group-select-options" >
                  <select className="form-control"
                          data-testid="groupSelect"
                          defaultValue={ selectedValue }
                          onBlur={ event => updateSelectedValue(event)} >
                    { groups.map((group, index) => <option key={index} value={ group[0] }>{ group[1] }</option>) }
                  </select>
                  <div className="group-choose-buttons">
                    <button className="btn btn-link btn-sm" style={{ paddingRight: '20px' }}
                            data-dismiss="modal">
                      Cancel
                    </button>
                    <button className="btn btn-primary btn-sm" data-dismiss="modal" onClick={ saveAndClose }>
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (<ModalWrapper modal={modal} />)
}

GroupChoiceModal.propTypes = {
  closeGroupChooser: PropTypes.func,
  choose: PropTypes.func,
  show: PropTypes.bool,
  currentUser: PropTypes.object,
  publishResource: PropTypes.func,
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.groupChoice.show,
  currentUser: getCurrentUser(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({ closeGroupChooser, publishResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GroupChoiceModal)
