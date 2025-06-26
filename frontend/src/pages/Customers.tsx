import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Search, User, Phone } from 'lucide-react';
import { Customer, customerAPI } from '../services/api';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  margin: 0;
`;

const AddButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  transition: background 0.3s ease;
  
  &:hover {
    background: #45a049;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
`;

const CustomersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CustomerCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CustomerIcon = styled.div`
  background: #FFD700;
  color: #333;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomerDetails = styled.div`
  flex: 1;
`;

const CustomerName = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const CustomerPhone = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
`;

const ModalTitle = styled.h2`
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  color: white;
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  
  background: ${props => props.variant === 'secondary' ? '#6c757d' : '#4CAF50'};
  color: white;
  
  &:hover {
    background: ${props => props.variant === 'secondary' ? '#5a6268' : '#45a049'};
    transform: translateY(-2px);
  }
`;

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [customers, searchTerm]);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Müşteriler yüklenemedi:', error);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    setLoading(true);
    try {
      await customerAPI.create(newCustomer);
      setNewCustomer({ name: '', phone: '' });
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Müşteri eklenemedi:', error);
      alert('Müşteri eklenirken hata oluştu. Bu telefon numarası zaten kayıtlı olabilir.');
    }
    setLoading(false);
  };

  return (
    <Container>
      <Header>
        <Title>Müşteriler</Title>
        <AddButton onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Yeni Müşteri
        </AddButton>
      </Header>

      <SearchContainer>
        <SearchIcon size={20} />
        <SearchInput
          type="text"
          placeholder="Müşteri ara (isim veya telefon)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      <CustomersGrid>
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer.id}>
            <CustomerInfo>
              <CustomerIcon>
                <User size={24} />
              </CustomerIcon>
              <CustomerDetails>
                <CustomerName>{customer.name}</CustomerName>
                <CustomerPhone>
                  <Phone size={16} />
                  {customer.phone}
                </CustomerPhone>
              </CustomerDetails>
            </CustomerInfo>
          </CustomerCard>
        ))}
      </CustomersGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalTitle>Yeni Müşteri Ekle</ModalTitle>
          <form onSubmit={handleAddCustomer}>
            <FormGroup>
              <Label>İsim Soyisim</Label>
              <Input
                type="text"
                placeholder="Müşteri adını girin"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Telefon</Label>
              <Input
                type="tel"
                placeholder="Telefon numarasını girin"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                required
              />
            </FormGroup>
            <ButtonGroup>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Ekleniyor...' : 'Ekle'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Customers; 