use serde::{Deserialize, Serialize};
use std::vec::Vec;

// The same structs as in lib.rs
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GamePublicValues {
    pub score: u32,
    pub timestamp: u64,
    pub game_id: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GamePrivateValues {
    pub player_id: String,
    pub game_actions: Vec<GameAction>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum GameAction {
    Click { x: u32, y: u32, timestamp: u64 },
    KeyPress { key_code: u32, timestamp: u64 },
}

// This is the entry point for the SP1 program
fn main() {
    // Get the private input
    let private_input = sp1_zkvm::io::read_input::<GamePrivateValues>();
    
    // Perform our game logic
    let mut score = 0;
    let mut latest_timestamp = 0;
    
    // Calculate score based on actions
    for action in &private_input.game_actions {
        match action {
            GameAction::Click { timestamp, .. } => {
                score += 10;
                if *timestamp > latest_timestamp {
                    latest_timestamp = *timestamp;
                }
            },
            GameAction::KeyPress { timestamp, .. } => {
                score += 5;
                if *timestamp > latest_timestamp {
                    latest_timestamp = *timestamp;
                }
            }
        }
    }
    
    // Generate a unique game ID based on player ID and timestamp
    let game_id = format!("{}_{}", private_input.player_id, latest_timestamp);
    
    // Construct the public output
    let public_output = GamePublicValues {
        score,
        timestamp: latest_timestamp,
        game_id,
    };
    
    // Write the public output
    sp1_zkvm::io::write_public_output(&public_output);
} 