// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["error", 4] */

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Config from 'Config'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import { getCurrentUser } from 'authSelectors'
import { retrieveResource } from 'actionCreators/resources'
import Button from 'react-bootstrap/lib/Button'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import { rootResource } from 'selectors/resourceSelectors'

const SinopiaSearchResults = (props) => {
  const [navigateEditor, setNavigateEditor] = useState(false)

  const handleClick = (resourceURI) => {
    props.retrieveResource(props.currentUser, resourceURI).then((success) => {
      setNavigateEditor(success)
    })
  }

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && props.rootResource && !props.error) {
      props.history.push('/editor')
    }
  })

  // This returns the current row number + 1 in order to include it in the displayed table
  const indexFormatter = (_cell, _row, rowIndex) => rowIndex + 1

  const linkFormatter = (_cell, row) => (
    <ButtonToolbar>
      <Button bsStyle="link" onClick={e => handleClick(`${Config.sinopiaServerBase}/${row.uri}`, e)}>{row.title}</Button>
    </ButtonToolbar>
  )

  if (props.searchResults.length === 0) {
    return null
  }

  const columns = [{
    dataField: 'index',
    text: 'ID',
    sort: false,
    formatter: indexFormatter,
    headerStyle: { backgroundColor: '#F8F6EF', width: '5%' },
  },
  {
    dataField: '_source.title',
    text: 'Title',
    sort: false,
    formatter: linkFormatter,
    headerStyle: { backgroundColor: '#F8F6EF', width: '95%' },
  }]

  return (
    <React.Fragment>
      { props.error
        && <div className="row">
          <div className="col-md-12" style={{ marginTop: '10px' }}>
            <div className="alert alert-danger alert-dismissible">
              <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
              { props.error }
            </div>
          </div>
        </div>
      }
      <div id="search-results" className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-8">
          <h3>Your List of Bibliographic Metadata Stored in Sinopia</h3>
          <BootstrapTable id="search-results-list" keyField="uri" data={ props.searchResults } columns={ columns } />
        </div>
        <div className="col-sm-2"></div>
      </div>
    </React.Fragment>
  )
}

SinopiaSearchResults.propTypes = {
  searchResults: PropTypes.array,
  retrieveResource: PropTypes.func,
  currentUser: PropTypes.object,
  history: PropTypes.object,
  rootResource: PropTypes.object,
  error: PropTypes.string,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  searchResults: state.selectorReducer.search.results,
  rootResource: rootResource(state),
  error: state.selectorReducer.editor.retrieveResourceError,
})

const mapDispatchToProps = dispatch => bindActionCreators({ retrieveResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SinopiaSearchResults)
