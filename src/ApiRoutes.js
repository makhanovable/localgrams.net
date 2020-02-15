let router = require('express').Router();
let walletController = require('./WalletController');

router.get('/', function (req, res) {
  res.json({
    status: 'API is Working',
    message: 'Welcome to Gram Core',
  });
});

router.post('/wallet/new', walletController.new);
router.get('/wallet/balance', walletController.balance);
router.post('/wallet/transfer', walletController.transfer);

module.exports = router;