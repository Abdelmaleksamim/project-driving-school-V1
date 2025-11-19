import React, { useState, useEffect } from 'react';
import './css/PaiementsPage.css';

const PaiementsPage = () => {

    const [payments, setPayments] = useState([]);
    const [losses, setLosses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [lossSearchTerm, setLossSearchTerm] = useState('');
    const [editingPaymentId, setEditingPaymentId] = useState(null);
    const [editingLossId, setEditingLossId] = useState(null);

    function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-CA'); // Format YYYY-MM-DD
    }
  // Payment states
    const [payment, setPayment] = useState({
        date_paiement: '',
        nom: '',
        prenom: '',
        montant: '',
        N_serie: ''
    });


    // Loss states
    const [loss, setLoss] = useState({
        id_perte: '',
        date_perte: '',
        montant: '',
        nom_perte: ''
    });



    // Filter payments
    const filteredPayments = payments.filter(payment => {
        const searchLower = searchTerm.toLowerCase();
        return (
        payment.nom.toLowerCase().includes(searchLower) ||
        payment.prenom.toLowerCase().includes(searchLower)
        );
    });

    // Filter losses
    const filteredLosses = losses.filter(loss => {
        const searchLower = lossSearchTerm.toLowerCase();
        return (
        loss.nom_perte.toLowerCase().includes(searchLower) ||
        loss.date_perte.includes(lossSearchTerm)
        );
    });

    const fetchPaiements = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/paiements');
        const data = await response.json();

        if (response.ok) {
        setPayments(data); // stocke les paiements dans un state
        } else {
        console.error("Erreur lors du chargement des paiements");
        }
    } catch (error) {
        console.error("Erreur fetch paiements:", error);
    }
    };

    // useEffect pour charger nom et prénom selon N_serie
    useEffect(() => {
        const fetchClientInfo = async () => {
            if (payment.N_serie.trim().length === 0) return;

            try {
                const response = await fetch(`http://localhost:5000/api/paiements/client/${payment.N_serie}`);
                const data = await response.json();

                if (response.ok) {
                    setPayment(prev => ({
                        ...prev,
                        nom: data.nom,
                        prenom: data.prenom
                    }));
                } else {
                    setPayment(prev => ({
                        ...prev,
                        nom: '',
                        prenom: ''
                    }));
                }
            } catch (err) {
                console.error('Erreur:', err);
            }
        };

        fetchClientInfo();
    }, [payment.N_serie]);

    useEffect(() => {
        const fetchPaiements = async () => {
            try {
            const response = await fetch('http://localhost:5000/api/paiements');
            const data = await response.json();

            if (response.ok) {
                setPayments(data); // met à jour le state
            } else {
                alert('Erreur lors du chargement des paiements.');
            }
            } catch (error) {
            console.error('Erreur fetch paiements:', error);
            }
        };

        fetchPaiements();
        }, []);

    // Payment handlers
    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPayment(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentSubmit = async (e) => {
    e.preventDefault();
      console.log("Données à envoyer:", payment);

    try {
        const response = editingPaymentId
        ? await fetch(`http://localhost:5000/api/paiements/${editingPaymentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date_paiement: payment.date_paiement,
                montant: payment.montant,
            }),
            })
        : await fetch(`http://localhost:5000/api/paiements/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payment),
            });
        const data = await response.json();

        if (response.ok) {
        alert(data.message || "Paiement enregistré.");
        setEditingPaymentId(null);
        setPayment({
            date_paiement: '',
            nom: '',
            prenom: '',
            montant: '',
            N_serie: '',
        });
        fetchPaiements(); // recharge la liste
        } else {
        alert(data.message || "Erreur");
        }
    } catch (err) {
        console.error("Erreur:", err);
    }
    };

    const handleDeletePayment = async (id) => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce paiement ?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/paiements/${id}`, {
            method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
            alert(data.message);
            fetchPaiements(); // recharge la liste
            } else {
            alert(data.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("Erreur suppression paiement:", error);
        }
    };

    //fetchLosses
    const fetchLosses = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/pertes');
        const data = await res.json();
        setLosses(data);
    } catch (err) {
        console.error("Erreur lors du chargement des pertes:", err);
    }
    };


    useEffect(() => {
    fetchLosses();
    }, []);




    // Loss handlers
    const handleLossChange = (e) => {
        const { name, value } = e.target;
        setLoss(prev => ({ ...prev, [name]: value }));
    };
    const handleEditLoss = (loss) => {
        setLoss({
            date_perte: formatDate(loss.date_perte),
            montant: loss.montant,
            nom_perte: loss.nom_perte,
        });
        setEditingLossId(loss.id_perte);
    };

    const handleLossSubmit = async (e) => {
    e.preventDefault();

    try {
        const url = editingLossId
        ? `http://localhost:5000/api/pertes/${editingLossId}`
        : 'http://localhost:5000/api/pertes/add';

        const method = editingLossId ? 'PUT' : 'POST';

        const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date_perte: loss.date_perte || new Date().toISOString().split('T')[0],
            montant: loss.montant,
            nom_perte: loss.nom_perte,
        }),
        });

        if (response.ok) {
        const message = editingLossId ? "Perte modifiée" : "Perte ajoutée";
        console.log(`${message} avec succès`);

        // Rafraîchir les pertes
        fetchLosses();

        // Réinitialiser le formulaire
        setLoss({
            date_perte: '',
            montant: '',
            nom_perte: '',
        });
        setEditingLossId(null);
        } else {
        const error = await response.json();
        console.error("Erreur:", error.message);
        }
    } catch (error) {
        console.error("Erreur réseau:", error);
    }
    };

    const handleDeleteLoss = async (id) => {
    if (!window.confirm("Confirmer la suppression de cette perte ?")) return;

    try {
        const res = await fetch(`http://localhost:5000/api/pertes/${id}`, {
        method: 'DELETE',
        });

        if (res.ok) {
        console.log("Perte supprimée");
        fetchLosses();
        } else {
        const error = await res.json();
        console.error("Erreur:", error.message);
        }
    } catch (error) {
        console.error("Erreur réseau:", error);
    }
    };


    return (
        <div className="paiements-container">
        <h2>💰 Gestion Financière</h2>
        {/* Payments Section */}
        <section className="section">
            <h3>Paiements</h3>
            {/* Payment Form */}
            <form onSubmit={handlePaymentSubmit} className="form">
            <div className="form-row">
                <div className="form-group">
                <label>Date de Paiement</label>
                <input
                    type="date"
                    name="date_paiement"
                    value={payment.date_paiement}
                    onChange={handlePaymentChange}
                />
                </div>
                <div className="form-group">
                <label>Numéro de série</label>
                <input
                    type="text"
                    name="N_serie"
                    value={payment.N_serie}
                    onChange={handlePaymentChange}
                    required
                />
                </div>
                <div className="form-group">
                <label>Nom</label>
                <input
                    type="text"
                    name="nom"
                    value={payment.nom}
                    readOnly
                />
                </div>
                <div className="form-group">
                <label>Prénom</label>
                <input
                    type="text"
                    name="prenom"
                    value={payment.prenom}
                    readOnly
                />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                <label>Montant (DH)</label>
                <input
                    type="number"
                    name="montant"
                    value={payment.montant}
                    onChange={handlePaymentChange}
                    required
                />
                </div>

                <div className="form-group">
                <button type="submit" className="btn btn-primary">
                    {editingPaymentId ? 'Modifier Paiement' : 'Ajouter Paiement'}
                </button>
                {editingPaymentId && (
                    <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => {
                        setEditingPaymentId(null);
                        setPayment({
                        date_paiement: '',
                        nom: '',
                        prenom: '',
                        montant: '',
                        N_serie: ''
                        });
                    }}
                    >
                    Annuler
                    </button>
                )}
                </div>
            </div>
            </form>

            {/* Payments Table */}
            <div className="table-container">
            <div className="table-header">
                <h4>Liste des Paiements</h4>
                <div className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher par nom ou prénom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
                </div>
            </div>

            {filteredPayments.length > 0 ? (
                <div className="table-responsive">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Montant</th>
                        <th>N° Série</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPayments.map(p => (
                        <tr key={p.id_paiement}>
                        <td>{p.id_paiement}</td>
                        <td>{formatDate(p.date_paiement)}</td>
                        <td>{p.nom}</td>
                        <td>{p.prenom}</td>
                        <td>{p.montant} DH</td>
                        <td>{p.N_serie}</td>
                        <td className="actions-cell">
                            <button onClick={() => {
                                setEditingPaymentId(p.id_paiement);
                                setPayment({
                                    date_paiement: formatDate(p.date_paiement),
                                    nom: p.nom,
                                    prenom: p.prenom,
                                    montant: p.montant,
                                    N_serie: p.N_serie,
                                });
                            }} className='btn btn-edit'>
                            ✏️
                            </button>
                            <button
                            onClick={() => handleDeletePayment(p.id_paiement)}
                            className="btn btn-delete"
                            >
                            🗑️
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            ) : (
                <p className="no-data">
                {payments.length === 0 ? "Aucun paiement enregistré" : "Aucun résultat trouvé"}
                </p>
            )}
            </div>
        </section>

        {/* Losses Section */}
        <section className="section">
            <h3>Pertes</h3>

            {/* Loss Form */}
            <form onSubmit={handleLossSubmit} className="form">
            <div className="form-row">
                <div className="form-group">
                <label>Date</label>
                <input
                    type="date"
                    name="date_perte"
                    value={loss.date_perte}
                    onChange={handleLossChange}
                />
                </div>

                <div className="form-group">
                <label>Montant (DH)</label>
                <input
                    type="number"
                    name="montant"
                    value={loss.montant}
                    onChange={handleLossChange}
                    required
                />
                </div>

                <div className="form-group">
                <label>Type de perte</label>
                <input
                    type="text"
                    name="nom_perte"
                    value={loss.nom_perte}
                    onChange={handleLossChange}
                    required
                />
                </div>

                <div className="form-group">
                <button type="submit" className="btn btn-secondary">
                    {editingLossId ? 'Modifier Perte' : 'Ajouter Perte'}
                </button>
                {editingLossId && (
                    <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => {
                        setEditingLossId(null);
                        setLoss({
                        date: '',
                        montant: '',
                        type: ''
                        });
                    }}
                    >
                    Annuler
                    </button>
                )}
                </div>
            </div>
            </form>

            {/* Losses Table */}
            <div className="table-container">
            <div className="table-header">
                <h4>Liste des Pertes</h4>
                <div className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher par type ou date..."
                    value={lossSearchTerm}
                    onChange={(e) => setLossSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
                </div>
            </div>

            {filteredLosses.length > 0 ? (
                <div className="table-responsive">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredLosses.map(l => (
                        <tr key={l.id_perte}>
                        <td>{l.id_perte}</td>
                        <td>{formatDate(l.date_perte)}</td>
                        <td>{l.montant} DH</td>
                        <td>{l.nom_perte}</td>
                        <td className="actions-cell">
                            <button
                            onClick={() => handleEditLoss(l)}
                            className="btn btn-edit"
                            >
                            ✏️
                            </button>
                            <button
                            onClick={() => handleDeleteLoss(l.id_perte)}
                            className="btn btn-delete"
                            >
                            🗑️
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            ) : (
                <p className="no-data">
                {losses.length === 0 ? "Aucune perte enregistrée" : "Aucun résultat trouvé"}
                </p>
            )}
            </div>
        </section>
        </div>
    );
};

export default PaiementsPage;