import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Appointments from './pages/Appointments';
import LaundryStatus from './pages/LaundryStatus';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/laundry" element={<LaundryStatus />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
