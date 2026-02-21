// Calculator Logic
let currentStep = 1;
const totalSteps = 4;
let formData = {};

// DOM Elements
const form = document.getElementById('calculator-form');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const progressSteps = document.querySelectorAll('.progress-step');
const formSections = document.querySelectorAll('.form-section');
const scenarioCards = document.querySelectorAll('.scenario-card');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateUI();
});

// Event Listeners
function setupEventListeners() {
    // Scenario selection
    scenarioCards.forEach(card => {
        card.addEventListener('click', function() {
            selectScenario(this);
        });
    });

    // Navigation buttons
    btnNext.addEventListener('click', handleNext);
    btnBack.addEventListener('click', handleBack);

    // Form inputs
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            validateField(this);
        });
    });
}

// Scenario Selection
function selectScenario(card) {
    // Remove previous selection
    scenarioCards.forEach(c => c.classList.remove('selected'));
    
    // Add selection
    card.classList.add('selected');
    
    // Store value
    const scenario = card.dataset.scenario;
    document.getElementById('selected-scenario').value = scenario;
    formData.scenario = scenario;
    
    // Enable next button
    btnNext.disabled = false;
}

// Navigation
function handleNext() {
    if (validateCurrentStep()) {
        if (currentStep === totalSteps) {
            // Submit form
            calculateResults();
        } else {
            currentStep++;
            updateUI();
        }
    }
}

function handleBack() {
    if (currentStep > 1) {
        currentStep--;
        updateUI();
    }
}

// Validation
function validateCurrentStep() {
    const currentSection = document.querySelector(`.form-section[data-section="${currentStep}"]`);
    const requiredInputs = currentSection.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Check if required and empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Specific validations
    if (value) {
        switch(fieldName) {
            case 'buildingArea':
                if (parseFloat(value) < 50) {
                    isValid = false;
                    errorMessage = 'Building area must be at least 50 m²';
                }
                break;
            case 'lifespan':
                if (parseFloat(value) < 10 || parseFloat(value) > 100) {
                    isValid = false;
                    errorMessage = 'Lifespan must be between 10 and 100 years';
                }
                break;
            case 'embodiedEnergy':
                if (parseFloat(value) < 50) {
                    isValid = false;
                    errorMessage = 'Embodied energy factor must be at least 50 kgCO₂/m²';
                }
                break;
            case 'operationalEnergy':
                if (parseFloat(value) < 10) {
                    isValid = false;
                    errorMessage = 'Operational energy must be at least 10 kWh/m²/yr';
                }
                break;
            case 'reuseRate':
                if (parseFloat(value) < 0 || parseFloat(value) > 100) {
                    isValid = false;
                    errorMessage = 'Reuse rate must be between 0 and 100%';
                }
                break;
        }
    }

    // Show/hide error
    const errorElement = document.getElementById(`error-${field.id}`);
    if (errorElement) {
        if (!isValid) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        } else {
            field.classList.remove('error');
            errorElement.classList.remove('show');
        }
    }

    // Store valid data
    if (isValid && value) {
        formData[fieldName] = value;
    }

    return isValid;
}

// UI Updates
function updateUI() {
    // Update progress steps
    progressSteps.forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });

    // Update form sections
    formSections.forEach(section => {
        const sectionNum = parseInt(section.dataset.section);
        if (sectionNum === currentStep) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Update buttons
    if (currentStep === 1) {
        btnBack.style.display = 'none';
        btnNext.disabled = !formData.scenario;
    } else {
        btnBack.style.display = 'inline-flex';
        btnNext.disabled = false;
    }

    if (currentStep === totalSteps) {
        btnNext.innerHTML = `
            Calculate Results
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        updateReviewSummary();
    } else {
        btnNext.innerHTML = `
            Next Step
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateReviewSummary() {
    const reviewSummary = document.getElementById('review-summary');
    
    const scenarioNames = {
        'light-renovation': 'Light Renovation',
        'deep-renovation': 'Deep Renovation',
        'new-build': 'Demolish & New Build'
    };

    const materialNames = {
        'concrete': 'Concrete',
        'steel': 'Steel',
        'timber': 'Timber',
        'masonry': 'Masonry',
        'mixed': 'Mixed'
    };

    const climateNames = {
        'cold': 'Cold (Heating-dominant)',
        'temperate': 'Temperate (Mixed)',
        'warm': 'Warm (Cooling-dominant)',
        'hot': 'Hot (High cooling demand)'
    };

    reviewSummary.innerHTML = `
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--darker); margin-bottom: 1.5rem;">Summary</h3>
        <div style="display: grid; gap: 1rem;">
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
                <div style="font-weight: 600; color: var(--text);">Scenario:</div>
                <div style="color: var(--text-light);">${scenarioNames[formData.scenario] || 'Not selected'}</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
                <div style="font-weight: 600; color: var(--text);">Building Area:</div>
                <div style="color: var(--text-light);">${formData.buildingArea || 'Not entered'} m²</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
                <div style="font-weight: 600; color: var(--text);">Expected Lifespan:</div>
                <div style="color: var(--text-light);">${formData.lifespan || 'Not entered'} years</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
                <div style="font-weight: 600; color: var(--text);">Structural Material:</div>
                <div style="color: var(--text-light);">${materialNames[formData.structuralMaterial] || 'Not selected'}</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
                <div style="font-weight: 600; color: var(--text);">Climate Zone:</div>
                <div style="color: var(--text-light);">${climateNames[formData.climateZone] || 'Not selected'}</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
                <div style="font-weight: 600; color: var(--text);">Embodied Energy Factor:</div>
                <div style="color: var(--text-light);">${formData.embodiedEnergy || 'Not entered'} kgCO₂/m²</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
                <div style="font-weight: 600; color: var(--text);">Operational Energy:</div>
                <div style="color: var(--text-light);">${formData.operationalEnergy || 'Not entered'} kWh/m²/yr</div>
            </div>
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 1rem; padding: 0.75rem 0;">
                <div style="font-weight: 600; color: var(--text);">Material Reuse Rate:</div>
                <div style="color: var(--text-light);">${formData.reuseRate || 'Using scenario default'} ${formData.reuseRate ? '%' : ''}</div>
            </div>
        </div>
    `;
}

// Calculate Results
function calculateResults() {
    // Store data in localStorage
    localStorage.setItem('calculatorData', JSON.stringify(formData));
    
    // Redirect to results page
    window.location.href = 'results.html';
}
