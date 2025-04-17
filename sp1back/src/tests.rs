#[cfg(test)]
mod tests {
    use super::*;
    use crate::{GameAction, GamePrivateValues, game_program};
    
    #[test]
    fn test_game_program() {
        // Create a sample private input
        let private_values = GamePrivateValues {
            player_id: "player123".to_string(),
            game_actions: vec![
                GameAction::Click { x: 100, y: 200, timestamp: 1000 },
                GameAction::KeyPress { key_code: 32, timestamp: 1100 },
                GameAction::Click { x: 150, y: 250, timestamp: 1200 },
            ],
        };
        
        // Run the game program
        let public_values = game_program(private_values.clone());
        
        // Verify the results
        assert_eq!(public_values.score, 25); // 10 + 5 + 10
        assert_eq!(public_values.timestamp, 1200); // Latest timestamp
        assert_eq!(public_values.game_id, "player123_1200");
    }
    
    // In a full implementation, we would also test proof generation and verification
    // but this requires a fully set up SP1 environment
} 