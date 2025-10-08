// src/components/Profile/PublicProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { profileAPI } from '../../services/api';

const PublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPublicProfile();
  }, [userId]);

  const fetchPublicProfile = async () => {
    try {
      const response = await profileAPI.getPublicProfile(userId);
      setProfile(response.data);
    } catch (error) {
      setError('Profile not found or is private');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading profile...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
        <div className="text-center mt-3">
          <Button variant="primary" onClick={handleBack}>
            Go Back
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body className="text-center p-4">
              {/* Profile Image */}
              {profile.profile_image && (
                <div className="mb-4">
                  <img
                    src={profile.profile_image}
                    alt="Profile"
                    className="rounded-circle shadow"
                    style={{ 
                      width: '150px', 
                      height: '150px', 
                      objectFit: 'cover',
                      border: '5px solid #4361ee'
                    }}
                  />
                </div>
              )}
              
              {/* Name */}
              <h2 className="mb-2 gradient-text">
                {profile.first_name} {profile.last_name}
              </h2>
              
              {/* Company & Position */}
              {(profile.company || profile.position) && (
                <p className="text-muted mb-4 fs-5">
                  {profile.position} 
                  {profile.company && ` at ${profile.company}`}
                </p>
              )}
              
              {/* Bio */}
              {profile.bio && (
                <Card className="mb-4 border-0 bg-light">
                  <Card.Body>
                    <h5 className="mb-3">
                      <i className="bi bi-person-lines-fill me-2 text-primary"></i>
                      About
                    </h5>
                    <Card.Text className="text-muted fs-6">
                      {profile.bio}
                    </Card.Text>
                  </Card.Body>
                </Card>
              )}
              
              {/* Contact Information */}
              <Row className="text-start g-3">
                {profile.phone && (
                  <Col sm={6}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-telephone-fill text-primary me-3 fs-5"></i>
                      <div>
                        <strong>Phone</strong>
                        <div className="text-muted">{profile.phone}</div>
                      </div>
                    </div>
                  </Col>
                )}
                
                {profile.address && (
                  <Col sm={6}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-geo-alt-fill text-primary me-3 fs-5"></i>
                      <div>
                        <strong>Address</strong>
                        <div className="text-muted">{profile.address}</div>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>

              {/* Back Button */}
              <div className="mt-4">
                <Button variant="outline-primary" onClick={handleBack}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Scanner
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicProfile;