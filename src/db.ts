import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const initDB = async () => {
  const db = await open({
    filename: './laundry.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS ring_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      time_range TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS ring_appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      ring_slot_id INTEGER NOT NULL,
      FOREIGN KEY(customer_id) REFERENCES customers(id),
      FOREIGN KEY(ring_slot_id) REFERENCES ring_slots(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS laundry_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      shelf_code TEXT,
      FOREIGN KEY(customer_id) REFERENCES customers(id)
    );
  `);

  return db;
};
