CREATE TABLE IF NOT EXISTS quiz_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  archetype_id TEXT NOT NULL,
  score_vector TEXT NOT NULL,
  created_at TEXT NOT NULL
);
