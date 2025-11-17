const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const multer = require('multer');

const Storage = multer.memoryStorage();
const upload = multer({ storage: Storage });


router.post('/add', upload.single('photo'), clientController.addClient);
router.put('/update/:N_serie', upload.single('photo'), clientController.updateClient);
router.delete('/delete/:N_serie', clientController.deleteClient);
router.get('/all', clientController.getAllClients);
router.get('/filter', clientController.filterClients);


router.get('/status', clientController.filterByStatut);



module.exports = router;