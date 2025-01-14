import React from 'react'
import { fireEvent } from '@testing-library/react'
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux, createReduxStore } from 'testUtils'
import App from 'components/App'
import { MemoryRouter } from 'react-router-dom'

const createInitialState = () => {
  // Note that making mandatory
  return {
    authenticate: {
      authenticationState: {
        currentSession: {
          idToken: {},
        },
      },
    },
    selectorReducer: {
      resource: {
        'resourceTemplate:bf2:WorkTitle': {
          'http://id.loc.gov/ontologies/bibframe/mainTitle': {
            items: {
            },
          },
        },
      },
      entities: {
        languages: {
          loading: false,
          options: [
            {
              id: 'en',
              label: 'English',
            },
          ],
        },
        resourceTemplateSummaries: {
          'resourceTemplate:bf2:WorkTitle': {
            key: 'resourceTemplate:bf2:WorkTitle',
            name: 'Work Title',
            id: 'resourceTemplate:bf2:WorkTitle',
            group: 'ld4p',
          },
        },
        resourceTemplates: {
          'resourceTemplate:bf2:WorkTitle': {
            id: 'resourceTemplate:bf2:WorkTitle',
            resourceLabel: 'Work Title',
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Title',
            propertyTemplates: [
              {
                propertyURI: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
                propertyLabel: 'Preferred Title for Work',
                remark: 'http://access.rdatoolkit.org/rdachp6_rda6-2036.html',
                mandatory: 'true',
                repeatable: 'true',
                type: 'literal',
                resourceTemplates: [],
                valueConstraint: {
                  valueTemplateRefs: [],
                  useValuesFrom: [],
                  valueDataType: {},
                  defaults: [],
                },
              },
            ],
          },
        },
      },
      editor: {
        resourceValidationErrors: {},
        copyToNewMessage: {},
        rdfPreview: {
          show: true,
        },
        groupChoice: {
          show: false,
        },
      },
      appVersion: {
        version: undefined,
        lastChecked: Date.now(),
      },
    },
  }
}

describe('Preview and try to save resource', () => {
  const store = createReduxStore(createInitialState())
  const {
    getByText, getByTitle, queryByText, queryAllByText,
  } = renderWithRedux(
    (<MemoryRouter><App /></MemoryRouter>), store,
  )

  it('opens the resource, previews RDF, and displays validation', async () => {
    // Open the resource
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.click(getByText('Editor'))

    // Preview the RDF
    fireEvent.click(getByTitle('Preview RDF'))
    expect(getByText('RDF Preview')).toBeInTheDocument()
    expect(getByText(/<> <http:\/\/sinopia.io\/vocabulary\/hasResourceTemplate> "resourceTemplate:bf2:WorkTitle" ./)).toBeInTheDocument()

    // Save
    // There are multiple of these on screen, so selecting by id.
    // There is probably a more idiomatic way of doing this.
    const saveAndPublish = queryAllByText('Save').find((btn) => {
      return btn.id === 'modal-save'
    })
    fireEvent.click(saveAndPublish)

    expect(queryByText('Which group do you want to save to?')).not.toBeInTheDocument()
    expect(queryByText(/There was a probem saving this resource/)).toBeInTheDocument()
    expect(queryByText('Required')).toBeInTheDocument()
  })
})
