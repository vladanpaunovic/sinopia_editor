// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import shortid from 'shortid'
import { renderWithRedux, createReduxStore } from 'testUtils'
import LanguageButton from 'components/editor/property/LanguageButton'

// describe('<LanguageButton />', () => {
//   let mockWrapper
//

  // shortid.generate = jest.fn().mockReturnValue(0)

  // beforeEach(() => {
  //   mockWrapper = shallow(<LanguageButton.WrappedComponent
  //                                       reduxPath={[
  //                                         'resourceTemplate:bf2:Monograph:Instance',
  //                                         'http://id.loc.gov/ontologies/bibframe/instanceOf',
  //                                         'items',
  //                                         'TM1qwVFkh',
  //                                       ]}
  //                                       language={'English'}
  //                                       languageSelected={jest.fn()} />)
  // })
  //
  // it('item appears when user inputs text into the field', () => {
  //   expect(mockWrapper.find('button#language').childAt(1).text()).toEqual('English')
  // })

describe('When the user enters input into language modal', () => {
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
          'content': "122345"
        }
      }
    }
  }
  const store = createReduxStore(state)
  const { debug, getByText } = renderWithRedux(
    <LanguageButton
      language={"Spanish"}
      reduxPath={[
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/instanceOf']}
      textValue={"12345"}
    />,
    store
  )
  print(debug())
//   const mockMyItemsLangChange = jest.fn()
//
//   shortid.generate = jest.fn().mockReturnValue(0)
//   const mockWrapper = shallow(<LanguageButton.WrappedComponent
//                                             reduxPath={[
//                                               'resourceTemplate:bf2:Monograph:Instance',
//                                               'http://id.loc.gov/ontologies/bibframe/instanceOf',
//                                               'items',
//                                               'TM1qwVFkh',
//                                             ]}
//                                             language={'English'}
//                                             languageSelected={mockMyItemsLangChange} />)
//
  it('shows the <InputLang> modal when the <Button/> is clicked', async () => {

    fireEvent.click(getByText('Spanish'))
//     mockWrapper.find('button').first().simulate('click')
//     expect(mockWrapper.find('div.modal').prop('data-show')).toEqual(true)
//     expect(mockWrapper.find('h4.modal-title').render().text()).toEqual('Languages')
  })
//
//   it('calls handleLangSubmit when submit is clicked', () => {
//     mockWrapper.find('button').first().simulate('click')
//     expect(mockWrapper.find('div.modal').prop('data-show')).toEqual(true)
//     expect(mockWrapper.find('div.modal').length).toEqual(1)
//     mockWrapper.find('div.modal-footer').find('button').first().simulate('click')
//     expect(mockMyItemsLangChange.mock.calls.length).toEqual(1)
//     expect(mockWrapper.find('div.modal').length).toEqual(0)
//
//
//     mockMyItemsLangChange.mock.calls = []
//   })
//
//   it('closes modal when close is clicked', () => {
//     mockWrapper.find('button').first().simulate('click')
//     expect(mockWrapper.find('div.modal').prop('data-show')).toEqual(true)
//     mockWrapper.find('div.modal-footer').find('button').last().simulate('click')
//     expect(mockMyItemsLangChange.mock.calls.length).toEqual(0)
//     expect(mockWrapper.find('div.modal').length).toEqual(0)
//
//     mockMyItemsLangChange.mock.calls = []
//   })
})
