const Accounts = require('./accounts-model');

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body || {};

  if (name === undefined || budget === undefined) {
    return res.status(400).json({ message: 'name and budget are required' });
  }

  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (trimmedName.length < 3 || trimmedName.length > 100) {
    return res.status(400).json({ message: 'name of account must be between 3 and 100' });
  }

  const numericBudget = budget === null || (typeof budget === 'string' && budget.trim() === '')
    ? Number.NaN
    : Number(budget);

  if (!Number.isFinite(numericBudget)) {
    return res.status(400).json({ message: 'budget of account must be a number' });
  }

  if (numericBudget < 0 || numericBudget > 1000000) {
    return res.status(400).json({ message: 'budget of account is too large or too small' });
  }

  req.body = {
    ...req.body,
    name: trimmedName,
    budget: numericBudget,
  };
  return next();
};

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const account = await Accounts.getByName(req.body.name);
    const currentId = Number(req.params.id);

    if (account && account.id !== currentId) {
      return res.status(400).json({ message: 'that name is taken' });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Accounts.getById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: 'account not found' });
    }

    req.account = account;
    return next();
  } catch (error) {
    return next(error);
  }
};
