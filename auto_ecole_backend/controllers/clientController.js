// controllers/clientController.js
const db = require('../config/db');
const supabase = require('../supabase');

// Upload image to Supabase and return the public URL
const uploadImageToSupabase = async (file) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const { data, error } = await supabase.storage
    .from('image')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('image')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};

// ✅ Add new client
exports.addClient = async (req, res) => {
  try {
    const {
      N_serie, nom, prenom, CIN, adresse, date_nais, tel,
      type_permis, date_inscription, Prix, Duree, Type_Code,
      Statut, photos, carte_id, contrat, visite_medicale
    } = req.body;
    db.query(`SELECT N_serie FROM Client WHERE N_serie = ?`, [N_serie], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ error: "N_serie déjà existe" });
      }

      let photoUrl = '';
      if (req.file) {
        photoUrl = await uploadImageToSupabase(req.file);
      }

      const sql = `INSERT INTO Client SET ?`;
      const newClient = {
        N_serie, nom, prenom, CIN, adresse, date_nais, tel,
        type_permis, date_inscription, Prix, Duree, Type_Code,
        Statut, photo: photoUrl, admin : 1,
        photos, carte_id, contrat, visite_medicale
      };

      db.query(sql, newClient, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Client ajouté avec succès' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ Get all clients
exports.getAllClients = (req, res) => {
  const sql = `SELECT * FROM Client`;
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
      Statut, photos, carte_id, contrat, visite_medicale
    } = req.body;

    let photoUrl = req.body.image_url || '';
    if (req.file) {
      photoUrl = await uploadImageToSupabase(req.file);
    }

    const sql = `UPDATE Client SET ? WHERE N_serie = ?`;
    const updatedClient = {
      nom, prenom, CIN, adresse, date_nais, tel,
      type_permis, date_inscription, Prix, Duree, Type_Code,
      Statut, photo: photoUrl,
      photos, carte_id, contrat, visite_medicale
    };

    db.query(sql, [updatedClient, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Client mis à jour avec succès' });
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



