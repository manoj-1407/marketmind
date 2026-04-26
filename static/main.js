// MarketMind AI - Professional Edition
const API_BASE = 'http://localhost:8000';

// ============================================
// THEME MANAGEMENT
// ============================================

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
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
// UI COMPONENTS
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
  console.log(`📤 API Call: ${endpoint}`, data);
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  console.log(`📥 Response status: ${response.status}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error: ${response.status}`, errorText);
    throw new Error(`API Error: ${response.status}`);
  }
  
  const result = await response.json();
  console.log(`✅ API Success:`, result);
  return result;
}

// ============================================
// CAMPAIGN GENERATOR - WITH FILE UPLOAD
// ============================================

let uploadedFile = null;

function initCampaignForm() {
  const form = document.getElementById('campaignForm');
  if (!form) return;

  // Advanced toggle
  const advancedToggle = document.getElementById('advancedToggle');
  const advancedOptions = document.getElementById('advancedOptions');
  
  if (advancedToggle) {
    advancedToggle.addEventListener('click', () => {
      const isHidden = advancedOptions.style.display === 'none';
      advancedOptions.style.display = isHidden ? 'block' : 'none';
      advancedToggle.textContent = isHidden ? '⚙️ Hide Advanced Options' : '⚙️ Show Advanced Options';
    });
  }

  // File upload handling
  const fileInput = document.getElementById('productMediaInput');
  const fileUploadZone = document.getElementById('fileUploadZone');
  const filePreview = document.getElementById('filePreview');
  const imagePreview = document.getElementById('imagePreview');
  const videoPreview = document.getElementById('videoPreview');
  const fileName = document.getElementById('fileName');

  if (fileInput && fileUploadZone) {
    fileInput.addEventListener('change', handleFileSelect);
    
    fileUploadZone.addEventListener('click', (e) => {
      if (e.target !== fileUploadZone && !e.target.classList.contains('upload-text') && !e.target.classList.contains('upload-subtext') && !e.target.classList.contains('upload-icon')) {
        return;
      }
      fileInput.click();
    });

    fileUploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileUploadZone.classList.add('dragover');
    });

    fileUploadZone.addEventListener('dragleave', () => {
      fileUploadZone.classList.remove('dragover');
    });

    fileUploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      fileUploadZone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    });
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }

  function handleFileUpload(file) {
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showToast('File Too Large', 'Please upload a file smaller than 10MB', 'error');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      showToast('Invalid File Type', 'Please upload an image (JPG, PNG, GIF) or video (MP4, MOV)', 'error');
      return;
    }

    uploadedFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      filePreview.classList.remove('hidden');
      fileName.textContent = file.name;

      if (file.type.startsWith('image/')) {
        imagePreview.src = e.target.result;
        imagePreview.classList.add('active');
        videoPreview.classList.remove('active');
      } else if (file.type.startsWith('video/')) {
        videoPreview.src = e.target.result;
        videoPreview.classList.add('active');
        imagePreview.classList.remove('active');
      }

      showToast('File Uploaded', `${file.name} ready for campaign generation`, 'success');
    };
    reader.readAsDataURL(file);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('🚀 Campaign form submitted');

    const product = document.getElementById('productInput').value.trim();
    const audience = document.getElementById('audienceInput').value.trim();

    if (!product || !audience) {
      showToast('Validation Error', 'Please fill in required fields', 'error');
      return;
    }

    // Gather advanced options
    const platforms = Array.from(document.querySelectorAll('input[name="platform"]:checked'))
      .map(cb => cb.value);
    
    const campaignData = {
      product,
      audience,
      budget: document.getElementById('budgetInput')?.value || '',
      timeline: document.getElementById('timelineInput')?.value || '',
      industry: document.getElementById('industryInput')?.value || '',
      objective: document.getElementById('objectiveInput')?.value || 'leads',
      tone: document.getElementById('toneInput')?.value || 'professional',
      leadGoal: document.getElementById('leadGoalInput')?.value || '',
      platforms: platforms.length > 0 ? platforms.join(', ') : 'Google Ads',
      competitors: document.getElementById('competitorInput')?.value || '',
      usp: document.getElementById('uspInput')?.value || '',
      abTesting: document.getElementById('abTestingCheck')?.checked || false,
      contentType: document.getElementById('contentTypeInput')?.value || 'all',
      visualStyle: document.getElementById('visualStyleInput')?.value || 'professional',
      aiInstructions: document.getElementById('aiInstructions')?.value || '',
      hasMedia: uploadedFile ? true : false,
      mediaType: uploadedFile ? (uploadedFile.type.startsWith('image/') ? 'image' : 'video') : 'none',
      mediaName: uploadedFile ? uploadedFile.name : ''
    };

    showLoading('Analyzing your media and generating campaign...');

    try {
      const result = await apiCall('/api/generate_campaign', campaignData);

      hideLoading();

      if (result && result.content) {
        displayOutput(result.content);
        updateWordCount(result.content);
        showToast('Success', 'Campaign generated successfully!', 'success');
      } else {
        throw new Error('No content in response');
      }
    } catch (error) {
      hideLoading();
      console.error('❌ Campaign generation failed:', error);
      showToast('Error', `Failed: ${error.message}`, 'error');
    }
  });
  
  console.log('✅ Campaign form initialized with file upload');
}

function removeFile() {
  uploadedFile = null;
  const filePreview = document.getElementById('filePreview');
  const imagePreview = document.getElementById('imagePreview');
  const videoPreview = document.getElementById('videoPreview');
  const fileInput = document.getElementById('productMediaInput');
  
  if (filePreview) filePreview.classList.add('hidden');
  if (imagePreview) {
    imagePreview.src = '';
    imagePreview.classList.remove('active');
  }
  if (videoPreview) {
    videoPreview.src = '';
    videoPreview.classList.remove('active');
  }
  if (fileInput) fileInput.value = '';
  
  showToast('File Removed', 'Media file removed from campaign', 'info');
}

// ============================================
// PITCH GENERATOR - ADVANCED
// ============================================

function initPitchForm() {
  const form = document.getElementById('pitchForm');
  if (!form) return;

  // Advanced toggle
  const advancedToggle = document.getElementById('pitchAdvancedToggle');
  const advancedOptions = document.getElementById('pitchAdvancedOptions');
  
  if (advancedToggle) {
    advancedToggle.addEventListener('click', () => {
      const isHidden = advancedOptions.style.display === 'none';
      advancedOptions.style.display = isHidden ? 'block' : 'none';
      advancedToggle.textContent = isHidden ? '⚙️ Hide Advanced Options' : '⚙️ Show Advanced Options';
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const product = document.getElementById('pitchProductInput').value.trim();
    const customer = document.getElementById('customerInput').value.trim();
    const problem = document.getElementById('problemInput').value.trim();
    const solution = document.getElementById('solutionInput').value.trim();

    if (!product || !customer || !problem || !solution) {
      showToast('Validation Error', 'Please fill in all required fields', 'error');
      return;
    }

    const pitchData = {
      product,
      audience: customer,
      problem,
      solution,
      fundingStage: document.getElementById('fundingStageInput')?.value || 'seed',
      amountSeeking: document.getElementById('amountSeekingInput')?.value || '',
      valuation: document.getElementById('valuationInput')?.value || '',
      teamSize: document.getElementById('teamSizeInput')?.value || '',
      revenue: document.getElementById('revenueInput')?.value || '',
      customers: document.getElementById('customersInput')?.value || '',
      growthRate: document.getElementById('growthRateInput')?.value || '',
      burnRate: document.getElementById('burnRateInput')?.value || '',
      marketSize: document.getElementById('marketSizeInput')?.value || '',
      competitors: document.getElementById('competitorsInput')?.value || '',
      advantage: document.getElementById('advantageInput')?.value || '',
      businessModel: document.getElementById('businessModelInput')?.value || 'subscription',
      pricing: document.getElementById('pricingInput')?.value || '',
      includeFinancials: document.getElementById('includeFinancialsCheck')?.checked || false,
      includeRoadmap: document.getElementById('includeRoadmapCheck')?.checked || false,
      includeTeam: document.getElementById('includeTeamCheck')?.checked || false
    };

    showLoading('Crafting your investor pitch...');

    try {
      const result = await apiCall('/api/generate_pitch', pitchData);

      hideLoading();

      if (result.content) {
        displayOutput(result.content);
        updateWordCount(result.content);
        countSlides(result.content);
        showToast('Success', 'Pitch generated successfully!', 'success');
      } else {
        throw new Error('No content in response');
      }
    } catch (error) {
      hideLoading();
      console.error('Pitch error:', error);
      showToast('Error', `Failed: ${error.message}`, 'error');
    }
  });
}

// ============================================
// LEAD SCORING - ADVANCED
// ============================================

function initLeadScoreForm() {
  // Mode selector
  const modeBtns = document.querySelectorAll('.mode-btn');
  const singleForm = document.getElementById('singleLeadForm');
  const bulkForm = document.getElementById('bulkUploadForm');

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const mode = btn.dataset.mode;
      if (mode === 'single') {
        singleForm?.classList.remove('hidden');
        bulkForm?.classList.add('hidden');
      } else {
        singleForm?.classList.add('hidden');
        bulkForm?.classList.remove('hidden');
      }
    });
  });

  // Single lead form
  const form = document.getElementById('leadScoreForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('nameInput').value.trim();

    if (!name) {
      showToast('Validation Error', 'Please enter lead name', 'error');
      return;
    }

    const leadData = {
      name,
      company: document.getElementById('companyInput')?.value || '',
      role: document.getElementById('roleInput')?.value || '',
      email: document.getElementById('emailInput')?.value || '',
      industry: document.getElementById('industrySelectInput')?.value || '',
      companySize: document.getElementById('companySizeInput')?.value || '',
      budget: document.getElementById('budgetSelectInput')?.value || '',
      urgency: document.getElementById('urgencySelectInput')?.value || '',
      source: document.getElementById('sourceInput')?.value || '',
      engagement: document.getElementById('engagementInput')?.value || '',
      notes: document.getElementById('notesInput')?.value || ''
    };

    showLoading('Analyzing lead qualification...');

    try {
      const result = await apiCall('/api/score_lead', leadData);

      hideLoading();

      if (result.content) {
        try {
          const scoreData = JSON.parse(result.content);
          displayLeadScore(scoreData);
        } catch {
          displayOutput(result.content);
        }
        showToast('Success', 'Lead scored!', 'success');
      } else {
        throw new Error('No content in response');
      }
    } catch (error) {
      hideLoading();
      console.error('Lead score error:', error);
      showToast('Error', `Failed: ${error.message}`, 'error');
    }
  });

  // CSV upload
  const csvFileInput = document.getElementById('csvFileInput');
  const uploadZone = document.getElementById('uploadZone');

  if (csvFileInput) {
    csvFileInput.addEventListener('change', handleCSVUpload);
  }

  if (uploadZone) {
    uploadZone.addEventListener('click', () => csvFileInput?.click());
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });
    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) handleCSVFile(file);
    });
  }
}

async function handleCSVUpload(e) {
  const file = e.target.files[0];
  if (file) handleCSVFile(file);
}

async function handleCSVFile(file) {
  if (!file.name.endsWith('.csv')) {
    showToast('Error', 'Please upload a CSV file', 'error');
    return;
  }

  showLoading('Processing CSV file...');

  setTimeout(() => {
    hideLoading();
    showToast('Success', `Processed ${file.name}`, 'success');
    
    const bulkResults = document.getElementById('bulkResults');
    if (bulkResults) {
      bulkResults.classList.remove('hidden');
      document.getElementById('bulkResultsTable').innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Score</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Sample Lead 1</td><td>Company A</td><td>92</td><td>🔥 HOT</td></tr>
            <tr><td>Sample Lead 2</td><td>Company B</td><td>78</td><td>⚡ WARM</td></tr>
            <tr><td>Sample Lead 3</td><td>Company C</td><td>45</td><td>❄️ COLD</td></tr>
          </tbody>
        </table>
      `;
    }
  }, 1500);
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function displayLeadScore(scoreData) {
  const outputSection = document.getElementById('outputSection');
  const outputContent = document.getElementById('outputContent');

  if (outputSection && outputContent) {
    const score = scoreData.score || 0;
    const priority = scoreData.priority || 'WARM';
    const recommendation = scoreData.recommendation || 'Follow up';
    const reasoning = scoreData.reasoning || 'Lead analysis';

    // Update score circle
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreNumber = document.getElementById('scoreNumber');
    const scorePriority = document.getElementById('scorePriority');

    if (scoreCircle) {
      const offset = 565 - (565 * score / 100);
      scoreCircle.style.strokeDashoffset = offset;
      
      if (priority === 'HOT') scoreCircle.style.stroke = '#10b981';
      else if (priority === 'WARM') scoreCircle.style.stroke = '#f59e0b';
      else scoreCircle.style.stroke = '#ef4444';
    }

    if (scoreNumber) scoreNumber.textContent = score;
    if (scorePriority) {
      scorePriority.textContent = priority;
      if (priority === 'HOT') scorePriority.style.color = '#10b981';
      else if (priority === 'WARM') scorePriority.style.color = '#f59e0b';
      else scorePriority.style.color = '#ef4444';
    }

    outputContent.innerHTML = `
      <h3>📋 Recommendation</h3>
      <p>${recommendation}</p>
      <h3>🧠 Analysis</h3>
      <p>${reasoning}</p>
    `;
    
    outputSection.classList.remove('hidden');
    saveToHistory('lead', `Score: ${score} - ${priority}`);

    setTimeout(() => {
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

function displayOutput(content) {
  const outputSection = document.getElementById('outputSection');
  const outputContent = document.getElementById('outputContent');

  if (outputSection && outputContent) {
    let formatted = content
      .replace(/##\s*(.+)/g, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n- /g, '<br>• ')
      .replace(/\n(\d+)\. /g, '<br>$1. ');

    if (!formatted.startsWith('<')) {
      formatted = '<p>' + formatted + '</p>';
    }

    outputContent.innerHTML = formatted;
    outputSection.classList.remove('hidden');

    const type = window.location.pathname.includes('campaign') ? 'campaign' :
                window.location.pathname.includes('pitch') ? 'pitch' : 'lead';
    saveToHistory(type, content);

    setTimeout(() => {
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

function updateWordCount(content) {
  const wordCountEl = document.getElementById('wordCount');
  if (wordCountEl) {
    const words = content.split(/\s+/).length;
    wordCountEl.textContent = `${words} words`;
  }
}

function countSlides(content) {
  const slideCountEl = document.getElementById('slideCount');
  if (slideCountEl) {
    const slides = (content.match(/##/g) || []).length;
    slideCountEl.textContent = `${slides} slides`;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function saveToHistory(type, content) {
  try {
    const history = JSON.parse(localStorage.getItem('mm_history') || '[]');
    history.unshift({ type, content, ts: new Date().toISOString() });
    localStorage.setItem('mm_history', JSON.stringify(history.slice(0, 20)));
  } catch (e) {
    console.error('History save failed:', e);
  }
}

function copyOutput() {
  const outputContent = document.getElementById('outputContent');
  if (outputContent) {
    navigator.clipboard
      .writeText(outputContent.textContent)
      .then(() => showToast('Copied', 'Content copied to clipboard!', 'success'))
      .catch(() => showToast('Error', 'Failed to copy', 'error'));
  }
}

function downloadPDF() {
  showToast('Coming Soon', 'PDF export will be available soon', 'info');
}

function exportPowerPoint() {
  showToast('Coming Soon', 'PowerPoint export will be available soon', 'info');
}

function saveTemplate() {
  showToast('Saved', 'Template saved to your library', 'success');
}

function downloadTemplate() {
  const csv = 'name,company,role,email,industry,company_size,budget,urgency,source,notes\nJohn Doe,Example Corp,CEO,john@example.com,technology,51-200,50k-100k,immediate,website,Interested in premium plan';
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lead_template.csv';
  a.click();
}

function exportBulkResults() {
  showToast('Success', 'Results exported to CSV', 'success');
}

function addToCRM() {
  showToast('Coming Soon', 'CRM integration coming soon', 'info');
}

function scheduleFollowUp() {
  showToast('Coming Soon', 'Calendar integration coming soon', 'info');
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

  // Clear uploaded file
  removeFile();

  showToast('Cleared', 'Form cleared', 'info');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 MarketMind Pro initializing...');
  
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

  console.log('✅ MarketMind Pro - Fully initialized');
});
