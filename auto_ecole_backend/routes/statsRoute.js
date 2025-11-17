const express = require('express');
const router = express.Router();
const db = require('../config/db');

// stats client
router.get('/stats/clients', async (req, res) => {
    try {
        // Total clients
        const [[{ totalClients }]] = await db.promise().query(`
            SELECT COUNT(*) AS totalClients FROM Client
        `);

        // Clients added this month
        const [[{ monthlyClients }]] = await db.promise().query(`
            SELECT COUNT(*) AS monthlyClients
            FROM Client
            WHERE MONTH(date_inscription) = MONTH(CURDATE())
            AND YEAR(date_inscription) = YEAR(CURDATE())
        `);

        res.json({
            totalClients,
            monthlyClients
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Paiements cette semaine et aujourd'hui
router.get('/stats/paiements', async (req, res) => {
    try {
        // Paiements cette semaine (lundi à dimanche)
        const [[{ weeklyPayments }]] = await db.promise().query(`
            SELECT COUNT(*) AS weeklyPayments
            FROM paiements
            WHERE YEARWEEK(date_paiement, 1) = YEARWEEK(CURDATE(), 1)
        `);

        // Paiements aujourd'hui
        const [[{ todayPayments }]] = await db.promise().query(`
            SELECT COUNT(*) AS todayPayments
            FROM paiements
            WHERE DATE(date_paiement) = CURDATE()
        `);

        res.json({
            weeklyPayments,
            todayPayments
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/stats/examens', async (req, res) => {
    try {
        // Compter les examens passés cette semaine (lundi à dimanche)
        const [[{ weeklyExams }]] = await db.promise().query(`
            SELECT COUNT(*) AS weeklyExams
            FROM examens
            WHERE YEARWEEK(date_examen, 1) = YEARWEEK(CURDATE(), 1)
        `);

        res.json({ weeklyExams });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;