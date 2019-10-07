// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GraphBuilder from 'GraphBuilder'
import ModalWrapper from './ModalWrapper'
import SaveAndPublishButton from './SaveAndPublishButton'

const RDFModal = (props) => {
  const modal = (
    <div className="modal fade" id="rdf-modal" data-testid="rdf-modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header" data-testid="rdf-modal-header">
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
    </div>)

  return (<ModalWrapper modal={modal} />)
}

RDFModal.propTypes = {
  show: PropTypes.bool,
  rdf: PropTypes.func,
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.rdfPreview.show,
  rdf: () => new GraphBuilder(state.selectorReducer).graph.toCanonical(),
})

export default connect(mapStateToProps, null)(RDFModal)
