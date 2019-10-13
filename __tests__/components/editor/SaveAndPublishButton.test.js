// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import SaveAndPublishButton from 'components/editor/SaveAndPublishButton'

describe('<SaveAndPublishButton />', () => {
  describe('when disabled', () => {
    const wrapper = shallow(<SaveAndPublishButton.WrappedComponent isDisabled={true} />)
    it('the button is disabled', () => {
      expect(wrapper.find('button').prop('disabled')).toEqual(true)
    })
  })
  describe('when not disabled', () => {
    const wrapper = shallow(<SaveAndPublishButton.WrappedComponent isDisabled={false} />)
    it('the button is not disabled', () => {
      expect(wrapper.find('button').prop('disabled')).toEqual(false)
    })
  })
})
