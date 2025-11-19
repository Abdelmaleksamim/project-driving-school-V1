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
router.get("/stats/clientsPermonth", (req, res) => {
    const sql = `
        SELECT
        MONTH(date_inscription) AS month,
        COUNT(*) AS total
        FROM Client
        GROUP BY MONTH(date_inscription)
        ORDER BY MONTH(date_inscription);
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        const formatted = results.map((r) => ({
        name: months[r.month - 1],
        clients: r.total,
        }));

        res.json(formatted);
    });
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
router.get('/stats/paymentsThisWeek', (req, res) => {
    const sql = `
        SELECT
            DATE(date_paiement) AS date,
            SUM(montant) AS totalAmount
        FROM paiements
        WHERE date_paiement >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(date_paiement)
        ORDER BY DATE(date_paiement);
    `;

    db.query(sql, (err, results) => {
        if (err) {console.log("SQL ERROR:", err);
            return res.status(500).json({ error: "Database error" })};
        const days = ["Lun", "Mar", "Mer", "Jeu", "Van", "Sam", "Dim"];

        const formatted = results.map((r) => {
            const dateObj = new Date(r.date);
            return {
                name: days[dateObj.getDay()],
                amount: r.totalAmount,
            };
        });

        res.json(formatted);
    });
});

// Compter les examens passés cette semaine (lundi à dimanche)
router.get('/stats/examens', async (req, res) => {
    try {
        const [[{ thisMonthExams }]] = await db.promise().query(`
                    SELECT COUNT(*) AS thisMonthExams
                    FROM examens
                    WHERE MONTH(date_examen) = MONTH(CURDATE())
                    AND YEAR(date_examen) = YEAR(CURDATE())
        `);

        res.json({ thisMonthExams });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/stats/examsLast15Days", (req, res) => {
    const sql = `
            SELECT type_examen AS type, COUNT(*) AS total
            FROM examens
            WHERE date_examen BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
            GROUP BY type_examen;
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        const formatted = results.map(r => ({
            name: r.type,
            value: r.total
        }));

        res.json(formatted);
    });
});



module.exports = router;