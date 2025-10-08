// src/components/Profile/ProfileForm.jsx
import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Spinner, Card, Modal } from 'react-bootstrap';
import { profileAPI } from '../../services/api';

const ProfileForm = ({ profile, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    company: profile?.company || '',
    position: profile?.position || '',
    bio: profile?.bio || '',
    profileImage: profile?.profile_image || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(profile?.profile_image || '');
  const [showImageModal, setShowImageModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      profileImage: url
    });
    if (url) {
      setImagePreview(url);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      
      // For now, we'll convert to base64 and store as data URL
      // In production, you'd upload to a cloud service like Cloudinary
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({
          ...formData,
          profileImage: base64String
        });
        setImagePreview(base64String);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError('Failed to upload image');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await profileAPI.updateProfile(formData);
      onSuccess(response.data.profile);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      profileImage: ''
    });
    setImagePreview('');
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Profile Image Section */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Profile Photo</h5>
          </Card.Header>
          <Card.Body className="text-center">
            {imagePreview ? (
              <div className="mb-3">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="rounded-circle shadow"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowImageModal(true)}
                />
                <div className="mt-2">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={removeImage}
                    disabled={loading}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Remove Photo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto border"
                  style={{
                    width: '150px',
                    height: '150px',
                    cursor: 'pointer'
                  }}
                  onClick={() => document.getElementById('fileUpload').click()}
                >
                  <i className="bi bi-camera fs-1 text-muted"></i>
                </div>
                <p className="text-muted mt-2">Click to upload a photo</p>
              </div>
            )}

            <input
              type="file"
              id="fileUpload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={loading}
            />

            <Form.Group>
              <Form.Label>Or enter image URL</Form.Label>
              <Form.Control
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleImageUrlChange}
                placeholder="https://example.com/photo.jpg"
                disabled={loading}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name *</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Last Name *</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Enter your position"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
          />
        </Form.Group>

        <div className="d-flex gap-2 justify-content-end">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save Profile'}
          </Button>
        </div>
      </Form>

      {/* Image Preview Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Profile Photo Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={imagePreview}
            alt="Profile preview"
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              objectFit: 'contain'
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfileForm;