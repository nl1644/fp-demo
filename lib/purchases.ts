import { db } from "./db";

export interface Purchase {
  id: number;
  tourId: string;
  tourName: string;
  quantity: number;
  price: number;
  email: string;
  visitorId: string | null;
  chargeback: number;
  createdAt: number;
}

export function createPurchase(data: {
  tourId: string;
  tourName: string;
  quantity: number;
  price: number;
  email: string;
  visitorId?: string;
}): Purchase {
  const result = db
    .prepare(
      `INSERT INTO purchases (tourId, tourName, quantity, price, email, visitorId, createdAt)
       VALUES (@tourId, @tourName, @quantity, @price, @email, @visitorId, @createdAt)`
    )
    .run({ ...data, visitorId: data.visitorId ?? null, createdAt: Date.now() });
  return getPurchaseById(result.lastInsertRowid as number)!;
}

export function getPurchaseById(id: number): Purchase | undefined {
  return db.prepare("SELECT * FROM purchases WHERE id = ?").get(id) as Purchase | undefined;
}

export function getPurchasesByEmail(email: string): Purchase[] {
  return db
    .prepare("SELECT * FROM purchases WHERE email = ? ORDER BY createdAt DESC")
    .all(email) as Purchase[];
}

export function getAllPurchases(): Purchase[] {
  return db
    .prepare("SELECT * FROM purchases ORDER BY createdAt DESC")
    .all() as Purchase[];
}

export function getRelatedPurchases(id: number): Purchase[] {
  const purchase = getPurchaseById(id);
  if (!purchase) return [];
  return db
    .prepare(
      `SELECT * FROM purchases
       WHERE id != ? AND (email = ? OR (visitorId IS NOT NULL AND visitorId = ?))
       ORDER BY createdAt DESC`
    )
    .all(id, purchase.email, purchase.visitorId) as Purchase[];
}

export function disputePurchase(id: number): boolean {
  const result = db
    .prepare("UPDATE purchases SET chargeback = 1 WHERE id = ? AND chargeback = 0")
    .run(id);
  return result.changes > 0;
}
