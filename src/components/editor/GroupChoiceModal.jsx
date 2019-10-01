// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Config from 'Config'
import { closeGroupChooser, showRdfPreview } from 'actions/index'
import { getCurrentUser } from 'authSelectors'
import { publishResource } from 'actionCreators/resources'

const GroupChoiceModal = (props) => {
  // The ld4p group is only for templates
  const groups = Object.entries(Config.groupsInSinopia)
    .filter(([groupSlug]) => groupSlug !== 'ld4p')
    .sort(([, groupLabelA], [, groupLabelB]) => groupLabelA.localeCompare(groupLabelB))

  const [selectedValue, setSelectedValue] = useState(groups[0][0])

  const updateSelectedValue = (event) => {
    setSelectedValue(event.target.value)
  }

  const saveAndClose = () => {
    props.publishResource(props.currentUser, selectedValue)
    props.showRdfPreview(false)
    props.closeGroupChooser(false)
  }

  return (
    <div>
      <div className="modal modal-lg"
           role="dialog"
           tabIndex="-1"
           show={ props.show }
           onHide={ () => props.closeGroupChooser(false) }>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header prop-heading" closeButton>
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
                  <select defaultValue={ selectedValue } onBlur={ event => updateSelectedValue(event)} >
                    { groups.map((group, index) => <option key={index} value={ group[0] }>{ group[1] }</option>) }
                  </select>
                  <div className="group-choose-buttons">
                    <button className="btn btn-link btn-sm" style={{ paddingRight: '20px' }}
                            onClick={ () => props.closeGroupChooser(false) }>
                      Cancel
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={ saveAndClose }>
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
}

GroupChoiceModal.propTypes = {
  closeGroupChooser: PropTypes.func,
  showRdfPreview: PropTypes.func,
  choose: PropTypes.func,
  show: PropTypes.bool,
  currentUser: PropTypes.object,
  publishResource: PropTypes.func,
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.groupChoice.show,
  currentUser: getCurrentUser(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({ closeGroupChooser, showRdfPreview, publishResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GroupChoiceModal)
