import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {connect as liveConnect} from '../actions/live'
import {loadProfile} from '../actions/profile'

import Header from '../components/Header'
import InvitedToLesson from '../components/InvitedToLesson'

import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

export class DefaultLayoutWithBreadcrumbs extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render () {
    return (
      <div>
        <div style={{fontSize: 14, margin: '12px 16px'}}><Link to='/'>◀ <FormattedMessage id='backToConversations' /></Link></div>
        {this.props.children}
      </div>
    )
  }
}

class DefaultLayout extends React.Component {

  static propTypes = {
    children: React.PropTypes.node,
    liveConnect: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.liveConnect() // TODO: handle unmount
  }

  render () {
    return (
      <div style={{flex: '1 1 auto', marginBottom: 30}}>
        <Header />
        <div style={{clear: 'both', minHeight: 200, background: 'white', maxWidth: 960, margin: '0 auto', border: 'solid 1px #DDD', position: 'relative'}}>
          {this.props.children}
        </div>
        <InvitedToLesson />
      </div>
    )
  }
}

class DefaultLayoutOrLoad extends Component {

  static propTypes = {
    profile: PropTypes.object,
    error: PropTypes.string,
    loadProfile: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (!this.props.profile) this.props.loadProfile()
  }

  render () {
    const {profile, error} = this.props

    if (profile) return <DefaultLayout {...this.props} />

    if (error) {
      return (
        <div style={{marginTop: 100, textAlign: 'center'}}>
          <div>Fehler: {error}</div>
          <div><a href='javascript:location.reload()'>Neuladen</a></div>
        </div>
      )
    }

    return (
      <div>Laden...</div>
    )
  }
}

export default connect((state, props) => {
  const {profile, error} = state.profile
  return {profile, error}
}, {liveConnect, loadProfile})(DefaultLayoutOrLoad)
