/* ========================================
   BUILDING SUSTAINABILITY FRAMEWORK
   Calculator Logic - 7 Scenarios (REAL DATA from Valentine Lhoëst)
   Based on Meeting 2_Data.pdf - February 2026
   ✅ VERSÃO FINAL CORRIGIDA A 100%
   ======================================== */

// State Management
let currentStep = 1;
const totalSteps = 2;
let formData = {};

// ✅ 7 CENÁRIOS COM DADOS REAIS DA VALENTINE
const scenarioDefaults = {
    'light-renovation': {
        name: 'light-renovation',
        displayName: 'Light Renovation',
        reuseRate: 0.90,                    // 85-95% average = 90%
        embodiedFactor: 0.10,               // 5-15% average = 10%
        operationalImprovement: 0.25,       // 20-30% average = 25%
        lifespan: 17.5,                     // 15-20 years average
        category: 'renovation'
    },
    'medium-renovation': {
        name: 'medium-renovation',
        displayName: 'Medium Renovation',
        reuseRate: 0.70,                    // 60-80% average = 70%
        embodiedFactor: 0.275,              // 20-35% average = 27.5%
        operationalImprovement: 0.475,      // 40-50% average = 47.5%
        lifespan: 22.5,                     // 20-25 years average
        category: 'renovation'
    },
    'deep-renovation': {
        name: 'deep-renovation',
        displayName: 'Deep Renovation',
        reuseRate: 0.525,                   // 45-60% average = 52.5%
        embodiedFactor: 0.45,               // 35-55% average = 45%
        operationalImprovement: 0.70,       // 65-75% average = 70%
        lifespan: 30,                       // 25-35 years average
        category: 'renovation'
    },
    'deep-renovation-demolition': {
        name: 'deep-renovation-demolition',
        displayName: 'Deep + Demo',
        reuseRate: 0.425,                   // 40-45% average = 42.5%
        embodiedFactor: 0.55,               // 45-65% average = 55%
        operationalImprovement: 0.75,       // 70-80% average = 75%
        lifespan: 35,                       // 30-40 years average
        category: 'renovation'
    },
    'code-compliant-new': {
        name: 'code-compliant-new',
        displayName: 'Code-Compliant',
        reuseRate: 0.025,                   // 0-5% average = 2.5%
        embodiedFactor: 0.975,              // 95-100% average = 97.5%
        operationalImprovement: 0.84,       // 80-88% average = 84%
        lifespan: 40,                       // 40 years
        category: 'newbuild'
    },
    'high-performance-new': {
        name: 'high-performance-new',
        displayName: 'High-Performance',
        reuseRate: 0.10,                    // 5-15% average = 10%
        embodiedFactor: 0.825,              // 75-90% average = 82.5%
        operationalImprovement: 0.94,       // 92-96% average = 94%
        lifespan: 50,                       // 50 years
        category: 'newbuild'
    },
    'low-carbon-new': {
        name: 'low-carbon-new',
        displayName: 'Low-Carbon',
        reuseRate: 0.225,                   // 15-30% average = 22.5%
        embodiedFactor: 0.65,               // 55-75% average = 65%
        operationalImprovement: 0.98,       // 97-99% average = 98%
        lifespan: 60,                       // 60 years
        category: 'newbuild'
    }
};

// ✅ PROGRAM TYPE BASELINES (kWh/m²/yr) - From Valentine's data
const programBaselines = {
    'office': 350,
    'residential': 250,
    'institutional': 450,
    'industrial': 700
};

// ✅ CLIMATE MULTIPLIERS - Real data from Valentine
const climateMultipliers = {
    'temperate': 1.00,
    'cold': 1.27,
    'hot-dry': 0.92,
    'hot-humid': 0.95,
    'coastal': 0.85,
    'mountain': 1.13
};

// Material Factors (optional, can be used for refinement)
const materialFactors = {
    'concrete': 1.0,
    'steel': 1.3,
    'timber': 0.7,
    'masonry': 0.9,
    'mixed': 1.0
};

// ✅ MAPEAMENTO "UNKNOWN" → VALORES ESTIMADOS (em MJ/m²)
const embodiedContextMap = {
    'light-construction': 7500,
    'medium-construction': 9000,
    'heavy-construction': 10500,
    'existing-building': 7500
};

const operationalContextMap = {
    'high-performance': 20,
    'code-compliant': 80,
    'existing-standard': 150,
    'poor-performance': 275
};

// DOM Elements
const form = document.getElementById('calculator-form');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const formSections = document.querySelectorAll('.form-section');
const resultsSection = document.getElementById('results');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateUI();
    initTabs();
    setupUnknownLogic();
    setupMaterialDropdown();
    injectAnimationStyles();
    
    console.log('✅ Calculator initialized with REAL DATA from Valentine Lhoëst');
    console.log('📊 7 Scenarios loaded:', Object.keys(scenarioDefaults));
});

/* ========================================
   ✅ CUSTOM MATERIAL DROPDOWN
   ======================================== */
function setupMaterialDropdown() {
    const dropdown = document.getElementById('material-dropdown');
    if (!dropdown) return;
    
    const trigger = dropdown.querySelector('.multiselect-trigger');
    const dropdownContainer = dropdown.querySelector('.multiselect-dropdown');
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
    const placeholder = dropdown.querySelector('.multiselect-placeholder');
    
    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = dropdownContainer.style.display === 'block';
        
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updatePlaceholder();
            validateMaterialDropdown();
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
    
    dropdownContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    function openDropdown() {
        dropdownContainer.style.display = 'block';
        dropdown.classList.add('open');
    }
    
    function closeDropdown() {
        dropdownContainer.style.display = 'none';
        dropdown.classList.remove('open');
    }
    
    function updatePlaceholder() {
        const selected = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.nextElementSibling.nextElementSibling.textContent);
        
        if (selected.length === 0) {
            placeholder.textContent = 'Select materials...';
            placeholder.style.color = '#9ca3af';
        } else if (selected.length <= 2) {
            placeholder.textContent = selected.join(', ');
            placeholder.style.color = '#111827';
        } else {
            placeholder.textContent = `${selected.length} materials selected`;
            placeholder.style.color = '#111827';
        }
    }
    
    function validateMaterialDropdown() {
        const parentGroup = dropdown.closest('.form-group');
        const errorMessage = parentGroup ? parentGroup.querySelector('.input-error-message') : null;
        const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        dropdown.classList.remove('input-valid', 'input-invalid');
        
        if (selectedCount === 0) {
            dropdown.classList.add('input-invalid');
            if (errorMessage) {
                errorMessage.textContent = 'Please select at least one material';
                errorMessage.style.display = 'block';
            }
            return false;
        } else {
            dropdown.classList.add('input-valid');
            if (errorMessage) errorMessage.style.display = 'none';
            return true;
        }
    }
}

/* ========================================
   EVENT LISTENERS
   ======================================== */
function setupEventListeners() {
    btnNext.addEventListener('click', handleNext);
    btnBack.addEventListener('click', handleBack);

    const inputs = form.querySelectorAll('input:not([type="checkbox"]), select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('change', function() {
            validateInput(this);
            if (this.value) {
                formData[this.name] = this.value;
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                validateInput(this);
            }
        });
    });
}

/* ========================================
   ✅ SHOW/HIDE "UNKNOWN" CONTEXT SELECTORS
   ======================================== */
function setupUnknownLogic() {
    const embodiedEnergySelect = document.getElementById('embodied-energy');
    const embodiedContextGroup = document.getElementById('embodied-context-group');
    const embodiedContextSelect = document.getElementById('embodied-context');
    
    const operationalEnergySelect = document.getElementById('operational-energy');
    const operationalContextGroup = document.getElementById('operational-context-group');
    const operationalContextSelect = document.getElementById('operational-context');

    if (embodiedEnergySelect) {
        embodiedEnergySelect.addEventListener('change', function() {
            if (this.value === 'unknown') {
                embodiedContextGroup.style.display = 'block';
                embodiedContextSelect.setAttribute('required', 'required');
            } else {
                embodiedContextGroup.style.display = 'none';
                embodiedContextSelect.removeAttribute('required');
                embodiedContextSelect.value = '';
            }
        });
    }

    if (operationalEnergySelect) {
        operationalEnergySelect.addEventListener('change', function() {
            if (this.value === 'unknown') {
                operationalContextGroup.style.display = 'block';
                operationalContextSelect.setAttribute('required', 'required');
            } else {
                operationalContextGroup.style.display = 'none';
                operationalContextSelect.removeAttribute('required');
                operationalContextSelect.value = '';
            }
        });
    }
}

/* ========================================
   REAL-TIME VALIDATION
   ======================================== */
function validateInput(input) {
    const parentGroup = input.closest('.form-group');
    const errorMessage = parentGroup ? parentGroup.querySelector('.input-error-message') : null;
    
    input.classList.remove('input-valid', 'input-invalid');
    if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }
    
    if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('input-invalid');
        if (errorMessage) {
            errorMessage.textContent = 'This field is required';
            errorMessage.style.display = 'block';
        }
        return false;
    }
    
    if (input.value.trim()) {
        input.classList.add('input-valid');
        if (errorMessage) errorMessage.style.display = 'none';
    }
    
    return true;
}

/* ========================================
   NAVIGATION
   ======================================== */
function handleNext() {
    if (validateCurrentStep()) {
        if (currentStep === totalSteps) {
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
   STEP VALIDATION
   ======================================== */
function validateCurrentStep() {
    const currentSection = document.querySelector(`.form-section[data-section="${currentStep}"]`);
    const requiredInputs = currentSection.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidInput = null;

    if (currentStep === 1) {
        const materialDropdown = document.getElementById('material-dropdown');
        if (materialDropdown) {
            const checkboxes = materialDropdown.querySelectorAll('input[type="checkbox"]');
            const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            
            if (selectedCount === 0) {
                isValid = false;
                const parentGroup = materialDropdown.closest('.form-group');
                const errorMessage = parentGroup ? parentGroup.querySelector('.input-error-message') : null;
                
                materialDropdown.classList.add('input-invalid');
                if (errorMessage) {
                    errorMessage.textContent = 'Please select at least one material';
                    errorMessage.style.display = 'block';
                }
                
                materialDropdown.style.animation = 'shake 0.4s ease-in-out';
                setTimeout(() => {
                    materialDropdown.style.animation = '';
                }, 400);
                
                if (!firstInvalidInput) {
                    firstInvalidInput = materialDropdown;
                }
            }
        }
    }

    requiredInputs.forEach(input => {
        const inputValid = validateInput(input);
        
        if (!inputValid) {
            isValid = false;
            if (!firstInvalidInput) {
                firstInvalidInput = input;
            }
            
            input.style.animation = 'shake 0.4s ease-in-out';
            setTimeout(() => {
                input.style.animation = '';
            }, 400);
        }
    });

    if (!isValid) {
        if (firstInvalidInput) {
            firstInvalidInput.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            if (firstInvalidInput.focus) firstInvalidInput.focus();
        }
        
        showErrorNotification('Please correct the highlighted fields before continuing');
    }

    return isValid;
}

/* ========================================
   ERROR NOTIFICATION
   ======================================== */
function showErrorNotification(message) {
    const existing = document.querySelector('.validation-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'validation-notification';
    notification.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/* ========================================
   UI UPDATES WITH SMOOTH TRANSITIONS
   ======================================== */
function updateUI() {
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
    
    updateButtons();
}

function showNextSection() {
    const nextSection = document.querySelector(`.form-section[data-section="${currentStep}"]`);
    
    if (nextSection) {
        nextSection.style.opacity = '0';
        nextSection.style.transform = 'translateX(20px)';
        nextSection.classList.add('active');
        
        setTimeout(() => {
            nextSection.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            nextSection.style.opacity = '1';
            nextSection.style.transform = 'translateX(0)';
        }, 50);
    }
}

function updateButtons() {
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
   ✅ CALCULATIONS - 7 SCENARIOS (100% CORRIGIDO)
   Formula da Valentine: Total = Embodied + (Operational × Lifespan × 3.6)
   ======================================== */
function calculateResults() {
    btnNext.disabled = true;
    btnNext.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="60" stroke-dashoffset="20" opacity="0.25"/>
        </svg>
        Calculating...
    `;
    
    setTimeout(() => {
        performCalculation();
    }, 800);
}

function performCalculation() {
    // ✅ READ FORM INPUTS
    const buildingType = document.getElementById('building-type').value;
    const area = parseFloat(document.getElementById('building-area').value);
    const climate = document.getElementById('climate-zone').value;
    
    // ✅ MATERIAL DROPDOWN
    const materialDropdown = document.getElementById('material-dropdown');
    const materialCheckboxes = materialDropdown.querySelectorAll('input[type="checkbox"]:checked');
    const selectedMaterials = Array.from(materialCheckboxes).map(cb => cb.value);
    
    const materialFactor = selectedMaterials.length > 0
        ? selectedMaterials.reduce((sum, mat) => sum + (materialFactors[mat] || 1.0), 0) / selectedMaterials.length
        : 1.0;
    
    // ✅ EMBODIED ENERGY BASELINE (MJ/m²)
    let embodiedEnergyBaseMJ;
    const embodiedEnergyValue = document.getElementById('embodied-energy').value;
    if (embodiedEnergyValue === 'unknown') {
        const embodiedContext = document.getElementById('embodied-context').value;
        embodiedEnergyBaseMJ = embodiedContextMap[embodiedContext] || 9000;
    } else {
        embodiedEnergyBaseMJ = parseFloat(embodiedEnergyValue);
    }
    
    // ✅ OPERATIONAL ENERGY BASELINE (kWh/m²/yr)
    // SEMPRE USA O BASELINE DO PROGRAM TYPE (ignora user input se "unknown")
    let operationalEnergyBaselineKWh = programBaselines[buildingType] || 350;
    
    // Se user forneceu um valor específico (não "unknown"), usa esse
    const operationalEnergyValue = document.getElementById('operational-energy').value;
    if (operationalEnergyValue !== 'unknown' && operationalEnergyValue !== '') {
        operationalEnergyBaselineKWh = parseFloat(operationalEnergyValue);
    }
    
    // ✅ CLIMATE FACTOR
    const climateFactor = climateMultipliers[climate] || 1.0;
    
    // ✅ APPLY CLIMATE TO BASELINE
    const operationalEnergyClimate = operationalEnergyBaselineKWh * climateFactor;
    
    console.log('📊 INPUTS:', {
        buildingType,
        area,
        climate,
        climateFactor,
        selectedMaterials,
        materialFactor,
        embodiedEnergyBaseMJ,
        operationalEnergyBaselineKWh,
        operationalEnergyClimate
    });
    
    // ✅ CALCULATE 7 SCENARIOS
    const scenariosArray = [];
    
    Object.keys(scenarioDefaults).forEach(scenarioKey => {
        const scenario = scenarioDefaults[scenarioKey];
        
        // ✅ EMBODIED ENERGY (MJ) - CORRIGIDO
        // Formula da Valentine: Embodied = Baseline × EmbodiedFactor × (1 - ReuseRate) × Area
        const embodiedEnergyPerM2 = embodiedEnergyBaseMJ * scenario.embodiedFactor * (1 - scenario.reuseRate);
        const embodiedTotalMJ = embodiedEnergyPerM2 * area;
        
        // ✅ OPERATIONAL ENERGY (MJ over lifespan) - CORRIGIDO
        // Formula da Valentine: Operational = Baseline × Climate × (1 - Improvement) × Lifespan × Area × 3.6
        const operationalKWhPerM2PerYear = operationalEnergyClimate * (1 - scenario.operationalImprovement);
        const operationalMJPerM2PerYear = operationalKWhPerM2PerYear * 3.6; // Convert kWh → MJ
        const operationalTotalMJ = operationalMJPerM2PerYear * scenario.lifespan * area;
        
        // ✅ TOTAL LIFECYCLE ENERGY (MJ)
        const totalMJ = embodiedTotalMJ + operationalTotalMJ;
        
        console.log(`📊 ${scenario.displayName}:`, {
            embodiedPerM2: embodiedEnergyPerM2.toFixed(2),
            embodiedTotal: embodiedTotalMJ.toFixed(0),
            operationalPerM2Year: operationalKWhPerM2PerYear.toFixed(2),
            operationalTotal: operationalTotalMJ.toFixed(0),
            total: totalMJ.toFixed(0)
        });
        
        scenariosArray.push({
            name: scenarioKey,
            displayName: scenario.displayName,
            category: scenario.category,
            lifespan: scenario.lifespan,
            embodiedCarbon: Math.round(embodiedTotalMJ),
            operationalCarbon: Math.round(operationalTotalMJ),
            totalCarbon: Math.round(totalMJ)
        });
    });
    
    console.log('✅ CALCULATED 7 SCENARIOS:', scenariosArray);
    
    // ✅ FIND BEST RENOVATION & BEST NEW BUILD
    const renovationScenarios = scenariosArray.filter(s => s.category === 'renovation');
    const newbuildScenarios = scenariosArray.filter(s => s.category === 'newbuild');
    
    const bestRenovation = renovationScenarios.reduce((best, current) => 
        current.totalCarbon < best.totalCarbon ? current : best
    );
    
    const bestNewbuild = newbuildScenarios.reduce((best, current) => 
        current.totalCarbon < best.totalCarbon ? current : best
    );
    
    // ✅ DECISION
    const decision = bestRenovation.totalCarbon < bestNewbuild.totalCarbon ? 'RENOVATE' : 'DEMOLISH & REBUILD';
    const recommended = decision === 'RENOVATE' ? bestRenovation.displayName : bestNewbuild.displayName;
    const savings = Math.abs(bestRenovation.totalCarbon - bestNewbuild.totalCarbon);
    const savingsPercentage = ((savings / Math.max(bestRenovation.totalCarbon, bestNewbuild.totalCarbon)) * 100).toFixed(1);
    
    // ✅ RESULTS OBJECT
    const results = {
        decision: decision,
        recommendedScenario: recommended,
        savings: savings,
        savingsPercent: savingsPercentage,
        bestRenovation: bestRenovation,
        bestNewbuild: bestNewbuild,
        allScenarios: scenariosArray,
        inputs: {
            buildingType: buildingType,
            buildingArea: area,
            lifespan: bestRenovation.lifespan,
            embodiedEnergy: embodiedEnergyBaseMJ,
            operationalEnergy: operationalEnergyBaselineKWh,
            materials: selectedMaterials,
            materialFactor: materialFactor,
            climate: climate,
            climateFactor: climateFactor
        }
    };
    
    console.log('🎯 FINAL RESULTS:', results);
    console.log('🧪 TEST VALIDATION: For 7500 m², Office, Temperate, 9000 MJ/m² embodied');
    console.log('   Scenario 4 (Deep+Demo) total should be ~82M-105M MJ');
    
    displayResults(results);
}

/* ========================================
   DISPLAY RESULTS WITH ANIMATIONS
   ======================================== */
function displayResults(results) {
    console.log('📊 Displaying results:', results);

    const decisionBadge = document.getElementById('decisionBadge');
    const decisionText = document.getElementById('decisionText');
    const resultsTitle = document.getElementById('resultsTitle');

    if (results.decision === 'RENOVATE') {
        if (decisionBadge) {
            decisionBadge.style.background = 'linear-gradient(to right, #047857 0%, #059669 50%, #047857 100%)';
        }
        if (decisionText) {
            decisionText.textContent = 'RENOVATE';
        }
        if (resultsTitle) {
            resultsTitle.textContent = results.recommendedScenario + ' is the better choice';
        }
    } else {
        if (decisionBadge) {
            decisionBadge.style.background = 'linear-gradient(to right, #dc2626 0%, #ef4444 50%, #dc2626 100%)';
        }
        if (decisionText) {
            decisionText.textContent = 'DEMOLISH & REBUILD';
        }
        if (resultsTitle) {
            resultsTitle.textContent = results.recommendedScenario + ' is recommended';
        }
    }

    const savingsAmount = document.getElementById('savingsAmount');
    const savingsPercent = document.getElementById('savingsPercent');
    if (savingsAmount) {
        savingsAmount.textContent = formatNumber(results.savings) + ' MJ';
    }
    if (savingsPercent) {
        savingsPercent.textContent = '(' + results.savingsPercent + '%)';
    }

    animateNumber('renovationTotal', 0, results.bestRenovation.totalCarbon, 1500);
    animateNumber('renovationEmbodied', 0, results.bestRenovation.embodiedCarbon, 1500);
    animateNumber('renovationOperational', 0, results.bestRenovation.operationalCarbon, 1500);
    
    animateNumber('newbuildTotal', 0, results.bestNewbuild.totalCarbon, 1500);
    animateNumber('newbuildEmbodied', 0, results.bestNewbuild.embodiedCarbon, 1500);
    animateNumber('newbuildOperational', 0, results.bestNewbuild.operationalCarbon, 1500);

    if (window.ChartsModule) {
        setTimeout(() => {
            window.ChartsModule.init(results);
        }, 800);
    }

    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';
    resultsSection.style.opacity = '0';
    
    setTimeout(() => {
        resultsSection.style.transition = 'opacity 0.6s ease';
        resultsSection.style.opacity = '1';
        
        resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);

    btnNext.disabled = false;
    btnNext.innerHTML = `
        Calculate Results
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
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
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetTab = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPane = document.getElementById(`tab-${targetTab}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

/* ========================================
   INJECT ANIMATION STYLES
   ======================================== */
function injectAnimationStyles() {
    if (document.getElementById('calculator-animations')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'calculator-animations';
    styleElement.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleElement);
}

/* ========================================
   DEBUG HELPERS
   ======================================== */
window.calculatorDebug = {
    formData: formData,
    scenarioDefaults: scenarioDefaults,
    programBaselines: programBaselines,
    climateMultipliers: climateMultipliers,
    currentStep: () => currentStep,
    validate: () => validateCurrentStep(),
    embodiedContextMap: embodiedContextMap,
    operationalContextMap: operationalContextMap
};

console.log('✅ Calculator initialized with REAL DATA from Valentine Lhoëst (Meeting 2_Data.pdf)');
console.log('📊 7 Scenarios loaded:', Object.keys(scenarioDefaults));
console.log('🌍 6 Climate zones:', Object.keys(climateMultipliers));
console.log('🏢 4 Building types:', Object.keys(programBaselines));
console.log('🔧 Formula: Embodied × Factor × (1 - Reuse) × Area + Operational × Climate × (1 - Improvement) × Lifespan × Area × 3.6');
