//
// This file was generated using TON Labs developer tools.
//

const abi = {
  "ABI version": 1,
  "functions": [
    {
      "name": "constructor",
      "inputs": [],
      "outputs": []
    },
    {
      "name": "sendTransaction",
      "inputs": [
        {"name": "dest", "type": "address"},
        {"name": "value", "type": "uint128"},
        {"name": "bounce", "type": "bool"}
      ],
      "outputs": []
    }
  ],
  "events": [],
  "data": []
};

const pkg = {
  abi,
  imageBase64: 'te6ccgECGwEABOkAAgE0BgEBAcACAgPPIAUDAQHeBAAD0CAAQdgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAIo/wAgwAH0pCBYkvSg4YrtU1gw9KAJBwEK9KQg9KEIABCgAAAACjDbMAIBIA0KAc7/f/79AW1haW5fZXh0ZXJuYWwhjkr++QFjaGVja1NpZ27VIMcBjhL++gFjaGVja1NpZ24yITEx2zDgIIECANch1wv/IvkBIiL5EPKo/voBY2hlY2tTaWduMyIDXwPbMNgg0x/TPzMgCwGcjoDYjkL+/gFtYWluX2V4dGVybmFsMv74AXR2bV9qdW1wIiL++QF0dm1fanVtcDDxQAH+/gFtYWluX2V4dGVybmFsM18I2zDggHzy8F8IDAD8/vsBcmVwbGF5X3Byb3RwcO1E0Mgh9AQzAfQAIYEAgNdFmiHTP9M/NF4ANTOWgggbd0Az4iMluSX4I4ED6KgloLmwjiQkzws/Is8LPyHPFiDJ7VT+/AFyZXBsYXlfcHJvdDJ/BV8F2zDg/vwBcmVwbGF5X3Byb3QzcAVfBdswAgEgFA4CAnMQDwAPtD9xA5htmEABCbQaZuzAEQH6/vgBYzRfdG9fYzftR+1E0PQFb4wg7Vf++QFjNF90b19jNzAw/vkBc2VuZGVyX3BraHWhYHAhf7qOF2h0oWDVIMcBs5oggQIA1yHXC/8z3l8C3v76AXNlbmRlcl9wazMgMTGAZO1HbxGAQPQOk9P/0ZFw4rry4GT4APpAASASAfzXCwHDAo40IPpCIG8QwAOOI8h0zwsCIW8SzwoHIW8TIYEBACLXSaHPQDIgIs4yIcnQNF8ClHDy4GTiMN4gMQHTf9IAMCHCACL++wFnZXRfYmFsYW5jZfgnbxC5sPLgZSIiInD++wFhY190cmFuc2Zlcshyz0AizwoAcc9A+CgTAHjPFiTPFiP6AnHPQHD6AnD6AoBAz0D4I88LH3LPQCDJIvsA/v8BYWNfdHJhbnNmZXJfZW5kXwVfA3Bq2zACAUgZFQEJuIkAJ1AWAfr+/QFjb25zdHJfcHJvdF8wcHCCCBt3QO1E0CD0BDI0IIEAgNdFjhLTPwEz0z8BMiBx10WUgHvy8N7eyCQB9AAjzws/Is8LP3HPQSHPFiDJ7VT+/QFjb25zdHJfcHJvdF8xXwUA+AD++AFjNF90b19jN+1H7UTQ9AVvjCDtVxcB8P75AWM0X3RvX2M3MDAw/vkBbXlfcHVia2V57UTQIPQEMnAhgED0DvLgZNP/ASHRbTL+/QFteV9wdWJrZXlfZW5kIARfBMjL/4Bk7UdvEYBA9EPtRwFvUe1X/vgBYzdfdG9fYzTtRND0AcjtR28RAfQAIc8WIMntVBgAIv75AWM3X3RvX2M0MF8CcGoAAeLccP79AW1haW5faW50ZXJuYWwi/vwBZ2V0X3NyY19hZGRyINBz1yH+/QFnZXRfc3JjX2FkZHIw0wABMTEixwCOLyDAAI4l/vgBdHZtX2p1bXAighBcfuIH/vkBdHZtX2p1bXAw8UABXwbbMOBfBtsw4BoAsv7+AW1haW5faW50ZXJuYWwxItMfNCHAAY4g/vgBdHZtX2p1bXAgev75AXR2bV9qdW1wMPFAAV8H2zDg/vgBdHZtX2p1bXAjIf75AXR2bV9qdW1wMPFAAV8H',
};

class WalletContract {
  /**
   * @param {TONClient} client
   * @param {string} address can be null if contract will be deployed
   * @param {TONKeyPairData} keys
   */
  constructor(client, address, keys) {
    this.client = client;
    this.address = address;
    this.keys = keys;
    this.package = pkg;
    this.abi = abi;
  }

  /**
   */
  async deploy() {
    if (!this.keys) {
      this.keys = await this.client.crypto.ed25519Keypair();
    }
    this.address = (await this.client.contracts.deploy({
      package: pkg,
      constructorParams: {},
      initParams: {},
      keyPair: this.keys,
    })).address;
  }

  /**
   * @param {string} functionName
   * @param {object} input
   * @return {Promise.<object>}
   */
  async run(functionName, input) {
    const result = await this.client.contracts.run({
      address: this.address,
      functionName,
      abi,
      input,
      keyPair: this.keys,
    });
    return result.output;
  }

  /**
   * @param {string} functionName
   * @param {object} input
   * @return {Promise.<object>}
   */
  async runLocal(functionName, input) {
    const result = await this.client.contracts.runLocal({
      address: this.address,
      functionName,
      abi,
      input,
      keyPair: this.keys,
    });
    return result.output;
  }

  /**
   * @param {object} params
   * @param {string} params.dest (address)
   * @param {uint128} params.value
   * @param {bool} params.bounce
   */
  sendTransaction(params) {
    return this.run('sendTransaction', params);
  }

  /**
   * @param {object} params
   * @param {string} params.dest (address)
   * @param {uint128} params.value
   * @param {bool} params.bounce
   */
  sendTransactionLocal(params) {
    return this.runLocal('sendTransaction', params);
  }

}

WalletContract.package = pkg;

module.exports = WalletContract;
