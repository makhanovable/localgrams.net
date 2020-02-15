let WalletContract = require('./contract/WalletContract');
const {TONClient} = require('ton-client-node-js');
let client = null;

(async () => {
  try {
    console.log("Starting connecting to TON Blockchain...");
    client = new TONClient();
    client.config.setData({
      servers: ['https://us-east-1.large.testnet.ton.dev']
    });

    await client.setup();
    console.log("Connected to TON Blockchain");
  } catch (error) {
    console.error(error);
  }
})();

exports.new = async function (req, res) {
  if (client) {
    const keys = await client.crypto.ed25519Keypair();
    const futureWalletAddress = (await client.contracts.createDeployMessage({
      package: WalletContract.package,
      constructorParams: {},
      keyPair: keys,
    })).address;

    const addressInBase64 = await client.contracts.convertAddress({
      address: futureWalletAddress,
      convertTo: 'Base64',
      base64Params: {
        test: false, //TODO test flag
        bounce: true,
        url: true,
      },
    });

    await res.json({
      code: 200,
      message: 'Wallet Created but not initialized',
      data: {
        balance: 0,
        state: 0, // uninit
        public_key: keys.public,
        private_key: keys.secret,
        address: addressInBase64.address
      }
    });
  } else {
    await res.json({
      code: 500,
      message: 'Not connected to TON',
      data: null
    });
  }
};

exports.balance = async function (req, res) {
  if (client) {
    let address = req.query.address;
    if (address != null) {
      const addressInHex = await client.contracts.convertAddress({
        address: address,
        convertTo: 'Hex',
      });

      const accounts = await client.queries.accounts.query({
        id: {eq: addressInHex.address}
      }, 'balance acc_type');

      let balance = 0;
      let state = 0;
      if (accounts.length === 0) {
        console.log('There is no such wallet with address = ' + address);
      } else {
        balance = parseInt(accounts[0].balance, 16);
        state = accounts[0].acc_type;
        console.log('Balance = ' + balance + ", state = " + state + ", address = " + address);
      }

      await res.json({
        code: 200,
        message: 'Wallet balance',
        data: {
          state: state,
          balance: balance
        }
      });
    } else {
      await res.json({
        code: 500,
        message: 'Empty address',
        data: null
      });
    }
  } else {
    await res.json({
      code: 500,
      message: 'Not connected to TON',
      data: null
    });
  }
};

exports.transfer = async function (req, res) {
  if (client) {
    const sender_public = req.body.sender_public;
    const sender_private = req.body.sender_private;
    const sender_address = req.body.sender_address;
    const dest_address = req.body.dest_address;
    const amount = req.body.amount;

    try {

      if (sender_public != null && sender_private != null && sender_address != null &&
        dest_address != null && amount != null && amount > 0) {
        console.log('<------------------------------------------------------------------------------------->');
        console.log(sender_public);
        console.log(sender_private);
        console.log(sender_address);
        console.log(dest_address);
        console.log(amount);
        console.log('<------------------------------------------------------------------------------------->');

        const senderAddressInHex = await client.contracts.convertAddress({
          address: sender_address,
          convertTo: 'Hex',
        });

        const destAddressInHex = await client.contracts.convertAddress({
          address: dest_address,
          convertTo: 'Hex',
        });

        const existingKeys = {
          secret: sender_private,
          public: sender_public
        };

        console.log('getting state...');
        const accounts = await client.queries.accounts.query({
          id: {eq: senderAddressInHex.address}
        }, 'acc_type');

        let state = 0;
        console.log('state is got');
        if (accounts.length === 0) {
          console.log('trying to deploy wallet 0');
          // const deployedResponse = await deployWallet(existingKeys);
          // console.log('Deployed at = ' + deployedResponse.address);
          await res.json({
            code: 500,
            message: 'Cant init wallet cause not enough grams or maybe keys incorrect',
            transaction: null
          });
          return
        } else {
          state = accounts[0].acc_type;
          if (state === 0) {
            try {
              console.log('trying to deploy');
              const deployedResponse = await deployWallet(existingKeys);
              console.log('Deployed at = ' + deployedResponse.address);
            } catch (e) {
              console.log(e);
              console.log('Error on deploying');
              await res.json({
                code: 500,
                message: 'Cant init wallet, cause maybe keys incorrect',
                transaction: null
              });
              return
            }
          }
        }
        if (state === 2) {
          await res.json({
            code: 500,
            message: 'Wallet is frozen',
            transaction: null
          });
        } else {
          try {
            console.log('starting transfering');
            console.log(existingKeys);
            console.log(senderAddressInHex.address);
            console.log(destAddressInHex.address);
            const transactionResponse = await transfer(existingKeys, senderAddressInHex.address,
              destAddressInHex.address, amount);

            console.log("grams transfered, transactionId = " + transactionResponse.transaction.id);
            await res.json({
              code: 200,
              message: 'Success',
              transaction: transactionResponse.transaction.id
            });
          } catch (e) {
            console.error(e);
            await res.json({
              code: 500,
              message: 'Some error occurred',
            });
          }
        }
      } else {
        await res.json({
          code: 401,
          message: 'Some fields are empty or amout is less than 0',
        });
      }
    } catch (e) {
      await res.json({
        code: 500,
        message: 'Some error occurred',
      });
    }
  } else {
    await res.json({
      code: 500,
      message: 'Not connected to TON',
    });
  }
};

async function deployWallet(existingKeys) {
  return await client.contracts.deploy({
    package: WalletContract.package,
    constructorParams: {},
    keyPair: existingKeys,
  });
}

async function transfer(existingKeys, senderAddressInHex, destAddressInHex, amount) {
  return await client.contracts.run({
    address: senderAddressInHex,
    abi: WalletContract.package.abi,
    functionName: 'sendTransaction',
    input: {
      dest: destAddressInHex,
      value: amount,
      bounce: true,
    },
    keyPair: existingKeys,
  });
}