/* ========================================
   BUILDING SUSTAINABILITY FRAMEWORK
   Calculator Logic - 7 Scenarios Comparison
   ======================================== */

// State Management
let currentStep = 1;
const totalSteps = 2;
let formData = {};

// 7 CENÁRIOS COM VALORES PLACEHOLDER (Valentine vai fornecer os reais)
const scenarioDefaults = {
    'light-renovation': {
        name: 'Light Renovation',
        reuseRate: 0.90,
        embodiedFactor: 0.15,
        operationalImprovement: 0.25,
        category: 'renovation'
    },
    'medium-renovation': {
        name: 'Medium Renovation',
        reuseRate: 0.70,
        embodiedFactor: 0.35,
        operationalImprovement: 0.40,
        category: 'renovation'
    },
    'deep-renovation': {
        name: 'Deep Renovation',
        reuseRate: 0.50,
        embodiedFactor: 0.60,
        operationalImprovement: 0.55,
        category: 'renovation'
    },
    'deep-renovation-demolition': {
        name: 'Deep Renovation + Slight Demolition',
        reuseRate: 0.40,
        embodiedFactor: 0.75,
        operationalImprovement: 0.60,
        category: 'renovation'
    },
    'code-compliant-new': {
        name: 'Code-Compliant New Build',
        reuseRate: 0.10,
        embodiedFactor: 1.50,
        operationalImprovement: 0.60,
        category: 'newbuild'
    },
    'high-performance-new': {
        name: 'High-Performance New Build',
        reuseRate: 0.05,
        embodiedFactor: 1.30,
        operationalImprovement: 0.75,
        category: 'newbuild'
    },
    'low-carbon-new': {
        name: 'Low-Carbon New Build',
        reuseRate: 0.15,
        embodiedFactor: 0.90,
        operationalImprovement: 0.80,
        category: 'newbuild'
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

// ✅ MAPEAMENTO "UNKNOWN" → VALORES ESTIMADOS
const embodiedContextMap = {
    'light-construction': 300,
    'medium-construction': 500,
    'heavy-construction': 700,
    'existing-building': 125
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
    setupMaterialDropdown(); // ✅ NOVO
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
    
    // Toggle dropdown ao clicar no trigger
    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = dropdownContainer.style.display === 'block';
        
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });
    
    // Atualizar placeholder quando checkboxes mudam
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updatePlaceholder();
            validateMaterialDropdown();
        });
    });
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Prevenir dropdown close ao clicar dentro
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
    
    // Check if required and empty
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

    // ✅ Validar material dropdown separadamente
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
   CALCULATIONS - 7 SCENARIOS
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
    const buildingType = document.getElementById('building-type').value;
    const area = parseFloat(document.getElementById('building-area').value);
    const lifespan = parseFloat(document.getElementById('lifespan').value);
    const climate = document.getElementById('climate-zone').value;
    
    // ✅ MATERIAL MULTI-SELECT (CUSTOM DROPDOWN)
    const materialDropdown = document.getElementById('material-dropdown');
    const materialCheckboxes = materialDropdown.querySelectorAll('input[type="checkbox"]:checked');
    const selectedMaterials = Array.from(materialCheckboxes).map(cb => cb.value);
    
    const materialFactor = selectedMaterials.length > 0
        ? selectedMaterials.reduce((sum, mat) => sum + (materialFactors[mat] || 1.0), 0) / selectedMaterials.length
        : 1.0;
    
    // ✅ EMBODIED ENERGY (COM "UNKNOWN" SUPPORT)
    let embodiedEnergy;
    const embodiedEnergyValue = document.getElementById('embodied-energy').value;
    if (embodiedEnergyValue === 'unknown') {
        const embodiedContext = document.getElementById('embodied-context').value;
        embodiedEnergy = embodiedContextMap[embodiedContext] || 500;
    } else {
        embodiedEnergy = parseFloat(embodiedEnergyValue);
    }
    
    // ✅ OPERATIONAL ENERGY (COM "UNKNOWN" SUPPORT)
    let operationalEnergy;
    const operationalEnergyValue = document.getElementById('operational-energy').value;
    if (operationalEnergyValue === 'unknown') {
        const operationalContext = document.getElementById('operational-context').value;
        operationalEnergy = operationalContextMap[operationalContext] || 150;
    } else {
        operationalEnergy = parseFloat(operationalEnergyValue);
    }
    
    const userReuseRate = parseFloat(document.getElementById('reuse-rate').value) / 100;
    const climateFactor = climateMultipliers[climate] || 1.0;

    const scenarios = {};
    
    Object.keys(scenarioDefaults).forEach(scenarioKey => {
        const scenario = scenarioDefaults[scenarioKey];
        
        const reuseRate = userReuseRate;
        const embodiedFactor = scenario.embodiedFactor;
        const operationalImprovement = scenario.operationalImprovement;

        const embodiedCarbon = embodiedEnergy * area * embodiedFactor * materialFactor * (1 - reuseRate);
        const operationalCarbon = operationalEnergy * (1 - operationalImprovement) * area * climateFactor * lifespan * 0.5;
        const totalCarbon = embodiedCarbon + operationalCarbon;

        scenarios[scenarioKey] = {
            name: scenario.name,
            category: scenario.category,
            embodiedCarbon: Math.round(embodiedCarbon),
            operationalCarbon: Math.round(operationalCarbon),
            totalCarbon: Math.round(totalCarbon)
        };
    });

    console.log('📊 Calculated 7 scenarios:', scenarios);
    console.log('🏢 Building Type:', buildingType);
    console.log('🧱 Selected Materials:', selectedMaterials, '→ Factor:', materialFactor.toFixed(2));

    const renovationScenarios = Object.keys(scenarios).filter(k => scenarios[k].category === 'renovation');
    const newbuildScenarios = Object.keys(scenarios).filter(k => scenarios[k].category === 'newbuild');

    const bestRenovationKey = renovationScenarios.reduce((best, current) => 
        scenarios[current].totalCarbon < scenarios[best].totalCarbon ? current : best
    );

    const bestNewbuildKey = newbuildScenarios.reduce((best, current) => 
        scenarios[current].totalCarbon < scenarios[best].totalCarbon ? current : best
    );

    const bestRenovation = scenarios[bestRenovationKey];
    const bestNewbuild = scenarios[bestNewbuildKey];

    const decision = bestRenovation.totalCarbon < bestNewbuild.totalCarbon ? 'RENOVATE' : 'DEMOLISH & REBUILD';
    const recommended = decision === 'RENOVATE' ? bestRenovation.name : bestNewbuild.name;
    const savings = Math.abs(bestRenovation.totalCarbon - bestNewbuild.totalCarbon);
    const savingsPercentage = ((savings / Math.max(bestRenovation.totalCarbon, bestNewbuild.totalCarbon)) * 100).toFixed(1);

    const results = {
        decision: decision,
        recommended: recommended,
        savings: savings,
        savingsPercent: savingsPercentage,
        bestRenovation: bestRenovation,
        bestNewbuild: bestNewbuild,
        allScenarios: scenarios,
        inputs: {
            buildingType: buildingType,
            buildingArea: area,
            lifespan: lifespan,
            embodiedEnergy: embodiedEnergy,
            operationalEnergy: operationalEnergy,
            materials: selectedMaterials,
            materialFactor: materialFactor,
            climate: climate,
            reuseRate: userReuseRate * 100
        }
    };

    console.log('✅ Final results:', results);

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
            resultsTitle.textContent = results.recommended + ' is the better choice';
        }
    } else {
        if (decisionBadge) {
            decisionBadge.style.background = 'linear-gradient(to right, #dc2626 0%, #ef4444 50%, #dc2626 100%)';
        }
        if (decisionText) {
            decisionText.textContent = 'DEMOLISH & REBUILD';
        }
        if (resultsTitle) {
            resultsTitle.textContent = results.recommended + ' is recommended';
        }
    }

    const savingsAmount = document.getElementById('savingsAmount');
    const savingsPercent = document.getElementById('savingsPercent');
    if (savingsAmount) {
        savingsAmount.textContent = formatNumber(results.savings) + ' tCO₂e';
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
        btn.addEventListener('click', () => {
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
   ANIMATIONS CSS (inject into page)
   ======================================== */
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
        20%, 40%, 60%, 80% { transform: translateX(8px); }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
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
    
    .form-input.input-valid,
    .form-select.input-valid {
        border-color: #10b981 !important;
        background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 12L11 14L15 10' stroke='%2310b981' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='12' cy='12' r='10' stroke='%2310b981' stroke-width='2'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 22px;
        padding-right: 45px;
    }
    
    .form-input.input-invalid,
    .form-select.input-invalid {
        border-color: #ef4444 !important;
        background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10' stroke='%23ef4444' stroke-width='2'/%3E%3Cpath d='M12 8V12M12 16H12.01' stroke='%23ef4444' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 22px;
        padding-right: 45px;
    }
    
    /* ✅ CUSTOM MULTISELECT DROPDOWN STYLES */
    .custom-multiselect {
        position: relative;
        width: 100%;
    }
    
    .multiselect-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.875rem 1rem;
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 52px;
    }
    
    .multiselect-trigger:hover {
        border-color: #047857;
    }
    
    .multiselect-trigger:focus {
        outline: none;
        border-color: #047857;
        box-shadow: 0 0 0 3px rgba(4, 120, 87, 0.1);
    }
    
    .custom-multiselect.open .multiselect-trigger {
        border-color: #047857;
        box-shadow: 0 0 0 3px rgba(4, 120, 87, 0.1);
    }
    
    .multiselect-placeholder {
        flex: 1;
        color: #9ca3af;
        font-size: 1rem;
    }
    
    .multiselect-arrow {
        transition: transform 0.2s ease;
        stroke: #6b7280;
        flex-shrink: 0;
    }
    
    .custom-multiselect.open .multiselect-arrow {
        transform: rotate(180deg);
    }
    
    .multiselect-dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        right: 0;
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        z-index: 100;
        max-height: 320px;
        overflow-y: auto;
        padding: 0.5rem;
    }
    
    .checkbox-item {
        display: flex;
        align-items: center;
        padding: 0.875rem 1rem;
        cursor: pointer;
        border-radius: 6px;
        transition: background 0.15s ease;
        margin-bottom: 0.25rem;
        user-select: none;
    }
    
    .checkbox-item:hover {
        background: #f9fafb;
    }
    
    .checkbox-item:last-child {
        margin-bottom: 0;
    }
    
    .checkbox-item input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }
    
    .checkbox-custom {
        width: 22px;
        height: 22px;
        border: 2.5px solid #d1d5db;
        border-radius: 5px;
        margin-right: 0.875rem;
        flex-shrink: 0;
        transition: all 0.2s ease;
        position: relative;
        background: white;
    }
    
    .checkbox-item:hover .checkbox-custom {
        border-color: #047857;
    }
    
    .checkbox-item input[type="checkbox"]:checked + .checkbox-custom {
        background: #047857;
        border-color: #047857;
    }
    
    .checkbox-item input[type="checkbox"]:checked + .checkbox-custom::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 6px;
        height: 11px;
        border: solid white;
        border-width: 0 2.5px 2.5px 0;
        transform: rotate(45deg);
    }
    
    .checkbox-label {
        flex: 1;
        font-size: 1rem;
        color: #111827;
        font-weight: 500;
    }
    
    .checkbox-item input[type="checkbox"]:checked ~ .checkbox-label {
        color: #047857;
        font-weight: 600;
    }
    
    /* VALIDATION STATES */
    .custom-multiselect.input-valid .multiselect-trigger {
        border-color: #10b981 !important;
    }
    
    .custom-multiselect.input-invalid .multiselect-trigger {
        border-color: #ef4444 !important;
    }
    
    .multiselect-dropdown::-webkit-scrollbar {
        width: 8px;
    }
    
    .multiselect-dropdown::-webkit-scrollbar-track {
        background: #f3f4f6;
        border-radius: 4px;
    }
    
    .multiselect-dropdown::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
    }
    
    .multiselect-dropdown::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
    }
    
    .input-error-message {
        display: none;
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        font-weight: 500;
        padding-left: 0.25rem;
        animation: fadeIn 0.3s ease-in;
    }
    
    .input-error-message::before {
        content: '⚠ ';
        margin-right: 0.25rem;
    }
    
    .validation-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.95rem;
        z-index: 9999;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 40px rgba(239, 68, 68, 0.35);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        border-left: 4px solid #dc2626;
    }
    
    .validation-notification svg {
        flex-shrink: 0;
        width: 22px;
        height: 22px;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animationStyles);

/* ========================================
   DEBUG HELPERS
   ======================================== */
window.calculatorDebug = {
    formData: formData,
    scenarioDefaults: scenarioDefaults,
    currentStep: () => currentStep,
    validate: () => validateCurrentStep(),
    embodiedContextMap: embodiedContextMap,
    operationalContextMap: operationalContextMap
};

console.log('✨ Calculator initialized with 7-scenario comparison logic (including Deep Renovation + Slight Demolition)');
