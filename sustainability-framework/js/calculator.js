/* ========================================
   BUILDING SUSTAINABILITY FRAMEWORK
   Calculator Logic - Enhanced with smooth animations
   ======================================== */

// State Management
let currentStep = 1;
const totalSteps = 3;
let formData = {};

// Scenario Defaults
const scenarioDefaults = {
    'light-renovation': {
        reuseRate: 90,
        embodiedFactor: 0.15,
        operationalImprovement: 0.25
    },
    'deep-renovation': {
        reuseRate: 50,
        embodiedFactor: 0.50,
        operationalImprovement: 0.50
    },
    'new-build': {
        reuseRate: 10,
        embodiedFactor: 1.50,
        operationalImprovement: 0.70
    }
};

// Material Factors
const materialFactors = {
    'concrete': 1.0,
    'steel': 1.3,
    'timber': 0.7,
    'masonry': 0.9,
    'mixed': 1.0
};

// Climate Multipliers
const climateMultipliers = {
    'cold': 1.2,
    'temperate': 1.0,
    'warm': 0.9,
    'hot': 1.1
};

// DOM Elements
const form = document.getElementById('calculator-form');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const formSections = document.querySelectorAll('.form-section');
const scenarioCards = document.querySelectorAll('.scenario-card');
const resultsSection = document.getElementById('results');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateUI();
    initTabs();
});

/* ========================================
   EVENT LISTENERS
   ======================================== */
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

    // Form inputs - store data on change
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value) {
                formData[this.name] = this.value;
            }
        });
    });
}

/* ========================================
   SCENARIO SELECTION
   ======================================== */
function selectScenario(card) {
    // Remove previous selection with fade
    scenarioCards.forEach(c => {
        c.classList.remove('selected');
        c.style.transform = 'scale(1)';
    });
    
    // Add selection with animation
    card.classList.add('selected');
    card.style.transform = 'scale(1.02)';
    
    // Reset after animation
    setTimeout(() => {
        card.style.transform = '';
    }, 300);
    
    // Store value
    const scenario = card.dataset.scenario;
    document.getElementById('selected-scenario').value = scenario;
    formData.scenario = scenario;
    
    // Enable next button with subtle animation
    btnNext.disabled = false;
    btnNext.style.opacity = '1';
    btnNext.style.transform = 'translateY(0)';
}

/* ========================================
   NAVIGATION
   ======================================== */
function handleNext() {
    if (validateCurrentStep()) {
        if (currentStep === totalSteps) {
            // Final step - calculate results
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

/* ========================================
   VALIDATION
   ======================================== */
function validateCurrentStep() {
    const currentSection = document.querySelector(`.form-section[data-section="${currentStep}"]`);
    const requiredInputs = currentSection.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            // Smooth error animation
            input.style.borderColor = 'var(--error)';
            input.style.animation = 'shake 0.3s ease-in-out';
            setTimeout(() => {
                input.style.animation = '';
            }, 300);
        } else {
            input.style.borderColor = 'var(--border)';
        }
    });

    if (!isValid) {
        // Show error message with fade-in
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.textContent = 'Please fill in all required fields';
        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--error);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 9999;
            animation: slideDown 0.3s ease-out;
            box-shadow: 0 10px 40px rgba(239, 68, 68, 0.3);
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => errorDiv.remove(), 300);
        }, 2000);
    }

    return isValid;
}

/* ========================================
   UI UPDATES WITH SMOOTH TRANSITIONS
   ======================================== */
function updateUI() {
    // Fade out current section
    const currentSection = document.querySelector('.form-section.active');
    if (currentSection) {
        currentSection.style.opacity = '0';
        currentSection.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            currentSection.classList.remove('active');
            showNextSection();
        }, 150);
    } else {
        showNextSection();
    }
    
    // Update buttons
    updateButtons();
}

function showNextSection() {
    const nextSection = document.querySelector(`.form-section[data-section="${currentStep}"]`);
    
    if (nextSection) {
        // Reset styles for animation
        nextSection.style.opacity = '0';
        nextSection.style.transform = 'translateX(20px)';
        nextSection.classList.add('active');
        
        // Trigger animation
        setTimeout(() => {
            nextSection.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            nextSection.style.opacity = '1';
            nextSection.style.transform = 'translateX(0)';
        }, 50);
    }
}

function updateButtons() {
    // Update back button visibility
    if (currentStep === 1) {
        btnBack.style.opacity = '0';
        btnBack.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            btnBack.style.display = 'none';
        }, 200);
    } else {
        btnBack.style.display = 'inline-flex';
        setTimeout(() => {
            btnBack.style.transition = 'all 0.3s ease';
            btnBack.style.opacity = '1';
            btnBack.style.transform = 'translateX(0)';
        }, 50);
    }
    
    // Update next button state
    btnNext.disabled = currentStep === 1 && !formData.scenario;
    
    // Update button text with smooth transition
    btnNext.style.opacity = '0.7';
    setTimeout(() => {
        if (currentStep === totalSteps) {
            btnNext.innerHTML = `
                Calculate Results
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        } else {
            btnNext.innerHTML = `
                Next Step
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
        btnNext.style.transition = 'opacity 0.3s ease';
        btnNext.style.opacity = '1';
    }, 150);
}

/* ========================================
   CALCULATIONS
   ======================================== */
function calculateResults() {
    // Show loading state
    btnNext.disabled = true;
    btnNext.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="60" stroke-dashoffset="20" opacity="0.25"/>
        </svg>
        Calculating...
    `;
    
    // Simulate calculation delay for smooth UX
    setTimeout(() => {
        performCalculation();
    }, 800);
}

function performCalculation() {
    // Get form data
    const scenario = formData.scenario;
    const area = parseFloat(formData.buildingArea);
    const lifespan = parseFloat(formData.lifespan);
    const embodiedEnergy = parseFloat(formData.embodiedEnergy);
    const operationalEnergy = parseFloat(formData.operationalEnergy);
    const material = formData.structuralMaterial;
    const climate = formData.climateZone;
    const customReuseRate = formData.reuseRate ? parseFloat(formData.reuseRate) / 100 : null;

    // Get scenario defaults
    const scenarioData = scenarioDefaults[scenario];
    const reuseRate = customReuseRate !== null ? customReuseRate : scenarioData.reuseRate / 100;
    const embodiedFactor = scenarioData.embodiedFactor;
    const operationalImprovement = scenarioData.operationalImprovement;

    // Get multipliers
    const materialFactor = materialFactors[material] || 1.0;
    const climateFactor = climateMultipliers[climate] || 1.0;

    // RENOVATION CALCULATIONS
    const renovationEmbodied = embodiedEnergy * area * embodiedFactor * materialFactor * (1 - reuseRate);
    const renovationOperational = operationalEnergy * (1 - operationalImprovement) * area * climateFactor * lifespan;
    const renovationTotal = renovationEmbodied + renovationOperational;

    // NEW BUILD CALCULATIONS
    const newBuildEmbodied = embodiedEnergy * area * 1.5 * materialFactor;
    const newBuildOperational = operationalEnergy * 0.3 * area * climateFactor * lifespan;
    const newBuildTotal = newBuildEmbodied + newBuildOperational;

    // DECISION
    const decision = renovationTotal < newBuildTotal ? 'RENOVATE' : 'DEMOLISH & NEW BUILD';
    const savings = Math.abs(renovationTotal - newBuildTotal);
    const savingsPercentage = ((savings / Math.max(renovationTotal, newBuildTotal)) * 100).toFixed(1);

    // Prepare results object for charts
    const results = {
        decision: decision,
        savings: Math.round(savings),
        savingsPercent: savingsPercentage,
        renovation: {
            totalCarbon: Math.round(renovationTotal),
            embodiedCarbon: Math.round(renovationEmbodied),
            operationalCarbon: Math.round(renovationOperational)
        },
        newBuild: {
            totalCarbon: Math.round(newBuildTotal),
            embodiedCarbon: Math.round(newBuildEmbodied),
            operationalCarbon: Math.round(newBuildOperational)
        },
        inputs: {
            scenario: scenario,
            buildingArea: area,
            lifespan: lifespan,
            embodiedEnergy: embodiedEnergy,
            operationalEnergy: operationalEnergy,
            material: material,
            climate: climate,
            reuseRate: reuseRate * 100
        }
    };

    // Display results with animation
    displayResults(results);
}

/* ========================================
   DISPLAY RESULTS WITH ANIMATIONS
   ======================================== */
function displayResults(results) {
    console.log('📊 Displaying results:', results);

    // Update decision badge
    const decisionBadge = document.getElementById('decisionBadge');
    const decisionText = document.getElementById('decisionText');
    const resultsTitle = document.getElementById('resultsTitle');

    if (results.decision === 'RENOVATE') {
        if (decisionBadge) {
            decisionBadge.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-light))';
        }
        if (decisionText) {
            decisionText.textContent = 'RENOVATE';
        }
        if (resultsTitle) {
            resultsTitle.textContent = 'Renovation is the better choice';
        }
    } else {
        if (decisionBadge) {
            decisionBadge.style.background = 'linear-gradient(135deg, var(--accent), #ef4444)';
        }
        if (decisionText) {
            decisionText.textContent = 'DEMOLISH & REBUILD';
        }
        if (resultsTitle) {
            resultsTitle.textContent = 'New build is recommended';
        }
    }

    // Update subtitle with savings
    const savingsAmount = document.getElementById('savingsAmount');
    const savingsPercent = document.getElementById('savingsPercent');
    if (savingsAmount) {
        savingsAmount.textContent = formatNumber(results.savings) + ' tCO₂e';
    }
    if (savingsPercent) {
        savingsPercent.textContent = '(' + results.savingsPercent + '%)';
    }

    // Update carbon values with animation
    animateNumber('renovationTotal', 0, results.renovation.totalCarbon, 1500);
    animateNumber('renovationEmbodied', 0, results.renovation.embodiedCarbon, 1500);
    animateNumber('renovationOperational', 0, results.renovation.operationalCarbon, 1500);
    
    animateNumber('newbuildTotal', 0, results.newBuild.totalCarbon, 1500);
    animateNumber('newbuildEmbodied', 0, results.newBuild.embodiedCarbon, 1500);
    animateNumber('newbuildOperational', 0, results.newBuild.operationalCarbon, 1500);

    // Initialize charts
    if (window.ChartsModule) {
        setTimeout(() => {
            window.ChartsModule.init(results);
        }, 800);
    }

    // Show results section with fade-in
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';
    resultsSection.style.opacity = '0';
    
    setTimeout(() => {
        resultsSection.style.transition = 'opacity 0.6s ease';
        resultsSection.style.opacity = '1';
        
        // Smooth scroll to results
        resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
}

/* ========================================
   HELPER FUNCTIONS
   ======================================== */
function formatNumber(num) {
    return Math.round(num).toLocaleString('en-US');
}

function animateNumber(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuad = progress * (2 - progress);
        const current = start + (end - start) * easeOutQuad;
        
        element.textContent = formatNumber(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ========================================
   TABS FUNCTIONALITY
   ======================================== */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked
            btn.classList.add('active');
            const targetPane = document.getElementById(`tab-${targetTab}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

/* ========================================
   ANIMATIONS CSS (inject into page)
   ======================================== */
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .form-section {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .scenario-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(animationStyles);

/* ========================================
   DEBUG HELPERS
   ======================================== */
window.calculatorDebug = {
    formData: formData,
    scenarioDefaults: scenarioDefaults,
    currentStep: () => currentStep
};

console.log('✨ Calculator initialized with smooth animations');
