// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import SinopiaResourceTemplates from 'components/templates/SinopiaResourceTemplates'
import { fireEvent, wait } from '@testing-library/react'
import { createMemoryHistory } from 'history'
/* eslint import/no-unresolved: 'off' */
import { renderWithReduxAndRouter, createReduxStore } from 'testUtils'
import { saveAs } from 'file-saver'

jest.mock('file-saver')

const createInitialState = () => {
  const state = {
    selectorReducer: {
      resource: {
        'resourceTemplate:bf2:Note': {
          'http://id.loc.gov/ontologies/bibframe/note': {
            items: {},
          },
        },
      },
      entities: {
        resourceTemplateSummaries,
        resourceTemplates: {},
      },
      editor: {
        serverError: '',
      },
    },
  }
  return state
}

const resourceTemplateSummary = {
  name: 'Note',
  key: 'resourceTemplate:bf2:Note',
  id: 'resourceTemplate:bf2:Note',
  author: 'wright.lee.renønd',
  remark: 'very salient information',
  group: 'ld4p',
}

const resourceTemplateSummaries = [resourceTemplateSummary]

describe('SinopiaResourceTemplates', () => {
  it('has a header for the area where the table of resource templates for the groups are displayed', () => {
    const store = createReduxStore(createInitialState())
    const { getByText } = renderWithReduxAndRouter(
      <SinopiaResourceTemplates messages={[]} />, store,
    )

    expect(getByText('Available Resource Templates in Sinopia')).toBeInTheDocument()
  })

  it('has a bootstrap table that displays the results from the calls to sinopia_server', () => {
    const store = createReduxStore(createInitialState())
    const { container, getByText, getAllByText } = renderWithReduxAndRouter(
      <SinopiaResourceTemplates messages={[]} />, store,
    )

    expect(container.querySelector('table#resource-template-list')).toBeInTheDocument()
    expect(getByText(/Template name/)).toBeInTheDocument()
    expect(getByText(/ID/)).toBeInTheDocument()
    expect(getByText(/Author/)).toBeInTheDocument()
    expect(getByText(/Guiding statement/)).toBeInTheDocument()
    expect(getAllByText(/Download/)[0]).toBeInTheDocument()
  })

  it('renders a link to the Editor', async () => {
    const store = createReduxStore(createInitialState())
    const history = createMemoryHistory()
    const { container, getByText } = renderWithReduxAndRouter(
      <SinopiaResourceTemplates messages={[]} history={history} />, store,
    )

    expect(container.querySelector('a[href="/editor"]')).toBeInTheDocument()
    fireEvent.click(getByText('Note'))
    await wait(() => expect(history.location.pathname).toBe('/editor'))
  })

  it('renders a link to download the template', async () => {
    const store = createReduxStore(createInitialState())
    const { container, getAllByText } = renderWithReduxAndRouter(
      <SinopiaResourceTemplates messages={[]} />, store,
    )

    saveAs.mockReturnValue('file saved')
    expect(container.querySelector('button.btn-linky')).toBeInTheDocument()
    fireEvent.click(getAllByText('Download')[1])
    expect(saveAs()).toMatch('file saved')
  })
})
