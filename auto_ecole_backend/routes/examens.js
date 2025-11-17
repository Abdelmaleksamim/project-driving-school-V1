const express = require('express');
const router = express.Router();
const db = require('../config/db'); // adjust this path to your config

// POST /api/examens
router.post('/', async (req, res) => {
    const { N_serie, date_examen, type_examen, result, date_ratt } = req.body;

    try {
        // Step 1: Get Client Info
        const [clients] = await db.promise().query(
            'SELECT nom, prenom FROM Client WHERE N_serie = ?',
            [N_serie]
        );

        if (clients.length === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        const { nom, prenom } = clients[0];

        // Step 2: Validate `date_ratt`
        let validDateRatt = null;
        if (result === 'echoui' && type_examen !== 'rattrapage') {
            validDateRatt = date_ratt;
        }

        // Step 3: Insert into examens table
        await db.promise().query(
            `INSERT INTO examens (N_serie, date_examen, type_examen, result, date_ratt)
                VALUES (?, ?, ?, ?, ?)`,
            [N_serie, date_examen, type_examen, result || null, validDateRatt]
        );

        // Step 4: Return success with client info
        res.status(201).json({
            message: 'Examen ajouté avec succès',
            nom,
            prenom
        });

    } catch (error) {
        console.error('Erreur ajout examen:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.get('/client-info/:N_serie', async (req, res) => {
    const { N_serie } = req.params;
    try {
        const [rows] = await db.promise().query(
        `SELECT CONCAT(nom, ' ', prenom) AS nom_complet FROM Client WHERE N_serie = ?`,[N_serie]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Client not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /api/examens
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
        SELECT
            e.id_examen,
            e.N_serie,
            CONCAT(c.nom, ' ', c.prenom) AS nomPrenom,
            e.type_examen,
            e.result,
            e.date_examen,
            e.date_ratt
        FROM examens e
        JOIN Client c ON e.N_serie = c.N_serie
        ORDER BY e.id_examen DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des examens:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// PUT /api/examens/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { type_examen, date_examen, result, date_ratt } = req.body;

  try {
    await db.promise().query(
      `UPDATE examens
       SET type_examen = ?, date_examen = ?, result = ?, date_ratt = ?
       WHERE id_examen = ?`,
      [type_examen, date_examen, result || null, date_ratt || null, id]
    );

    res.json({ message: 'Examen mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur update examen:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /api/examens/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.promise().query(`DELETE FROM examens WHERE id_examen = ?`, [id]);
    res.json({ message: 'Examen supprimé avec succès' });
  } catch (err) {
    console.error('Erreur suppression examen:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



module.exports = router;
