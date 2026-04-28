import { db } from "./db";

export interface FpEvent {
  id: number;
  timestamp: string;
  event_id: string | null;
  visitor_id: string | null;
  confidence_score: number | null;
  ip_address: string | null;
  suspect_score: number | null;
  vpn: number | null;
  developer_tool: number | null;
  incognito: number | null;
}

export function insertFpEvent(data: Omit<FpEvent, "id">): void {
  db.prepare(`
    INSERT INTO identification_events
      (timestamp, event_id, visitor_id, confidence_score, ip_address, suspect_score, vpn, developer_tool, country_name, incognito)
    VALUES
      (@timestamp, @event_id, @visitor_id, @confidence_score, @ip_address, @suspect_score, @vpn, @developer_tool, @country_name, @incognito)
  `).run(data);
}

export function getAllFpEvents(): FpEvent[] {
  return db
    .prepare("SELECT * FROM identification_events ORDER BY id DESC")
    .all() as FpEvent[];
}
