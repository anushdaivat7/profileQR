// // src/components/Common/Navbar.js
// import React from 'react';
// import { Navbar, Nav, Container, Button } from 'react-bootstrap';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { isAuthenticated, removeToken, removeUser, getUser } from '../../utils/auth';

// const CustomNavbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const user = getUser();

//   const handleLogout = () => {
//     removeToken();
//     removeUser();
//     navigate('/login');
//   };

//   return (
//     <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
//       <Container>
//         <Navbar.Brand as={Link} to="/">
//           🔐 UserAuth App
//         </Navbar.Brand>
        
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             {isAuthenticated() && (
//               <Nav.Link 
//                 as={Link} 
//                 to="/dashboard" 
//                 active={location.pathname === '/dashboard'}
//               >
//                 Dashboard
//               </Nav.Link>
//             )}
//           </Nav>
          
//           <Nav>
//             {isAuthenticated() ? (
//               <>
//                 <Navbar.Text className="me-3">
//                   Welcome, {user?.email}
//                 </Navbar.Text>
//                 <Button variant="outline-light" size="sm" onClick={handleLogout}>
//                   Logout
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Nav.Link as={Link} to="/login" active={location.pathname === '/login'}>
//                   Login
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/register" active={location.pathname === '/register'}>
//                   Register
//                 </Nav.Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default CustomNavbar;


// src/components/Common/Navbar.jsx
import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, removeToken, removeUser, getUser } from '../../utils/auth';
import QRScanner from '../Scanner/QRScanner';

const CustomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [showScanner, setShowScanner] = useState(false);

  const handleLogout = () => {
    removeToken();
    removeUser();
    navigate('/login');
  };

  const handleScan = (userId) => {
    setShowScanner(false);
    navigate(`/profile/${userId}`);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <i className="bi bi-person-badge me-2"></i>
            UserAuth App
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isAuthenticated() && (
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  active={location.pathname === '/dashboard'}
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </Nav.Link>
              )}
            </Nav>
            
            <Nav>
              {isAuthenticated() ? (
                <>
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    className="me-2"
                    onClick={() => setShowScanner(true)}
                  >
                    <i className="bi bi-camera me-1"></i>
                    Scan QR
                  </Button>
                  <Navbar.Text className="me-3">
                    <i className="bi bi-person-circle me-1"></i>
                    Welcome, {user?.email}
                  </Navbar.Text>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" active={location.pathname === '/login'}>
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" active={location.pathname === '/register'}>
                    <i className="bi bi-person-plus me-1"></i>
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <QRScanner 
        show={showScanner} 
        onClose={() => setShowScanner(false)} 
        onScan={handleScan}
      />
    </>
  );
};

export default CustomNavbar;