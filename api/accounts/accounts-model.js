const db = require('../../data/db-config');

const SORTABLE_COLUMNS = new Set(['id', 'name', 'budget']);

const getAll = (options = {}) => {
  const query = db('accounts');
  const requestedColumn = String(options.sortby || '').toLowerCase();
  const requestedDirection = String(options.sortdir || '').toLowerCase();

  if (requestedColumn || requestedDirection) {
    const column = SORTABLE_COLUMNS.has(requestedColumn) ? requestedColumn : 'id';
    const direction = requestedDirection === 'desc' ? 'desc' : 'asc';
    query.orderBy(column, direction);
  }

  const limit = Number.parseInt(options.limit, 10);
  if (Number.isInteger(limit) && limit > 0) {
    query.limit(limit);
  }

  return query;
};

const getById = id => db('accounts').where({ id }).first();

const getByName = name => db('accounts').where({ name }).first();

const create = async account => {
  const [id] = await db('accounts').insert(account);
  return getById(id);
};

const updateById = async (id, account) => {
  await db('accounts').where({ id }).update(account);
  return getById(id);
};

const deleteById = async id => {
  const account = await getById(id);
  await db('accounts').where({ id }).delete();
  return account;
};

module.exports = {
  getAll,
  getById,
  getByName,
  create,
  updateById,
  deleteById,
};
