const router = require('express').Router();
const Accounts = require('./accounts-model');
const {
  checkAccountId,
  checkAccountNameUnique,
  checkAccountPayload,
} = require('./accounts-middleware');

router.get('/', async (req, res, next) => {
  try {
    const accounts = await Accounts.getAll(req.query);
    res.json(accounts);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', checkAccountId, (req, res) => {
  res.json(req.account);
});

router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try {
    const account = await Accounts.create(req.body);
    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', checkAccountId, checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try {
    const account = await Accounts.updateById(req.params.id, req.body);
    res.json(account);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', checkAccountId, async (req, res, next) => {
  try {
    const account = await Accounts.deleteById(req.params.id);
    res.json(account);
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => { // eslint-disable-line
  console.error(err);
  res.status(500).json({ message: 'server error' });
});

module.exports = router;
