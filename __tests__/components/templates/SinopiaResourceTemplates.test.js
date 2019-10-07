// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import SinopiaResourceTemplates from 'components/templates/SinopiaResourceTemplates'

jest.mock('sinopiaServer')

describe('<SinopiaResourceTemplates />', () => {
  const messages = [
    'Created http://localhost:8080/repository/ld4p/Note/sinopia:resourceTemplate:bf2:Note1',
    'Created http://localhost:8080/repository/ld4p/Note/sinopia:resourceTemplate:bf2:Note2',
  ]

  const resourceTemplateSummary = {
    name: 'Note',
    key: 'ld4p:resourceTemplate:bf2:Note',
    id: 'ld4p:resourceTemplate:bf2:Note',
    author: 'wright.lee.renønd',
    remark: 'very salient information',
    group: 'stanford',
  }

  const resourceTemplateSummaries = [resourceTemplateSummary]

  const wrapper = shallow(<SinopiaResourceTemplates.WrappedComponent messages={messages} resourceTemplateSummaries={resourceTemplateSummaries} />)

  it('has a header for the area where the table of resource templates for the groups are displayed', () => {
    expect(wrapper.find('div > h4').last().text()).toEqual('Available Resource Templates in Sinopia')
  })

  it('has a bootstrap table that displays the results from the calls to sinopia_server', () => {
    expect(wrapper.find('.table').length).toEqual(1)
  })

  describe('display', () => {
    const wrapper = shallow(<SinopiaResourceTemplates.WrappedComponent messages={[]} resourceTemplateSummaries={resourceTemplateSummaries} />)

    it('renders the table of resource templates with name, id, author, guiding statement, download columns', () => {
      const tableHeaderCellText = wrapper.find('div > table > thead > tr > th')
      expect(tableHeaderCellText.at(0).text()).toEqual('Template name')
      expect(tableHeaderCellText.at(1).text()).toEqual('ID')
      expect(tableHeaderCellText.at(2).text()).toEqual('Author')
      expect(tableHeaderCellText.at(3).text()).toEqual('Guiding statement')
      expect(tableHeaderCellText.at(4).text()).toEqual('Download')
    })
  })

  describe('linking back to the Editor component', () => {
    it('renders a link to the Editor', () => {
      expect.assertions(1)
      const link = wrapper.find('Link')
      expect(link.props().to.pathname).toEqual('/editor')
    })
  })
  describe('linking to download the template', () => {
    it('renders a link to download the template', () => {
      expect.assertions(2)
      const link = wrapper.find('Download')

      expect(link.props().resourceTemplateId).toEqual('ld4p:resourceTemplate:bf2:Note')
      expect(link.props().groupName).toEqual('stanford')
    })
  })
})
