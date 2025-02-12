import React from 'react'
import { fireEvent, render, wait } from '@testing-library/react'
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux, createReduxStore } from 'testUtils'
import App from 'components/App'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'


const createInitialState = () => {
  return {
    authenticate: {
      authenticationState: {
        currentSession: {
          idToken: {},
        },
      },
    },
    selectorReducer: {
      resource: {},
      entities: {
        resourceTemplateSummaries: {},
        resourceTemplates: {},
      },
      editor: {
      },
      appVersion: {
        version: undefined,
        lastChecked: Date.now(),
      },
    },
  }
}

describe('Loading an invalid resource template', () => {
  const store = createReduxStore(createInitialState())
  const app = (<MemoryRouter><App /></MemoryRouter>)
  const {
    getByText, queryByText, container,
  } = renderWithRedux(
    app, store,
  )

  it('notifies the user that invalid', async () => {
    // Upload the resource template
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.click(getByText('Import a Profile containing New or Revised Resource Templates'))

    expect(getByText(/Drag and drop a resource template file/)).toBeInTheDocument()
    expect(queryByText(/The profile you provided was not valid JSON/)).not.toBeInTheDocument()

    const file = new File(['(⌐□_□)'], 'bad_json.json', {
      type: 'application/json',
    })

    const input = container.querySelector('input[type="file"]')
    Object.defineProperty(input, 'files', {
      value: [file],
    })

    dispatchEvt(input, 'change')
    await flushPromises(app, store, container)

    await wait(() => expect(queryByText(/The profile you provided was not valid JSON/)).toBeInTheDocument())
  })
})

// From https://github.com/react-dropzone/react-dropzone/blob/master/src/index.spec.js
// Using fireEvent.* doesn't work for our use case,
// we cannot set the event props
function dispatchEvt(node, type, data) {
  const event = new Event(type, { bubbles: true })
  if (data) {
    Object.assign(event, data)
  }
  fireEvent(node, event)
}

function flushPromises(ui, store, container) {
  return new Promise(resolve => global.setImmediate(() => {
    render((<Provider store={store}>{ui}</Provider>), { container })
    resolve(container)
  }))
}
