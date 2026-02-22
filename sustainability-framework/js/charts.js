/**
 * Building Sustainability Framework - Charts Module
 * Handles all data visualizations (Bar, Pie, Line, Table)
 */

const ChartsModule = {
    // Chart instances
    barChart: null,
    pieChart: null,
    lineChart: null,

    // Chart color palette
    colors: {
        renovation: {
            primary: '#047857',
            light: '#10b981',
            dark: '#065f46'
        },
        newbuild: {
            primary: '#dc2626',
            light: '#ef4444',
            dark: '#991b1b'
        },
        embodied: '#f59e0b',
        operational: '#3b82f6'
    },

    /**
     * Initialize all charts with calculation results
     * @param {Object} results - Calculation results from calculator.js
     */
    init(results) {
        console.log('📊 Initializing charts with results:', results);
        
        this.createBarChart(results);
        this.createPieChart(results);
        this.createLineChart(results);
        this.createComparisonTable(results);
    },

    /**
     * BAR CHART: Embodied vs Operational Carbon Comparison
     */
    createBarChart(results) {
        const ctx = document.getElementById('barChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.barChart) {
            this.barChart.destroy();
        }

        this.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Renovation', 'New Build'],
                datasets: [
                    {
                        label: 'Embodied Carbon',
                        data: [
                            results.renovation.embodiedCarbon,
                            results.newBuild.embodiedCarbon
                        ],
                        backgroundColor: this.colors.embodied,
                        borderRadius: 8
                    },
                    {
                        label: 'Operational Carbon',
                        data: [
                            results.renovation.operationalCarbon,
                            results.newBuild.operationalCarbon
                        ],
                        backgroundColor: this.colors.operational,
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15,
                            font: { size: 13, weight: '500' },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                       context.parsed.y.toLocaleString() + ' tCO₂e';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: { display: false }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + ' t';
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * PIE CHART: Carbon Breakdown Percentages
     */
    createPieChart(results) {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;

        if (this.pieChart) {
            this.pieChart.destroy();
        }

        const total = results.renovation.totalCarbon;
        const embodiedPercent = (results.renovation.embodiedCarbon / total * 100).toFixed(1);
        const operationalPercent = (results.renovation.operationalCarbon / total * 100).toFixed(1);

        this.pieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    `Embodied Carbon (${embodiedPercent}%)`,
                    `Operational Carbon (${operationalPercent}%)`
                ],
                datasets: [{
                    data: [
                        results.renovation.embodiedCarbon,
                        results.renovation.operationalCarbon
                    ],
                    backgroundColor: [
                        this.colors.embodied,
                        this.colors.operational
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12, weight: '500' },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percent = ((value / total) * 100).toFixed(1);
                                return context.label + ': ' + 
                                       value.toLocaleString() + ' tCO₂e (' + percent + '%)';
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * LINE CHART: Lifecycle Carbon Timeline (Year-by-Year)
     */
    createLineChart(results) {
        const ctx = document.getElementById('lineChart');
        if (!ctx) return;

        if (this.lineChart) {
            this.lineChart.destroy();
        }

        const lifespan = results.inputs.lifespan;
        const years = Array.from({length: lifespan + 1}, (_, i) => i);

        // Calculate cumulative carbon over time
        const renovationData = years.map(year => {
            const embodied = results.renovation.embodiedCarbon;
            const operational = (results.renovation.operationalCarbon / lifespan) * year;
            return embodied + operational;
        });

        const newBuildData = years.map(year => {
            const embodied = results.newBuild.embodiedCarbon;
            const operational = (results.newBuild.operationalCarbon / lifespan) * year;
            return embodied + operational;
        });

        this.lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Renovation',
                        data: renovationData,
                        borderColor: this.colors.renovation.primary,
                        backgroundColor: this.colors.renovation.light + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'New Build',
                        data: newBuildData,
                        borderColor: this.colors.newbuild.primary,
                        backgroundColor: this.colors.newbuild.light + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15,
                            font: { size: 13, weight: '500' },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return 'Year ' + context[0].label;
                            },
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                       context.parsed.y.toLocaleString() + ' tCO₂e';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Years',
                            font: { size: 12, weight: '600' }
                        },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cumulative Carbon (tCO₂e)',
                            font: { size: 12, weight: '600' }
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + ' t';
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * COMPARISON TABLE: All 3 Scenarios Side-by-Side
     */
    createComparisonTable(results) {
        const tbody = document.querySelector('#comparisonTable tbody');
        if (!tbody) {
            console.warn('⚠️ Comparison table tbody not found');
            return;
        }

        // Calculate Light & Deep renovation scenarios
        const light = this.calculateScenario('light', results.inputs);
        const deep = this.calculateScenario('deep', results.inputs);
        const newBuild = results.newBuild;

        const scenarios = [
            { name: 'Light Renovation', data: light },
            { name: 'Deep Renovation', data: deep },
            { name: 'New Build', data: newBuild }
        ];

        const metrics = [
            { label: 'Total Carbon', key: 'totalCarbon', unit: ' tCO₂e', lower: true },
            { label: 'Embodied Carbon', key: 'embodiedCarbon', unit: ' tCO₂e', lower: true },
            { label: 'Operational Carbon', key: 'operationalCarbon', unit: ' tCO₂e', lower: true },
            { label: 'Material Reuse Rate', key: 'reuseRate', unit: '%', higher: true },
            { label: 'Carbon per m²', key: 'carbonPerM2', unit: ' kgCO₂e/m²', lower: true }
        ];

        tbody.innerHTML = '';

        metrics.forEach(metric => {
            const row = document.createElement('tr');
            
            // Metric name
            const nameCell = document.createElement('td');
            nameCell.className = 'metric-name';
            nameCell.textContent = metric.label;
            row.appendChild(nameCell);

            // Values for each scenario
            const values = scenarios.map(s => {
                const val = s.data[metric.key];
                // Handle undefined/null/NaN values
                return (val !== undefined && val !== null && !isNaN(val)) ? val : 0;
            });
            
            const bestValue = metric.lower 
                ? Math.min(...values) 
                : Math.max(...values);

            scenarios.forEach((scenario, i) => {
                const cell = document.createElement('td');
                const value = values[i];
                
                // Format number safely
                const formattedValue = typeof value === 'number' && !isNaN(value)
                    ? value.toLocaleString('en-US', { maximumFractionDigits: 1 })
                    : '0';
                
                cell.textContent = formattedValue + metric.unit;
                
                if (value === bestValue && value !== 0) {
                    cell.classList.add('best-value');
                }
                
                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });
        
        console.log('✅ Comparison table created');
    },

    /**
     * Calculate scenario carbon based on type
     */
    calculateScenario(type, inputs) {
        // Validate inputs
        if (!inputs || typeof inputs !== 'object') {
            console.error('❌ Invalid inputs for scenario calculation');
            return this.getEmptyScenario();
        }

        const scenarioDefaults = {
            light: { reuseRate: 90, embodiedFactor: 0.15, operationalImprovement: 0.25 },
            deep: { reuseRate: 50, embodiedFactor: 0.50, operationalImprovement: 0.50 }
        };

        const scenario = scenarioDefaults[type];
        if (!scenario) {
            console.error(`❌ Unknown scenario type: ${type}`);
            return this.getEmptyScenario();
        }

        const materialFactors = { 
            concrete: 1.0, 
            steel: 1.3, 
            timber: 0.7, 
            masonry: 0.9, 
            mixed: 1.0 
        };
        
        const climateMultipliers = { 
            cold: 1.2, 
            temperate: 1.0, 
            warm: 0.9, 
            hot: 1.1 
        };

        // Safely get values with defaults
        const buildingArea = parseFloat(inputs.buildingArea) || 0;
        const lifespan = parseFloat(inputs.lifespan) || 0;
        const embodiedEnergy = parseFloat(inputs.embodiedEnergy) || 0;
        const operationalEnergy = parseFloat(inputs.operationalEnergy) || 0;
        const material = inputs.material || 'concrete';
        const climate = inputs.climate || 'temperate';

        const materialFactor = materialFactors[material] || 1.0;
        const climateFactor = climateMultipliers[climate] || 1.0;

        // Calculate carbon values
        const embodiedCarbon = 
            embodiedEnergy * 
            buildingArea * 
            scenario.embodiedFactor * 
            materialFactor * 
            (1 - scenario.reuseRate / 100);

        const operationalCarbon = 
            operationalEnergy * 
            (1 - scenario.operationalImprovement) * 
            buildingArea * 
            climateFactor * 
            lifespan;

        const totalCarbon = embodiedCarbon + operationalCarbon;
        const carbonPerM2 = buildingArea > 0 ? totalCarbon / buildingArea : 0;

        return {
            totalCarbon: Math.round(totalCarbon),
            embodiedCarbon: Math.round(embodiedCarbon),
            operationalCarbon: Math.round(operationalCarbon),
            reuseRate: scenario.reuseRate,
            carbonPerM2: Math.round(carbonPerM2)
        };
    },

    /**
     * Return empty scenario object (fallback)
     */
    getEmptyScenario() {
        return {
            totalCarbon: 0,
            embodiedCarbon: 0,
            operationalCarbon: 0,
            reuseRate: 0,
            carbonPerM2: 0
        };
    },

    /**
     * Destroy all charts (for cleanup)
     */
    destroy() {
        if (this.barChart) this.barChart.destroy();
        if (this.pieChart) this.pieChart.destroy();
        if (this.lineChart) this.lineChart.destroy();
    }
};

// Expose to global scope
window.ChartsModule = ChartsModule;
