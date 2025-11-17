const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Connexion MySQL

// Ajouter une perte
router.post('/add', async (req, res) => {
  const { date_perte, montant, nom_perte } = req.body;

  if (!date_perte || !montant || !nom_perte) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }

  try {
    const [result] = await db.promise().query(
      `INSERT INTO pertes (date_perte, montant, nom_perte, admin)
        VALUES (?, ?, ?, ?)`,
      [date_perte, montant, nom_perte, 1] // admin_id toujours 1
    );

    res.status(201).json({ message: "Perte ajoutée avec succès", perteId: result.insertId });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la perte:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



// GET all pertes
router.get('/', async (req, res) => {
  try {
    const [pertes] = await db.promise().query(`
      SELECT
        p.id_perte,
        p.date_perte,
        p.montant,
        p.nom_perte
      FROM pertes p
      ORDER BY p.id_perte DESC
    `);

    res.json(pertes);
  } catch (error) {
    console.error("Erreur lors de la récupération des pertes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// Modifier une perte
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { date_perte, montant, nom_perte } = req.body;

  if (!date_perte || !montant || !nom_perte) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }

  try {
    const [result] = await db.promise().query(
        `UPDATE pertes
        SET date_perte = ?, montant = ?, nom_perte = ?
        WHERE id_perte = ?`,
      [date_perte, montant, nom_perte, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Perte non trouvée" });
    }

    res.json({ message: "Perte modifiée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la modification de la perte:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer une perte
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query(
      `DELETE FROM pertes WHERE id_perte = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Perte non trouvée" });
    }

    res.json({ message: "Perte supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la perte:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
