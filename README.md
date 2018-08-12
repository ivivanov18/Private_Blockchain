# PRIVATE BLOCKCHAIN

## Description

This is a an implementation of a private blockchain. All the code can be found in the file `simpleChain.js`.
The program can:

- instantiate a Blockchain class and persist the Genesis Block (first block of the given blockchain) in the LevelDB database
- add new subsequent blocks to the blockchain and persist them in the database
- get the block height of the blockchain
- get a block for a given block height
- validate a block
- validate the whole chain

## Data Model

### Class `Block`

Class that is represents every block and the information it contains, in the blockchain.

```javascript
{   "hash" = "<SHA256 hash of the block>",
    "height" = "<can be considered as the number of the block>",
    "body" = "<data in the block>"),
    "time" = "<timestamp of the creation of the block>",
    "previousBlockHash" = "<hash of the previous block>"
}
```

### Class `Blockchain`

Class that represents the blockchain. The class provides with the following functionalities:

- Persist blockchain data using LevelDB (level library)
- Add new blocks to the blockchain
- Get blocks from the blockchain
- Get block height from the blockchain
- Validate a single block
- Validate the blockchain (multiple blocks)

### Database

The information of the blockchain is stored in a key-value database - LevelDB.
The information representing an individual is stored the following way:

- `key`= `block height` (starts at 0 for the Genesis block (first block))
- `value` = `string representing the block information`

## How to run

- Clone the project using: `git clone https://github.com/ivivanov18/Private_Blockchain.git`
- Run the command `npm install` to install the dependencies
- Run the program `node simpleChain.js`

## To improve

- Refactor the code to separate the implementation of the Block, Blockchain, and code for testing in different files
