import React, { PropTypes as T } from 'react'
import { Row, Col, Image }       from 'react-bootstrap'

export class ProfileDetails extends React.Component {
  static propTypes = {
    profile: T.object
  }

  render() {
    const { profile } = this.props
    console.log(profile)
    //TODO replace address with language of choice
    const { address } = profile.user_metadata || {} // custom address field
    return (
      <Row>
        <Col md={2} mdOffset={3}>
          <Image src={profile.picture} circle />
        </Col>
        <Col md={6}>
          <h3>Profile</h3>
          <p><strong>Name: </strong> { profile.name }</p>
          <p><strong>Email: </strong> { profile.email }</p>
          <p><strong>Nickname: </strong> { profile.nickname }</p>
          <p><strong>Address: </strong> { address }</p>
          <p><strong>Created At: </strong> { profile.created_at }</p>
          <p><strong>Updated At: </strong> { profile.updated_at }</p>
        </Col>
      </Row>
    )
  }
}

export default ProfileDetails;
