// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Download from 'components/templates/Download'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { newResource } from 'actionCreators/resources'
import { rootResource } from 'selectors/resourceSelectors'

/**
 * This is the list view of all the templates
 */
class SinopiaResourceTemplates extends Component {
  constructor(props) {
    super(props)
    this.state = { navigateEditor: false }
  }

  componentDidUpdate() {
    // Forces a wait until the root resource has been set in state
    if (this.state.navigateEditor && this.props.rootResource && !this.props.error) {
      this.props.history.push('/editor')
    }
  }

  handleClick = (resourceTemplateId, event) => {
    event.preventDefault()
    this.props.newResource(resourceTemplateId).then((result) => {
      this.setState({ navigateEditor: result })
    })
  }

  generateRows = () => {
    const rows = []
    this.props.resourceTemplateSummaries.forEach((row) => {
      rows.push(<tr key={row.id}>
        <td style={{ wordBreak: 'break-all' }}>
          <Link to={{ pathname: '/editor', state: { } }} onClick={e => this.handleClick(row.id, e)}>{row.name}</Link>
        </td>
        <td style={{ wordBreak: 'break-all' }}>
          { row.id }
        </td>
        <td style={{ wordBreak: 'break-all' }}>
          { row.author }
        </td>
        <td style={{ wordBreak: 'break-all' }}>
          { row.remark }
        </td>
        <td>
          <Download resourceTemplateId={ row.id } groupName={ row.group } />
        </td>
      </tr>)
    })
    return rows
  }

  render() {
    if (this.props.resourceTemplateSummaries.length === 0) {
      return (
        <div className="alert alert-warning alert-dismissible">
          <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
          No connection to the Sinopia Server is available, or there are no resources for any group.
        </div>
      )
    }

    const createResourceMessage = this.props.messages.length === 0
      ? (<span />)
      : (
        <div className="alert alert-info">
          { this.props.messages.join(', ') }
        </div>
      )

    const errorMessage = this.props.error === undefined
      ? (<span />)
      : (<div className="alert alert-warning">{ this.props.error }</div>)

    return (
      <div>
        { createResourceMessage }
        { errorMessage }
        <h4>Available Resource Templates in Sinopia</h4>
        <table className="table table-bordered"
               id="resource-template-list">
          <thead>
            <tr>
              <th style={{ backgroundColor: '#F8F6EF', width: '30%' }}>Template name</th>
              <th style={{ backgroundColor: '#F8F6EF', width: '30%' }}>ID</th>
              <th style={{ backgroundColor: '#F8F6EF', width: '10%' }}>Author</th>
              <th style={{ backgroundColor: '#F8F6EF', width: '22%' }}>Guiding statement</th>
              <th style={{ backgroundColor: '#F8F6EF', width: '8%' }}>Download</th>
            </tr>
          </thead>
          <tbody>
            { this.generateRows()}
          </tbody>
        </table>
      </div>
    )
  }
}

SinopiaResourceTemplates.propTypes = {
  messages: PropTypes.array,
  resourceTemplateSummaries: PropTypes.array,
  newResource: PropTypes.func,
  history: PropTypes.object,
  error: PropTypes.string,
  rootResource: PropTypes.object,
}

const mapStateToProps = (state) => {
  const resourceTemplateSummaries = Object.values(state.selectorReducer.entities.resourceTemplateSummaries)
  const resource = rootResource(state)
  const error = state.selectorReducer.editor.retrieveResourceTemplateError
  return {
    resourceTemplateSummaries,
    error,
    rootResource: resource,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ newResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SinopiaResourceTemplates)
