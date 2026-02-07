/**
 * Database schema definitions for future SQLite migration.
 * Currently using AsyncStorage for MVP.
 * These type definitions serve as documentation for the data model.
 */

export const SCHEMA_VERSION = 1;

export const TABLES = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      current_phase TEXT,
      phase_week INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    )
  `,
  checkins: `
    CREATE TABLE IF NOT EXISTS checkins (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      energy INTEGER NOT NULL CHECK(energy BETWEEN 1 AND 5),
      mood TEXT,
      soreness TEXT,
      intent TEXT NOT NULL CHECK(intent IN ('train', 'light', 'rest')),
      created_at TEXT NOT NULL
    )
  `,
  weigh_ins: `
    CREATE TABLE IF NOT EXISTS weigh_ins (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      weight REAL NOT NULL,
      created_at TEXT NOT NULL
    )
  `,
  progress_photos: `
    CREATE TABLE IF NOT EXISTS progress_photos (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      uri TEXT NOT NULL,
      label TEXT,
      created_at TEXT NOT NULL
    )
  `,
  workout_templates: `
    CREATE TABLE IF NOT EXISTS workout_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target_muscles TEXT,
      estimated_minutes INTEGER,
      exercises TEXT NOT NULL
    )
  `,
  workout_sessions: `
    CREATE TABLE IF NOT EXISTS workout_sessions (
      id TEXT PRIMARY KEY,
      template_id TEXT NOT NULL,
      template_name TEXT NOT NULL,
      date TEXT NOT NULL,
      started_at TEXT NOT NULL,
      completed_at TEXT,
      sets TEXT NOT NULL
    )
  `,
} as const;
