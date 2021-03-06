import React, { PropTypes as T } from 'react'
import {Button}                  from 'react-bootstrap'
import AuthService               from 'utils/AuthService'
import ProfileDetails            from 'components/Profile/ProfileDetails'
import ProfileEdit               from 'components/Profile/ProfileEdit'
import styles                    from './styles.module.css'

export class Home extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      profile: props.auth.getProfile()
    }
    // update internal state based on profile_updated events
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({profile: newProfile})
    })
  }

  logout(){
    // wipes session data
    this.props.auth.logout()
    // redirect to login
    this.context.router.push('/login');
  }

  render(){
    const { profile } = this.state
    return (
      <div className={styles.root}>
        <p>Welcome {profile.name}!</p>
        <ProfileDetails profile={profile}></ProfileDetails>
        <ProfileEdit profile={profile} auth={this.props.auth}></ProfileEdit>
        <Button onClick={this.logout.bind(this)}>Logout</Button>
      </div>
    )
  }
}

export default Home;
