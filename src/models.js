import { modelFactory } from 'modelld'
import { rdflib } from 'solid-client'

import * as utils from './utils'

const vocab = {
  bookmark: term => rdflib.namedNode(`http://www.w3.org/2002/01/bookmark#${term}`),
  dc: term => rdflib.namedNode(`http://purl.org/dc/elements/1.1/${term}`),
  rdf: term => rdflib.namedNode(`http://www.w3.org/1999/02/22-rdf-syntax-ns#${term}`),
  solid: term => rdflib.namedNode(`http://www.w3.org/ns/solid/terms#${term}`)
}

function getSourceConfig (webId) {
  const bookmarksUrl = utils.defaultBookmarksUrlForWebId(webId)
  return {
    defaultSources: {
      listed: bookmarksUrl
    },
    sourceIndex: {
      [bookmarksUrl]: true
    }
  }
}

export function bookmarkModelFactory (webId) {
  return (graph, subject) => modelFactory(rdflib, getSourceConfig(webId), {
    type: vocab.rdf('type'),
    url: vocab.bookmark('recalls'),
    title: vocab.dc('title'),
    description: vocab.dc('description'),
    tags: vocab.bookmark('hasTopic'),
    archived: vocab.solid('read')
  })(graph, subject).setAny('type', 'http://www.w3.org/2002/01/bookmark#Bookmark', {listed: true})
}
