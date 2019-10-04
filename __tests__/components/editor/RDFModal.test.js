// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import RDFModal from 'components/editor/RDFModal'
import SaveAndPublishButton from 'components/editor/SaveAndPublishButton'

describe('<RDFModal />', () => {
  const closeFunc = jest.fn()
  const rdfFunc = jest.fn()
  const saveFunc = jest.fn()

  const wrapper = shallow(<RDFModal.WrappedComponent show={true} rdf={rdfFunc} close={closeFunc} save={saveFunc} />)

  it('renders the <RDFModal /> component as a Modal', () => {
    expect(wrapper.find('.modal').length).toBe(1)
  })

  describe('header', () => {
    it('has a Modal.Header', () => {
      expect(wrapper.find('.modal-header').length).toBe(1)
    })

    it('has a close button', () => {
      expect(wrapper.find('.modal-header').prop('closeButton')).toBe(true)
    })

    it('has a Modal.Title inside the Modal.Header', () => {
      expect(wrapper.find('.modal-header').find('.modal-title').length).toBe(1)
    })
    it('shows the RDF Preview title with the resource template id', () => {
      const title = wrapper.find('.modal-header').find('.modal-title')

      expect(title.childAt(0).text()).toMatch(/RDF Preview/)
    })
  })

  describe('body', () => {
    it('has a save and publish button', () => {
      expect(wrapper.find(SaveAndPublishButton).length).toBe(1)
    })

    it('has a Modal.Body', () => {
      expect(wrapper.find('.modal-body').length).toBe(1)
    })
  })
})
