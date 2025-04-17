/**
 * SP1 Game Integration Module
 * 
 * This module integrates SP1 proof generation and verification with the game mechanics.
 */

import { initSP1, generateProof, verifyResult } from './sp1Integration.js';
import { initSP1Badge } from './SP1Badge.js';

let sp1Badge;
let isInitialized = false;
let currentProof = null;

/**
 * Initialize SP1 integration for the game
 * @returns {Promise<boolean>} - Whether initialization was successful
 */
async function initializeSP1Game() {
  if (isInitialized) return true;
  
  try {
    // Initialize SP1 system
    const sp1Initialized = await initSP1();
    
    if (sp1Initialized) {
      // Initialize SP1 badge component
      sp1Badge = initSP1Badge();
      sp1Badge.updateStatus('pending', { timestamp: Date.now() });
      
      isInitialized = true;
      console.log('SP1 game integration initialized');
      return true;
    } else {
      console.error('Failed to initialize SP1 game integration');
      return false;
    }
  } catch (error) {
    console.error('Error initializing SP1 game integration:', error);
    return false;
  }
}

/**
 * Process game results with SP1
 * @param {Object} gameData - Game result data
 * @returns {Promise<Object>} - Processed result with SP1 verification
 */
async function processGameResult(gameData) {
  if (!isInitialized) {
    await initializeSP1Game();
  }
  
  try {
    // Update badge status
    if (sp1Badge) {
      sp1Badge.updateStatus('pending', { timestamp: Date.now() });
    }
    
    // Generate proof for game result
    const proof = await generateProof(gameData);
    currentProof = proof;
    
    // Verify the proof
    const isVerified = await verifyResult(gameData, proof);
    
    // Update badge status
    if (sp1Badge) {
      sp1Badge.updateStatus(
        isVerified ? 'verified' : 'failed',
        {
          proofId: proof.proof,
          timestamp: proof.timestamp
        }
      );
    }
    
    // Return verified result
    return {
      ...gameData,
      sp1Verified: isVerified,
      sp1Proof: proof.proof,
      sp1Timestamp: proof.timestamp
    };
  } catch (error) {
    console.error('Error processing game result with SP1:', error);
    
    // Update badge status to failed
    if (sp1Badge) {
      sp1Badge.updateStatus('failed', { timestamp: Date.now() });
    }
    
    return {
      ...gameData,
      sp1Verified: false,
      sp1Error: error.message
    };
  }
}

/**
 * Get the current SP1 verification status
 * @returns {Object} - Current verification status
 */
function getSP1VerificationStatus() {
  return {
    isInitialized,
    currentProof,
    isVerified: currentProof ? currentProof.verified : false
  };
}

// Export the SP1 game integration functions
export {
  initializeSP1Game,
  processGameResult,
  getSP1VerificationStatus
}; 