import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Clock, User } from 'lucide-react';
import { Customer, RingSlot, customerAPI, ringSlotAPI } from '../services/api';

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

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  color: white;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SlotsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SlotItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  border-left: 4px solid #FFD700;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SlotTime = styled.span`
  color: white;
  font-weight: bold;
`;

const BookButton = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
  
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
  padding: 2rem;
`;

const Appointments: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [slots, setSlots] = useState<RingSlot[]>([]);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<RingSlot | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customersRes, slotsRes] = await Promise.all([
        customerAPI.getAll(),
        ringSlotAPI.getAll()
      ]);
      setCustomers(customersRes.data);
      setSlots(slotsRes.data);
    } catch (error) {
      console.error('Veri yüklenemedi:', error);
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTime) return;

    setLoading(true);
    try {
      await ringSlotAPI.create(newSlotTime);
      setNewSlotTime('');
      setIsSlotModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Zaman dilimi eklenemedi:', error);
      alert('Zaman dilimi eklenirken hata oluştu.');
    }
    setLoading(false);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedSlot) return;

    setLoading(true);
    try {
      await ringSlotAPI.createAppointment(parseInt(selectedCustomerId), selectedSlot.id);
      setSelectedCustomerId('');
      setSelectedSlot(null);
      setIsAppointmentModalOpen(false);
      alert('Randevu başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Randevu oluşturulamadı:', error);
      alert('Randevu oluşturulurken hata oluştu.');
    }
    setLoading(false);
  };

  const openAppointmentModal = (slot: RingSlot) => {
    setSelectedSlot(slot);
    setIsAppointmentModalOpen(true);
  };

  return (
    <Container>
      <Header>
        <Title>Randevu Yönetimi</Title>
        <AddButton onClick={() => setIsSlotModalOpen(true)}>
          <Plus size={20} />
          Zaman Dilimi Ekle
        </AddButton>
      </Header>

      <SectionGrid>
        <Section>
          <SectionTitle>
            <Clock size={24} />
            Mevcut Zaman Dilimleri
          </SectionTitle>
          <SlotsList>
            {slots.length > 0 ? (
              slots.map((slot) => (
                <SlotItem key={slot.id}>
                  <SlotTime>{slot.time_range}</SlotTime>
                  <BookButton onClick={() => openAppointmentModal(slot)}>
                    Randevu Al
                  </BookButton>
                </SlotItem>
              ))
            ) : (
              <EmptyState>Henüz zaman dilimi eklenmemiş.</EmptyState>
            )}
          </SlotsList>
        </Section>

        <Section>
          <SectionTitle>
            <User size={24} />
            Müşteri Bilgileri
          </SectionTitle>
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1rem' }}>
              Toplam Müşteri: <strong style={{ color: 'white' }}>{customers.length}</strong>
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              Randevu almak için soldaki zaman dilimlerinden birini seçin.
            </p>
          </div>
        </Section>
      </SectionGrid>

      {/* Zaman Dilimi Ekleme Modal */}
      <Modal isOpen={isSlotModalOpen}>
        <ModalContent>
          <ModalTitle>Yeni Zaman Dilimi Ekle</ModalTitle>
          <form onSubmit={handleAddSlot}>
            <FormGroup>
              <Label>Zaman Aralığı</Label>
              <Input
                type="text"
                placeholder="Örn: 09:00 - 11:00"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                required
              />
            </FormGroup>
            <ButtonGroup>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsSlotModalOpen(false)}
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

      {/* Randevu Oluşturma Modal */}
      <Modal isOpen={isAppointmentModalOpen}>
        <ModalContent>
          <ModalTitle>Randevu Oluştur</ModalTitle>
          <form onSubmit={handleBookAppointment}>
            <FormGroup>
              <Label>Zaman Dilimi</Label>
              <Input
                type="text"
                value={selectedSlot?.time_range || ''}
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label>Müşteri Seç</Label>
              <Select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
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
            <ButtonGroup>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsAppointmentModalOpen(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Oluşturuluyor...' : 'Randevu Oluştur'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Appointments; 