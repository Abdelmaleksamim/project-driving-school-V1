import { useState, useEffect } from 'react';
import '../pages/css/ClientsPage.css';
import { Users, Edit, Trash2, Search  } from 'lucide-react'
import axios from 'axios';

const ClientsPage = () => {
const [client, setClient] = useState({
  N_serie: '',
  nom: '',
  prenom: '',
  CIN: '',
  adresse: '',
  date_nais: '',
  tel: '',
  type_permis: '',
  date_inscription: '',
  Prix: '',
  Duree: 20,
  Type_Code: 'code karim',
  Statut: 'en cours',
  photo: null,
  image_url: '',
  photos: false,
  carte_id: false,
  contrat: false,
  visite_medicale: false,
});

  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    console.log("Image URL:", data.imageUrl);
  };

  const documentTypes = [
    { key: 'photos', label: 'Photos' },
    { key: 'carte_id', label: 'CIN' },
    { key: 'contrat', label: 'Contrat' },
    { key: 'visite_medicale', label: 'Visite' }
  ];

  const permisOptions = ['AA', 'BB', 'CC', 'DD', 'EC'];
  const codeOptions = ['code karim'];
  const statusOptions = ['en cours', 'réussi'];

  useEffect(() => {
    const fetchFilteredClients = async () => {
      try {
        let url = '';
        if (searchTerm) {
          url = `http://localhost:5000/api/clients/filter?search=${encodeURIComponent(searchTerm)}`;
        } else if (statusFilter !== 'tous') {
          url = `http://localhost:5000/api/clients/status?statut=${statusFilter}`;
        } else {
          url = `http://localhost:5000/api/clients/all`;
        }
        const response = await fetch(url);
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Erreur lors du filtrage:", error);
      }
    };
    fetchFilteredClients();
  }, [searchTerm, statusFilter]);


const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;
  if (type === 'file') {
  setClient(prev => ({
      ...prev,
      photo: files[0] || null,
      image_url: '', // Clear old URL because new file chosen
    }));
  } else if (type === 'checkbox') {
    setClient(prev => ({ ...prev, [name]: checked }));
  } else {
    setClient(prev => ({ ...prev, [name]: value }));
  }
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();

    const serialNumber =  client.N_serie || `CLI-${Date.now()}`;
    const formatDate = (dateStr) =>
      dateStr ? dateStr.slice(0, 10) : '';

    formData.append('N_serie', serialNumber);
    formData.append('nom', client.nom);
    formData.append('prenom', client.prenom);
    formData.append('CIN', client.CIN);
    formData.append('adresse', client.adresse);
    formData.append('date_nais', formatDate(client.date_nais));
    formData.append('tel', client.tel);
    formData.append('type_permis', client.type_permis);
    formData.append('date_inscription', formatDate(client.date_inscription));
    formData.append('Prix', client.Prix);
    formData.append('Duree', client.Duree);
    formData.append('Type_Code', client.Type_Code);
    formData.append('Statut', client.Statut);
    formData.append('photos', client.photos ? '1' : '0');
    formData.append('carte_id', client.carte_id ? '1' : '0');
    formData.append('contrat', client.contrat ? '1' : '0');
    formData.append('visite_medicale', client.visite_medicale ? '1' : '0');
    formData.append("image_url", client.image_url || "");
    if (client.photo instanceof File) {
      formData.append("photo", client.photo);
    }

    const url = editingId
      ? `http://localhost:5000/api/clients/update/${editingId}`
      : `http://localhost:5000/api/clients/add`;

    const method = editingId ? 'PUT' : 'POST';

    const response = await fetch(url, { method, body: formData });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);

      const res = await fetch('http://localhost:5000/api/clients/all');
      const updatedClients = await res.json();
      setClients(updatedClients);

      // Reset form
      setClient({
        N_serie: '',
        nom: '',
        prenom: '',
        CIN: '',
        adresse: '',
        date_nais: '',
        tel: '',
        type_permis: '',
        date_inscription: '',
        Prix: '',
        Duree: 20,
        Type_Code: 'code karim',
        Statut: 'en cours',
        photo: null,
        photos: false,
        carte_id: false,
        contrat: false,
        visite_medicale: false
      });

      setEditingId(null);
    } else {
      alert(data.error || 'Une erreur est survenue');
    }
  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
    alert("Erreur lors de l'envoi du formulaire");
  }
  };



    const handleDelete = (N_serie) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client?')) {
      fetch(`http://localhost:5000/api/clients/delete/${N_serie}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          setClients(clients.filter(c => c.N_serie !== N_serie));
        })
        .catch(err => console.error('Erreur lors de la suppression:', err));
    }
    };
  const DocumentStatus = ({ documents }) => {
    if (!documents) return <span>-</span>;

    return (
      <div className="document-status-container">
        {documentTypes.map((doc) => (
          <div
            key={doc.key}
            className={`document-status ${documents[doc.key] ? 'provided' : 'missing'}`}
            title={`${doc.label}: ${documents[doc.key] ? 'Fourni' : 'Manquant'}`}
          >
            {documents[doc.key] ? '✓' : '✗'} <span className="document-label">{doc.label}</span>
          </div>
        ))}
      </div>
    );
  };

const DocumentSection = ({ client }) => {
  const [docStatus, setDocStatus] = useState(null);

  useEffect(() => {
    const selectedDocuments = [];

    if (client.photos) selectedDocuments.push('photos');
    if (client.carte_id) selectedDocuments.push('carte_id');
    if (client.contrat) selectedDocuments.push('contrat');
    if (client.visite_medicale) selectedDocuments.push('visite_medicale');

    const checkDocuments = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/check-documents', {
          selectedDocuments,
        });
        setDocStatus(response.data);
      } catch (error) {
        console.error('Erreur lors de la vérification des documents:', error);
        setDocStatus(null);
      }
    };

    checkDocuments();
  }, [
    client.photos,
    client.carte_id,
    client.contrat,
    client.visite_medicale,
  ]);

  return (
    <td className="documents-cell">
      {docStatus ? <DocumentStatus documents={docStatus} /> : <span>Chargement...</span>}
    </td>
  );
};


  return (
<div className="clients-container">
      <h2><Users size={32} /> Gestion des clients</h2>
      {/* Client Form */}
      <form onSubmit={handleSubmit} className="client-form">
        <div className="form-row">
          <div className="form-group">
            <label>Numéro de série</label>
            <input
              type="text"
              name="N_serie"
              value={client.N_serie}
              onChange={handleChange}
              placeholder="Auto-généré si vide"
            />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              name="nom"
              value={client.nom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              name="prenom"
              value={client.prenom}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>CIN</label>
            <input
              type="text"
              name="CIN"
              value={client.CIN}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Adresse</label>
            <input
              type="text"
              name="adresse"
              value={client.adresse}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Date de naissance</label>
            <input
              type="date"
              name="date_nais"
              value={client.date_nais ? client.date_nais.slice(0, 10) : ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="tel"
              value={client.tel}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Date d'inscription</label>
            <input
              type="date"
              name="date_inscription"
              value={client.date_inscription ? client.date_inscription.slice(0, 10) : ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Prix (DH)</label>
            <input
              type="number"
              name="Prix"
              value={client.Prix}
              onChange={handleChange}
              step="0.01"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Durée (heures)</label>
            <input
              type="number"
              name="Duree"
              value={client.Duree}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Type de code</label>
            <select
              name="Type_Code"
              value={client.Type_Code}
              onChange={handleChange}
            >
              {codeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Statut</label>
            <select
              name="Statut"
              value={client.Statut}
              onChange={handleChange}
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label>Type de Permis</label>
            <div className="checkbox-options">
              {permisOptions.map(option => (
                <label key={option} className="checkbox-label">
                  <input
                    type="radio"
                    name="type_permis"
                    value={option}
                    checked={client.type_permis === option}
                    onChange={handleChange}
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>Documents fournis</label>
            <div className="checkbox-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="photos"
                  checked={client.photos}
                  onChange={handleChange}
                />
                <span>Photos</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="carte_id"
                  checked={client.carte_id}
                  onChange={handleChange}
                />
                <span>Carte d'identité</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="contrat"
                  checked={client.contrat}
                  onChange={handleChange}
                />
                <span>Contrat</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="visite_medicale"
                  checked={client.visite_medicale}
                  onChange={handleChange}
                />
                <span>Visite médicale</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Photo</label>
            <div className="file-upload-container">
              <label className="file-upload-label">
                <input
                  type="file"
                  name="photo"
                    onChange={(e) => {
                      handleChange(e);
                      handleImageUpload(e);
                    }}
                  accept="image/*"
                  className="file-input"
                />
                {client.photo ? 'Changer la photo' : 'Choisir une photo'}
              </label>
              <div className="photo-preview">
                {client.photo && typeof client.photo === 'object' ? (
                  <img src={URL.createObjectURL(client.photo)} alt="Aperçu" className="preview-image" />
                ) : client.image_url ? (
                  <img src={client.image_url} alt="Aperçu" className="preview-image" />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {editingId ? 'Mettre à jour' : 'Ajouter'} Client
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setEditingId(null);
                setClient({
                  N_serie: '',
                  nom: '',
                  prenom: '',
                  CIN: '',
                  adresse: '',
                  date_nais: '',
                  tel: '',
                  type_permis: '',
                  date_inscription: '',
                  Prix: '',
                  Duree: 20,
                  Type_Code: 'code karim',
                  Statut: 'en cours',
                  photo: null,
                  photos: false,
                  carte_id: false,
                  contrat: false,
                  visite_medicale: false,
                });
              }}
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Clients Table */}
      <div className="clients-table-container">
        <div className="table-header">
          <h3>Liste des Clients ({clients.length})</h3>
          <div className="table-controls">
            <div className="search-box">
              <Search className="search-icon" size={18} color="#888" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, CIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="tous">Tous les statuts</option>
                <option value="en cours">En cours</option>
                <option value="réussi">Réussi</option>
              </select>
            </div>
          </div>
        </div>

        {clients.length > 0 ? (
          <div className="table-wrapper">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>CIN</th>
                  <th>Adresse</th>
                  <th>Date Naissance</th>
                  <th>Téléphone</th>
                  <th>Permis</th>
                  <th>Date Inscription</th>
                  <th>Prix</th>
                  <th>Durée</th>
                  <th>Type Code</th>
                  <th>Documents</th>
                  <th>Statut</th>
                  <th>Photo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.N_serie} className={`status-${client.Statut}`}>
                    <td>{client.N_serie}</td>
                    <td>{client.nom}</td>
                    <td>{client.prenom}</td>
                    <td>{client.CIN}</td>
                    <td>{client.adresse}</td>
                    <td>{new Date(client.date_nais).toLocaleDateString('fr-FR')}</td>
                    <td>{client.tel}</td>
                    <td>{client.type_permis}</td>
                    <td>{new Date(client.date_inscription).toLocaleDateString('fr-FR')}</td>
                    <td>{client.Prix} DH</td>
                    <td>{client.Duree} heures</td>
                    <td>{client.Type_Code}</td>
                    <>
                      <DocumentSection client={client} />
                    </>
                    <td
                      style={{
                        backgroundColor:
                          client.Statut === 'réussi' ? '#008000' : // Light green
                          client.Statut === 'en cours' ? '#fff4e5' : 'transparent', // Light orange
                        color:
                          client.Statut === 'réussi' ? '#2e7d32' : // Dark green
                          client.Statut === 'en cours' ? '#f57c00' : 'inherit', // Orange
                        fontWeight: 600,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        boxShadow: '0 0 5px rgba(0,0,0,0.05)',
                        width: '100px',
                        margin: 'auto',
                      }}
                    >
                      {client.Statut}
                    </td>


                    <td>
                      {client.photo ? (
                        <img
                          src={client.photo}
                          alt="Client"
                          className="client-photo"
                        />
                      ) : (
                        <span className="no-photo">-</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => {
                          setEditingId(client.N_serie);
                          setClient({...client,
                            image_url: client.photo || "",
                          });
                        }}
                        className="btn btn-edit"
                        title="Modifier"
                      >
                        <Edit size={20} color="#ffffff" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.N_serie)}
                        className="btn btn-delete"
                        title="Supprimer"
                      >
                        <Trash2 size={20} color="#ffffff" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-clients">
            {clients.length === 0
              ? "Aucun client enregistré"
              : "Aucun résultat trouvé"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;