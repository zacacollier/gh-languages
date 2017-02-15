import React, { PropTypes as T } from 'react'
import {
  Col,
  Container,
  Image,
  Row
  }                              from 'react-bootstrap'

export class ProfileDetails extends React.Component {
  static propTypes = {
    profile: T.object
  }

// TODO: automatically select favorite language based off of repo count
  render() {
    const { profile } = this.props
    return (
      <Row>
        <Col md={3}>
          <Row>
          <Col md={4} mdOffset={4}>
            <Image responsive src={profile.picture} circle />
          </Col>
        </Row>
          <Row>
            <Col md={4} mdOffset={4}>
              <p><strong>{ profile.name }</strong></p>
              <p>{ profile.nickname }</p>
              <p>{ profile.public_repos }</p>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default ProfileDetails;
