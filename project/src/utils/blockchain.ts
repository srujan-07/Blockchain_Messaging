import SHA256 from 'crypto-js/sha256';

export class BlockChain {
  chain: Block[];
  difficulty: number;
  pendingMessages: Message[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingMessages = [];
  }

  createGenesisBlock(): Block {
    return {
      index: 0,
      timestamp: Date.now(),
      messages: [],
      previousHash: "0",
      hash: "0",
      nonce: 0
    };
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  addMessage(message: Message): void {
    this.pendingMessages.push(message);
  }

  minePendingMessages(): void {
    const block = {
      index: this.chain.length,
      timestamp: Date.now(),
      messages: this.pendingMessages,
      previousHash: this.getLatestBlock().hash,
      hash: "",
      nonce: 0
    };

    block.hash = this.calculateHash(block);
    this.chain.push(block);
    this.pendingMessages = [];
  }

  calculateHash(block: Block): string {
    return SHA256(
      block.index +
      block.previousHash +
      block.timestamp +
      JSON.stringify(block.messages) +
      block.nonce
    ).toString();
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

export const blockchain = new BlockChain();