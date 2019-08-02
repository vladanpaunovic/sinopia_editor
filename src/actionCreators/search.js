// Copyright 2019 Stanford University see LICENSE for license
import { getSearchResultsStarted, setSearchResults } from 'actions/index'
import { getSearchResults } from 'sinopiaServer'

const fetchSearchResults = (query, queryFrom) => (dispatch) => {
  dispatch(getSearchResultsStarted(query, queryFrom))

  return getSearchResults(query, queryFrom).then((response) => {
    dispatch(setSearchResults(response.results, response.totalHits, query))
  })
}

export default fetchSearchResults