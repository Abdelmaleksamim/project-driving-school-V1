const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const upload = require('../middleware/upload');

router.post('/add', upload.single('photo'), clientController.addClient);
router.delete('/delete/:N_serie', clientController.deleteClient);
router.get('/all', clientController.getAllClients);
router.get('/filter', clientController.filterClients);
router.get('/status', clientController.filterByStatut);
router.put('/update/:N_serie', upload.single('photo'), clientController.updateClient);



module.exports = router;