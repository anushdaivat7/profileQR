// src/components/Dashboard/ProfileSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Spinner, Alert, Dropdown, Badge } from 'react-bootstrap';
import { profileAPI } from '../../services/api';
import ProfileForm from '../Profile/ProfileForm';
import QRCode from 'qrcode.react';

const ProfileSection = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [error, setError] = useState('');
  const qrRef = useRef();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowModal(false);
  };

  const getPublicProfileUrl = () => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    return `${window.location.origin}/profile/${userId}`;
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `profile-qr-${profile.first_name || 'user'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const shareQRCode = async () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas && navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `profile-qr-${profile.first_name || 'user'}.png`, { type: 'image/png' });
          await navigator.share({
            title: 'My Profile QR Code',
            text: `Scan this QR code to view ${profile.first_name}'s profile`,
            files: [file],
          });
        });
      } catch (error) {
        console.log('Sharing failed:', error);
        // Fallback to download
        downloadQRCode();
      }
    } else {
      // Fallback for browsers that don't support sharing
      downloadQRCode();
    }
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;
    
    let completedFields = 0;
    const totalFields = 6; // firstName, lastName, phone, company, position, profileImage
    
    if (profile.first_name) completedFields++;
    if (profile.last_name) completedFields++;
    if (profile.phone) completedFields++;
    if (profile.company) completedFields++;
    if (profile.position) completedFields++;
    if (profile.profile_image) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const isProfileComplete = () => {
    return profile && profile.first_name && profile.last_name;
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading profile...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>
              <i className="bi bi-person-badge me-2"></i>
              Profile
            </Card.Title>
            <div className="d-flex align-items-center gap-2">
              <Badge bg={getProfileCompletion() === 100 ? "success" : "warning"}>
                {getProfileCompletion()}% Complete
              </Badge>
              <Button variant="outline-primary" size="sm" onClick={() => setShowModal(true)}>
                <i className="bi bi-pencil me-1"></i>
                Edit
              </Button>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {profile ? (
            <div>
              {/* Profile Photo */}
              <div className="text-center mb-4">
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt="Profile"
                    className="rounded-circle shadow profile-image"
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      border: '4px solid #4361ee'
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto border image-placeholder"
                    style={{
                      width: '120px',
                      height: '120px'
                    }}
                  >
                    <i className="bi bi-person fs-1 text-muted"></i>
                  </div>
                )}
                <p className="text-muted mt-2 small">
                  {profile.profile_image ? 'Profile Photo' : 'No photo added'}
                </p>
              </div>

              {/* Profile Information */}
              <div className="profile-info">
                <div className="mb-3">
                  <strong>
                    <i className="bi bi-person me-2 text-primary"></i>
                    Name:
                  </strong>{' '}
                  {profile.first_name && profile.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : <span className="text-muted">Not set</span>
                  }
                </div>
                
                {profile.email && (
                  <div className="mb-3">
                    <strong>
                      <i className="bi bi-envelope me-2 text-primary"></i>
                      Email:
                    </strong>{' '}
                    {profile.email}
                  </div>
                )}
                
                {profile.company && (
                  <div className="mb-3">
                    <strong>
                      <i className="bi bi-building me-2 text-primary"></i>
                      Company:
                    </strong>{' '}
                    {profile.company}
                  </div>
                )}
                
                {profile.position && (
                  <div className="mb-3">
                    <strong>
                      <i className="bi bi-briefcase me-2 text-primary"></i>
                      Position:
                    </strong>{' '}
                    {profile.position}
                  </div>
                )}
                
                {profile.phone && (
                  <div className="mb-3">
                    <strong>
                      <i className="bi bi-telephone me-2 text-primary"></i>
                      Phone:
                    </strong>{' '}
                    {profile.phone}
                  </div>
                )}

                {profile.address && (
                  <div className="mb-3">
                    <strong>
                      <i className="bi bi-geo-alt me-2 text-primary"></i>
                      Address:
                    </strong>{' '}
                    <div className="text-muted small">{profile.address}</div>
                  </div>
                )}

                {profile.bio && (
                  <div className="mb-3">
                    <strong>
                      <i className="bi bi-file-text me-2 text-primary"></i>
                      Bio:
                    </strong>{' '}
                    <div className="text-muted small">{profile.bio}</div>
                  </div>
                )}
              </div>

              {/* QR Code Actions */}
              <Dropdown className="w-100 mt-4">
                <Dropdown.Toggle 
                  variant={isProfileComplete() ? "success" : "outline-secondary"} 
                  className="w-100" 
                  disabled={!isProfileComplete()}
                >
                  <i className="bi bi-qr-code me-2"></i>
                  QR Code Actions
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item onClick={() => setShowQRModal(true)}>
                    <i className="bi bi-eye me-2"></i>View QR Code
                  </Dropdown.Item>
                  <Dropdown.Item onClick={downloadQRCode}>
                    <i className="bi bi-download me-2"></i>Download QR
                  </Dropdown.Item>
                  <Dropdown.Item onClick={shareQRCode}>
                    <i className="bi bi-share me-2"></i>Share QR
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {!isProfileComplete() && (
                <Alert variant="info" className="mt-3 small">
                  <i className="bi bi-info-circle me-2"></i>
                  Complete your profile (add name) to generate and share QR codes
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mb-3">
                <i className="bi bi-person-plus fs-1 text-muted"></i>
              </div>
              <p className="text-muted">No profile information yet</p>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-circle me-1"></i>
                Create Profile
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Profile Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            {profile ? 'Edit Profile' : 'Create Profile'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProfileForm 
            profile={profile} 
            onSuccess={handleProfileUpdate}
            onCancel={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* QR Code Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-qr-code me-2"></i>
            Your Profile QR Code
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div ref={qrRef} className="mb-3">
            <QRCode 
              value={getPublicProfileUrl()} 
              size={256}
              level="H"
              includeMargin
              style={{ 
                border: '10px solid white', 
                borderRadius: '15px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
          </div>
          
          <div className="mb-3">
            <h6 className="text-primary">{profile?.first_name} {profile?.last_name}</h6>
            {profile?.position && <p className="text-muted mb-1">{profile.position}</p>}
            {profile?.company && <p className="text-muted small">{profile.company}</p>}
          </div>

          <p className="text-muted small mb-3">
            <i className="bi bi-info-circle me-1"></i>
            Scan this QR code to view the public profile
          </p>
          
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-primary" size="sm" onClick={downloadQRCode}>
              <i className="bi bi-download me-1"></i> Download
            </Button>
            <Button variant="outline-success" size="sm" onClick={shareQRCode}>
              <i className="bi bi-share me-1"></i> Share
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <small className="text-muted">
            Profile URL: {getPublicProfileUrl()}
          </small>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileSection;