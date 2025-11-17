const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const paiementRoutes = require('./routes/paiementRoutes');
const pertesRoutes = require('./routes/pertes');
const examensRoutes = require('./routes/examens');
const statsRoute = require('./routes/statsRoute');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

app.use('/api/paiements', paiementRoutes);
app.use('/api/pertes', pertesRoutes);
app.use('/api/examens', examensRoutes);
app.use('/api', statsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
//
app.post('/api/check-documents', (req, res) => {
  const { selectedDocuments } = req.body;

  const result = {
    photos: selectedDocuments.includes('photos'),
    carte_id: selectedDocuments.includes('carte_id'),
    contrat: selectedDocuments.includes('contrat'),
    visite_medicale: selectedDocuments.includes('visite_medicale'),
  };

  res.json(result);
});