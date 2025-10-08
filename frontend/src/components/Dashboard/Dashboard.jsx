// src/components/Dashboard/Dashboard.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ProfileSection from './ProfileSection';

const Dashboard = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1 className="mb-4">Dashboard</h1>
        </Col>
      </Row>
      
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Welcome to Your Dashboard</Card.Title>
              <Card.Text>
                Manage your profile information and generate shareable QR codes from this dashboard.
                Your profile information will be visible to anyone who scans your QR code.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <ProfileSection />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;