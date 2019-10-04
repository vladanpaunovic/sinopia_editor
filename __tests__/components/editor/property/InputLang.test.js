// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import InputLang from 'components/editor/property/InputLang'
import { Provider } from 'react-redux'
import { fireEvent, waitForElement } from '@testing-library/react'
import { renderWithRedux, createReduxStore } from 'testUtils'

const state = {
  selectorReducer: {
    entities: {
      languages: {
        options: [{
          id: 'en',
          label: 'English',
        }],
      }
    },
    resource: {
      'http://id.loc.gov/ontologies/bibframe/instanceOf': {
        'content': '45678'
      }
    }
  }
}

const plProps = {
  id: '1223',
  propertyTemplate: {
    propertyLabel: 'Instance of',
    propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
    type: 'literal',
  },
  loadLanguages: jest.fn(),
  options: [],
  reduxPath: [ 'resource', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
}

describe('<InputLang />', () => {
  const store = createReduxStore(state)
  const portalRoot = document.createElement('div')
  portalRoot.setAttribute('id', 'modal')
  document.body.appendChild(portalRoot)

  it('contains a label with the value of propertyLabel', () => {
    const { queryByText} = renderWithRedux(
      <InputLang {...plProps} />,
      store
    )
    const expected = 'Select language for 45678'
    expect(queryByText(expected)).toBeInTheDocument()
  })

  it('typeahead component exists', () => {
    const { getByRole, getByText, debug } = renderWithRedux(
      <InputLang {...plProps} />,
      store
    )
    expect(getByRole('combobox')).toBeInTheDocument()
  })

  it('calls theon change', async () => {
    const { getByRole, getByText, debug } = renderWithRedux(
      <InputLang {...plProps} />,
      store
    )
    fireEvent.change(getByRole('combobox'), { target: { value: 'English' } })
    // wrapper.find('#langComponent').simulate('change', [{ id: 'en', label: 'English' }])
    await waitForElement(() => getByText('English'))
  })
})
