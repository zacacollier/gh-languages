import auth0              from 'auth0-js'
import Auth0Lock          from 'auth0-lock'
import { browserHistory } from 'react-router'
import { EventEmitter }   from 'events'
import { isTokenExpired } from './jwtHelper'

export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super()
    // Configure Auth0
    this.auth0 = new auth0.WebAuth({
      clientID: 'ezsFdDPSYvu8EFCEU639Fy4gw7OVaOj9',
      domain: 'zacacollier.auth0.com',
      responseType: 'token id_token',
      redirectUri: 'http://localhost:3000/login',
    })
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: 'http://localhost:3000/login',
        responseType: 'token'
      }
    })
    this.domain = domain // setting domain param as an instance attribute
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this._authorizationError.bind(this))
    this.login = this.login.bind(this)
    this.signup = this.signup.bind(this)
    this.loginWithGoogle = this.loginWithGoogle.bind(this)
    this.loginWithGitHub = this.loginWithGitHub.bind(this)
  }

  _doAuthentication(authResult) {
    // Saves the user token
    this.setToken(authResult.idToken)
    // navigate to the home route
    browserHistory.replace('/home')
    // Async loads the user profile data
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) console.log(`Error loading User Profile: ${error}`)
      else this.setProfile(profile)
    })
  }

  _authorizationError(error) {
    console.log(`Authentication Error: ${error}`)
  }

  login(username, password) {
    // Call the show method to display the widget.
    this.lock.show()
    this.auth0.client.login({
      realm: 'Username-Password-Authentication',
      username,
      password
    }, (err, authResult) => {
      if (err) {
        alert('Error: ' + err.description)
        return
      }
      if (authResult && authResult.idToken && authResult.accessToken) {
        this.setToken(authResult.accessToken, authResult.idToken)
        browserHistory.replace('/home')
      }
    })
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    return !!this.getToken()
  }

  signup(email, password){
    this.auth0.redirect.signupAndLogin({
      connection: 'Username-Password-Authentication',
      email,
      password,
    }, function(err) {
      if (err) {
        alert('Error: ' + err.description)
      }
    })
  }

  loginWithGitHub() {
    this.auth0.authorize({
      connection: 'github'
    })
  }

  loginWithGoogle() {
    this.auth0.authorize({
      connection: 'google-oauth2'
    })
  }

  parseHash(hash) {
    this.auth0.parseHash({ hash }, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setToken(authResult.accessToken, authResult.idToken)
        browserHistory.replace('/home')
        this.auth0.client.userInfo(authResult.accessToken, (error, profile) => {
          if (error) {
            console.log('Error loading the Profile', error)
          } else {
            this.setProfile(profile)
          }
        })
      } else if (authResult && authResult.error) {
        alert('Error: ' + authResult.error)
      }
    })
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    return !!token && !isTokenExpired(token)
  }

  setToken(accessToken, idToken) {
    // Saves user access token and ID token into local storage
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('id_token', idToken)
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('access_token')
  }

  setProfile(profile) {
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile)
  }

  updateProfile(userId, data) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken() // setting authorization header
    }
    return fetch(`https://${this.domain}/api/v2/users/${userId}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(newProfile => this.setProfile(newProfile)) //updating current profile
  }

  getProfile() {
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }


  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token')
    localStorage.removeItem('profile')
  }
}
