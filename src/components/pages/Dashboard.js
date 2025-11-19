// src/components/Dashboard.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import "./css/Dashboard.css";
import { Users, Wallet, Calendar} from "lucide-react";
import { ActiveLinkContext } from "../context/ActiveLinkContext";





const paymentsData = [
  { name: 'Lun', amount: 400 },
  { name: 'Mar', amount: 600 },
  { name: 'Mer', amount: 200 },
  { name: 'Jeu', amount: 800 },
  { name: 'Ven', amount: 500 },
  { name: 'Sam', amount: 100 },
  { name: 'Dim', amount: 50 },
];

const examData = [
  { name: 'Code', value: 15 },
  { name: 'Conduite', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F'];

const Dashboard = () => {
    const [chartData, setChartData] = useState([]);
    const today = new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const { setActiveLink } = useContext(ActiveLinkContext);
    const [clientStats, setClientStats] = useState({ totalClients: 0, monthlyClients: 0 });
    const [paiementStats, setPaiementStats] = useState({ weeklyPayments: 0, todayPayments: 0 });
    const [examStats, setExamStats] = useState({ weeklyExams: 0 });


    useEffect(() => {
    // Clients
    fetch('http://localhost:5000/api/stats/clients')
        .then(res => res.json())
        .then(data => setClientStats(data))
        .catch(err => console.error(err));

    // Paiements
    fetch('http://localhost:5000/api/stats/paiements')
        .then(res => res.json())
        .then(data => setPaiementStats(data))
        .catch(err => console.error(err));

    // Examens
    fetch('http://localhost:5000/api/stats/examens')
        .then(res => res.json())
        .then(data => setExamStats(data))
        .catch(err => console.error(err));
    }, []);
    useEffect(() => {
        fetch("http://localhost:5000/api/stats/clientsPermonth")
            .then(res => res.json())
            .then(data => setChartData(data))
            .catch(err => console.error("Erreur:", err));
    }, []);




    const handleQuickLinkClick = (link) => {
        setActiveLink(link);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Bonjour <span className="waving-hand">👋</span></h1>
                <p className="date-display">Aujourd'hui : {today}</p>
            </header>

            <div className="stats-grid">
                {/* Statistics Cards */}
                <div className="stat-card clients-card">
                    <div className="stat-icon"><Users size={32} /></div>
                    <div className="stat-content">
                        <h3>Clients</h3>
                        <p className="stat-value">{clientStats.totalClients}</p>
                        <p className="stat-change">+{clientStats.monthlyClients} ce mois</p>
                    </div>
                </div>

                <div className="stat-card payments-card">
                    <div className="stat-icon"><Wallet size={32} /></div>
                    <div className="stat-content">
                        <h3>Paiements</h3>
                        <p className="stat-value">{paiementStats.weeklyPayments}</p>
                        <p className="stat-change">+{paiementStats.todayPayments} aujourd'hui</p>
                    </div>
                </div>

                <div className="stat-card exams-card">
                    <div className="stat-icon"><Calendar size={32} /></div>
                    <div className="stat-content">
                        <h3>Examens</h3>
                        <p className="stat-value">{examStats.weeklyExams}</p>
                        <p className="stat-change">Cette semaine</p>
                    </div>
                </div>

            </div>

            {/* Charts Section */}
            <div className="charts-container">
                <div className="chart-card">
                    <h2>Nouveaux clients par mois</h2>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false}/>
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="clients" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h2>Paiements cette semaine</h2>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={paymentsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="amount" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h2>Répartition des examens</h2>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={examData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {examData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Links Section */}
            <section className="quick-links">
                <h2>Accès rapide</h2>
                <div className="links-grid">
                    <Link
                        to="/clients"
                        className="quick-link"
                        onClick={() => handleQuickLinkClick('clients')}
                    >
                        <span className="link-icon"><Users size={32} /></span>
                        <span className="link-text">Gérer les clients</span>
                    </Link>
                    <Link
                        to="/paiements"
                        className="quick-link"
                        onClick={() => handleQuickLinkClick('paiements')}
                    >
                        <span className="link-icon"><Wallet size={32} /></span>
                        <span className="link-text">Enregistrer un paiement</span>
                    </Link>
                    <Link
                        to="/examens"
                        className="quick-link"
                        onClick={() => handleQuickLinkClick('examens')}
                    >
                        <span className="link-icon"><Calendar size={32} /></span>
                        <span className="link-text">Planifier un examen</span>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;