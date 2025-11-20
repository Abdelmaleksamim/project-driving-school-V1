const db = require('../config/db');

exports.addClient = async (req, res) => {
  try {
    const {
      N_serie, nom, prenom, CIN, adresse, date_nais, tel,
      type_permis, date_inscription, Prix, Duree, Type_Code,
      Statut, photos, carte_id, contrat, visite_medicale
    } = req.body;

    db.query(
      `SELECT N_serie FROM Client WHERE N_serie = ?`,
      [N_serie],
      async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
          return res.status(400).json({ error: "N_serie déjà existe" });
        }

        let photoUrl = "";
        if (req.file) {
          photoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const newClient = {
          N_serie, nom, prenom, CIN, adresse, date_nais, tel,
          type_permis, date_inscription, Prix, Duree, Type_Code,
          Statut,
          photo: photoUrl,
          admin: 1,
          photos, carte_id, contrat, visite_medicale
        };

        const sql = `INSERT INTO Client SET ?`;

        db.query(sql, newClient, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({
            message: 'Client ajouté avec succès',
            image: photoUrl
          });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// ✅ Get all clients
exports.getAllClients = (req, res) => {
  const sql = `SELECT * FROM Client ORDER BY date_inscription DESC, N_serie DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};


// ✅ Update client
exports.updateClient = async (req, res) => {
  try {
    const id = req.params.N_serie;
    const {
      nom, prenom, CIN, adresse, date_nais, tel,
      type_permis, date_inscription, Prix, Duree, Type_Code,
      Statut, photos, carte_id, contrat, visite_medicale, image_url
    } = req.body;

    let photoUrl = req.body.image_url || "";
    if (req.file) {
      photoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const sql = `UPDATE Client SET ? WHERE N_serie = ?`;
    const updatedClient = {
      nom, prenom, CIN, adresse, date_nais, tel,
      type_permis, date_inscription, Prix, Duree, Type_Code,
      Statut,
      photo: photoUrl,
      photos, carte_id, contrat, visite_medicale
    };

    db.query(sql, [updatedClient, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          message: "Client mis à jour avec succès",
          image: photoUrl
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


// ✅ Delete client
exports.deleteClient = (req, res) => {
  const id = req.params.N_serie;
  const sql = `DELETE FROM Client WHERE N_serie = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Client supprimé avec succès' });
  });
};

// filter with nom , prenom, CIN, type_permis
exports.filterClients = (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ error: "Search value is required" });
  }

  const sql = `
    SELECT * FROM Client
    WHERE
      nom LIKE ? OR
      prenom LIKE ? OR
      CIN LIKE ? OR
      type_permis LIKE ?
  `;
  const value = `%${search}%`;
  const params = [value, value, value, value];

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};


//.filter By Statut
exports.filterByStatut = (req, res) => {
  const { statut } = req.query;

  let sql = `SELECT * FROM Client`;
  const params = [];

  if (statut && statut !== 'tous') {
    sql += ` WHERE Statut = ?`;
    params.push(statut);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};



