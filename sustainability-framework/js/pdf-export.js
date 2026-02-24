/* ========================================
   BUILDING SUSTAINABILITY FRAMEWORK
   PDF Export Module - 4 Pages with 7 Scenarios
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadPdfBtn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generatePDF);
    }
});

async function generatePDF() {
    const button = document.getElementById('downloadPdfBtn');
    
    // Disable button and show loading
    button.disabled = true;
    button.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="60" stroke-dashoffset="20" opacity="0.25"/>
        </svg>
        Generating PDF...
    `;

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);

        // ====================================
        // PAGE 1: HEADER + DECISION + RESULTS
        // ====================================
        
        // Header with dark green background
        pdf.setFillColor(4, 120, 87); // #047857
        pdf.rect(0, 0, pageWidth, 40, 'F');
        
        // Title
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SustainaBuild', margin, 20);
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Carbon Analysis Report (7 Scenarios)', margin, 28);
        
        // Generation date
        const today = new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
        pdf.setFontSize(10);
        pdf.text('Generated: ' + today, pageWidth - margin - 40, 28);

        // Reset text color
        pdf.setTextColor(31, 41, 55);

        // Decision Badge
        const decisionText = document.getElementById('decisionText')?.textContent || 'RENOVATE';
        const resultsTitle = document.getElementById('resultsTitle')?.textContent || 'Renovation is the better choice';
        
        const isRenovate = decisionText === 'RENOVATE';
        pdf.setFillColor(isRenovate ? 4 : 220, isRenovate ? 120 : 38, isRenovate ? 87 : 38);
        pdf.roundedRect(margin, 50, contentWidth, 20, 3, 3, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(decisionText, margin + 5, 58);
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.text(resultsTitle, margin + 5, 65);

        // Savings
        const savingsAmount = document.getElementById('savingsAmount')?.textContent || '0 tCO₂e';
        const savingsPercent = document.getElementById('savingsPercent')?.textContent || '(0%)';
        
        pdf.setTextColor(31, 41, 55);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Carbon Savings:', margin, 85);
        
        pdf.setFontSize(14);
        pdf.setTextColor(4, 120, 87);
        pdf.text(savingsAmount + ' ' + savingsPercent, margin, 93);

        // Results Title
        pdf.setTextColor(31, 41, 55);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Carbon Comparison Results', margin, 110);

        // Quick Stats
        const renovationTotal = document.getElementById('renovationTotal')?.textContent || '0';
        const newbuildTotal = document.getElementById('newbuildTotal')?.textContent || '0';
        
        // Renovation box
        pdf.setFillColor(220, 252, 231); // Light green
        pdf.setDrawColor(4, 120, 87); // Dark green border
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin, 120, (contentWidth / 2) - 5, 30, 2, 2, 'FD');
        
        pdf.setFontSize(10);
        pdf.setTextColor(4, 120, 87);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Best Renovation', margin + 5, 128);
        
        pdf.setFontSize(18);
        pdf.text(renovationTotal + ' tCO₂e', margin + 5, 140);

        // New Build box
        pdf.setFillColor(224, 242, 254); // Light blue
        pdf.setDrawColor(14, 165, 233); // Blue border
        pdf.roundedRect(margin + (contentWidth / 2) + 5, 120, (contentWidth / 2) - 5, 30, 2, 2, 'FD');
        
        pdf.setTextColor(14, 165, 233);
        pdf.text('Best New Build', margin + (contentWidth / 2) + 10, 128);
        
        pdf.setFontSize(18);
        pdf.text(newbuildTotal + ' tCO₂e', margin + (contentWidth / 2) + 10, 140);

        // Breakdown
        pdf.setTextColor(31, 41, 55);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Detailed Breakdown', margin, 165);

        const renovationEmbodied = document.getElementById('renovationEmbodied')?.textContent || '0';
        const renovationOperational = document.getElementById('renovationOperational')?.textContent || '0';
        const newbuildEmbodied = document.getElementById('newbuildEmbodied')?.textContent || '0';
        const newbuildOperational = document.getElementById('newbuildOperational')?.textContent || '0';

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Renovation breakdown
        pdf.text('Best Renovation:', margin, 175);
        pdf.text('  • Embodied: ' + renovationEmbodied + ' tCO₂e', margin, 182);
        pdf.text('  • Operational: ' + renovationOperational + ' tCO₂e', margin, 189);
        
        // New Build breakdown
        pdf.text('Best New Build:', margin, 202);
        pdf.text('  • Embodied: ' + newbuildEmbodied + ' tCO₂e', margin, 209);
        pdf.text('  • Operational: ' + newbuildOperational + ' tCO₂e', margin, 216);

        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.text('SustainaBuild © 2026 | Research by Valentine Lhoest | Development by João Alfar', 
                 pageWidth / 2, pageHeight - 10, { align: 'center' });

        // ====================================
        // PAGE 2: COMPARISON TABLE (7 SCENARIOS) ✅ CORRIGIDO
        // ====================================
        
        pdf.addPage();
        
        // Header
        pdf.setFillColor(4, 120, 87);
        pdf.rect(0, 0, pageWidth, 30, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('7 Scenarios Comparison Table', margin, 18); // ✅ MUDADO DE 6 PARA 7

        // Capture table
        const tableElement = document.getElementById('comparisonTable');
        
        if (tableElement) {
            try {
                // Switch to table tab to ensure it's visible
                const tableTab = document.querySelector('[data-tab="table"]');
                if (tableTab) tableTab.click();
                
                await new Promise(resolve => setTimeout(resolve, 400));
                
                const canvas = await html2canvas(tableElement, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true
                });
                
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                let yPosition = 40;
                
                // Se a tabela for muito grande, ajusta o tamanho
                if (imgHeight > pageHeight - 60) {
                    const scaledHeight = pageHeight - 60;
                    const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
                    pdf.addImage(imgData, 'PNG', margin, yPosition, scaledWidth, scaledHeight);
                } else {
                    pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
                }
                
            } catch (error) {
                console.error('Error capturing table:', error);
                pdf.setTextColor(220, 38, 38);
                pdf.setFontSize(10);
                pdf.text('Error: Could not capture comparison table', margin, 50);
            }
        } else {
            pdf.setTextColor(220, 38, 38);
            pdf.setFontSize(10);
            pdf.text('Error: Comparison table not found', margin, 50);
        }

        // Footer ✅ CORRIGIDO
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.text('Page 2 of 4 | SustainaBuild Carbon Analysis Report (7 Scenarios)', 
                 pageWidth / 2, pageHeight - 10, { align: 'center' });

        // ====================================
        // PAGE 3: BAR CHART + PIE CHART ✅ CORRIGIDO
        // ====================================
        
        pdf.addPage();
        
        // Header
        pdf.setFillColor(4, 120, 87);
        pdf.rect(0, 0, pageWidth, 30, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Visual Analysis (7 Scenarios)', margin, 18); // ✅ MUDADO DE 6 PARA 7

        // Bar Chart
        const barChartElement = document.getElementById('barChart');
        if (barChartElement) {
            try {
                // Switch to comparison tab
                const comparisonTab = document.querySelector('[data-tab="comparison"]');
                if (comparisonTab) comparisonTab.click();
                
                await new Promise(resolve => setTimeout(resolve, 400));
                
                const canvas = await html2canvas(barChartElement.parentElement, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false
                });
                
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                pdf.addImage(imgData, 'PNG', margin, 40, imgWidth, Math.min(imgHeight, 110));
                
            } catch (error) {
                console.error('Error capturing bar chart:', error);
            }
        }

        // Pie Chart
        const pieChartElement = document.getElementById('pieChart');
        if (pieChartElement) {
            try {
                // Switch to breakdown tab
                const breakdownTab = document.querySelector('[data-tab="breakdown"]');
                if (breakdownTab) breakdownTab.click();
                
                await new Promise(resolve => setTimeout(resolve, 400));
                
                const canvas = await html2canvas(pieChartElement.parentElement, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false
                });
                
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                pdf.addImage(imgData, 'PNG', margin, 160, imgWidth, Math.min(imgHeight, 110));
                
            } catch (error) {
                console.error('Error capturing pie chart:', error);
            }
        }

        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.text('Page 3 of 4 | SustainaBuild Carbon Analysis Report', 
                 pageWidth / 2, pageHeight - 10, { align: 'center' });

        // ====================================
        // PAGE 4: LINE CHART + BUILDING INPUTS
        // ====================================
        
        pdf.addPage();
        
        // Header
        pdf.setFillColor(4, 120, 87);
        pdf.rect(0, 0, pageWidth, 30, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Timeline & Building Inputs', margin, 18);

        // Line Chart
        const lineChartElement = document.getElementById('lineChart');
        if (lineChartElement) {
            try {
                // Switch to timeline tab
                const timelineTab = document.querySelector('[data-tab="timeline"]');
                if (timelineTab) timelineTab.click();
                
                await new Promise(resolve => setTimeout(resolve, 400));
                
                const canvas = await html2canvas(lineChartElement.parentElement, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false
                });
                
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                pdf.addImage(imgData, 'PNG', margin, 40, imgWidth, Math.min(imgHeight, 100));
                
            } catch (error) {
                console.error('Error capturing line chart:', error);
            }
        }

        // Building Inputs Summary
        pdf.setTextColor(31, 41, 55);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Building Inputs Summary', margin, 160);

        // ✅ LER MATERIAIS DO CUSTOM DROPDOWN
        const materialDropdown = document.getElementById('material-dropdown');
        let selectedMaterials = 'N/A';
        if (materialDropdown) {
            const checkedBoxes = materialDropdown.querySelectorAll('input[type="checkbox"]:checked');
            if (checkedBoxes.length > 0) {
                selectedMaterials = Array.from(checkedBoxes)
                    .map(cb => cb.value.charAt(0).toUpperCase() + cb.value.slice(1))
                    .join(', ');
            }
        }

        const buildingType = document.getElementById('building-type')?.value || 'N/A';
        const buildingArea = document.getElementById('building-area')?.value || 'N/A';
        const lifespan = document.getElementById('lifespan')?.value || 'N/A';
        const climateZone = document.getElementById('climate-zone')?.value || 'N/A';
        const embodiedEnergy = document.getElementById('embodied-energy')?.value || 'N/A';
        const operationalEnergy = document.getElementById('operational-energy')?.value || 'N/A';
        const reuseRate = document.getElementById('reuse-rate')?.value || 'N/A';

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        let yPos = 170;
        const inputs = [
            ['Building Type:', buildingType === 'N/A' ? buildingType : buildingType.charAt(0).toUpperCase() + buildingType.slice(1).replace('-', ' ')],
            ['Building Area:', buildingArea + ' m²'],
            ['Expected Lifespan:', lifespan + ' years'],
            ['Structural Materials:', selectedMaterials],
            ['Climate Zone:', climateZone === 'N/A' ? climateZone : climateZone.charAt(0).toUpperCase() + climateZone.slice(1)],
            ['Embodied Energy:', embodiedEnergy === 'unknown' ? 'Estimated' : embodiedEnergy + ' kgCO₂/m²'],
            ['Operational Energy:', operationalEnergy === 'unknown' ? 'Estimated' : operationalEnergy + ' kWh/m²/yr'],
            ['Material Reuse Rate:', reuseRate + '%']
        ];

        inputs.forEach(([label, value]) => {
            pdf.setFont('helvetica', 'bold');
            pdf.text(label, margin, yPos);
            pdf.setFont('helvetica', 'normal');
            
            // Wrap text se for muito longo
            const maxWidth = contentWidth - 65;
            const splitValue = pdf.splitTextToSize(value, maxWidth);
            pdf.text(splitValue, margin + 65, yPos);
            
            yPos += (splitValue.length * 5) + 2;
        });

        // Methodology Note
        pdf.setFillColor(254, 243, 199); // Yellow background
        pdf.roundedRect(margin, yPos + 5, contentWidth, 40, 2, 2, 'F');
        
        pdf.setTextColor(180, 83, 9);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Methodology:', margin + 3, yPos + 13);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(120, 53, 15);
        const methodologyText = 'This analysis evaluates 7 scenarios (Light, Medium, Deep Renovation, Deep + Slight Demolition vs Code-Compliant, High-Performance, Low-Carbon New Build) using whole-life carbon methodology. Results based on research by Valentine Lhoest.';
        const splitText = pdf.splitTextToSize(methodologyText, contentWidth - 10);
        pdf.text(splitText, margin + 3, yPos + 20);

        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.text('Page 4 of 4 | SustainaBuild Carbon Analysis Report | sustainabuild.com', 
                 pageWidth / 2, pageHeight - 10, { align: 'center' });

        // ====================================
        // SAVE PDF
        // ====================================
        
        const filename = 'SustainaBuild_Report_7Scenarios_' + 
                        today.replace(/\//g, '-') + '.pdf';
        
        pdf.save(filename);

        // Success message
        showSuccessMessage('PDF downloaded successfully!');

    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try again.');
    } finally {
        // Reset button
        button.disabled = false;
        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Download PDF
        `;
    }
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

console.log('✨ PDF Export module loaded (4 pages with 7 scenarios + custom material dropdown support)');
