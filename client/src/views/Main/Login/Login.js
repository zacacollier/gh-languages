import React, { PropTypes as T } from 'react'
import ReactDOM                  from 'react-dom'
import { ButtonToolbar, Button, ControlLabel, Form, FormGroup, FormControl } from 'react-bootstrap'
import AuthService from 'utils/AuthService'
import styles from './styles.module.css'

export class Login extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  getAuthParams() {
    return {
      email: ReactDOM.findDOMNode(this.refs.email).value,
      password: ReactDOM.findDOMNode(this.refs.password).value
    }
  }

  login(e) {
    e.preventDefault()
    const { email, password } = this.getAuthParams()
    this.props.auth.login(email, password)
  }

  signup() {
    const { email, password } = this.getAuthParams()
    this.props.auth.signup(email, password)
  }

  loginWithGitHub() {
    this.props.auth.loginWithGitHub();
  }

  render() {
    const { auth } = this.props
    return (
      <div className={styles.root}>
        <h2>Login</h2>
        <Form onSubmit={this.login.bind(this)}>
          <FormGroup controlId="email">
            <ControlLabel>Email</ControlLabel>
            <FormControl type="email" ref="email" placeholder="'tom@myspace.com'" required />
          </FormGroup>

          <FormGroup controlId="password">
            <ControlLabel>Password</ControlLabel>
            <FormControl type="password" ref="password" required />
          </FormGroup>

          <ButtonToolbar className={styles.toolbar}>
            <Button type="submit" bsStyle="primary" onClick={auth.login.bind(this)}>Login</Button>
            <Button bsStyle="primary" onClick={this.signup.bind(this)}>Sign Up</Button>
            <Button bsStyle="primary" onClick={this.loginWithGitHub.bind(this)}>
              Login with GitHub
            </Button>
          </ButtonToolbar>
        </Form>
      </div>
    )
  }
}

export default Login;
