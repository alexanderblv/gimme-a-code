/**
 * SP1 Badge Component
 * 
 * This component displays the SP1 verification status badge.
 */

// Import required styles
const SP1_BADGE_STYLES = `
.sp1-badge {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #2a0060, #6600cc);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 0 15px rgba(102, 0, 204, 0.4);
  transition: all 0.3s ease;
}

.sp1-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(102, 0, 204, 0.6);
}

.sp1-badge-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #00FFD1;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: sp1-pulse 2s infinite;
}

.sp1-badge-verified .sp1-badge-icon {
  background: #00FFD1;
}

.sp1-badge-pending .sp1-badge-icon {
  background: #FFAA00;
}

.sp1-badge-failed .sp1-badge-icon {
  background: #FF3366;
}

.sp1-badge-details {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #6600cc;
  border-radius: 8px;
  padding: 15px;
  color: white;
  font-family: 'Inter', sans-serif;
  width: 260px;
  z-index: 1001;
  box-shadow: 0 0 20px rgba(102, 0, 204, 0.5);
  display: none;
}

.sp1-badge-details.active {
  display: block;
  animation: fade-in 0.3s forwards;
}

.sp1-badge-details h3 {
  color: #00FFD1;
  font-family: 'Orbitron', sans-serif;
  margin-top: 0;
  font-size: 16px;
}

.sp1-badge-details-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 6px;
}

.sp1-badge-details-label {
  color: #999;
}

.sp1-badge-details-value {
  color: #00FFD1;
  font-family: 'Orbitron', sans-serif;
}

@keyframes sp1-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 209, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(0, 255, 209, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 209, 0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

/**
 * Initialize SP1 Badge in the DOM
 * @param {Object} options - Configuration options
 */
function initSP1Badge(options = {}) {
  // Add styles
  const styleElement = document.createElement('style');
  styleElement.textContent = SP1_BADGE_STYLES;
  document.head.appendChild(styleElement);

  // Create badge element
  const badge = document.createElement('div');
  badge.className = 'sp1-badge sp1-badge-pending';
  badge.innerHTML = `
    <div class="sp1-badge-icon"></div>
    <span>SP1 Verified</span>
  `;
  document.body.appendChild(badge);

  // Create details panel
  const details = document.createElement('div');
  details.className = 'sp1-badge-details';
  details.innerHTML = `
    <h3>SP1 Verification Details</h3>
    <div class="sp1-badge-details-row">
      <span class="sp1-badge-details-label">Status:</span>
      <span class="sp1-badge-details-value" id="sp1-status">Pending</span>
    </div>
    <div class="sp1-badge-details-row">
      <span class="sp1-badge-details-label">Proof ID:</span>
      <span class="sp1-badge-details-value" id="sp1-proof-id">-</span>
    </div>
    <div class="sp1-badge-details-row">
      <span class="sp1-badge-details-label">Generated:</span>
      <span class="sp1-badge-details-value" id="sp1-timestamp">-</span>
    </div>
  `;
  document.body.appendChild(details);

  // Toggle details panel on badge click
  badge.addEventListener('click', () => {
    details.classList.toggle('active');
  });

  // Close details panel when clicking outside
  document.addEventListener('click', (event) => {
    if (!badge.contains(event.target) && !details.contains(event.target)) {
      details.classList.remove('active');
    }
  });

  return {
    /**
     * Update badge status
     * @param {string} status - 'verified', 'pending', or 'failed'
     * @param {Object} data - Additional data to display
     */
    updateStatus: (status, data = {}) => {
      // Remove all status classes
      badge.classList.remove('sp1-badge-verified', 'sp1-badge-pending', 'sp1-badge-failed');
      
      // Add the appropriate status class
      badge.classList.add(`sp1-badge-${status}`);
      
      // Update details panel
      const statusElement = document.getElementById('sp1-status');
      const proofIdElement = document.getElementById('sp1-proof-id');
      const timestampElement = document.getElementById('sp1-timestamp');
      
      if (statusElement) {
        statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      }
      
      if (proofIdElement && data.proofId) {
        proofIdElement.textContent = data.proofId;
      }
      
      if (timestampElement && data.timestamp) {
        const date = new Date(data.timestamp);
        timestampElement.textContent = date.toLocaleTimeString();
      }
    }
  };
}

export { initSP1Badge }; 