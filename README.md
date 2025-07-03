# NHMRC Investigator Grant Career Disruption Calculator

A free, privacy-focused web tool for researchers to calculate career disruption periods and FTE (Full-Time Equivalent) years, specifically designed for **NHMRC Investigator Grant applications**. This calculator helps researchers demonstrate their track record relative to opportunity by accurately documenting career disruptions and calculating precise FTE years for grant submissions.

## 🌟 Live Demo

**Try the calculator now:** [https://eramezani.github.io/career/](https://eramezani.github.io/career/)

## 🎯 Purpose

This calculator is specifically designed for **NHMRC Investigator Grant applications** where researchers need to:
- Document career disruptions (maternity/paternity leave, illness, carer responsibilities)
- Calculate accurate FTE years for relative to opportunity assessment
- Generate evidence for grant application requirements
- Export results in formats suitable for grant submissions
- Demonstrate research output relative to actual working time

## ✨ Key Features

### 📊 Career Disruption Analysis
- **Relative to Opportunity Results**: Calculate FTE years per position with detailed breakdowns
- **Career Disruption Results**: Identify periods of reduced FTE (1-FTE) with exact dates
- **Automatic Gap Detection**: Ensures continuous career timeline with validation
- **Export to CSV**: Download results for grant applications
- **Data Validation**: Comprehensive error checking and validation

### 🧮 Interactive FTE Calculator
- **Calculate FTE Years**: Find FTE years between any dates
- **Find Start Date**: Calculate when to start for target FTE years
- **Find End Date**: Calculate when you'll reach target FTE years
- **Assumed FTE Handling**: For periods outside your data range
- **Real-time Calculations**: Instant results with clear explanations

### 🔒 Privacy & Security
- **Client-side Processing**: All calculations done in your browser
- **No Data Collection**: Your data never leaves your computer
- **Open Source**: Transparent and verifiable code on GitHub
- **No Registration Required**: Use immediately without any setup
- **No Cookies**: Complete privacy protection

## 📋 CSV Format

Your CSV file should include these columns:

| Column | Format | Description |
|--------|--------|-------------|
| `start_date` | DD/MM/YYYY | Start date of the period |
| `end_date` | DD/MM/YYYY | End date of the period |
| `fte` | 0.0 to 1.0 | Actual FTE worked (not disruption) |
| `position` | Text | Role title or position |

**Important**: The FTE value should represent your actual working FTE (e.g., 0.5 for half-time, 1.0 for full-time). The calculator automatically calculates disruption periods as (1-FTE).

### Example Data
```csv
start_date,end_date,fte,position
01/01/2020,31/12/2020,1.0,Research Fellow
01/01/2021,30/06/2021,0.5,Research Fellow
01/07/2021,31/12/2021,1.0,Senior Research Fellow
```

## 🚀 Quick Start

1. **Download Template**: Click the "Download Template" button in the calculator to get the CSV template with example data
2. **Prepare Your Data**: Fill in your career timeline with actual FTE values (0.0 to 1.0)
3. **Upload & Validate**: Drag and drop your CSV file - the tool automatically validates your data
4. **View Results**: Get Relative to Opportunity and Career Disruption results with detailed breakdowns
5. **Export**: Download results as CSV files for your grant application

## 🎓 NHMRC Grant Application Support

This calculator is specifically designed to help with **NHMRC Investigator Grant applications**:

### What It Provides
- **Relative to Opportunity Evidence**: Accurate FTE calculations per position with detailed breakdowns
- **Career Disruption Documentation**: Clear periods of reduced research capacity with exact dates
- **Grant-Ready Outputs**: CSV files suitable for grant submissions
- **Compliance**: Meets NHMRC documentation requirements
- **Professional Formatting**: Results formatted for grant application inclusion

### Common Use Cases
- Maternity/paternity leave documentation
- Carer responsibilities during research career
- Illness or medical leave periods
- Part-time work arrangements
- Career breaks for personal reasons
- Reduced FTE due to administrative duties
- Research interruptions due to external factors

## 🛠️ Technical Details

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Framework**: Bootstrap 5 for responsive design
- **Processing**: 100% client-side (no server required)
- **Browser Support**: Chrome, Firefox, Safari, Edge
- **License**: GNU GPL v3
- **Hosting**: GitHub Pages
- **Analytics**: Google Analytics (privacy-compliant)

## 🔧 Development

### Local Setup
```bash
# Clone the repository
git clone https://github.com/eramezani/career.git

# Navigate to the directory
cd career

# Open index.html in your browser
```

### Contributing
We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Contact & Support

For technical support or questions about Career Disruption Calculator:

- **Ehsan Ramezani**: [ramezani.e@wehi.edu.au](mailto:ramezani.e@wehi.edu.au)

## 📄 Licence

This project is licensed under the **GNU General Public Licence v3** - see the [LICENCE](LICENCE) file for details.

## 🔗 Related Resources

- [NHMRC Investigator Grant Guidelines](https://www.nhmrc.gov.au/funding/find-funding/investigator-grants)
- [NHMRC Funding Guidelines](https://www.nhmrc.gov.au/funding/find-funding)
- [GitHub Repository](https://github.com/eramezani/career)

---

**Keywords**: NHMRC, Investigator Grant, career disruption, FTE calculator, grant application, research career, relative to opportunity, maternity leave, paternity leave, research funding, academic career, career break, full-time equivalent, research output, grant submission, career timeline, Australian research, medical research, research career calculator 
