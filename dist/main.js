// pk 58902cc139c57fa5a852dd214ff97104029128b04edde448107f0404476a2d83
// eth address 0x900c7Dd5CE1c2771976AC58a8B2b53e9745bA8A8

document.addEventListener('DOMContentLoaded', function () {
  //const web3 = new Web3();
  setTimeout(() => {
    window.ethereum.on('connect', (connectInfo) => {
      console.log('on connect');
      console.log('ethereum.isConnected()', window.ethereum.isConnected());
      console.log(connectInfo);
    });
    window.ethereum.on('disconnect', (error) => {
      console.log('on disconnect');
      console.log('ethereum.isConnected()', window.ethereum.isConnected());
      console.log(error);
    });
    window.ethereum.on('accountsChanged', (accounts) => {
      console.log('on accountsChanged');
      console.log(accounts);
    });
    window.ethereum.on('chainChanged', (chainId) => {
      console.log('on chainChanged');
      console.log(chainId);
    });
  }, 500);
  let account = '';
  document
    .getElementById('eth_requestAccounts')
    .addEventListener('click', (e) => {
      e.preventDefault();
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts, b) => {
          if (!Array.isArray(accounts) || accounts.length !== 1) {
            console.error('[connect] not array of length 1');
            return;
          }
          if (accounts[0] !== '0x900c7dd5ce1c2771976ac58a8b2b53e9745ba8a8') {
            console.error(
              "[connect] accounts[0] !== '0x900c7dd5ce1c2771976ac58a8b2b53e9745ba8a8'"
            );
            return;
          }
          account = accounts[0];
          console.log('[connect] ✓ connected !');
        });
    });
  document.getElementById('eth_chainId').addEventListener('click', (e) => {
    e.preventDefault();
    window.ethereum.request({ method: 'eth_chainId' }).then((chainId) => {
      console.log('[eth_chainId] ✓', chainId);
    });
  });
  const eth_sendTransaction = document.getElementsByClassName(
    'eth_sendTransaction'
  );
  for (let i = 0; i < eth_sendTransaction.length; i += 1) {
    eth_sendTransaction[i].addEventListener('click', (e) => {
      e.preventDefault();
      const confirm = e.target.getAttribute('confirm');
      const invalid = e.target.getAttribute('invalid');
      if (invalid === 'true') {
        window.ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: account,
              },
            ],
          })
          .then((hash) => {
            console.error(
              '[eth_sendTransaction reject] ✗ should have rejected !'
            );
            console.log(hash);
          })
          .catch((err) => {
            if (err.code !== -32602) {
              console.error(
                '[eth_sendTransaction invalid] rejected but err.code !== -32602'
              );
            }
            console.log('[eth_sendTransaction] ✓ rejected !');
            console.log(err);
          });
        return;
      }
      const payload1 = {
        from: account,
        to: '0x7f847d40c3ec604fe3d4263bfdd04111eb9b4e32',
        nonce: '0xfb6e1a62d119228b',
        gasLimit: '0x33303030',
        gasPrice: '0x32303030',
        value: '0x33303030303030',
        chainId: 137,
      };
      if (confirm === 'true') {
        window.ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [payload1],
          })
          .then((hash) => {
            console.log('[eth_sendTransaction confirm] ✓ confirmed !');
            console.log(hash);
          })
          .catch((err) => {
            console.error(
              '[eth_sendTransaction confirm] ✗ should have confirmed !'
            );
            console.log(err);
          });
      } else {
        window.ethereum
          .request({
            method: 'eth_sendTransaction',
            params: [payload1],
          })
          .then((hash) => {
            console.error(
              '[eth_sendTransaction reject] ✗ should have rejected !'
            );
            console.log(hash);
          })
          .catch((err) => {
            if (err.code !== 4001) {
              console.error(
                '[eth_sendTransaction reject] rejected but err.code !== 4001'
              );
            }
            if (
              err.message !==
              'MetaMask Tx Signature: User denied transaction signature.'
            ) {
              console.error(
                '[eth_sendTransaction reject] rejected but err.message !== "MetaMask Tx Signature: User denied transaction signature."'
              );
            }
            console.log('[eth_sendTransaction reject] ✓ rejected !');
            console.log(err);
          });
      }
    });
  }
  document.getElementById('personal_sign').addEventListener('click', (e) => {
    e.preventDefault();
    window.ethereum
      .request({
        method: 'personal_sign',
        params: [web3.utils.toHex('message to sign'), account],
      })
      .then((signedMessage) => {
        if (
          signedMessage ===
          '0x4b359ec0508bd4d82e87f7e4ea27710d13b92dc16361dfdc5fa4c7b7bb506988751ce6706f2980b3d258f7524cc928ba678711b53458bb4e18b7f6faeabe9f431b'
        ) {
          console.log('[personal_sign] ✓ verified !');
        } else {
          console.error(
            "[personal_sign] ✗ invalid, message !== '0x4b359ec0508bd4...'"
          );
        }
      })
      .catch((err) => {
        console.error('[personal_sign] ✗ should have signed');
        console.log(err);
      });
  });
  document.getElementById('signTypedData_v4').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('signTypedData_v4');

    const msgParams = JSON.stringify({
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: 1,
        // Give a user friendly name to the specific contract you are signing for.
        name: 'Ether Mail',
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '1',
      },

      // Defining the message signing data content.
      message: {
        /*
         - Anything you want. Just a JSON Blob that encodes the data you want to send
         - No required fields
         - This is DApp Specific
         - Be as explicit as possible when building out the message schema.
        */
        contents: 'Hello, Bob!',
        attachedMoneyInEth: 4.2,
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'Mail',
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Not an EIP712Domain definition
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        // Refer to PrimaryType
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        // Not an EIP712Domain definition
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    });

    var from = web3.eth.accounts[0];

    var params = [account, msgParams];
    var method = 'eth_signTypedData_v4';

    web3.currentProvider.sendAsync(
      {
        method,
        params,
        from: account,
      },
      function (err, result) {
        if (err) return console.dir(err);
        if (result.error) {
          alert(result.error.message);
        }
        if (result.error) return console.error('ERROR', result);
        console.log('TYPED SIGNED:' + JSON.stringify(result.result));

        const recovered = sigUtil.recoverTypedSignature_v4({
          data: JSON.parse(msgParams),
          sig: result.result,
        });

        if (
          ethUtil.toChecksumAddress(recovered) ===
          ethUtil.toChecksumAddress(from)
        ) {
          alert('Successfully recovered signer as ' + from);
        } else {
          alert(
            'Failed to verify signer when comparing ' + result + ' to ' + from
          );
        }
      }
    );
  });
});
