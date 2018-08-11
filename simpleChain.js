/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require("crypto-js/sha256");

//const LevelDB = require("./levelSandbox");

const level = require("level");
const chainDB = "./blockchaindata";
const db = level(chainDB);

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    (this.hash = ""),
      (this.height = 0),
      (this.body = data),
      (this.time = 0),
      (this.previousBlockHash = "");
  }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  /**
   * @todo check whether genesis block exists
   */
  constructor() {
    this.chain = [];
    this.addBlock(new Block("First block in the chain - Genesis block"));
  }

  // Add new block
  addBlock(newBlock) {
    // Block height
    newBlock.height = this.chain.length;
    // UTC timestamp
    newBlock.time = new Date()
      .getTime()
      .toString()
      .slice(0, -3);
    // previous block hash
    if (this.chain.length > 0) {
      newBlock.previousBlockHash = this.chain[this.chain.length - 1].hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    console.log(JSON.stringify(newBlock));
    // Adding block object to chain

    this.chain.push(newBlock);

    addBlockToDB(newBlock.height, JSON.stringify(newBlock))
      .then(function() {
        return getBlockFromDB(newBlock.height);
      })
      .then(function(value) {
        console.log("GOT: ", value);
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  // Get block height
  getBlockHeight() {
    return this.chain.length - 1;
  }

  // get block
  getBlock(blockHeight) {
    // return object as a single string
    return JSON.parse(JSON.stringify(this.chain[blockHeight]));
  }

  // validate block
  validateBlock(blockHeight) {
    // get block object
    let block = this.getBlock(blockHeight);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = "";
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash === validBlockHash) {
      return true;
    } else {
      console.log(
        "Block #" +
          blockHeight +
          " invalid hash:\n" +
          blockHash +
          "<>" +
          validBlockHash
      );
      return false;
    }
  }

  // Validate blockchain
  validateChain() {
    let errorLog = [];
    for (var i = 0; i < this.chain.length - 1; i++) {
      // validate block
      if (!this.validateBlock(i)) errorLog.push(i);
      // compare blocks hash link
      let blockHash = this.chain[i].hash;
      let previousHash = this.chain[i + 1].previousBlockHash;
      if (blockHash !== previousHash) {
        errorLog.push(i);
      }
    }
    if (errorLog.length > 0) {
      console.log("Block errors = " + errorLog.length);
      console.log("Blocks: " + errorLog);
    } else {
      console.log("No errors detected");
    }
  }
}

/**
 *
 * @param {*} key
 * @param {*} value
 */
const addBlockToDB = (key, value) => {
  return db.put(key, value);
};

/**
 *
 * @param {*} key
 */
const getBlockFromDB = key => {
  return db.get(key);
};

/**
 *
 */
const getBlockHeightFromDB = () => {
  let height = -1;

  db.createReadStream()
    .on("data", function(data) {
      height++;
      console.log(data.key, "=", data.value);
    })
    .on("error", function(err) {
      console.log("Oh my!", err);
    })
    .on("close", function() {
      console.log("Stream closed");
    })
    .on("end", function() {
      console.log("Stream ended");
      console.log("HEIGHT: ", height);
      return height;
    });
};

blockchain = new Blockchain();
block2 = new Block("Second Block");
blockchain.addBlock(block2);
blockchain.addBlock(new Block("Third Block"));
blockchain.addBlock(new Block("Fourth Block"));
blockchain.addBlock(new Block("Fifth Block"));
blockchain.addBlock(new Block("Sixth Block"));
blockchain.addBlock(new Block("Seventh Block"));

getBlockHeightFromDB();
