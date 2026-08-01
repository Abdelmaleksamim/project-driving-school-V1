const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const paiementRoutes = require('./routes/paiementRoutes');
const pertesRoutes = require('./routes/pertes');
const examensRoutes = require('./routes/examens');
const statsRoute = require('./routes/statsRoute');

const dotenv = require("dotenv");

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env",
});

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());






// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/uploads', express.static('uploads'));


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


