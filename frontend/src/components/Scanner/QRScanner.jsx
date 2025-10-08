// src/components/Scanner/QRScanner.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ show, onClose, onScan }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    if (show) {
      initializeScanner();
    } else {
      cleanupScanner();
    }
  }, [show]);

  const initializeScanner = () => {
    if (!html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current = new Html5QrcodeScanner(
        "qr-scanner",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: []
        },
        false
      );

      html5QrcodeScannerRef.current.render(
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (error) => {
          // Handle scan errors silently
          console.log('Scan error:', error);
        }
      );
    }
  };

  const cleanupScanner = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
      html5QrcodeScannerRef.current = null;
    }
    setScanResult(null);
    setError('');
  };

  const handleScanSuccess = (decodedText) => {
    setLoading(true);
    setScanResult(decodedText);
    
    // Extract user ID from URL
    const userId = decodedText.split('/profile/')[1];
    if (userId && onScan) {
      onScan(userId);
    }
    setLoading(false);
  };

  const handleClose = () => {
    cleanupScanner();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Scan QR Code</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          {error && <Alert variant="danger">{error}</Alert>}
          
          {scanResult ? (
            <div>
              <Alert variant="success">
                <i className="bi bi-check-circle-fill me-2"></i>
                QR Code Scanned Successfully!
              </Alert>
              {loading && (
                <div className="text-center my-3">
                  <Spinner animation="border" />
                  <p className="mt-2">Loading profile...</p>
                </div>
              )}
            </div>
          ) : (
            <Card className="p-3">
              <div id="qr-scanner" style={{ width: '100%' }}></div>
              <p className="text-muted mt-3">
                Point your camera at a QR code to scan
              </p>
            </Card>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRScanner;