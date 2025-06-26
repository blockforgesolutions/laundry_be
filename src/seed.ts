import { initDB } from './db';

const seed = async () => {
  const db = await initDB();

  await db.exec(`DELETE FROM customers`);
  await db.exec(`DELETE FROM ring_slots`);
  await db.exec(`DELETE FROM ring_appointments`);
  await db.exec(`DELETE FROM laundry_status`);

  const c1 = await db.run(`INSERT INTO customers (name, phone) VALUES (?, ?)`, ['Ahmet Yılmaz', '05551234567']);
  const c2 = await db.run(`INSERT INTO customers (name, phone) VALUES (?, ?)`, ['Zeynep Koç', '05553334455']);

  const s1 = await db.run(`INSERT INTO ring_slots (time_range) VALUES (?)`, ['10:00 - 12:00']);
  const s2 = await db.run(`INSERT INTO ring_slots (time_range) VALUES (?)`, ['14:00 - 16:00']);

  await db.run(`INSERT INTO ring_appointments (customer_id, ring_slot_id) VALUES (?, ?)`, [c1.lastID, s1.lastID]);

  await db.run(`INSERT INTO laundry_status (customer_id, status, shelf_code) VALUES (?, ?, ?)`, [c1.lastID, 'ready', 'A1']);
  await db.run(`INSERT INTO laundry_status (customer_id, status, shelf_code) VALUES (?, ?, ?)`, [c2.lastID, 'washing', null]);

  console.log('✅ Örnek veriler başarıyla yüklendi.');
};

seed();
