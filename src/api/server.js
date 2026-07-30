import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import cors from 'cors';
import express from 'express';

const PORT = process.env.PORT ?? 3010;
const DIFFICULTIES = ['easy', 'moderate', 'hard', 'extreme'];

// The database file is created on first run and starts empty.
const db = new DatabaseSync('trails.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS trails (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    miles REAL NOT NULL,
    difficulty TEXT NOT NULL
  )
`);

const selectAll = db.prepare('SELECT id, name, miles, difficulty FROM trails ORDER BY name');
const selectOne = db.prepare('SELECT id, name, miles, difficulty FROM trails WHERE id = ?');
const insertOne = db.prepare('INSERT INTO trails (id, name, miles, difficulty) VALUES (?, ?, ?, ?)');

// Mirrors the validators on the Add Trail form, so the API says no to the same
// things the client does.
function validate(body) {
  const errors = [];
  const { name, miles, difficulty } = body ?? {};

  if (typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required');
  } else if (name.trim().length < 2) {
    errors.push('name must be at least 2 characters');
  }

  if (typeof miles !== 'number' || Number.isNaN(miles)) {
    errors.push('miles is required and must be a number');
  } else if (miles < 0.1 || miles > 900) {
    errors.push('miles must be between 0.1 and 900');
  }

  if (!DIFFICULTIES.includes(difficulty)) {
    errors.push(`difficulty must be one of: ${DIFFICULTIES.join(', ')}`);
  }

  return errors;
}

const app = express();
app.use(cors()); // super promiscuous - I'll take anything from anyone... this is good for demos, etc.
app.use(express.json());

app.get('/api/trails', (req, res) => {
  res.json(selectAll.all() || []);
});

app.post('/api/trails', (req, res) => {
  const errors = validate(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'That trail is not valid.', errors });
  }

  const trail = {
    id: randomUUID(),
    name: req.body.name.trim(),
    miles: req.body.miles,
    difficulty: req.body.difficulty,
  };

  insertOne.run(trail.id, trail.name, trail.miles, trail.difficulty);
  res.status(201).location(`/api/trails/${trail.id}`).json(trail);
});

// Not used by the app yet, but it makes the Location header above mean something.
app.get('/api/trails/:id', (req, res) => {
  const trail = selectOne.get(req.params.id);
  if (!trail) {
    return res.status(404).json({ message: 'No trail with that id.' });
  }
  res.json(trail);
});

app.listen(PORT, (e) => {
  console.log(`Trails API listening on http://localhost:${PORT}`);
  console.log(e)
});
