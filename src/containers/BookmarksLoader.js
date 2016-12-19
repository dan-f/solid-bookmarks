import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import FilterableBookmarksList from './FilterableBookmarksList'
import NewBookmarkEditor from './NewBookmarkEditor'
import Header from '../components/Header'

class BookmarksLoader extends React.Component {
  componentDidMount () {
    const {actions, webId} = this.props
    const {bookmarksUrl} = this.props.params
    actions.loadBookmarks(bookmarksUrl, webId)
  }

  render () {
    return (
      <div>
        <Header />
        <NewBookmarkEditor />
        <FilterableBookmarksList />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    webId: state.auth.webId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksLoader)