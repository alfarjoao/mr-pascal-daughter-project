/* ========================================
   BUILDING SUSTAINABILITY FRAMEWORK
   Charts Module - 7 Scenarios Visualization
   VERSÃO CORRIGIDA PARA VERCEL
   ======================================== */

const ChartsModule = (function() {
    let barChart, pieChart, lineChart;
    let resultsData = null;

    // Chart.js default config
    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        Chart.defaults.color = '#64748b';
        console.log('✅ Chart.js detected and configured');
    } else {
        console.error('❌ Chart.js NOT LOADED! Check CDN link in HTML');
    }

    function init(data) {
        console.log('📊 ChartsModule.init() called with data:', data);
        
        if (!data || !data.allScenarios || !Array.isArray(data.allScenarios)) {
            console.error('❌ Invalid data structure:', data);
            return;
        }
        
        console.log('✅ Data validation passed. Scenarios:', data.allScenarios.length);
        
        resultsData = data;
        
        // Destroy existing charts
        destroyCharts();
        
        // Create new charts with delay
        setTimeout(() => {
            console.log('📊 Creating charts...');
            createBarChart();
            createPieChart();
            createLineChart();
            createComparisonTable();
        }, 300);
    }

    function destroyCharts() {
        if (barChart) {
            barChart.destroy();
            barChart = null;
        }
        if (pieChart) {
            pieChart.destroy();
            pieChart = null;
        }
        if (lineChart) {
            lineChart.destroy();
            lineChart = null;
        }
    }

    /* ========================================
       BAR CHART - 7 SCENARIOS COMPARISON
       ======================================== */
    function createBarChart() {
        const ctx = document.getElementById('barChart');
        
        if (!ctx || !resultsData) {
            console.error('❌ Bar chart: Missing canvas or data');
            return;
        }

        const scenarios = resultsData.allScenarios;
        
        const sortedScenarios = scenarios.slice().sort((a, b) => 
            a.totalCarbon - b.totalCarbon
        );

        const labels = sortedScenarios.map(s => s.displayName);
        const embodiedData = sortedScenarios.map(s => s.embodiedCarbon);
        const operationalData = sortedScenarios.map(s => s.operationalCarbon);
        
        const colors = sortedScenarios.map(s => 
            s.category === 'renovation' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(14, 165, 233, 0.8)'
        );
        const borderColors = sortedScenarios.map(s => 
            s.category === 'renovation' ? '#10b981' : '#0ea5e9'
        );

        try {
            barChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Embodied Carbon',
                            data: embodiedData,
                            backgroundColor: colors,
                            borderColor: borderColors,
                            borderWidth: 2,
                            borderRadius: 8,
                        },
                        {
                            label: 'Operational Carbon',
                            data: operationalData,
                            backgroundColor: colors.map(c => c.replace('0.8', '0.5')),
                            borderColor: borderColors,
                            borderWidth: 2,
                            borderRadius: 8,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,  // ✅ CORRIGIDO
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: '7-Scenario Carbon Comparison',
                            font: { size: 18, weight: 'bold' },
                            color: '#1f2937',
                            padding: { bottom: 20 }
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                font: { size: 13, weight: '600' },
                                padding: 15,
                                usePointStyle: true,
                                pointStyle: 'rectRounded'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(31, 41, 55, 0.95)',
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 13 },
                            padding: 12,
                            cornerRadius: 8,
                            displayColors: true,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + 
                                           context.parsed.y.toLocaleString() + ' tCO₂e';
                                },
                                footer: function(tooltipItems) {
                                    const total = tooltipItems.reduce((sum, item) => sum + item.parsed.y, 0);
                                    return 'Total: ' + total.toLocaleString() + ' tCO₂e';
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            grid: { display: false },
                            ticks: {
                                font: { size: 10, weight: '600' },
                                color: '#374151',
                                maxRotation: 45,
                                minRotation: 0
                            }
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            grid: {
                                color: '#e5e7eb',
                                lineWidth: 1
                            },
                            ticks: {
                                font: { size: 12 },
                                color: '#6b7280',
                                callback: function(value) {
                                    return value.toLocaleString() + ' tCO₂e';
                                }
                            },
                            title: {
                                display: true,
                                text: 'Total Carbon Emissions (tCO₂e)',
                                font: { size: 13, weight: '600' },
                                color: '#374151'
                            }
                        }
                    }
                }
            });
            
            console.log('✅ BAR CHART created');
            
        } catch (error) {
            console.error('❌ Error creating bar chart:', error);
        }
    }

    /* ========================================
       PIE CHART - BREAKDOWN (BEST SCENARIOS)
       ======================================== */
    function createPieChart() {
        const ctx = document.getElementById('pieChart');
        
        if (!ctx || !resultsData) {
            console.error('❌ Pie chart: Missing canvas or data');
            return;
        }

        const bestRenovation = resultsData.bestRenovation;
        const bestNewbuild = resultsData.bestNewbuild;
        
        if (!bestRenovation || !bestNewbuild) {
            console.error('❌ Missing best scenarios');
            return;
        }

        try {
            pieChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: [
                        bestRenovation.displayName + ' (Embodied)',
                        bestRenovation.displayName + ' (Operational)',
                        bestNewbuild.displayName + ' (Embodied)',
                        bestNewbuild.displayName + ' (Operational)'
                    ],
                    datasets: [{
                        data: [
                            bestRenovation.embodiedCarbon,
                            bestRenovation.operationalCarbon,
                            bestNewbuild.embodiedCarbon,
                            bestNewbuild.operationalCarbon
                        ],
                        backgroundColor: [
                            '#10b981',
                            '#34d399',
                            '#0ea5e9',
                            '#38bdf8'
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 3,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,  // ✅ CORRIGIDO
                    plugins: {
                        title: {
                            display: true,
                            text: 'Carbon Breakdown: Best Renovation vs Best New Build',
                            font: { size: 18, weight: 'bold' },
                            color: '#1f2937',
                            padding: { bottom: 20 }
                        },
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                font: { size: 11, weight: '600' },
                                padding: 12,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(31, 41, 55, 0.95)',
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 13 },
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return context.label + ': ' + value.toLocaleString() + 
                                           ' tCO₂e (' + percentage + '%)';
                                }
                            }
                        }
                    }
                }
            });
            
            console.log('✅ PIE CHART created');
            
        } catch (error) {
            console.error('❌ Error creating pie chart:', error);
        }
    }

    /* ========================================
       LINE CHART - TIMELINE (CUMULATIVE)
       ======================================== */
    function createLineChart() {
        const ctx = document.getElementById('lineChart');
        
        if (!ctx || !resultsData) {
            console.error('❌ Line chart: Missing canvas or data');
            return;
        }

        const scenarios = resultsData.allScenarios;
        const lifespan = resultsData.inputs.lifespan;
        
        const years = Array.from({ length: Math.min(lifespan + 1, 101) }, (_, i) => i);
        
        const datasets = scenarios.map((scenario) => {
            const embodied = scenario.embodiedCarbon;
            const operationalPerYear = scenario.operationalCarbon / lifespan;
            
            const cumulativeData = years.map(year => 
                Math.round(embodied + (operationalPerYear * year))
            );
            
            const isRenovation = scenario.category === 'renovation';
            
            const renovationColors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
            const newbuildColors = ['#0ea5e9', '#38bdf8', '#7dd3fc'];
            
            let color;
            if (isRenovation) {
                const renovationIndex = ['light-renovation', 'medium-renovation', 'deep-renovation', 'deep-renovation-demolition'].indexOf(scenario.name);
                color = renovationColors[renovationIndex >= 0 ? renovationIndex : 0];
            } else {
                const newbuildIndex = ['code-compliant-new', 'high-performance-new', 'low-carbon-new'].indexOf(scenario.name);
                color = newbuildColors[newbuildIndex >= 0 ? newbuildIndex : 0];
            }
            
            return {
                label: scenario.displayName,
                data: cumulativeData,
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 2.5,
                tension: 0.4,
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            };
        });

        try {
            lineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years.map(y => 'Year ' + y),
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,  // ✅ CORRIGIDO
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Cumulative Carbon Over Building Lifespan (7 Scenarios)',
                            font: { size: 18, weight: 'bold' },
                            color: '#1f2937',
                            padding: { bottom: 20 }
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                font: { size: 9, weight: '600' },
                                padding: 6,
                                usePointStyle: true,
                                pointStyle: 'line',
                                boxWidth: 25
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(31, 41, 55, 0.95)',
                            titleFont: { size: 13, weight: 'bold' },
                            bodyFont: { size: 12 },
                            padding: 10,
                            cornerRadius: 8,
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
                            grid: { display: false },
                            ticks: {
                                font: { size: 10 },
                                color: '#6b7280',
                                maxTicksLimit: 15,
                                callback: function(value, index) {
                                    const year = years[index];
                                    const interval = lifespan > 50 ? 10 : 5;
                                    return year % interval === 0 ? 'Year ' + year : '';
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#e5e7eb',
                                lineWidth: 1
                            },
                            ticks: {
                                font: { size: 11 },
                                color: '#6b7280',
                                callback: function(value) {
                                    if (value >= 1000) {
                                        return (value / 1000).toFixed(0) + 'k';
                                    }
                                    return value.toLocaleString();
                                }
                            },
                            title: {
                                display: true,
                                text: 'Cumulative Carbon (tCO₂e)',
                                font: { size: 12, weight: '600' },
                                color: '#374151'
                            }
                        }
                    }
                }
            });
            
            console.log('✅ LINE CHART created');
            
        } catch (error) {
            console.error('❌ Error creating line chart:', error);
        }
    }

    /* ========================================
       COMPARISON TABLE - 7 SCENARIOS
       ======================================== */
    function createComparisonTable() {
        const table = document.getElementById('comparisonTable');
        
        if (!table || !resultsData) {
            console.error('❌ Table: Missing element or data');
            return;
        }

        const tbody = table.querySelector('tbody');
        
        if (!tbody) {
            console.error('❌ Table: Missing tbody');
            return;
        }
        
        tbody.innerHTML = '';

        const scenarios = resultsData.allScenarios;
        
        const bestEmbodied = Math.min(...scenarios.map(s => s.embodiedCarbon));
        const bestOperational = Math.min(...scenarios.map(s => s.operationalCarbon));
        const bestTotal = Math.min(...scenarios.map(s => s.totalCarbon));

        // Row 1: Total Carbon
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td class="metric-name"><strong>Total Carbon</strong></td>
            ${scenarios.map(s => {
                const isBest = s.totalCarbon === bestTotal;
                return `<td class="${isBest ? 'best-value' : ''}">
                    ${s.totalCarbon.toLocaleString()} tCO₂e
                    ${isBest ? ' <span style="color: #10b981;">✓</span>' : ''}
                </td>`;
            }).join('')}
        `;
        tbody.appendChild(totalRow);

        // Row 2: Embodied Carbon
        const embodiedRow = document.createElement('tr');
        embodiedRow.innerHTML = `
            <td class="metric-name">Embodied Carbon</td>
            ${scenarios.map(s => {
                const isBest = s.embodiedCarbon === bestEmbodied;
                return `<td class="${isBest ? 'best-value' : ''}">
                    ${s.embodiedCarbon.toLocaleString()} tCO₂e
                    ${isBest ? ' <span style="color: #10b981;">✓</span>' : ''}
                </td>`;
            }).join('')}
        `;
        tbody.appendChild(embodiedRow);

        // Row 3: Operational Carbon
        const operationalRow = document.createElement('tr');
        operationalRow.innerHTML = `
            <td class="metric-name">Operational Carbon</td>
            ${scenarios.map(s => {
                const isBest = s.operationalCarbon === bestOperational;
                return `<td class="${isBest ? 'best-value' : ''}">
                    ${s.operationalCarbon.toLocaleString()} tCO₂e
                    ${isBest ? ' <span style="color: #10b981;">✓</span>' : ''}
                </td>`;
            }).join('')}
        `;
        tbody.appendChild(operationalRow);

        // Row 4: Category
        const categoryRow = document.createElement('tr');
        categoryRow.innerHTML = `
            <td class="metric-name">Category</td>
            ${scenarios.map(s => 
                `<td style="font-weight: 500;">${s.category === 'renovation' ? '🔨 Renovation' : '🏗️ New Build'}</td>`
            ).join('')}
        `;
        tbody.appendChild(categoryRow);
        
        console.log('✅ TABLE created with', scenarios.length, 'scenarios');
    }

    /* ========================================
       PUBLIC API
       ======================================== */
    return {
        init: init,
        destroy: destroyCharts
    };
})();

// Expose to global scope
window.ChartsModule = ChartsModule;

console.log('✨ Charts module loaded (7 scenarios, Vercel-optimized)');
