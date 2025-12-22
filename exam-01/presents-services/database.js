import sqlite3 from 'sqlite3';

const sqlite3Verbose = sqlite3.verbose();

const DB_SOURCE = "presents.sqlite";

const db = new sqlite3Verbose.Database(DB_SOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
        console.log('Conectado a la base de datos SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS presents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            photo TEXT NOT NULL,
            description TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Error al crear la tabla 'presents'", err);
            } else {
                console.log("Tabla 'presents' lista.");
            }
        });
    }
});

export default db;