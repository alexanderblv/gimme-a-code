# Gimme a Code - SP1-Powered Game

A coding-themed game integrated with [SP1](https://docs.succinct.xyz/docs/sp1/introduction) for cryptographic verification of game results.

## Features

- Click-based gameplay where players need to catch code elements
- Visual effects and animations for an engaging experience
- SP1 zero-knowledge proof integration for secure score verification
- Responsive design for different screen sizes

## SP1 Integration

This game features SP1 (Succinct Processor 1) integration that provides:

- Cryptographic proof of game scores
- Tamper-proof game results
- Privacy-preserving verification

The SP1 integration allows players to verify their scores without revealing their specific actions during gameplay.

## How to Run

1. Clone this repository
2. Open `index.html` in your browser to play the game
3. For the full SP1 integration, you'll need to set up the Rust backend:

```bash
cd sp1back
cargo build
```

## Game Structure

- `index.html` - Main game interface
- `src/` - JavaScript game logic and styles
  - `app.js` - Core game mechanics
  - `sp1-bridge.js` - Bridge to SP1 functionality
  - `style.css` - Game styling
- `sp1back/` - Rust backend for SP1 integration
  - `src/lib.rs` - SP1 core functionality
  - `src/main.rs` - RISC-V program for SP1 zkVM
  - `build.rs` - Build script for compiling the SP1 program

## Technologies Used

- HTML5/CSS3/JavaScript
- Rust
- SP1 zkVM (Zero-Knowledge Virtual Machine)

## About SP1

SP1 is a high-performance zero-knowledge virtual machine that can prove the execution of arbitrary Rust programs. It enables developers to create verifiable computations with privacy guarantees. Learn more at [Succinct Docs](https://docs.succinct.xyz/docs/sp1/introduction).

## License

MIT

## Screenshots

![Game Screenshot](img/screenshot.png) 