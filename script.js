// Utility functions for date handling
function isValidDateFormat(dateStr) {
    // Allow both zero-padded and non-zero-padded dates
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if (!regex.test(dateStr)) return false;
    
    const [, day, month, year] = dateStr.match(regex);
    const date = new Date(year, month - 1, day);
    
    // Check if the date is valid and matches the input
    return date.getDate() === parseInt(day) && 
           date.getMonth() === parseInt(month) - 1 && 
           date.getFullYear() === parseInt(year);
}

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
}

function formatDate(date) {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function getNextDay(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 1);
    return formatDate(date);
}

// Function to download template
function downloadTemplate() {
    try {
        const csvContent = [
            ['start_date', 'end_date', 'fte', 'position'],
            ['01/01/2020', '31/12/2020', '1.0', 'Research Fellow'],
            ['01/01/2021', '30/06/2021', '0.5', 'Research Fellow'],
            ['01/07/2021', '31/12/2021', '1.0', 'Research Fellow']
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'career_disruption_template.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading template:', error);
        alert('There was an error downloading the template. Please try again.');
    }
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
    initSmoothScroll();
    initFileUpload();
    initFteCalculator();

    // Add click event listener for template download
    const templateDownloadBtn = document.getElementById('templateDownloadBtn');
    if (templateDownloadBtn) {
        templateDownloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadTemplate();
        });
    }
});

function initApp() {
    // Get the app container
    const appContainer = document.getElementById('app');
    
    // Initialize empty container for dynamic content
    appContainer.innerHTML = '';
}

function initFileUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const validationResults = document.getElementById('validationResults');
    const validationList = document.getElementById('validationList');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Handle file input change
    fileInput.addEventListener('change', handleFileSelect, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                validateAndProcessFile(file);
            } else {
                showValidationError('Please upload a CSV file');
            }
        }
    }

    function validateAndProcessFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const lines = content.split('\n');
            const headers = lines[0].trim().split(',');
            
            // Clear previous validation results
            validationList.innerHTML = '';
            validationResults.style.display = 'block';

            try {
                // Validate headers
                validateHeaders(headers);

                // Display input file with validation
                const validationResult = displayInputValidation(lines);
                
                // Only proceed if there are no errors
                if (validationResult.isValid) {
                    // Parse data (validation already done in displayInputValidation)
                    const data = parseAndValidateData(lines.slice(1));
                    
                    if (data) {
                        // Calculate results
                        const results = calculateResults(data);
                        
                        // Show results and download button
                        showResults(results);

                        // Show and initialize FTE calculator with the data
                        const fteCalculator = document.getElementById('fte-calculator');
                        fteCalculator.style.display = 'flex';
                        window.initializeFteCalculator(data);
                    }
                } else {
                    // Hide FTE calculator if validation fails
                    document.getElementById('fte-calculator').style.display = 'none';
                }
            } catch (error) {
                showValidationError(error.message);
                // Hide FTE calculator if validation fails
                document.getElementById('fte-calculator').style.display = 'none';
            }

            // Scroll to validation results
            validationResults.scrollIntoView({ behavior: 'smooth' });
        };
        reader.readAsText(file);
    }

    function displayInputValidation(lines) {
        let hasErrors = false;
        const validationHtml = `
            <div class="input-validation mt-4">
                <h5 class="mb-3">Input File Validation</h5>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th style="width: 50px">Line</th>
                                <th>Content</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${lines.map((line, index) => {
                                if (index === 0) {
                                    // Header row
                                    return `
                                        <tr class="table-primary">
                                            <td>${index + 1}</td>
                                            <td>${line}</td>
                                            <td><i class="fas fa-check-circle text-success"></i> Headers</td>
                                        </tr>
                                    `;
                                }
                                
                                if (line.trim() === '') {
                                    return `
                                        <tr class="table-secondary">
                                            <td>${index + 1}</td>
                                            <td><em>Empty line</em></td>
                                            <td><i class="fas fa-info-circle text-muted"></i> Skipped</td>
                                        </tr>
                                    `;
                                }

                                const [startDate, endDate, fte, position] = line.split(',').map(item => item.trim());
                                const errors = [];

                                // Validate start date
                                if (!isValidDateFormat(startDate)) {
                                    errors.push('Invalid start date format');
                                }

                                // Validate end date
                                if (!isValidDateFormat(endDate)) {
                                    errors.push('Invalid end date format');
                                }

                                // Validate date order
                                if (isValidDateFormat(startDate) && isValidDateFormat(endDate)) {
                                    const parsedStartDate = parseDate(startDate);
                                    const parsedEndDate = parseDate(endDate);
                                    if (parsedStartDate > parsedEndDate) {
                                        errors.push('Start date after end date');
                                    }
                                }

                                // Validate FTE
                                const fteValue = parseFloat(fte);
                                if (isNaN(fteValue) || fteValue < 0 || fteValue > 1) {
                                    errors.push('Invalid FTE value');
                                }

                                // Validate position
                                if (!position) {
                                    errors.push('Missing position');
                                }

                                // Validate date continuity
                                if (index > 1) {
                                    const prevLine = lines[index - 1].trim();
                                    if (prevLine) {
                                        const prevEndDate = prevLine.split(',')[1].trim();
                                        if (isValidDateFormat(prevEndDate) && isValidDateFormat(startDate)) {
                                            const prevDate = parseDate(prevEndDate);
                                            const currDate = parseDate(startDate);
                                            const expectedDate = new Date(prevDate);
                                            expectedDate.setDate(expectedDate.getDate() + 1);
                                            
                                            if (currDate.getTime() !== expectedDate.getTime()) {
                                                errors.push(`Gap in dates: Expected ${formatDate(expectedDate)}`);
                                            }
                                        }
                                    }
                                }

                                if (errors.length > 0) {
                                    hasErrors = true;
                                }

                                const rowClass = errors.length > 0 ? 'table-danger' : 'table-success';
                                const statusIcon = errors.length > 0 ? 'fa-exclamation-circle text-danger' : 'fa-check-circle text-success';
                                const statusText = errors.length > 0 ? errors.join(', ') : 'Valid';

                                return `
                                    <tr class="${rowClass}">
                                        <td>${index + 1}</td>
                                        <td>${line}</td>
                                        <td><i class="fas ${statusIcon}"></i> ${statusText}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        validationList.innerHTML = validationHtml;
        return { isValid: !hasErrors };
    }

    function validateHeaders(headers) {
        const requiredHeaders = ['start_date', 'end_date', 'fte', 'position'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
            throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }
        showValidationSuccess('All required columns are present');
    }

    function parseAndValidateData(lines) {
        const data = [];

        lines.forEach((line, index) => {
            if (line.trim() === '') return;

            const [startDate, endDate, fte, position] = line.split(',').map(item => item.trim());
            
            // Add valid data
            data.push({
                startDate: parseDate(startDate),
                endDate: parseDate(endDate),
                fte: parseFloat(fte),
                position: position
            });
        });

        return data;
    }

    function calculateResults(data) {
        // Calculate duration in days and FTE days for each record
        const recordsWithDuration = data.map(record => {
            const durationDays = Math.ceil((record.endDate - record.startDate) / (1000 * 60 * 60 * 24)) + 1;
            const fteDays = durationDays * record.fte;
            return {
                ...record,
                durationDays,
                fteDays
            };
        });

        // Group by position and calculate totals for RTO
        const positionGroups = {};
        recordsWithDuration.forEach(record => {
            if (!positionGroups[record.position]) {
                positionGroups[record.position] = {
                    startDate: record.startDate,
                    endDate: record.endDate,
                    totalFteDays: 0
                };
            }
            positionGroups[record.position].totalFteDays += record.fteDays;
            // Update start and end dates
            if (record.startDate < positionGroups[record.position].startDate) {
                positionGroups[record.position].startDate = record.startDate;
            }
            if (record.endDate > positionGroups[record.position].endDate) {
                positionGroups[record.position].endDate = record.endDate;
            }
        });

        // Calculate RTO results
        const rtoResults = Object.entries(positionGroups).map(([position, data]) => ({
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
            position,
            fteYears: (data.totalFteDays / 365).toFixed(2)
        })).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        // Calculate Career Disruption results
        const disruptionRecords = recordsWithDuration
            .filter(record => record.fte < 1) // Only include records with FTE < 1
            .map(record => {
                const disruptionFte = (1 - record.fte).toFixed(2);
                const disruptionDays = Math.round(record.durationDays * parseFloat(disruptionFte));
                return {
                    startDate: record.startDate,
                    endDate: record.endDate,
                    durationDays: record.durationDays,
                    disruptionDays: disruptionDays,
                    fte: disruptionFte
                };
            })
            .sort((a, b) => a.startDate - b.startDate); // Sort by start date

        // Aggregate consecutive periods with same FTE
        const disruptionResults = [];
        let currentGroup = null;

        disruptionRecords.forEach(record => {
            if (!currentGroup) {
                // Start new group
                currentGroup = {
                    startDate: record.startDate,
                    endDate: record.endDate,
                    dayCount: record.disruptionDays,
                    fte: record.fte
                };
            } else {
                // Check if this record can be merged with current group
                const isConsecutive = new Date(record.startDate) - new Date(currentGroup.endDate) === 86400000; // 24 hours in milliseconds
                const hasSameFte = record.fte === currentGroup.fte;

                if (isConsecutive && hasSameFte) {
                    // Merge with current group
                    currentGroup.endDate = record.endDate;
                    currentGroup.dayCount += record.disruptionDays;
                } else {
                    // Save current group and start new one
                    disruptionResults.push({
                        startDate: formatDate(currentGroup.startDate),
                        endDate: formatDate(currentGroup.endDate),
                        dayCount: currentGroup.dayCount,
                        fte: currentGroup.fte
                    });
                    currentGroup = {
                        startDate: record.startDate,
                        endDate: record.endDate,
                        dayCount: record.disruptionDays,
                        fte: record.fte
                    };
                }
            }
        });

        // Add the last group if it exists
        if (currentGroup) {
            disruptionResults.push({
                startDate: formatDate(currentGroup.startDate),
                endDate: formatDate(currentGroup.endDate),
                dayCount: currentGroup.dayCount,
                fte: currentGroup.fte
            });
        }

        return {
            rtoResults,
            disruptionResults
        };
    }

    function showResults(results) {
        // Create results tables
        const resultsHtml = `
            <div class="mt-4">
                <h5 class="mb-3">Relative to Opportunity Results</h5>
                <p class="text-muted mb-3">Calculated FTE years for each position, showing the impact on your career timeline.</p>
                <div class="table-responsive results-table">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Position</th>
                                <th>FTE Years</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.rtoResults.slice().reverse().map(r => `
                                <tr>
                                    <td>${r.startDate}</td>
                                    <td>${r.endDate}</td>
                                    <td>${r.position}</td>
                                    <td>${r.fteYears}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="mt-3 mb-4">
                    <button class="btn btn-success download-rto-results" data-results='${JSON.stringify(results.rtoResults)}'>
                        <i class="fas fa-download me-2"></i>Download Relative to Opportunity Results
                    </button>
                </div>

                <h5 class="mb-3 mt-5">Career Disruption Results</h5>
                <p class="text-muted mb-3">Periods of career disruption, calculated as 1-FTE for each time period.</p>
                <div class="table-responsive results-table">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Day Count</th>
                                <th>Disruption FTE</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.disruptionResults.map(r => `
                                <tr>
                                    <td>${r.startDate}</td>
                                    <td>${r.endDate}</td>
                                    <td>${r.dayCount}</td>
                                    <td>${r.fte}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="mt-3">
                    <button class="btn btn-success download-disruption-results" data-results='${JSON.stringify(results.disruptionResults)}'>
                        <i class="fas fa-download me-2"></i>Download Career Disruption Results
                    </button>
                </div>
            </div>
        `;
        validationList.innerHTML += resultsHtml;

        // Add scroll class only if there are more than 20 rows in total
        if (results.rtoResults.length + results.disruptionResults.length > 20) {
            validationResults.classList.add('has-scroll');
        } else {
            validationResults.classList.remove('has-scroll');
        }

        // Add click event listeners to the download buttons
        const rtoDownloadButton = validationList.querySelector('.download-rto-results');
        if (rtoDownloadButton) {
            rtoDownloadButton.addEventListener('click', function() {
                const rtoResults = JSON.parse(this.getAttribute('data-results'));
                downloadRtoResults(rtoResults);
            });
        }

        const disruptionDownloadButton = validationList.querySelector('.download-disruption-results');
        if (disruptionDownloadButton) {
            disruptionDownloadButton.addEventListener('click', function() {
                const disruptionResults = JSON.parse(this.getAttribute('data-results'));
                downloadDisruptionResults(disruptionResults);
            });
        }
    }

    // Function to download RTO results
    function downloadRtoResults(results) {
        try {
            const csvContent = [
                ['start_date', 'end_date', 'position', 'fte_years'],
                ...results.slice().reverse().map(r => [r.startDate, r.endDate, r.position, r.fteYears])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.setAttribute('href', url);
            link.setAttribute('download', 'relative_to_opportunity_results.csv');
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading RTO results:', error);
            alert('There was an error downloading the results. Please try again.');
        }
    }

    // Function to download Disruption results
    function downloadDisruptionResults(results) {
        try {
            const csvContent = [
                ['start_date', 'end_date', 'day_count', 'disruption_fte'],
                ...results.map(r => [r.startDate, r.endDate, r.dayCount, r.fte])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.setAttribute('href', url);
            link.setAttribute('download', 'career_disruption_results.csv');
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading disruption results:', error);
            alert('There was an error downloading the results. Please try again.');
        }
    }

    function showValidationSuccess(message) {
        const item = document.createElement('div');
        item.className = 'validation-item success';
        item.innerHTML = `
            <i class="fas fa-check-circle validation-icon text-success"></i>
            <span class="validation-message">${message}</span>
        `;
        validationList.appendChild(item);
    }

    function showValidationError(message) {
        const item = document.createElement('div');
        item.className = 'validation-item error';
        item.innerHTML = `
            <i class="fas fa-exclamation-circle validation-icon text-danger"></i>
            <span class="validation-message">${message}</span>
        `;
        validationList.appendChild(item);
    }
}

function initSmoothScroll() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initFteCalculator() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const fteYearsInput = document.getElementById('fteYears');
    const beforeFteInput = document.getElementById('beforeFte');
    const afterFteInput = document.getElementById('afterFte');
    const assumedFteContainer = document.getElementById('assumedFteContainer');
    const beforeFteContainer = document.getElementById('beforeFteContainer');
    const afterFteContainer = document.getElementById('afterFteContainer');
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const warningDiv = document.getElementById('calculatorWarning');
    const resultDiv = document.getElementById('calculatorResult');
    const calcInstructions = document.getElementById('calcInstructions');

    let careerData = null; // Will store the parsed career data
    let lastCalculationType = null; // Track what was last calculated

    // Initialize calculator with file data when available
    function initializeWithFileData(data) {
        careerData = data;
        if (data && data.length > 0) {
            // Set default dates from the file
            const firstRecord = data[0];
            const lastRecord = data[data.length - 1];
            startDateInput.value = formatDate(firstRecord.startDate);
            endDateInput.value = formatDate(lastRecord.endDate);
            
            // Set default assumed FTE values
            beforeFteInput.value = firstRecord.fte.toFixed(2);
            afterFteInput.value = lastRecord.fte.toFixed(2);
            
            calculateFTE();
        }
    }

    function updateInputVisibility() {
        const selectedMode = document.querySelector('input[name="calcMode"]:checked').value;
        const inputs = document.querySelectorAll('.calc-input');
        
        inputs.forEach(input => {
            const modes = input.dataset.mode.split(',');
            if (modes.includes(selectedMode)) {
                input.style.display = 'block';
            } else {
                input.style.display = 'none';
            }
        });

        // Update instructions based on selected mode
        switch (selectedMode) {
            case 'fte':
                calcInstructions.innerHTML = `
                    <li>Enter start and end dates to calculate FTE years</li>
                    <li>Dates outside the data range will use assumed FTE values</li>
                `;
                break;
            case 'start':
                calcInstructions.innerHTML = `
                    <li>Enter end date and target FTE years to find the start date</li>
                    <li>If the calculated start date is before the data range, you can adjust the assumed FTE</li>
                `;
                break;
            case 'end':
                calcInstructions.innerHTML = `
                    <li>Enter start date and target FTE years to find the end date</li>
                    <li>If the calculated end date is after the data range, you can adjust the assumed FTE</li>
                `;
                break;
        }
    }

    function calculateFTE() {
        const selectedMode = document.querySelector('input[name="calcMode"]:checked').value;
        const startDate = parseInputDate(startDateInput.value);
        const endDate = parseInputDate(endDateInput.value);
        const targetFte = parseFloat(fteYearsInput.value);
        const assumedBeforeFte = parseFloat(beforeFteInput.value) || 0;
        const assumedAfterFte = parseFloat(afterFteInput.value) || 0;

        // Clear previous messages
        warningDiv.style.display = 'none';
        resultDiv.style.display = 'none';

        if (!careerData) {
            showWarning('Please upload a career file first');
            return;
        }

        // Get data range
        const firstDate = careerData[0].startDate;
        const lastDate = careerData[careerData.length - 1].endDate;

        let resultMessage = '';
        let calculatedStartDate = null;
        let calculatedEndDate = null;

        // Calculate based on selected mode
        switch (selectedMode) {
            case 'fte':
                if (!startDate || !endDate) {
                    showWarning('Please enter both start and end dates');
                    return;
                }
                if (startDate > endDate) {
                    showWarning('Start date cannot be after end date');
                    return;
                }
                const fteYears = calculateFteYears(startDate, endDate, firstDate, lastDate, assumedBeforeFte, assumedAfterFte);
                fteYearsInput.value = fteYears.toFixed(2);
                resultMessage = `Calculated FTE years: ${fteYears.toFixed(2)}`;
                calculatedStartDate = startDate;
                calculatedEndDate = endDate;
                lastCalculationType = 'fte';
                break;

            case 'start':
                if (!endDate || !targetFte) {
                    showWarning('Please enter both end date and target FTE years');
                    return;
                }
                calculatedStartDate = calculateStartDate(endDate, targetFte, firstDate, lastDate, assumedBeforeFte, assumedAfterFte);
                startDateInput.value = formatDate(calculatedStartDate);
                resultMessage = `Calculated start date: ${formatDate(calculatedStartDate)}`;
                calculatedEndDate = endDate;
                lastCalculationType = 'start';
                break;

            case 'end':
                if (!startDate || !targetFte) {
                    showWarning('Please enter both start date and target FTE years');
                    return;
                }
                calculatedEndDate = calculateEndDate(startDate, targetFte, firstDate, lastDate, assumedBeforeFte, assumedAfterFte);
                endDateInput.value = formatDate(calculatedEndDate);
                resultMessage = `Calculated end date: ${formatDate(calculatedEndDate)}`;
                calculatedStartDate = startDate;
                lastCalculationType = 'end';
                break;
        }

        // Update visibility based on calculated dates
        if (calculatedStartDate && calculatedStartDate < firstDate) {
            beforeFteContainer.style.display = 'block';
            assumedFteContainer.style.display = 'flex';
            resultMessage += `\nNote: Calculated start date is before career data (${formatDate(firstDate)}). Using assumed FTE of ${assumedBeforeFte} for this period.`;
        }
        if (calculatedEndDate && calculatedEndDate > lastDate) {
            afterFteContainer.style.display = 'block';
            assumedFteContainer.style.display = 'flex';
            resultMessage += `\nNote: Calculated end date is after career data (${formatDate(lastDate)}). Using assumed FTE of ${assumedAfterFte} for this period.`;
        }

        showResult(resultMessage);
    }

    function calculateFteYears(startDate, endDate, firstDate, lastDate, assumedBeforeFte, assumedAfterFte) {
        let totalFteDays = 0;
        let currentDate = new Date(startDate);

        // Include both start and end dates in the calculation
        while (currentDate <= endDate) {
            if (currentDate < firstDate) {
                // Before first record - use assumed FTE
                totalFteDays += assumedBeforeFte;
            } else if (currentDate > lastDate) {
                // After last record - use assumed FTE
                totalFteDays += assumedAfterFte;
            } else {
                // Within data range - use actual FTE
                const record = findRecordForDate(currentDate);
                if (record) {
                    totalFteDays += record.fte;
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return totalFteDays / 365;
    }

    function calculateStartDate(endDate, targetFteYears, firstDate, lastDate, assumedBeforeFte, assumedAfterFte) {
        let totalFteDays = 0;
        let currentDate = new Date(endDate);
        const targetFteDays = targetFteYears * 365;
        const maxIterations = 365 * 100; // Prevent infinite loops (100 years max)
        let iterations = 0;

        // Include both start and end dates in the calculation
        while (totalFteDays < targetFteDays && iterations < maxIterations) {
            if (currentDate < firstDate) {
                // Before first record - use assumed FTE
                totalFteDays += assumedBeforeFte;
            } else if (currentDate > lastDate) {
                // After last record - use assumed FTE
                totalFteDays += assumedAfterFte;
            } else {
                // Within data range - use actual FTE
                const record = findRecordForDate(currentDate);
                if (record) {
                    totalFteDays += record.fte;
                }
            }
            currentDate.setDate(currentDate.getDate() - 1);
            iterations++;
        }

        // If we hit max iterations, return the earliest possible date
        if (iterations >= maxIterations) {
            return new Date(firstDate.getFullYear() - 100, firstDate.getMonth(), firstDate.getDate());
        }

        // Add one day back since we went one day too far
        currentDate.setDate(currentDate.getDate() + 1);
        return currentDate;
    }

    function calculateEndDate(startDate, targetFteYears, firstDate, lastDate, assumedBeforeFte, assumedAfterFte) {
        let totalFteDays = 0;
        let currentDate = new Date(startDate);
        const targetFteDays = targetFteYears * 365;
        const maxIterations = 365 * 100; // Prevent infinite loops (100 years max)
        let iterations = 0;

        // Include both start and end dates in the calculation
        while (totalFteDays < targetFteDays && iterations < maxIterations) {
            if (currentDate < firstDate) {
                // Before first record - use assumed FTE
                totalFteDays += assumedBeforeFte;
            } else if (currentDate > lastDate) {
                // After last record - use assumed FTE
                totalFteDays += assumedAfterFte;
            } else {
                // Within data range - use actual FTE
                const record = findRecordForDate(currentDate);
                if (record) {
                    totalFteDays += record.fte;
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
            iterations++;
        }

        // If we hit max iterations, return the latest possible date
        if (iterations >= maxIterations) {
            return new Date(lastDate.getFullYear() + 100, lastDate.getMonth(), lastDate.getDate());
        }

        // Subtract one day since we went one day too far
        currentDate.setDate(currentDate.getDate() - 1);
        return currentDate;
    }

    function findRecordForDate(date) {
        return careerData.find(record => 
            date >= record.startDate && date <= record.endDate
        );
    }

    function parseInputDate(dateStr) {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
    }

    function showWarning(message) {
        warningDiv.textContent = message;
        warningDiv.style.display = 'block';
    }

    function showResult(message) {
        resultDiv.textContent = message;
        resultDiv.style.display = 'block';
    }

    // Event listeners
    calculateBtn.addEventListener('click', calculateFTE);
    
    resetBtn.addEventListener('click', () => {
        startDateInput.value = '';
        endDateInput.value = '';
        fteYearsInput.value = '';
        if (careerData) {
            beforeFteInput.value = careerData[0].fte.toFixed(2);
            afterFteInput.value = careerData[careerData.length - 1].fte.toFixed(2);
        } else {
            beforeFteInput.value = '';
            afterFteInput.value = '';
        }
        warningDiv.style.display = 'none';
        resultDiv.style.display = 'none';
        assumedFteContainer.style.display = 'none';
        beforeFteContainer.style.display = 'none';
        afterFteContainer.style.display = 'none';
        lastCalculationType = null;
    });

    // Add event listeners for calculation mode selection
    document.querySelectorAll('input[name="calcMode"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updateInputVisibility();
            // Clear results when changing mode
            warningDiv.style.display = 'none';
            resultDiv.style.display = 'none';
        });
    });

    // Add input event listeners for real-time calculation
    [startDateInput, endDateInput, fteYearsInput].forEach(input => {
        input.addEventListener('change', calculateFTE);
    });

    // Add event listeners for assumed FTE inputs
    [beforeFteInput, afterFteInput].forEach(input => {
        input.addEventListener('change', calculateFTE);
    });

    // Initialize input visibility
    updateInputVisibility();

    // Make the calculator available globally
    window.initializeFteCalculator = initializeWithFileData;
}

// Add any additional utility functions here 