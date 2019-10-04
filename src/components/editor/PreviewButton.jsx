// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

const PreviewButton = () => (
  <button type="button"
          className="btn btn-link"
          aria-label="Preview RDF"
          title="Preview RDF"
          data-toggle="modal"
          data-target="#rdf-modal">
    <FontAwesomeIcon icon={faEye} size="2x" />
  </button>
)


export default PreviewButton
