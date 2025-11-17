const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Assure-toi que ce fichier est bien configuré

// Ajouter un paiement
router.post('/add', async (req, res) => {
    const { N_serie, date_paiement, montant } = req.body;

    try {
        const [client] = await db.promise().query(
            'SELECT nom, prenom FROM Client WHERE N_serie = ?',
            [N_serie]
        );

        if (client.length === 0) {
            return res.status(404).json({ message: "Client non trouvé" });
        }
        //console.log('Données reçues pour insertion:', { N_serie, date_paiement, montant });


        await db.promise().query(
            'INSERT INTO Paiements (N_serie, date_paiement, montant) VALUES (?, ?, ?)',
            [N_serie, date_paiement, montant]
        );

        res.status(201).json({ message: 'Paiement ajouté avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'ajout du paiement" });
    }
});
// Récupérer nom et prénom selon N_serie
router.get('/client/:N_serie', async (req, res) => {
    const { N_serie } = req.params;

    try {
        const [rows] = await db.promise().query(
            'SELECT nom, prenom FROM Client WHERE N_serie = ?',
            [N_serie]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du client" });
    }
});

module.exports = router;

// GET all paiements
router.get('/', async (req, res) => {
    try {
        const [paiements] = await db.promise().query(`
            SELECT
                p.id_paiement,
                p.N_serie,
                c.nom,
                c.prenom,
                p.date_paiement,
                p.montant
            FROM Paiements p
            JOIN Client c ON p.N_serie = c.N_serie
            ORDER BY p.id_paiement DESC
        `);

        res.json(paiements);
    } catch (error) {
        console.error('Erreur récupération paiements:', error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements." });
    }
});

// PUT - Modifier un paiement
router.put('/:id', async (req, res) => {
    const id_paiement = req.params.id;
    const { date_paiement, montant } = req.body;

    try {
        const [result] = await db.promise().query(
        `UPDATE Paiements SET date_paiement = ?, montant = ? WHERE id_paiement = ?`,
        [date_paiement, montant, id_paiement]
        );

        if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Paiement non trouvé." });
        }

        res.json({ message: "Paiement modifié avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du paiement:", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// DELETE - Supprimer un paiement par son ID
router.delete('/:id', async (req, res) => {
    const id_paiement = req.params.id;

    try {
        const [result] = await db.promise().query(
        'DELETE FROM Paiements WHERE id_paiement = ?',
        [id_paiement]
        );

        if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Paiement non trouvé.' });
        }

        res.json({ message: 'Paiement supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du paiement:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});
