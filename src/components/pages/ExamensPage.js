import React, { useState, useEffect } from 'react';
import '../pages/css/ClientsPage.css';

const ExamensPage = () => {

    function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-CA'); // Format YYYY-MM-DD
    }
  // Exam states
  const [exam, setExam] = useState({
    nomPrenom: '',
    type_examen: '',
    date_examen: '',
    result: '',
    date_ratt: '',
    N_serie: ''
  });

  const [exams, setExams] = useState([]);
  const [nextExamId, setNextExamId] = useState(1);
  const [editingExamId, setEditingExamId] = useState(null);
  const [examSearchTerm, setExamSearchTerm] = useState('');

  // Filter exams
  const filteredExams = exams.filter(exam => {
    const searchLower = examSearchTerm.toLowerCase();
    return (
      exam.nomPrenom.toLowerCase().includes(searchLower) ||
      exam.N_serie.toLowerCase().includes(searchLower) ||
      exam.type_examen.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
  if (exam.N_serie.trim()) {
    fetch(`http://localhost:5000/api/examens/client-info/${exam.N_serie}`)
      .then(res => {
        if (!res.ok) throw new Error('Client not found');
        return res.json();
      })
      .then(data => {
        setExam(prev => ({ ...prev, nomPrenom: data.nom_complet }));
      })
      .catch(err => {
        setExam(prev => ({ ...prev, nomPrenom: '' }));
        console.log(err.message);
      });
  } else {
    setExam(prev => ({ ...prev, nomPrenom: '' }));
  }
}, [exam.N_serie]);

  // Exam handlers
  const handleExamChange = (e) => {
    const { name, value } = e.target;
    setExam(prev => ({ ...prev, [name]: value }));
  };

  const handleExamSubmit = async (e) => {
  e.preventDefault();

  const isEditing = editingExamId !== null;

  const url = isEditing
    ? `http://localhost:5000/api/examens/${editingExamId}`
    : 'http://localhost:5000/api/examens';

  const method = isEditing ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        N_serie: exam.N_serie,
        type_examen: exam.type_examen,
        date_examen: exam.date_examen,
        result: exam.result,
        date_ratt: exam.date_ratt
      })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erreur lors de l’enregistrement');
    }

    const data = await response.json();

    if (isEditing) {
      setExams(prev =>
        prev.map(e =>
          e.id_examen === editingExamId
            ? { ...e, ...exam }
            : e
        )
      );
      setEditingExamId(null);
    } else {
      const newExam = {
        id_examen: nextExamId,
        ...exam,
        nomPrenom: `${data.nom} ${data.prenom}`
      };
      setExams([...exams, newExam]);
      setNextExamId(nextExamId + 1);
    }

    // Reset form
    setExam({
      nomPrenom: '',
      type_examen: '',
      date_examen: '',
      result: '',
      date_ratt: '',
      N_serie: ''
    });

  } catch (err) {
    alert(err.message);
    console.error(err);
  }
};

  useEffect(() => {
  const fetchExams = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/examens');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des examens');
      }
      const data = await response.json();
      setExams(data);
      if (data.length > 0) {
        setNextExamId(data[0].id_examen + 1);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  fetchExams();
  }, []);



  const handleEditExam = (id) => {
    const examToEdit = exams.find(e => e.id_examen === id);
    if (examToEdit) {
      setExam(examToEdit);
      setEditingExamId(id);
    }
  };

  const handleDeleteExam = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/examens/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de la suppression');
      }

      // Mise à jour de l'état local après suppression réussie
      setExams(prev => prev.filter(e => e.id_examen !== id));

      // Réinitialiser le formulaire si on supprimait l'examen en cours d'édition
      if (editingExamId === id) {
        setEditingExamId(null);
        setExam({
          nomPrenom: '',
          type_examen: '',
          date_examen: '',
          result: '',
          date_ratt: '',
          N_serie: ''
        });
      }
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };


  return (
    <div className="examens-container">
      <h2>📝 Gestion des Examens</h2>
            {/* Exam Section */}
      <section className="section">
        {/* Exam Form */}
        <form onSubmit={handleExamSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Numéro de série</label>
              <input
                type="text"
                name="N_serie"
                value={exam.N_serie}
                onChange={handleExamChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nom + Prénom</label>
              <input
                type="text"
                name="nomPrenom"
                value={exam.nomPrenom}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Type d'examen</label>
              <select
                name="type_examen"
                value={exam.type_examen}
                onChange={handleExamChange}
                required
              >
                <option value="">Sélectionner</option>
                <option value="Code">Code</option>
                <option value="Pratique">Pratique</option>
                <option value="Rattrapage">Rattrapage</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date d'examen</label>
              <input
                type="date"
                name="date_examen"
                value={exam.date_examen}
                onChange={handleExamChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Résultat</label>
              <select
                name="result"
                value={exam.result}
                onChange={handleExamChange}
              >
                <option value="">Sélectionner</option>
                <option value="Reussi">Réussi</option>
                <option value="echoui">Échoué</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date de rattrapage</label>
              <input
                type="date"
                name="date_ratt"
                value={exam.date_ratt}
                onChange={handleExamChange}
                disabled={!(exam.result === 'echoui' && exam.type_examen !== 'Rattrapage')}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingExamId ? 'Modifier Examen' : 'Ajouter Examen'}
            </button>
            {editingExamId && (
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => {
                  setEditingExamId(null);
                  setExam({
                    nomPrenom: '',
                    type_examen: '',
                    date_examen: '',
                    result: '',
                    date_ratt: '',
                    N_serie: ''
                  });
                }}
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        {/* Exams Table */}
        <div className="table-container">
          <div className="table-header">
            <h4>Liste des Examens</h4>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Rechercher par nom, type ou numéro..."
                value={examSearchTerm}
                onChange={(e) => setExamSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
          
          {filteredExams.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Examen</th>
                  <th>Nom + Prénom</th>
                  <th>Type examen</th>
                  <th>Date examen</th>
                  <th>Résultat</th>
                  <th>Date rattrapage</th>
                  <th>N° série</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map(ex => (
                  <tr key={ex.id_examen}>
                    <td>{ex.id_examen}</td>
                    <td>{ex.nomPrenom}</td>
                    <td>{ex.type_examen}</td>
                    <td>{formatDate(ex.date_examen)}</td>
                    <td>{ex.result}</td>
                    <td>{formatDate(ex.date_ratt) || '-'}</td>
                    <td>{ex.N_serie}</td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEditExam(ex.id_examen)}
                          className="btn btn-edit"
                        >
                          ✏️ Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteExam(ex.id_examen)}
                          className="btn btn-delete"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">
              {exams.length === 0 ? "Aucun examen enregistré" : "Aucun résultat trouvé"}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExamensPage;