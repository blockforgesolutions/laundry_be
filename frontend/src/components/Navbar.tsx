import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Home, Users, Calendar, Shirt } from 'lucide-react';

const NavContainer = styled.nav`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? '#FFD700' : 'white'};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: ${props => props.$isActive ? 'bold' : 'normal'};
  background: ${props => props.$isActive ? 'rgba(255, 215, 0, 0.1)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    span {
      display: none;
    }
  }
`;

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <NavContainer>
      <NavContent>
        <Logo>
          <Shirt size={24} />
          BYT
        </Logo>
        <NavLinks>
          <NavLink to="/" $isActive={isActive('/')}>
            <Home size={20} />
            <span>Ana Sayfa</span>
          </NavLink>
          <NavLink to="/customers" $isActive={isActive('/customers')}>
            <Users size={20} />
            <span>Müşteriler</span>
          </NavLink>
          <NavLink to="/appointments" $isActive={isActive('/appointments')}>
            <Calendar size={20} />
            <span>Randevular</span>
          </NavLink>
          <NavLink to="/laundry" $isActive={isActive('/laundry')}>
            <Shirt size={20} />
            <span>Çamaşırlar</span>
          </NavLink>
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar; 