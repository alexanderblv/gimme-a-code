# SP1 Integration for "Gimme a Code" Game

This is a Rust-based backend that integrates [SP1](https://docs.succinct.xyz/docs/sp1/introduction) zero-knowledge proofs with the "Gimme a Code" game. SP1 is a high-performance zkVM (zero-knowledge virtual machine) that allows us to create cryptographic proofs of game results.

## What is SP1?

SP1 (Succinct Processor 1) is a zero-knowledge virtual machine that can prove the execution of arbitrary Rust programs. It allows us to:

1. Prove that a specific computation was performed correctly
2. Keep parts of the computation private
3. Verify the proof efficiently

## How SP1 is Used in the Game

In "Gimme a Code," SP1 is used to:

1. Record and validate player actions (clicks and key presses)
2. Generate a cryptographic proof of the game score
3. Allow the score to be verified without revealing the specific player actions

## Project Structure

- `sp1back/src/lib.rs` - Main library with SP1 integration
- `sp1back/src/main.rs` - Program that runs inside the SP1 zkVM
- `sp1back/build.rs` - Build script to compile the SP1 program
- `src/sp1-bridge.js` - JavaScript bridge between the game and SP1 backend

## How It Works

1. During gameplay, player actions are recorded via the SP1 bridge
2. When the game ends, these actions are used as private inputs to generate a proof
3. The proof guarantees that the score was calculated correctly according to game rules
4. Anyone can verify this proof without seeing the player's specific actions

## Technical Implementation

The SP1 integration consists of two main parts:

1. **RISC-V Program**: Written in Rust, this program runs inside the SP1 zkVM and calculates the score based on player actions.

2. **Proof Generation/Verification**: This code handles generating and verifying proofs of the game execution.

## Usage

To build and run the SP1 backend:

```bash
cd sp1back
cargo build
```

In a production environment, you would then set up a server to process proof generation requests from the game client. For development and testing, we use a simulated bridge in JavaScript.

## Security Benefits

By using SP1, we gain:

1. **Tamper-proof scores**: Players cannot manipulate their scores
2. **Verifiable results**: Game results can be cryptographically verified
3. **Privacy**: Player actions remain private, only the final score is public

## Requirements

- Rust (with the `succinct` toolchain)
- SP1 SDK

## Learn More

- [SP1 Documentation](https://docs.succinct.xyz/docs/sp1/introduction)
- [Zero-Knowledge Proofs](https://blog.succinct.xyz/introducing-sp1/)

## License

MIT 