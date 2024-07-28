const express = require('express');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(fileUpload());
app.use(express.static(path.join(__dirname, '..')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'e_office_system'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const unique_id = `user_${Date.now()}`;
    const documents = req.files.documents;
    const uploadDir = path.join(__dirname, '..', 'uploads', unique_id);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    let documentArray = Array.isArray(documents) ? documents : [documents];

    const documentPromises = documentArray.map(document => {
        const uploadPath = path.join(uploadDir, document.name);
        return new Promise((resolve, reject) => {
            document.mv(uploadPath, err => {
                if (err) {
                    reject(err);
                } else {
                    const sql = `INSERT INTO documents (user_id, document_name, document_path) VALUES (?, ?, ?)`;
                    db.query(sql, [unique_id, document.name, uploadPath], (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    });

    Promise.all(documentPromises)
        .then(() => {
            res.json({ success: true, unique_id });
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
