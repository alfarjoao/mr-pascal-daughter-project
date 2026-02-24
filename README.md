# 🌱 SustainaBuild

**Renovation vs Demolition Carbon Calculator**  
Evidence-based decision framework for sustainable building practices.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://sustainability-framework.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repository-blue)](https://github.com/alfarjoao/sustainability-framework)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)

---

## 📖 Overview

**SustainaBuild** is a free, open-source carbon calculator that helps architects, engineers, and sustainability professionals make data-driven decisions about building renovation versus demolition. The tool evaluates **whole-life carbon impact** through multi-variable analysis, supporting Net Zero 2050 goals.

This project was developed as part of a master's thesis examining the carbon implications of building intervention strategies in the construction industry.

---

## ✨ Features

- **Multi-Variable Analysis**: Evaluates embodied carbon, operational energy, material reuse rates, and lifecycle considerations
- **3-Step Calculator**: Simple, guided workflow (Scenario → Building Data → Energy Data)
- **Real-Time Validation**: Instant feedback with visual error handling
- **Interactive Charts**: Bar, pie, line, and table visualizations using Chart.js
- **PDF Export**: Download professional 4-page reports with all results and charts
- **Responsive Design**: Fully mobile-optimized with hamburger menu
- **Scenario Comparison**: Light renovation, deep renovation, and new build options
- **Climate & Material Factors**: Accounts for structural material type and climate zone
- **Evidence-Based**: Built on systematic LCA review and research standards (EN 15978, ISO 14040/14044)

---

## 🚀 Live Demo

👉 **[https://sustainability-framework.vercel.app](https://sustainability-framework.vercel.app)**

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (CSS Variables), Vanilla JavaScript (ES6+)
- **Charts**: [Chart.js 4.4.1](https://www.chartjs.org/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/)
- **Deployment**: [Vercel](https://vercel.com)
- **Version Control**: Git & GitHub

---

## 📥 Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/alfarjoao/sustainability-framework.git
   cd sustainability-framework
