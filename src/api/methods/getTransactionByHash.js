const { Tx } = require('leap-core');
const txResponse = require('./txResponse');

module.exports = async (db, hash) => {
  const txDoc = await db.getTransaction(hash);
  if (!txDoc) return null; // return null as Infura does

  const { txData, blockHash, height, txPos } = txDoc;
  return await txResponse(db, Tx.fromJSON(txData), blockHash, height, txPos); // eslint-disable-line no-return-await
};
