// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GraphBuilder from 'GraphBuilder'
import { showRdfPreview } from 'actions/index'
import SaveAndPublishButton from './SaveAndPublishButton'

const RDFModal = (props) => {
  if (!props.show) {
    return null
  }

  return (<div>
    <div className="modal fade" data-show={true} role="dialog" onHide={() => props.showRdfPreview(false)}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">RDF Preview</h4>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body rdf-modal-content">
            <div className="row" style={{ marginLeft: '0', marginRight: '0' }}>
              <div className="col-sm-6">If this looks good, then click Save and Publish</div>
              <div className="col-sm-6" style={{ textAlign: 'right' }}>
                <SaveAndPublishButton id="modal-save" />
              </div>
            </div>
            <pre style={{ marginTop: '10px' }}>{ props.rdf() }</pre>
          </div>
        </div>
      </div>
    </div>
  </div>)
}

RDFModal.propTypes = {
  show: PropTypes.bool,
  showRdfPreview: PropTypes.func,
  rdf: PropTypes.func,
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.rdfPreview.show,
  rdf: () => new GraphBuilder(state.selectorReducer).graph.toCanonical(),
})

const mapDispatchToProps = dispatch => bindActionCreators({ showRdfPreview }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RDFModal)
