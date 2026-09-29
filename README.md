# Blockchain Playground

An interactive, single-file simulator that teaches how blockchain transactions work. Send tokens between people, mine blocks with real SHA-256 hashing, then try to cheat and watch the chain catch you.

No install, no server, no wallet. Just open `index.html` in a browser.

## Features

- **Guided lessons:** a coach bar gives one instruction at a time and highlights where to click. Six lessons, with a skip button and a sandbox mode.
- **Drag-and-drop payments:** drag one person onto another, or tap two people (works on touch screens). A slider keeps the amount within what the sender can spend.
- **Animated flow:** coins fly from sender to mempool, then from the new block to the receiver.
- **Live mining:** watch the hash change with every nonce, with leading zeros highlighted and a progress bar against the expected number of tries.
- **Adjustable difficulty:** 1 to 4 leading zeros, with the odds shown next to the slider.
- **Tamper demo:** edit any amount inside a block and see the red ripple along the chain. Re-mine each broken block to repair it.
- **Learning aids:** a glossary (hash, nonce, mempool, proof of work, signature, block), a play-by-play log and popup messages.
- **Accessible:** keyboard support, visible focus, and animations switch off for users who prefer reduced motion.

## How to run

1. Open `simulator/index.html` by double-clicking it (any modern browser: Chrome, Edge, Firefox, Safari).
2. That's it. It works offline.

## How to use

1. **Start:** the genesis block is mined automatically and gives starting balances: Alice 100, Bob 50, Carol 25, Dave 0.
2. **Pick a sender and receiver:** drag one person's card onto another, or tap one and then the other.
3. **Choose an amount:** use the slider, then press **Sign and send**. The payment enters the mempool. Balances do not change yet.
4. **Mine:** set the difficulty, then press **Mine block**. The miner searches for a nonce that gives a hash starting with enough zeros.
5. **Confirmation:** the block joins the chain, and balances update.
6. **Try overspending:** press **Try overspending** in the payment panel to see the network reject it.
7. **Cheat:** click an amount inside an old block and change it. That block and every later block turn red, and mining is blocked.
8. **Repair:** press **Re-mine** on each red block, earliest first, until the badge shows *Chain valid*. Finish with a mine at difficulty 4.

**Start over** resets the simulation at any time.

## Concepts demonstrated

| Concept | Where you see it |
|---|---|
| Transactions and signatures | Sending a payment creates a signed entry in the mempool |
| Mempool | The dashed box of pending payments |
| Proof of work | The miner box: guessing nonces until the hash meets the target |
| Difficulty | The slider; each extra zero makes mining 16 times harder |
| Blocks and hash links | The chain view, where each block stores the previous block's hash |
| Immutability | Editing a block breaks its hash and every later link |
| Double-spend protection | Overspending is rejected using confirmed balance minus pending payments |

## How it works

- **Hashing:** `sha256()` is a small hand-written implementation, checked against a standard library, so the page works offline without any dependencies.
- **Block hash:** `sha256(index | previousHash | JSON(transactions) | nonce)`.
- **Mining:** tries nonce 0, 1, 2 and so on, 150 per animation frame so the search is visible, until the hash starts with `"0"` repeated *difficulty* times.
- **Balances:** never stored. They are recomputed by replaying every transaction in the chain, so the ledger is the single source of truth.
- **Validation:** on every render, each block's hash is recomputed and compared with the stored value (contents check), and its `prev` value is compared with the recomputed hash of the block before it (link check). This is why an edit turns later blocks red too.
- **Signatures:** a simplified stand-in, `sha256(secret + from + to + amount + counter)`.

## What is simplified

- One miner instead of a competing network (no consensus or forks)
- Signatures are hash-based, not real public-key cryptography
- No mining rewards, transaction fees or Merkle trees
- No peer-to-peer networking

The companion ERC-20 token in this project is the real smart-contract implementation. This simulator explains the underlying ideas.

## Customising

All settings are near the top of the `<script>` in `index.html`:

| Change | Edit |
|---|---|
| People, avatars, starting balances | `NAMES`, `AV`, `START` |
| Glossary text | `GLOSS` |
| Lessons and their completion checks | `LESSONS` |
| Mining speed (tries per frame) | the `150` inside `mine()` |
| Maximum difficulty | the `max` attribute of the `#diff` slider (4 is the practical limit for the average laptop) |

## Troubleshooting

- **Mining seems slow at difficulty 4:** it needs about 65,000 tries on average and can take several seconds. Lower the difficulty, or increase the tries-per-frame number.
- **"Miners refuse to build on a broken chain":** you edited a block. Re-mine the red blocks, or press Start over.
- **Drag-and-drop does nothing on a phone:** touch screens don't support dragging cards. Tap the sender, then the receiver.
- **Animations are missing:** your system has *reduce motion* turned on. The simulator respects that setting.

## Files

```
simulator/
  index.html   the whole app (HTML, CSS and JavaScript in one file)
  README.md    this file
```
