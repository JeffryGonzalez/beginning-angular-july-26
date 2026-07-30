# Classroom API for Beginning Angular

This API will support the Angular application. It is a small Express + SQLite
service — everything lives in [server.js](server.js).

## Running it

```
npm install
npm start     # or: npm run dev   (restarts on file changes)
```

Listens on <http://localhost:3010> — the same URL the Angular app calls. Set `PORT`
to change it.

Data lives in `trails.db`, created next to `server.js` on first run. It starts
empty. Delete the file to start over; it is gitignored.

There are no native dependencies — SQLite comes from Node's built-in
`node:sqlite` module (Node 24+).

## Endpoints

### `GET /trails`

Returns all trails, ordered by name.

```json
[{ "id": "5f3c…", "name": "Bright Angel", "miles": 13.8, "difficulty": "hard" }]
```

### `POST /trails`

Creates a trail. Send `name`, `miles`, and `difficulty` — the `id` is assigned by
the server.

```json
{ "name": "Bright Angel", "miles": 13.8, "difficulty": "hard" }
```

Responds `201 Created` with the saved trail and a `Location` header.

Validation mirrors the Add Trail form: `name` is required and at least 2
characters, `miles` is required and between 0.1 and 900, and `difficulty` must be
one of `easy`, `moderate`, `hard`, `extreme`. A bad request comes back `400` with:

```json
{ "message": "That trail is not valid.", "errors": ["miles must be between 0.1 and 900"] }
```

### `GET /trails/:id`

Returns one trail, or `404` if there is no trail with that id. The app does not
use this yet — it is here so the `Location` header points at something real.

## Trying it out

See [trails.http](trails.http) if you have the REST Client extension installed.
