import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Users, Calendar, Shirt, TrendingUp } from 'lucide-react';
import { customerAPI, laundryAPI, LaundryWithCustomer } from '../services/api';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  color: #FFD700;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const StatNumber = styled.div`
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
`;

const RecentActivity = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
`;

const ActivityTitle = styled.h2`
  color: white;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActivityItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid ${props => props.color || '#FFD700'};
`;

const ActivityText = styled.p`
  color: white;
  margin: 0;
`;

const ActivityStatus = styled.span<{ status: string }>`
  background: ${props => 
    props.status === 'ready' ? '#4CAF50' : 
    props.status === 'washing' ? '#FF9800' : 
    '#9C27B0'
  };
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 1rem;
`;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeWashing: 0,
    readyLaundry: 0,
    totalToday: 0
  });
  const [recentActivity, setRecentActivity] = useState<LaundryWithCustomer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, laundryRes] = await Promise.all([
          customerAPI.getAll(),
          laundryAPI.getAllWithCustomer()
        ]);

        const customers = customersRes.data;
        const laundry = laundryRes.data;

        setStats({
          totalCustomers: customers.length,
          activeWashing: laundry.filter(item => item.status === 'washing').length,
          readyLaundry: laundry.filter(item => item.status === 'ready').length,
          totalToday: laundry.length
        });

        // Son 5 aktiviteyi göster
        setRecentActivity(laundry.slice(-5).reverse());
      } catch (error) {
        console.error('Dashboard verisi yüklenemedi:', error);
      }
    };

    fetchData();
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'washing': return 'Yıkanıyor';
      case 'ready': return 'Hazır';
      case 'delivered': return 'Teslim Edildi';
      default: return status;
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>BYT Çamaşırhane</Title>
        <Subtitle>Modern çamaşırhane yönetim sistemi</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Users size={48} />
          </StatIcon>
          <StatNumber>{stats.totalCustomers}</StatNumber>
          <StatLabel>Toplam Müşteri</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <Shirt size={48} />
          </StatIcon>
          <StatNumber>{stats.activeWashing}</StatNumber>
          <StatLabel>Yıkanan Çamaşır</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <Calendar size={48} />
          </StatIcon>
          <StatNumber>{stats.readyLaundry}</StatNumber>
          <StatLabel>Hazır Çamaşır</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <TrendingUp size={48} />
          </StatIcon>
          <StatNumber>{stats.totalToday}</StatNumber>
          <StatLabel>Bugünkü Toplam</StatLabel>
        </StatCard>
      </StatsGrid>

      <RecentActivity>
        <ActivityTitle>
          <TrendingUp size={24} />
          Son Aktiviteler
        </ActivityTitle>
        {recentActivity.length > 0 ? (
          recentActivity.map((item) => (
            <ActivityItem key={item.id}>
              <ActivityText>
                <strong>{item.name}</strong> - {item.phone}
                <ActivityStatus status={item.status}>
                  {getStatusText(item.status)}
                </ActivityStatus>
                {item.shelf_code && (
                  <span style={{ color: '#FFD700', marginLeft: '1rem' }}>
                    📦 Raf: {item.shelf_code}
                  </span>
                )}
              </ActivityText>
            </ActivityItem>
          ))
        ) : (
          <ActivityItem>
            <ActivityText>Henüz aktivite bulunmuyor.</ActivityText>
          </ActivityItem>
        )}
      </RecentActivity>
    </DashboardContainer>
  );
};

export default Dashboard; 