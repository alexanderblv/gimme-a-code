use serde::{Deserialize, Serialize};
use sp1::prelude::*;

// Define the public values that will be output by our program
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct GamePublicValues {
    pub score: u32,
    pub timestamp: u64,
    pub game_id: String,
}

// Define the private values that will be input to our program
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GamePrivateValues {
    pub player_id: String,
    pub game_actions: Vec<GameAction>,
}

// Represent different actions a player can take in the game
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum GameAction {
    Click { x: u32, y: u32, timestamp: u64 },
    KeyPress { key_code: u32, timestamp: u64 },
}

// The main SP1 program that will run in the zkVM
pub fn game_program(private_values: GamePrivateValues) -> GamePublicValues {
    // In a real implementation, we would validate game actions and calculate the score
    // For now, we'll use a simple calculation based on the number of actions
    
    let mut score = 0;
    let mut latest_timestamp = 0;
    
    // Calculate score based on actions
    for action in &private_values.game_actions {
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
    let game_id = format!("{}_{}", private_values.player_id, latest_timestamp);
    
    GamePublicValues {
        score,
        timestamp: latest_timestamp,
        game_id,
    }
}

// The ELF binary is embedded in the library at compile time
pub const ELF: &[u8] = include_bytes!(concat!(env!("OUT_DIR"), "/sp1_program.elf"));

// Functions to generate and verify proofs
pub fn generate_proof(private_values: GamePrivateValues) -> Vec<u8> {
    let mut runtime = Runtime::new();
    let elf = Elf::from_bytes(ELF).unwrap();
    
    // Serialize the private values
    let private_values_bytes = serde_json::to_vec(&private_values).unwrap();
    
    // Generate the proof
    let proof = runtime.prove(elf, private_values_bytes).unwrap();
    
    // Return the serialized proof
    proof.to_bytes()
}

pub fn verify_proof(proof: Vec<u8>) -> Result<GamePublicValues, String> {
    let mut runtime = Runtime::new();
    let proof = Proof::from_bytes(&proof).map_err(|e| e.to_string())?;
    
    // Verify the proof
    let verified = runtime.verify(proof.clone()).map_err(|e| e.to_string())?;
    
    if !verified {
        return Err("Proof verification failed".to_string());
    }
    
    // Extract the public values from the proof
    let public_values = proof.public_values();
    let public_values: GamePublicValues = serde_json::from_slice(public_values)
        .map_err(|e| format!("Failed to deserialize public values: {}", e))?;
    
    Ok(public_values)
}

// Include tests module
#[cfg(test)]
mod tests; 