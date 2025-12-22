import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/img', express.static(path.join(__dirname, 'img')));


function saveImage(base64Data) {
    try {
        const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            console.error("Formato de base64 inválido");
            return null;
        }
        const extension = matches[1];
        const data = matches[2];
        const buffer = Buffer.from(data, 'base64');
        const filename = `${Date.now()}.${extension}`;
        
        const imgFolderPath = path.join(__dirname, 'img');
        const filePath = path.join(imgFolderPath, filename);

        if (!fs.existsSync(imgFolderPath)) {
            fs.mkdirSync(imgFolderPath);
        }

        fs.writeFileSync(filePath, buffer);
        return filename;
    } catch (error) {
        console.error("Error al guardar la imagen:", error);
        return null;
    }
}

function formatPresentResponse(present) {
    return {
        ...present,
        photo: `${BASE_URL}/img/${present.photo}`
    };
}


app.get('/presents', (req, res) => {
    const sql = "SELECT * FROM presents";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const formattedPresents = rows.map(formatPresentResponse);
        res.json({ presents: formattedPresents });
    });
});

app.get('/presents/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM presents WHERE id = ?";
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Regalo no encontrado' });
        }
        res.json({ present: formatPresentResponse(row) });
    });
});

app.post('/presents', (req, res) => {
    const { photo, description } = req.body;
    if (!photo || !description) {
        return res.status(400).json({ error: 'Los campos "photo" y "description" son obligatorios.' });
    }
    const filename = saveImage(photo);
    if (!filename) {
        return res.status(400).json({ error: 'El formato de la imagen en base64 es incorrecto.' });
    }
    const sql = "INSERT INTO presents (photo, description) VALUES (?, ?)";
    db.run(sql, [filename, description], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const newId = this.lastID;
        db.get("SELECT * FROM presents WHERE id = ?", [newId], (err, row) => {
             if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ present: formatPresentResponse(row) });
        });
    });
});

app.put('/presents/:id', (req, res) => {
    const { id } = req.params;
    const { photo, description } = req.body;
    if (!photo || !description) {
        return res.status(400).json({ error: 'Los campos "photo" y "description" son obligatorios.' });
    }
    db.get("SELECT photo FROM presents WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Regalo no encontrado' });

        const oldPhotoFilename = row.photo;
        const newPhotoFilename = saveImage(photo);
        if (!newPhotoFilename) {
            return res.status(400).json({ error: 'El formato de la imagen en base64 es incorrecto.' });
        }

        const sql = "UPDATE presents SET photo = ?, description = ? WHERE id = ?";
        db.run(sql, [newPhotoFilename, description, id], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            const oldPhotoPath = path.join(__dirname, 'img', oldPhotoFilename);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
            
            db.get("SELECT * FROM presents WHERE id = ?", [id], (err, updatedRow) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ present: formatPresentResponse(updatedRow) });
            });
        });
    });
});

app.delete('/presents/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT photo FROM presents WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Regalo no encontrado' });
        
        const photoFilename = row.photo;
        const sql = "DELETE FROM presents WHERE id = ?";
        db.run(sql, [id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            
            const photoPath = path.join(__dirname, 'img', photoFilename);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
            res.status(204).send();
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${BASE_URL}`);
});