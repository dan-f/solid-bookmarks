import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'

import Dropdown from '../components/Dropdown'
import DropdownItem from '../components/DropdownItem'

class ProfileControls extends Component {
  constructor (props) {
    super(props)
    this.state = { open: false }
    this.handleClickDropdown = this.handleClickDropdown.bind(this)
    this.logout = this.logout.bind(this)
  }

  handleClickDropdown (event) {
    event.preventDefault()
    const { open } = this.state
    this.setState({ open: !open })
  }

  logout () {
    const { history } = this.props
    this.props.actions.logout()
      .then(() => history.push('/'))
      .then(() => { this.setState({ open: false }) })
  }

  render () {
    const { webId, img } = this.props
    const { handleClickDropdown, logout } = this
    return webId
      ? (
        <Dropdown open={this.state.open} handleClickDropdown={handleClickDropdown}>
          <button aria-label='Profile controls' type='button' className='btn-link dropdown-toggle' onClick={handleClickDropdown}>
            <img src={img} width='30' height='30' alt="User's profile image" />
          </button>
          <DropdownItem>
            <a href={`https://linkeddata.github.io/profile-editor/#/profile/view?webid=${encodeURIComponent(webId)}`} target='_blank' className='mx-1'>
              Edit Profile
            </a>
          </DropdownItem>
          <DropdownItem>
            <button type='button' className='btn btn-link' onClick={logout}>
              Log out
            </button>
          </DropdownItem>
        </Dropdown>
      )
      : <img src={img} width='30' height='30' alt="User's profile image" />
  }
}
const mapStateToProps = state => ({
  webId: state.auth.session ? state.auth.session.webId : '',
  img: state.profile['foaf:img']
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileControls))
