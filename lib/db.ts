import Database from "better-sqlite3";
import { join } from "path";
import { env } from "./env";

const db = new Database(join(process.cwd(), env.dbPath));

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      email TEXT PRIMARY KEY,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitorId TEXT NOT NULL,
      email TEXT NOT NULL,
      success INTEGER NOT NULL DEFAULT 0,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      expiresAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tourId TEXT NOT NULL,
      tourName TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      email TEXT NOT NULL,
      visitorId TEXT,
      chargeback INTEGER NOT NULL DEFAULT 0,
      createdAt INTEGER NOT NULL
    );
  `);
}

export function seedDefaults() {
  const upsertAccount = db.prepare(`
    INSERT INTO accounts(email, password)
    VALUES (@email, @password)
    ON CONFLICT(email) DO UPDATE SET password = excluded.password
  `);

  const accounts = [
    { email: "demo@example.com", password: "password123" },
    { email: "admin@example.com", password: "password" },
    { email: "user@example.com", password: "grapejuice" },
  ];

  db.transaction(() => accounts.forEach((r) => upsertAccount.run(r)))();

  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM purchases")
    .get() as { count: number };
  if (count > 0) return;

  const insertPurchase = db.prepare(`
    INSERT INTO purchases (tourId, tourName, quantity, price, email, visitorId, chargeback, createdAt)
    VALUES (@tourId, @tourName, @quantity, @price, @email, @visitorId, @chargeback, @createdAt)
  `);

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const purchases = [
    {
      tourId: "tour-010",
      tourName: "12 Days SEA Highlights",
      quantity: 2,
      price: 6998,
      email: "admin@example.com",
      visitorId: "vis_def456",
      chargeback: 1,
      createdAt: now - 5 * day,
    },
    {
      tourId: "tour-006",
      tourName: "5 Days Kuala Lumpur & Penang",
      quantity: 3,
      price: 2997,
      email: "user@example.com",
      visitorId: "vis_ghi789",
      chargeback: 0,
      createdAt: now - 20 * day,
    },
    {
      tourId: "tour-003",
      tourName: "10 Days Thailand Adventure",
      quantity: 1,
      price: 2199,
      email: "user@example.com",
      visitorId: "vis_ghi789",
      chargeback: 0,
      createdAt: now - 12 * day,
    },
    // fraud@example.com shares vis_abc123 with demo — demonstrates Fingerprint cross-account detection
    {
      tourId: "tour-001",
      tourName: "5 Days in Singapore",
      quantity: 5,
      price: 6495,
      email: "fraud@example.com",
      visitorId: "vis_abc123",
      chargeback: 1,
      createdAt: now - 8 * day,
    },
    {
      tourId: "tour-005",
      tourName: "6 Days Palawan, Philippines",
      quantity: 3,
      price: 5247,
      email: "fraud@example.com",
      visitorId: "vis_jkl012",
      chargeback: 1,
      createdAt: now - 6 * day,
    },
  ];

  // db.transaction(() => purchases.forEach((p) => insertPurchase.run(p)))();
}

export function resetDb() {
  db.exec(`DELETE FROM login_attempts`);
  db.exec(`DELETE FROM purchases`);
  seedDefaults();
}

export { db };

// Initialize and seed on load
initDb();
seedDefaults();
