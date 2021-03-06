/* eslint-disable no-underscore-dangle, global-require */

describe('readConfig', () => {
  jest.mock('fs');
  jest.mock('web3');
  jest.mock('leap-core');

  const fs = require('fs');
  fs.readFile = jest.fn((_, cb) => {
    cb(
      null,
      JSON.stringify({
        exitHandlerAddr: '0x000',
        network: 'testnet',
      })
    );
  });

  const Web3 = require('web3');
  const readConfig = require('./readConfig');

  test('from file', async () => {
    Web3.__setMethodMock('getConfig');

    const result = await readConfig('./config.json');
    expect(result).toEqual({
      exitHandlerAddr: '0x000',
      network: 'testnet',
    });
  });

  test('fetch node config', async () => {
    Web3.__setMethodMock('getConfig', {
      exitHandlerAddr: '0x000',
      network: 'testnet',
    });
    const result = await readConfig('https://tesnet.leapdao.org');
    expect(result).toEqual({
      exitHandlerAddr: '0x000',
      network: 'testnet',
    });
  });

  test('without bridge address', async () => {
    Web3.__setMethodMock('getConfig', {
      network: 'testnet',
    });
    let error;
    try {
      await readConfig('https://tesnet.leapdao.org');
    } catch (err) {
      error = err.message;
    }
    expect(error).toBe('exitHandlerAddr is required');
  });

  test("append donor's peer", async () => {
    Web3.__setMethodMock('getConfig', {
      exitHandlerAddr: '0x000',
      network: 'testnet',
      p2pPort: 41000,
      nodeId: 'blahblah',
    });
    const result = await readConfig('https://tesnet.leapdao.org');
    expect(result).toEqual({
      exitHandlerAddr: '0x000',
      network: 'testnet',
      peers: ['blahblah@tesnet.leapdao.org:41000'],
    });
  });
});
