import React, { PropTypes as T } from 'react'
import { Row, Col, Image }       from 'react-bootstrap'

export class ProfileDetails extends React.Component {
  static propTypes = {
    profile: T.object
  }

// TODO: automatically select favorite language based off of repo count
  render() {
    const { profile } = this.props
    return (
      <Row>
        <Col md={2} mdOffset={4}>
          <Image src={profile.picture} circle />
        </Col>
        <Col md={6}>
          <h3>Profile</h3>
          <p><strong>{ profile.name }</strong></p>
          <p><strong>{ profile.nickname }</strong></p>
          <p><strong>{ profile.public_repos }</strong> </p>
        </Col>
      </Row>
    )
  }
}

export default ProfileDetails;
