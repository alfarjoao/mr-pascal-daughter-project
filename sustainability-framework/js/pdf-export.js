/**
 * PDF Export Module - Simplified Version
 * Generates PDF reports from calculation results
 */

(function() {
    'use strict';

    const PDFExport = {
        
        init() {
            console.log('🔍 Checking PDF libraries...');
            
            // Check if libraries are loaded
            if (typeof html2canvas === 'undefined') {
                console.error('❌ html2canvas not loaded');
                return;
            }
            if (typeof window.jspdf === 'undefined') {
                console.error('❌ jsPDF not loaded');
                return;
            }
            
            console.log('✅ PDF libraries loaded');
            
            const downloadBtn = document.getElementById('downloadPdfBtn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => {
                    console.log('📄 PDF button clicked');
                    this.generatePDF();
                });
                console.log('✅ PDF button listener attached');
            } else {
                console.error('❌ Download button not found');
            }
        },

        async generatePDF() {
            console.log('🚀 Starting PDF generation...');
            
            const btn = document.getElementById('downloadPdfBtn');
            const originalHTML = btn.innerHTML;
            
            try {
                // Show loading
                btn.disabled = true;
                btn.innerHTML = '⏳ Generating PDF...';
                
                console.log('📦 Creating jsPDF instance...');
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF('p', 'mm', 'a4');
                
                const pageWidth = doc.internal.pageSize.getWidth();
                let yPos = 20;
                
                // Header
                doc.setFontSize(22);
                doc.setTextColor(4, 120, 87);
                doc.text('SUSTAINABUILD', 20, yPos);
                yPos += 10;
                
                doc.setFontSize(12);
                doc.setTextColor(100, 100, 100);
                doc.text('Building Sustainability Assessment Report', 20, yPos);
                yPos += 15;
                
                // Date
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-GB');
                doc.setFontSize(10);
                doc.text(`Generated: ${dateStr}`, 20, yPos);
                yPos += 15;
                
                // Decision
                const decision = document.getElementById('decisionText')?.textContent || 'N/A';
                doc.setFontSize(18);
                doc.setTextColor(4, 120, 87);
                doc.text(`DECISION: ${decision}`, 20, yPos);
                yPos += 12;
                
                // Title
                const title = document.getElementById('resultsTitle')?.textContent || 'N/A';
                doc.setFontSize(14);
                doc.setTextColor(0, 0, 0);
                doc.text(title, 20, yPos);
                yPos += 15;
                
                // Carbon values
                doc.setFontSize(12);
                doc.text('Carbon Comparison:', 20, yPos);
                yPos += 8;
                
                const renovationTotal = document.getElementById('renovationTotal')?.textContent || '0';
                const newbuildTotal = document.getElementById('newbuildTotal')?.textContent || '0';
                
                doc.setFontSize(11);
                doc.text(`Renovation: ${renovationTotal} tCO₂e`, 30, yPos);
                yPos += 6;
                doc.text(`New Build: ${newbuildTotal} tCO₂e`, 30, yPos);
                yPos += 10;
                
                // Savings
                const savingsAmount = document.getElementById('savingsAmount')?.textContent || '0';
                const savingsPercent = document.getElementById('savingsPercent')?.textContent || '0';
                
                doc.setTextColor(4, 120, 87);
                doc.text(`Savings: ${savingsAmount} ${savingsPercent}`, 30, yPos);
                yPos += 15;
                
                // Building inputs
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text('Building Inputs:', 20, yPos);
                yPos += 8;
                
                const formData = window.calculatorDebug?.formData || {};
                
                doc.setFontSize(10);
                doc.text(`Area: ${formData.buildingArea || 'N/A'} m²`, 30, yPos);
                yPos += 5;
                doc.text(`Lifespan: ${formData.lifespan || 'N/A'} years`, 30, yPos);
                yPos += 5;
                doc.text(`Material: ${formData.structuralMaterial || 'N/A'}`, 30, yPos);
                yPos += 5;
                doc.text(`Climate: ${formData.climateZone || 'N/A'}`, 30, yPos);
                yPos += 15;
                
                // Try to add chart
                console.log('📊 Attempting to capture chart...');
                const barChart = document.getElementById('barChart');
                if (barChart) {
                    try {
                        const chartImage = barChart.toDataURL('image/png', 1.0);
                        doc.addImage(chartImage, 'PNG', 20, yPos, 170, 80);
                        yPos += 90;
                        console.log('✅ Chart added to PDF');
                    } catch (chartError) {
                        console.warn('⚠️ Chart capture failed:', chartError);
                        doc.text('(Chart visualization not available)', 30, yPos);
                        yPos += 10;
                    }
                }
                
                // Footer
                const pageHeight = doc.internal.pageSize.getHeight();
                doc.setFontSize(9);
                doc.setTextColor(150, 150, 150);
                doc.text('Generated by SustainaBuild v1.0', 20, pageHeight - 20);
                doc.text('Academic Research Tool - Valentine Lhoest', 20, pageHeight - 15);
                
                // Save
                console.log('💾 Saving PDF...');
                const fileName = `SustainaBuild_Report_${dateStr.replace(/\//g, '-')}.pdf`;
                doc.save(fileName);
                
                console.log('✅ PDF saved successfully!');
                this.showToast('✅ PDF downloaded successfully!', 'success');
                
            } catch (error) {
                console.error('❌ PDF generation error:', error);
                this.showToast('❌ Error generating PDF: ' + error.message, 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        },

        showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? '#047857' : '#dc2626'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                z-index: 9999;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            `;
            
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => PDFExport.init());
    } else {
        PDFExport.init();
    }

    window.PDFExport = PDFExport;

})();
