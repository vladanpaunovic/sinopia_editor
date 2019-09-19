// Copyright 2019 Stanford University see LICENSE for license

export const loadingLanguages = () => ({
  type: 'LOADING_LANGUAGES',
})

export const languagesReceived = json => ({
  type: 'LANGUAGES_RECEIVED',
  payload: json,
})

export const loadedResourceTemplateSummaries = () => ({
  type: 'LOADED_RESOURCE_TEMPLATE_SUMMARIES',
})
