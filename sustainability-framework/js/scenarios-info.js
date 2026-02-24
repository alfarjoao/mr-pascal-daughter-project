/**
 * ========================================
 * SCENARIOS INFO MODULE
 * Pop-ups aparecem ABAIXO de cada categoria
 * ========================================
 */

const ScenariosInfoModule = {
    
    // Dados detalhados de cada cenário
    scenariosData: {
        'light-renovation': {
            title: 'Light Renovation',
            badge: 'Renovation',
            badgeClass: 'renovation',
            description: 'A light renovation focuses on cost-effective improvements that enhance energy efficiency without major structural changes. This approach is ideal for buildings in good condition that need modernization with minimal disruption.',
            specs: {
                'Material Reuse': '90%',
                'Embodied Factor': '10%',
                'Energy Improvement': '25%',
                'Expected Lifespan': '17.5 years'
            },
            advantages: [
                'Lowest upfront cost and fastest implementation',
                'Minimal disruption to occupants',
                'Good balance of cost and environmental benefit',
                'Preserves existing structural integrity'
            ],
            considerations: [
                'Lower energy savings compared to deeper renovations',
                'May require additional upgrades sooner',
                'Limited to buildings in relatively good condition',
                'Shorter lifespan before next intervention'
            ]
        },
        
        'medium-renovation': {
            title: 'Medium Renovation',
            badge: 'Renovation',
            badgeClass: 'renovation',
            description: 'Medium renovation strikes a balance between investment and performance, addressing envelope improvements, system upgrades, and moderate structural enhancements. Suitable for buildings requiring significant but not comprehensive updates.',
            specs: {
                'Material Reuse': '70%',
                'Embodied Factor': '27.5%',
                'Energy Improvement': '47.5%',
                'Expected Lifespan': '22.5 years'
            },
            advantages: [
                'Balanced cost-to-benefit ratio',
                'Significant energy savings',
                'Extended building lifespan',
                'Moderate construction timeline'
            ],
            considerations: [
                'Higher cost than light renovation',
                'More disruption during construction',
                'May not achieve net-zero targets',
                'Some structural limitations remain'
            ]
        },
        
        'deep-renovation': {
            title: 'Deep Renovation',
            badge: 'Renovation',
            badgeClass: 'renovation',
            description: 'Deep renovation transforms an existing building to near-new performance standards through comprehensive envelope upgrades, high-efficiency systems, and advanced insulation. This approach maximizes reuse while achieving excellent energy performance.',
            specs: {
                'Material Reuse': '52.5%',
                'Embodied Factor': '45%',
                'Energy Improvement': '70%',
                'Expected Lifespan': '30 years'
            },
            advantages: [
                'Excellent energy performance',
                'Maximizes heritage and material preservation',
                'Long-term value and durability',
                'Can achieve net-zero or near-net-zero operation'
            ],
            considerations: [
                'Higher upfront investment',
                'Longer construction period',
                'Requires careful planning and skilled contractors',
                'May face technical challenges in older buildings'
            ]
        },
        
        'deep-demolition': {
            title: 'Deep + Structural Demolition',
            badge: 'Renovation',
            badgeClass: 'renovation',
            description: 'This scenario involves deep renovation combined with selective structural demolition and reconstruction. It addresses buildings with significant structural issues while still preserving much of the existing fabric, offering a middle ground between full renovation and new construction.',
            specs: {
                'Material Reuse': '42.5%',
                'Embodied Factor': '55%',
                'Energy Improvement': '75%',
                'Expected Lifespan': '35 years'
            },
            advantages: [
                'Addresses major structural deficiencies',
                'High energy performance potential',
                'Flexibility in spatial redesign',
                'Extended lifespan with modern standards'
            ],
            considerations: [
                'Highest renovation cost',
                'Significant embodied carbon from new materials',
                'Long construction timeline',
                'Complex regulatory approvals may be required'
            ]
        },
        
        'code-new': {
            title: 'Code-Compliant New Build',
            badge: 'New Build',
            badgeClass: 'newbuild',
            description: 'A new building designed to meet minimum legal requirements for energy efficiency and carbon emissions. This baseline scenario represents conventional construction practices that comply with current building codes.',
            specs: {
                'Material Reuse': '10%',
                'Embodied Factor': '72.5%',
                'Energy Improvement': '88%',
                'Expected Lifespan': '40 years'
            },
            advantages: [
                'Meets all legal requirements',
                'Predictable performance and costs',
                'Modern construction methods',
                'Lower upfront cost than high-performance options'
            ],
            considerations: [
                'High embodied carbon from new materials',
                'Misses opportunity for leadership in sustainability',
                'May become obsolete as codes tighten',
                'Limited environmental differentiation'
            ]
        },
        
        'highperf-new': {
            title: 'High-Performance New Build',
            badge: 'New Build',
            badgeClass: 'newbuild',
            description: 'A new building that exceeds code requirements with advanced envelope design, high-efficiency systems, and superior insulation. This approach targets low operational energy while acknowledging higher embodied carbon.',
            specs: {
                'Material Reuse': '10%',
                'Embodied Factor': '82.5%',
                'Energy Improvement': '94%',
                'Expected Lifespan': '50 years'
            },
            advantages: [
                'Excellent operational energy performance',
                'Long lifespan reduces lifecycle impact',
                'Market differentiation and tenant appeal',
                'Future-proof against tightening regulations'
            ],
            considerations: [
                'Very high embodied carbon',
                'Higher construction cost',
                'Long payback period for carbon investment',
                'Demolition of existing structure required'
            ]
        },
        
        'lowcarbon-new': {
            title: 'Low-Carbon New Build',
            badge: 'New Build',
            badgeClass: 'newbuild',
            description: 'The most ambitious new-build scenario, utilizing low-carbon materials (timber, recycled content), renewable energy, and cutting-edge passive design. This represents best-practice sustainable construction with minimized embodied and operational carbon.',
            specs: {
                'Material Reuse': '10%',
                'Embodied Factor': '90%',
                'Energy Improvement': '97%',
                'Expected Lifespan': '60 years'
            },
            advantages: [
                'Industry-leading sustainability',
                'Near-zero operational carbon',
                'Very long lifespan',
                'Strong brand and ESG value'
            ],
            considerations: [
                'Highest upfront cost',
                'Requires specialized design and construction expertise',
                'Still involves significant embodied carbon',
                'Demolition impact on existing structure'
            ]
        }
    },

    // Inicialização
    init() {
        console.log('🔍 ScenariosInfoModule initialized');
        this.attachEventListeners();
        this.initTabs();
    },

    // Event Listeners nas Pills
    attachEventListeners() {
        const pills = document.querySelectorAll('.scenario-pill-compact[data-scenario]');
        
        console.log(`📊 Pills encontradas: ${pills.length}`);
        
        if (pills.length === 0) {
            console.error('❌ NENHUMA PILL ENCONTRADA! Verifica o HTML.');
            return;
        }
        
        pills.forEach((pill, index) => {
            const scenarioKey = pill.getAttribute('data-scenario');
            const category = pill.getAttribute('data-category');
            
            console.log(`🎯 Pill ${index + 1}: ${scenarioKey} (${category})`);
            
            pill.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log(`✅ CLIQUE DETECTADO: ${scenarioKey}`);
                this.toggleScenarioDetails(scenarioKey, category, pill);
            });
        });
        
        console.log('✅ Event listeners anexados');
    },

    // Toggle do pop-up
    toggleScenarioDetails(scenarioKey, category, clickedPill) {
        console.log(`🔄 toggleScenarioDetails chamado: ${scenarioKey}, categoria: ${category}`);
        
        // Determina qual container usar baseado na categoria
        const containerId = category === 'renovation' ? 'popup-renovation' : 'popup-newbuild';
        const container = document.getElementById(containerId);
        
        console.log(`📦 Container ID: ${containerId}, existe? ${container ? 'SIM' : 'NÃO'}`);
        
        if (!container) {
            console.error(`❌ Container #${containerId} não encontrado!`);
            return;
        }
        
        // Pega todas as pills da mesma categoria
        const categoryPills = document.querySelectorAll(`.scenario-pill-compact[data-category="${category}"]`);
        console.log(`📌 Pills da categoria ${category}: ${categoryPills.length}`);
        
        // Se a pill já está ativa, fecha o pop-up
        if (clickedPill.classList.contains('active')) {
            console.log('🔽 Fechando pop-up...');
            clickedPill.classList.remove('active');
            container.classList.remove('visible');
            setTimeout(() => {
                container.innerHTML = '';
            }, 500);
            return;
        }

        // Remove active de todas as pills da categoria
        categoryPills.forEach(pill => pill.classList.remove('active'));
        
        // Ativa a pill clicada
        clickedPill.classList.add('active');
        console.log('✅ Pill ativada');
        
        // Gera o HTML do pop-up
        const data = this.scenariosData[scenarioKey];
        if (!data) {
            console.error(`❌ Dados não encontrados para: ${scenarioKey}`);
            return;
        }
        
        console.log('🎨 Gerando HTML do pop-up...');
        const popupHTML = this.generatePopupHTML(data);
        
        // Insere e mostra
        container.innerHTML = popupHTML;
        
        // Força reflow
        void container.offsetHeight;
        
        container.classList.add('visible');
        console.log('✅ Pop-up aberto!');
        
        // Scroll suave
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);

        // Botão de fechar
        const closeBtn = container.querySelector('.detail-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('❌ Botão fechar clicado');
                clickedPill.classList.remove('active');
                container.classList.remove('visible');
                setTimeout(() => {
                    container.innerHTML = '';
                }, 500);
            });
        }
    },

    // Gera HTML do pop-up
    generatePopupHTML(data) {
        const specsHTML = Object.entries(data.specs)
            .map(([label, value]) => `
                <div class="spec-item">
                    <div class="spec-label">${label}</div>
                    <div class="spec-value">${value}</div>
                </div>
            `).join('');

        const advantagesHTML = data.advantages
            .map(item => `<li>${item}</li>`)
            .join('');

        const considerationsHTML = data.considerations
            .map(item => `<li>${item}</li>`)
            .join('');

        return `
            <div class="scenario-detail-popup">
                <div class="detail-header">
                    <div class="detail-title-group">
                        <span class="scenario-badge ${data.badgeClass}">${data.badge}</span>
                        <h3>${data.title}</h3>
                    </div>
                    <button class="detail-close-btn" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <p class="detail-description">${data.description}</p>

                <div class="detail-specs">
                    ${specsHTML}
                </div>

                <div class="detail-lists">
                    <div class="detail-list">
                        <h4>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Key Advantages
                        </h4>
                        <ul>${advantagesHTML}</ul>
                    </div>

                    <div class="detail-list">
                        <h4>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            Considerations
                        </h4>
                        <ul>${considerationsHTML}</ul>
                    </div>
                </div>
            </div>
        `;
    },

    // TABS FUNCTIONALITY
    initTabs() {
        console.log('🎯 Inicializando tabs...');
        
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        if (tabButtons.length === 0 || tabContents.length === 0) {
            console.error('❌ Tabs não encontrados');
            return;
        }
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                console.log(`📑 Mudando para tab: ${targetTab}`);
                
                // Remove active de todos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Adiciona active
                this.classList.add('active');
                
                const targetContent = document.getElementById(`tab-${targetTab}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                } else {
                    console.error(`❌ Conteúdo da tab '${targetTab}' não encontrado`);
                }
            });
        });
        
        console.log('✅ Tabs inicializados');
    }
};

// Auto-inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ScenariosInfoModule.init());
} else {
    ScenariosInfoModule.init();
}
