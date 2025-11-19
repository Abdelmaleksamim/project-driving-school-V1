import React, { useState } from 'react';
import './css/LoginPage.css';
import logo from '../assets/logoAutoecole.jpg';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
            try{
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();

                if(!response.ok) {
                    setShake(true);
                    setTimeout(() => setShake(false), 500);
                    alert(data.error || "Email ou mot de passe incorrect");
                }
                else {
                    alert("Vous êtes connecté avec succès!");
                    localStorage.setItem('token', data.token);
                    navigate('/dashboard');
                }
            } catch (error) {
                alert('Erreur de connexion au serveur');
                console.error("Erreur : ",error);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="login-container">
                <div className="login-left">
                    <div className="login-left-content">
                        <img src={logo} alt="Logo Auto-École" className="logo" />
                        <h1>Auto-École AZIZ HASSOUNI</h1>
                        <p>Gérez vos clients, examens, paiements et plus encore avec notre plateforme intuitive.</p>
                        <div className="features">
                            <div className="feature-item">
                                <span className="feature-icon">📋</span>
                                Gestion des élèves
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">📅</span>
                                Planification des cours
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">💰</span>
                                Suivi des paiements
                            </div>
                        </div>
                    </div>
                </div>
                <div className="login-right">
                    <div className={`login-form-container ${shake ? 'shake' : ''}`}>
                        <h2>Bienvenue</h2>
                        <p className="login-subtitle">Connectez-vous à votre compte</p>
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@autoecole.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">Mot de passe</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="forgot-password">
                                <a href="#forgot">Mot de passe oublié ?</a>
                            </div>
                            
                            <button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="spinner"></span>
                                ) : 'Se connecter'}
                            </button>
                        </form>
                        <div className="divider">
                            <span>ou</span>
                        </div>
<button
  className="secondary-button"
  onClick={() => {
    window.open(
      'https://mail.google.com/mail/?view=cm&to=abdelmaleksamim100@gmail.com',
      '_blank'
    );
  }}
>
  Contactez le support
</button>



                    </div>

                    <div className="footer">
                        <p>© 2025 Auto-École AZIZ HASSOUNI. Tous droits réservés. réalisé par abdelmalek samim "abdelmaleksamim100@gmail.com"</p>
                    </div>
                </div>
            </div>
    );
}

export default LoginPage;
