const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

/*
Usage:
Call `node client/index` from the root of the project to run it without arguments.
Then it'll default to check the name "Brad Reinger", a valid name.

--name <name> Pass the name to be checked
--verbose     Enable verbose output

Examples:
$ node client/index --name "Phil Murray"
$ node client/index --name "Spongebob Squarepants" --verbose
 */

async function main() {
  // let myName = "NakamotoNomad"; // invalid example
  let myName = "Brad Reinger"; // valid example
  let verbose = false;

  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name') {
      myName = args[i + 1];
    } else if (args[i] === '--verbose') {
      verbose = true;
    }
  }

  const merkleTree = new MerkleTree(niceList);
  const root = merkleTree.getRoot();

  if (verbose) {
    console.log("Created merkle tree with root: " + root);
  }

  const index = niceList.findIndex(n => n === myName);
  const myProof = merkleTree.getProof(index);

  if (verbose) {
    console.log("Created proof: " + JSON.stringify(myProof));
  }

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    name: myName,
    proof: myProof
  });

  console.log({ gift });
}

main();