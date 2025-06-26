import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit, Shirt, Package, User, Phone, Filter } from 'lucide-react';
import { Customer, LaundryWithCustomer, customerAPI, laundryAPI } from '../services/api';

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

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  background: ${props => props.active ? '#FFD700' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#333' : 'white'};
  
  &:hover {
    background: ${props => props.active ? '#FFD700' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const LaundryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const LaundryCard = styled.div`
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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CustomerInfo = styled.div`
  flex: 1;
`;

const CustomerName = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CustomerPhone = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  background: ${props => 
    props.status === 'ready' ? '#4CAF50' : 
    props.status === 'washing' ? '#FF9800' : 
    props.status === 'delivered' ? '#9C27B0' : '#6c757d'
  };
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const ShelfInfo = styled.div`
  margin: 1rem 0;
  padding: 0.8rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 8px;
  border-left: 4px solid #FFD700;
`;

const ShelfText = styled.p`
  color: #FFD700;
  margin: 0;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1976D2;
  }
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
  max-width: 500px;
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

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  option {
    background: #333;
    color: white;
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

const EmptyState = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 3rem;
  grid-column: 1 / -1;
`;

const LaundryStatus: React.FC = () => {
  const [laundryItems, setLaundryItems] = useState<LaundryWithCustomer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredItems, setFilteredItems] = useState<LaundryWithCustomer[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LaundryWithCustomer | null>(null);
  const [newLaundry, setNewLaundry] = useState({
    customer_id: '',
    status: 'washing',
    shelf_code: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentFilter === 'all') {
      setFilteredItems(laundryItems);
    } else {
      setFilteredItems(laundryItems.filter(item => item.status === currentFilter));
    }
  }, [laundryItems, currentFilter]);

  const fetchData = async () => {
    try {
      const [laundryRes, customersRes] = await Promise.all([
        laundryAPI.getAllWithCustomer(),
        customerAPI.getAll()
      ]);
      setLaundryItems(laundryRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error('Veri yüklenemedi:', error);
    }
  };

  const handleAddLaundry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLaundry.customer_id) return;

    setLoading(true);
    try {
      await laundryAPI.create({
        customer_id: parseInt(newLaundry.customer_id),
        status: newLaundry.status,
        shelf_code: newLaundry.shelf_code || undefined
      });
      setNewLaundry({ customer_id: '', status: 'washing', shelf_code: '' });
      setIsAddModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Çamaşır eklenemedi:', error);
      alert('Çamaşır eklenirken hata oluştu.');
    }
    setLoading(false);
  };

  const handleUpdateLaundry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setLoading(true);
    try {
      await laundryAPI.update(
        selectedItem.id,
        newLaundry.status,
        newLaundry.shelf_code || undefined
      );
      setIsEditModalOpen(false);
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      console.error('Çamaşır güncellenemedi:', error);
      alert('Çamaşır güncellenirken hata oluştu.');
    }
    setLoading(false);
  };

  const openEditModal = (item: LaundryWithCustomer) => {
    setSelectedItem(item);
    setNewLaundry({
      customer_id: '',
      status: item.status,
      shelf_code: item.shelf_code || ''
    });
    setIsEditModalOpen(true);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'washing': return 'Yıkanıyor';
      case 'ready': return 'Hazır';
      case 'delivered': return 'Teslim Edildi';
      default: return status;
    }
  };

  const getFilterCount = (status: string) => {
    if (status === 'all') return laundryItems.length;
    return laundryItems.filter(item => item.status === status).length;
  };

  return (
    <Container>
      <Header>
        <Title>Çamaşır Takibi</Title>
        <AddButton onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} />
          Yeni Çamaşır
        </AddButton>
      </Header>

      <FilterContainer>
        <Filter size={20} color="white" />
        <FilterButton
          active={currentFilter === 'all'}
          onClick={() => setCurrentFilter('all')}
        >
          Tümü ({getFilterCount('all')})
        </FilterButton>
        <FilterButton
          active={currentFilter === 'washing'}
          onClick={() => setCurrentFilter('washing')}
        >
          Yıkanıyor ({getFilterCount('washing')})
        </FilterButton>
        <FilterButton
          active={currentFilter === 'ready'}
          onClick={() => setCurrentFilter('ready')}
        >
          Hazır ({getFilterCount('ready')})
        </FilterButton>
        <FilterButton
          active={currentFilter === 'delivered'}
          onClick={() => setCurrentFilter('delivered')}
        >
          Teslim Edildi ({getFilterCount('delivered')})
        </FilterButton>
      </FilterContainer>

      <LaundryGrid>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <LaundryCard key={item.id}>
              <CardHeader>
                <CustomerInfo>
                  <CustomerName>
                    <User size={18} />
                    {item.name}
                  </CustomerName>
                  <CustomerPhone>
                    <Phone size={14} />
                    {item.phone}
                  </CustomerPhone>
                </CustomerInfo>
                <StatusBadge status={item.status}>
                  {getStatusText(item.status)}
                </StatusBadge>
              </CardHeader>
              
              {item.shelf_code && (
                <ShelfInfo>
                  <ShelfText>
                    <Package size={16} />
                    Raf Kodu: {item.shelf_code}
                  </ShelfText>
                </ShelfInfo>
              )}
              
              <ActionButton onClick={() => openEditModal(item)}>
                <Edit size={16} />
                Durumu Güncelle
              </ActionButton>
            </LaundryCard>
          ))
        ) : (
          <EmptyState>
            <Shirt size={64} color="rgba(255, 255, 255, 0.3)" />
            <p>Bu durumda çamaşır bulunmuyor.</p>
          </EmptyState>
        )}
      </LaundryGrid>

      {/* Yeni Çamaşır Ekleme Modal */}
      <Modal isOpen={isAddModalOpen}>
        <ModalContent>
          <ModalTitle>Yeni Çamaşır Ekle</ModalTitle>
          <form onSubmit={handleAddLaundry}>
            <FormGroup>
              <Label>Müşteri Seç</Label>
              <Select
                value={newLaundry.customer_id}
                onChange={(e) => setNewLaundry({ ...newLaundry, customer_id: e.target.value })}
                required
              >
                <option value="">Müşteri seçin...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Durum</Label>
              <Select
                value={newLaundry.status}
                onChange={(e) => setNewLaundry({ ...newLaundry, status: e.target.value })}
              >
                <option value="washing">Yıkanıyor</option>
                <option value="ready">Hazır</option>
                <option value="delivered">Teslim Edildi</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Raf Kodu (Opsiyonel)</Label>
              <Input
                type="text"
                placeholder="Raf kodunu girin"
                value={newLaundry.shelf_code}
                onChange={(e) => setNewLaundry({ ...newLaundry, shelf_code: e.target.value })}
              />
            </FormGroup>
            <ButtonGroup>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsAddModalOpen(false)}
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

      {/* Çamaşır Güncelleme Modal */}
      <Modal isOpen={isEditModalOpen}>
        <ModalContent>
          <ModalTitle>Çamaşır Durumunu Güncelle</ModalTitle>
          <form onSubmit={handleUpdateLaundry}>
            <FormGroup>
              <Label>Müşteri</Label>
              <Input
                type="text"
                value={selectedItem ? `${selectedItem.name} - ${selectedItem.phone}` : ''}
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label>Durum</Label>
              <Select
                value={newLaundry.status}
                onChange={(e) => setNewLaundry({ ...newLaundry, status: e.target.value })}
              >
                <option value="washing">Yıkanıyor</option>
                <option value="ready">Hazır</option>
                <option value="delivered">Teslim Edildi</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Raf Kodu</Label>
              <Input
                type="text"
                placeholder="Raf kodunu girin"
                value={newLaundry.shelf_code}
                onChange={(e) => setNewLaundry({ ...newLaundry, shelf_code: e.target.value })}
              />
            </FormGroup>
            <ButtonGroup>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Güncelleniyor...' : 'Güncelle'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default LaundryStatus; 