// Copyright 2019 Stanford University see LICENSE for license

import React, { useMemo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import { showResourceTemplateChooser as showResourceTemplateChooserAction } from 'actions/index'
import ResourceTemplateChoiceModal from '../ResourceTemplateChoiceModal'
import { getTerm } from 'utilities/qa'
import { existingResource as existingResourceAction } from 'actionCreators/resources'
import { rootResource as rootResourceSelector } from 'selectors/resourceSelectors'
import useResource from 'hooks/useResource'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const QASearchResults = (props) => {
  const dispatch = useDispatch()
  const showResourceTemplateChooser = () => dispatch(showResourceTemplateChooserAction())

  const searchResults = useSelector(state => state.selectorReducer.search.results)
  const searchUri = useSelector(state => state.selectorReducer.search.uri)
  const rootResource = useSelector(state => rootResourceSelector(state))

  const [error, setError] = useState(null)
  const [resourceURI, setResourceURI] = useState(null)
  // Resource ID is for handling non-LD QA authorities, e.g., Discog
  const [resourceId, setResourceId] = useState(null)
  const [resourceTemplateId, setResourceTemplateId] = useState(null)
  const [resourceN3, setResourceN3] = useState(null)
  const [resourceState, unusedDataset, useResourceError] = useResource(resourceN3, resourceURI, resourceTemplateId, rootResource, props.history)
  useEffect(() => {
    if (useResourceError && !error) {
      setError(useResourceError)
    }
  }, [useResourceError, error])

  useEffect(() => {
    if (resourceState && unusedDataset) {
      dispatch(existingResourceAction(resourceState, unusedDataset.toCanonical()))
    }
  }, [dispatch, resourceState, unusedDataset])

  // Retrieve N3 from QA
  useEffect(() => {
    if (!resourceURI || !searchUri) {
      return
    }
    getTerm(resourceURI, resourceId, searchUri)
      .then(resourceN3 => setResourceN3(resourceN3))
      .catch(err => setError(`Error retrieving resource: ${err.toString()}`))
  }, [resourceURI, searchUri])

  // Transform the results into the format to be displayed in the table.
  const tableData = useMemo(() => searchResults.map((result) => {
    // Discogs returns a context that is not an array
    console.log('result', result)
    const types = []
    if(result.context) {
      if(Array.isArray(result.context)) {
          const classContext = result.context.find(context => context.property === 'Type')
          if (classContext) {
              types.push(...classContext.values)
          }
      } else if (Array.isArray(result.context.Type)) {
        types.push(...result.context.Type)
      }
    }

    return {
      label: result.label,
      uri: result.uri,
      id: result.id,
      types,
    }
  }),
  [searchResults])

  const handleCopy = (uri, id) => {
    setResourceURI(uri)
    setResourceId(id)
    setResourceTemplateId(null)
    showResourceTemplateChooser()
  }

  // Passed into resource template chooser to allow it to pass back selected resource template id.
  const chooseResourceTemplate = (resourceTemplateId) => {
    setResourceTemplateId(resourceTemplateId)
  }

  function classFormatter(cell) {
    return (
      <ul className="list-unstyled">
        {cell.map(clazz => <li key={clazz}>{clazz}</li>)}
      </ul>
    )
  }

  function actionFormatter(cell, row) {
    return (
      <div>
        <button type="button"
                className="btn btn-link"
                onClick={() => handleCopy(cell, row.id)}
                title="Copy"
                aria-label="Copy this resource">
          <FontAwesomeIcon icon={faCopy} size="2x" />
        </button>
      </div>
    )
  }

  const columns = [
    {
      dataField: 'label',
      text: 'Label',
      sort: false,
      headerStyle: { backgroundColor: '#F8F6EF', width: '45%' },
    },
    {
      dataField: 'types',
      text: 'Types',
      sort: false,
      headerStyle: { backgroundColor: '#F8F6EF', width: '40%' },
      formatter: classFormatter,
    },
    {
      dataField: 'uri',
      text: '',
      sort: false,
      headerStyle: { backgroundColor: '#F8F6EF', width: '15%' },
      formatter: actionFormatter,
    }]

  return (
    <div id="search-results" className="row">
      { error
        && <div className="row">
          <div className="col-md-12" style={{ marginTop: '10px' }}>
            <div className="alert alert-danger alert-dismissible">
              <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
              { error.toString() }
            </div>
          </div>
        </div>
      }
      <div className="col-sm-2"></div>
      <div className="col-sm-8">
        <BootstrapTable id="search-results-list" keyField="uri" data={ tableData } columns={ columns } />
      </div>
      <div className="col-sm-2"></div>
      <ResourceTemplateChoiceModal choose={chooseResourceTemplate} />
    </div>
  )
}

QASearchResults.propTypes = {
  history: PropTypes.object.isRequired,
}

export default QASearchResults
