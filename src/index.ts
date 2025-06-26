import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db';
import { swaggerUi, specs } from './swagger';
import { writeLog } from './utils/logger';
import { sendSMS } from './utils/sendSMS';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

let db: any;

initDB().then((database) => {
  db = database;

  app.get('/', (req, res) => {
    res.send('Laundry Backend ✅ Çalışıyor!');
  });

  // Müşteri ekleme
  app.post('/customers', async (req, res) => {
    const { name, phone } = req.body;
    try {
      const result = await db.run(
        'INSERT INTO customers (name, phone) VALUES (?, ?)',
        [name, phone]
      );
      writeLog(`Yeni müşteri eklendi: ${name} (${phone})`);
      res.status(201).json({ id: result.lastID, name, phone });
    } catch (err: any) {
      if (err.message.includes('UNIQUE')) {
        res.status(400).json({ error: 'Bu telefon numarası zaten kayıtlı.' });
      } else {
        res.status(500).json({ error: 'Sunucu hatası' });
      }
    }
  });

  app.get('/customers', async (_, res) => {
    const customers = await db.all('SELECT * FROM customers');
    res.json(customers);
  });

  app.get('/customers/:phone', async (req, res) => {
    const { phone } = req.params;
    const customer = await db.get('SELECT * FROM customers WHERE phone = ?', [phone]);
    if (customer) res.json(customer);
    else res.status(404).json({ error: 'Bulunamadı' });
  });

  // Ring slot
  app.post('/ring-slots', async (req, res) => {
    const { time_range } = req.body;
    const result = await db.run('INSERT INTO ring_slots (time_range) VALUES (?)', [time_range]);
    res.status(201).json({ id: result.lastID, time_range });
  });

  app.get('/ring-slots', async (_, res) => {
    const slots = await db.all('SELECT * FROM ring_slots');
    res.json(slots);
  });

  app.post('/ring-appointments', async (req, res) => {
    const { customer_id, ring_slot_id } = req.body;
    await db.run(
      'INSERT INTO ring_appointments (customer_id, ring_slot_id) VALUES (?, ?)',
      [customer_id, ring_slot_id]
    );
    res.status(201).json({ message: 'Randevu alındı' });
  });

  // Laundry
  app.post('/laundry', async (req, res) => {
    const { customer_id, status, shelf_code } = req.body;
    const result = await db.run(
      'INSERT INTO laundry_status (customer_id, status, shelf_code) VALUES (?, ?, ?)',
      [customer_id, status, shelf_code]
    );
    res.status(201).json({ id: result.lastID, customer_id, status, shelf_code });
  });

  app.put('/laundry/:id', async (req, res) => {
    const { status, shelf_code } = req.body;
    const { id } = req.params;

    await db.run(
      'UPDATE laundry_status SET status = ?, shelf_code = ? WHERE id = ?',
      [status, shelf_code, id]
    );

    const customer = await db.get(
      'SELECT c.name, c.phone FROM laundry_status l JOIN customers c ON c.id = l.customer_id WHERE l.id = ?',
      [id]
    );

    if (status === 'ready' && shelf_code && customer) {
      const msg = `📦 Sayın ${customer.name}, çamaşırınız hazır. Raf kodu: ${shelf_code}`;
      await sendSMS(customer.phone, msg);
      writeLog(`SMS gönderildi: ${customer.phone} → ${msg}`);
    }

    writeLog(`Çamaşır güncellendi: id=${id}, status=${status}, shelf=${shelf_code}`);
    res.json({ message: 'Güncellendi' });
  });

  app.get('/laundry', async (req, res) => {
    const { status } = req.query;
    let query = 'SELECT * FROM laundry_status';
    const params: any[] = [];
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    const laundry = await db.all(query, params);
    res.json(laundry);
  });

  app.get('/laundry/with-customer', async (_, res) => {
    const rows = await db.all(`
      SELECT l.id, l.status, l.shelf_code, c.name, c.phone
      FROM laundry_status l
      JOIN customers c ON c.id = l.customer_id
    `);

    rows.forEach((row: any) => {
      const msg = row.status === 'ready' && row.shelf_code
        ? `📦 Sayın ${row.name}, çamaşırınız hazır. Raf kodu: ${row.shelf_code}`
        : `🌀 Sayın ${row.name}, çamaşırınız yıkanıyor...`;
      console.log(msg);
    });

    res.json(rows);
  });

  app.listen(PORT, () => {
    console.log(`Sunucu başlatıldı: http://localhost:${PORT}`);
  });
});
