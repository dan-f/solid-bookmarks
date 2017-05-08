import queryString from 'query-string'
import React from 'react'
import Loadable from 'react-loading-overlay'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'

import LoginPage from '../components/LoginPage'

export class LoginContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loggingIn: false,
      loginUiOpen: false,
      loginServer: ''
    }
    this.handleClickLogin = this.handleClickLogin.bind(this)
    this.handleChangeLoginServer = this.handleChangeLoginServer.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    const { auth, history, location } = this.props
    const { loadProfile, maybeInstallAppResources, saveCredentials } = this.props.actions
    let { webid: webId, key } = queryString.parse(location.search)
    if (!(webId && key)) {
      webId = auth.webId
      key = auth.key
    }
    if (webId && key) {
      saveCredentials({ webId, key })
    } else {
      return
    }
    this.setState({ loggingIn: true })
    loadProfile()
      .then(maybeInstallAppResources)
      .then(bookmarksContainer => {
        this.setState({ loggingIn: false })
        history.push(`/m/${bookmarksContainer}`)
      })
      .catch(() => this.setState({ loggingIn: false }))
  }

  handleClickLogin () {
    this.setState({ loginUiOpen: true })
  }

  handleChangeLoginServer (event) {
    this.setState({ loginServer: event.target.value })
  }

  handleCancel () {
    this.setState({ loginUiOpen: false, loginServer: '' })
  }

  handleSubmit (event) {
    event.preventDefault()
    const { findEndpoints } = this.props.actions
    let { loginServer } = this.state
    loginServer = loginServer.trim()
    if (!loginServer) {
      return
    }
    if (!/^http(s)?:\/\//.test(loginServer)) {
      loginServer = `https://${loginServer}`
    }
    findEndpoints(loginServer)
      .then(action =>
        window.location.assign(
          `${action.endpoints.login}?redirect=${window.location.href}&origin=${window.location.origin}`
        )
      )
  }

  render () {
    const { loginUiOpen, loggingIn } = this.state
    const { handleClickLogin, handleChangeLoginServer, handleCancel, handleSubmit } = this
    const props = { loginUiOpen, handleClickLogin, handleChangeLoginServer, handleCancel, handleSubmit }
    return (
      <Loadable active={loggingIn} spinner background='#FFFFFF' color='#000'>
        <LoginPage {...props} />
      </Loadable>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
