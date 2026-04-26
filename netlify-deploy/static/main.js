// ============================================
// MARKETAI SUITE - MAIN JAVASCRIPT
// ============================================

const API_BASE = 'http://localhost:8000';

// ============================================
// THEME MANAGEMENT
// ============================================

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);

  showToast('Theme changed', `Switched to ${newTheme} mode`, 'success');
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// ============================================
// LOADING OVERLAY
// ============================================

function showLoading(message = 'Processing...') {
  let overlay = document.querySelector('.loading-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">${message}</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  overlay.classList.add('active');
  overlay.querySelector('.loading-text').textContent = message;
}

function hideLoading() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(title, message, type = 'info') {
  let container = document.querySelector('.toast-container');

  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================
// API HELPERS
// ============================================

async function apiCall(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return await response.json();
}

// ============================================
// CAMPAIGN GENERATOR
// ============================================

function initCampaignForm() {
  const form = document.getElementById('campaignForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const product = document.getElementById('productInput').value.trim();
    const audience = document.getElementById('audienceInput').value.trim();
    const platform = document.getElementById('platformInput').value.trim();

    if (!product || !audience || !platform) {
      showToast('Validation Error', 'Please fill in all required fields', 'error');
      return;
    }

    showLoading('Generating your campaign strategy...');

    try {
      const result = await apiCall('/api/generate_campaign', {
        product,
        audience,
        platform,
      });

      hideLoading();

      if (result.success) {
        displayOutput(result.result);
        const scoreMatch = result.result.match(/Score:\s*(\d+)\s*\/\s*100/i);
if (scoreMatch) {
  const score = parseInt(scoreMatch[1], 10);
  const gauge = document.querySelector('.score-gauge-fill');
  if (gauge) {
    gauge.style.width = `${score}%`;
  }
}

        showToast('Success', 'Campaign generated successfully!', 'success');
      } else {
        throw new Error('Failed to generate campaign');
      }
    } catch (error) {
      hideLoading();
      showToast('Error', 'Failed to generate campaign. Please try again.', 'error');
      console.error(error);
    }
  });
}

// ============================================
// PITCH GENERATOR
// ============================================

function initPitchForm() {
  const form = document.getElementById('pitchForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const product = document.getElementById('pitchProductInput').value.trim();
    const customer = document.getElementById('customerInput').value.trim();

    if (!product || !customer) {
      showToast('Validation Error', 'Please fill in all required fields', 'error');
      return;
    }

    showLoading('Crafting your sales pitch...');

    try {
      const result = await apiCall('/api/generate_pitch', {
        product,
        customer,
      });

      hideLoading();

      if (result.success) {
        displayOutput(result.result);
        showToast('Success', 'Sales pitch generated successfully!', 'success');
      } else {
        throw new Error('Failed to generate pitch');
      }
    } catch (error) {
      hideLoading();
      showToast('Error', 'Failed to generate pitch. Please try again.', 'error');
      console.error(error);
    }
  });
}

// ============================================
// LEAD SCORING
// ============================================

function initLeadScoreForm() {
  const form = document.getElementById('leadScoreForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('nameInput').value.trim();
    const budget = document.getElementById('budgetInput').value.trim();
    const need = document.getElementById('needInput').value.trim();
    const urgency = document.getElementById('urgencyInput').value.trim();

    if (!name || !budget || !need || !urgency) {
      showToast('Validation Error', 'Please fill in all required fields', 'error');
      return;
    }

    showLoading('Analyzing lead qualification...');

    try {
  const result = await apiCall('/api/score_lead', {
    name,
    budget,
    need,
    urgency,
  });

  hideLoading();

  if (result.success) {
    displayOutput(result.result);
    
    // Parse and display score visually
    const scoreMatch = result.result.match(/Score:\s*(\d+)\s*\/\s*100/i);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1], 10);
      const gauge = document.getElementById('scoreGauge');
      const scoreValue = document.getElementById('scoreValue');
      const scoreLabel = document.getElementById('scoreLabel');

      if (gauge) gauge.style.width = `${score}%`;
      if (scoreValue) scoreValue.textContent = score;
      if (scoreLabel) {
        if (score >= 90) scoreLabel.textContent = 'HOT – Call TODAY';
        else if (score >= 75) scoreLabel.textContent = 'Warm – Priority follow‑up';
        else if (score >= 60) scoreLabel.textContent = 'Lukewarm – Nurture';
        else scoreLabel.textContent = 'Cold – Low priority';
      }
    }
    
    showToast('Success', 'Lead scored successfully!', 'success');
  } else {
    throw new Error('Failed to score lead');
  }
}
 catch (error) {
      hideLoading();
      showToast('Error', 'Failed to score lead. Please try again.', 'error');
      console.error(error);
    }
  });
}

// ============================================
// OUTPUT DISPLAY
// ============================================

function displayOutput(content) {
  const outputSection = document.getElementById('outputSection');
  const outputContent = document.getElementById('outputContent');

  if (outputSection && outputContent) {
    let formatted = content
      .replace(/##\s*(Objective|Audience Insight|Content Ideas|Ad Copy|CTAs?|KPIs|Measurement)/gi, '\n\n<h3>$1</h3>')
      .replace(/##\s*(Elevator Pitch|Value Proposition|Key Differentiators|Call to Action|Follow‑Up)/gi, '\n\n<h3>$1</h3>')
      .replace(/##\s*(Score|Budget Fit|Need Match|Urgency|Conversion Probability|Recommended Actions|Risk Factors)/gi, '\n\n<h3>$1</h3>')
      .replace(/\n\n\n+/g, '\n\n')
      .replace(/\n([1-9]\.)/g, '\n• $1')
      .replace(/✅/g, '<span style="color:var(--color-success)">✅</span>');

    outputContent.innerHTML = formatted;
    outputSection.classList.remove('hidden');

    // History
    const history = JSON.parse(localStorage.getItem('mm_history') || '[]');
    const type = window.location.pathname.includes('campaign') ? 'campaign' :
                window.location.pathname.includes('pitch') ? 'pitch' : 'lead';
    history.unshift({ type, content, ts: new Date().toISOString() });
    localStorage.setItem('mm_history', JSON.stringify(history.slice(0, 10)));

    setTimeout(() => {
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}


// ============================================
// OUTPUT ACTIONS
// ============================================

function copyOutput() {
  const outputContent = document.getElementById('outputContent');
  if (outputContent) {
    navigator.clipboard
      .writeText(outputContent.textContent)
      .then(() => showToast('Copied', 'Content copied to clipboard!', 'success'))
      .catch(() => showToast('Error', 'Failed to copy content', 'error'));
  }
}

function clearForm() {
  const forms = ['campaignForm', 'pitchForm', 'leadScoreForm'];

  forms.forEach((formId) => {
    const form = document.getElementById(formId);
    if (form) form.reset();
  });

  const outputSection = document.getElementById('outputSection');
  if (outputSection) {
    outputSection.classList.add('hidden');
  }

  showToast('Cleared', 'Form cleared successfully', 'info');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCampaignForm();
  initPitchForm();
  initLeadScoreForm();

  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-menu a').forEach((link) => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  console.log('✅ MarketMind - JS initialized');
});
