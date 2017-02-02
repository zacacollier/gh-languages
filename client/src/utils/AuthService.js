import { EventEmitter }   from 'events'
import { isTokenExpired } from './jwtHelper'
import Auth0Lock          from 'auth0-lock'
import { browserHistory } from 'react-router'
import auth0              from 'auth0-js'

export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super()
    this.domain = domain  // setting domain parameter as an instance attribute
    // Configure Auth0
    this.auth0 = new auth0.WebAuth({
      clientID: 'ezsFdDPSYvu8EFCEU639Fy4gw7OVaOj9',
      domain: 'zacacollier.auth0.com',
      responseType: 'token id_token',
      redirectUri: 'http://localhost:3000/home'
    })
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: `${window.location.origin}/home`,
        responseType: 'token'
      }
    })
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this._authorizationError.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)
    this.signup = this.signup.bind(this)
    this.loginWithGitHub = this.loginWithGitHub.bind(this)
  }

  login() {
    this.auth0.client.login({
      realm: 'Username-Password-Authentication',
      username,
      password
    }, (err, authResult) => {
      if (err) {
        alert(`Error: ${err.description}`)
        return
      }
      if (authResult && authResult.idToken && authResult.accessToken) {
        this.setToken(authResult.accessToken, authResult.idToken)
        browserHistory.replace('/home')
      }
    })
    // Call the show method to display the widget.
    // this.lock.show()
  }

  signup(email, password){
    this.auth0.redirect.signupAndLogin({
      connection: 'Username-Password-Authentication',
      email,
      password,
    }, (err) => {
      if (err) alert(`Error: ${err.description}`)
    })
  }

  loginWithGitHub() {
    this.auth0.authorize({
      connection: 'github'
    })
  }

  _doAuthentication(authResult){
    // Saves the user token
    this.setToken(authResult.idToken)
    // navigate to the home route
    browserHistory.replace('/home')
    // Async loads the user profile data
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error)
      } else {
        this.setProfile(profile)
      }
    })
  }

  _authorizationError(error){
    // Unexpected authentication error
    console.log('Authentication Error', error)
  }


  loggedIn(){
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    return !!token && !isTokenExpired(token)
  }

  setProfile(profile){
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile)
  }

  getProfile(){
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  updateProfile(userId, data) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    }
    // Make PATCH request to auth0
    return fetch(`https://${this.domain}/api/v2/users/${userId}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(newProfile => this.setProfile(newProfile))
    //TODO: persist profile updates in postgres
  }

  setToken(idToken){
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken(){
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout(){
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }
}
