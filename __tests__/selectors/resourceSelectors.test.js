// Copyright 2019 Stanford University see LICENSE for license

import {
  rootResourceId, isExpanded, itemsForProperty,
  getDisplayValidations, getResourceTemplate, getPropertyTemplate,
  resourceHasChangesSinceLastSave,
} from 'selectors/resourceSelectors'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'

let initialState

beforeEach(() => {
  initialState = {
    selectorReducer: {
      entities: {
        // The stuff we've retrieved from the server
        resourceTemplates: { },
      },
      resource: { // The state we're displaying in the editor
      },
      editor: {
        expanded: {},
      },
    },
  }
})

describe('rootResourceId', () => {
  it('returns the uri', () => {
    initialState.selectorReducer.resource = {
      'profile:bf2:Work': {
        resourceURI: 'http://platform:8080/repository/stanford/1f14d358-a0c9-4e66-b7e8-7c6ae5475036',
      },
    }

    expect(rootResourceId(initialState)).toEqual('http://platform:8080/repository/stanford/1f14d358-a0c9-4e66-b7e8-7c6ae5475036')
  })
})

describe('getDisplayValidations()', () => {
  it('returns false when missing', () => {
    expect(getDisplayValidations(initialState)).toBeFalsy()
  })

  it('returns value when present', () => {
    const state = {
      selectorReducer: {
        editor: {
          displayValidations: true,
        },
      },
    }

    expect(getDisplayValidations(state)).toBeTruthy()
  })
})

describe('itemsForProperty()', () => {
  beforeEach(() => {
    initialState.selectorReducer.resource = {
      'resourceTemplate:bf2:Monograph:Instance': {
        'http://id.loc.gov/ontologies/bibframe/issuance': {
          items: {
            abFEHPzpKR: {
              label: 'single unit',
              uri: 'http://id.loc.gov/vocabulary/issuance/mono',
            },
          },
        },
      },
    }
  })
  const reduxPath = [
    'resource', 'resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/issuance',
  ]

  it('returns value when present', () => {
    expect(itemsForProperty(initialState, reduxPath)).toEqual([{
      label: 'single unit',
      uri: 'http://id.loc.gov/vocabulary/issuance/mono',
    }])
  })
})

describe('isExpanded()', () => {
  const reduxPath = ['resource', 'resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf', 'aJOz_pLh3m7', 'resourceTemplate:bf2:Monograph:Work', 'http://id.loc.gov/ontologies/bibframe/title']

  it('returns false when missing', () => {
    expect(isExpanded(initialState, reduxPath)).toBeFalsy()
  })

  it('returns value when present', () => {
    const state = {
      selectorReducer: {
        editor: {
          expanded: {
            resource: {
              'resourceTemplate:bf2:Monograph:Instance': {
                'http://id.loc.gov/ontologies/bibframe/instanceOf': {
                  aJOz_pLh3m7: {
                    'resourceTemplate:bf2:Monograph:Work': {
                      'http://id.loc.gov/ontologies/bibframe/title': {
                        expanded: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }

    expect(isExpanded(state, reduxPath)).toBeTruthy()
  })
})

describe('getResourceTemplate()', () => {
  it('returns undefined when missing', () => {
    expect(getResourceTemplate(initialState, 'resourceTemplate:bf2:Monograph:Work')).toBeFalsy()
  })

  it('returns resource template when present', () => {
    const state = {
      selectorReducer: {
        entities: {
          resourceTemplates: {
            'resourceTemplate:bf2:Monograph:Work': {
              resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
            },
          },
        },
      },
    }

    expect(getResourceTemplate(state, 'resourceTemplate:bf2:Monograph:Work')).toEqual({
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
    })
  })
})

describe('getPropertyTemplate()', () => {
  it('returns undefined when missing', () => {
    expect(getPropertyTemplate(initialState, 'resourceTemplate:bf2:Monograph:Work', 'http://id.loc.gov/ontologies/bibframe/title')).toBeFalsy()
  })

  it('returns property template when present', () => {
    const state = {
      selectorReducer: {
        entities: {
          resourceTemplates: {
            'resourceTemplate:bf2:Monograph:Work': {
              resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
              propertyTemplates: [{
                propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
              }],
            },
          },
        },
      },
    }

    expect(getPropertyTemplate(state, 'resourceTemplate:bf2:Monograph:Work', 'http://id.loc.gov/ontologies/bibframe/title')).toEqual({
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/title',
    })
  })
})

describe('resourceHasChangesSinceLastSave', () => {
  let template
  beforeEach(async () => {
    const templateResponse = await getFixtureResourceTemplate('resourceTemplate:bf2:Note')
    template = templateResponse.response.body
  })
  const resource = {
    'resourceTemplate:bf2:Note': {
      'http://www.w3.org/2000/01/rdf-schema#label': {
        items: [
          {
            content: 'foo',
            id: 'VBtih30me',
            lang: 'en',
          },
        ],
      },
    },
  }
  describe('when not previously saved', () => {
    it('returns changed', () => {
      expect(resourceHasChangesSinceLastSave(initialState)).toBe(true)
    })
  })
  describe('when resource has changed', () => {
    it('returns changed', () => {
      initialState.selectorReducer.resource = resource
      initialState.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:Note'] = template
      initialState.selectorReducer.editor.lastSaveChecksum = 'abc123'
      expect(resourceHasChangesSinceLastSave(initialState)).toBe(true)
    })
  })
  describe('when resource has not changed', () => {
    it('returns not changed', () => {
      initialState.selectorReducer.resource = resource
      initialState.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:Note'] = template
      initialState.selectorReducer.editor.lastSaveChecksum = '3c1ce87bdaedc34b4d3f55c1aa775838'
      expect(resourceHasChangesSinceLastSave(initialState)).toBe(false)
    })
  })
})
