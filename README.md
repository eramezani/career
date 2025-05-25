# Career Disruption Calculator

A web-based tool for calculating career disruption and FTE (Full-Time Equivalent) years based on career history data.

## Live Demo

Visit the live demo at: [https://eramezani.github.io/career/](https://eramezani.github.io/career/)

## Features

- **CSV File Upload**: Upload your career history data in CSV format
- **Data Validation**: Automatic validation of CSV format and data integrity
- **Results Tables**:
  - Relative to Opportunity Results: Shows calculated FTE years for each position
  - Career Disruption Results: Shows periods of career disruption (1-FTE)
- **Download Options**:
  - Download Relative to Opportunity Results as CSV
  - Download Career Disruption Results as CSV
  - Download CSV Template for data entry
- **Interactive FTE Calculator**:
  - Calculate FTE years between dates
  - Find start date based on end date and target FTE years
  - Find end date based on start date and target FTE years
  - Automatic handling of periods outside data range with assumed FTE values

## CSV Format

Your CSV file should have the following columns:
- `start_date`: Start date of the period (DD/MM/YYYY)
- `end_date`: End date of the period (DD/MM/YYYY)
- `fte`: Full-time equivalent value (0 to 1)
- `position`: Position or role title

You can download a template CSV file with example data: [Download Template](template.csv)

Example:
```csv
start_date,end_date,fte,position
01/01/2020,31/12/2020,1.0,Research Fellow
01/01/2021,30/06/2021,0.5,Research Fellow
01/07/2021,31/12/2021,1.0,Research Fellow
```

## Usage

1. **Prepare Your Data**:
   - Download the template CSV file
   - Fill in your career history data following the template format
   - Save the file with a .csv extension

2. **Upload Data**:
   - Drag and drop your CSV file or click to browse
   - The file will be automatically validated

3. **View Results**:
   - Relative to Opportunity Results table shows FTE years per position
   - Career Disruption Results table shows periods of reduced FTE
   - Download buttons are available for each table

4. **Use FTE Calculator**:
   - Choose calculation mode
   - Enter required dates and values
   - Adjust assumed FTE values for periods outside data range
   - Click Calculate to see results

## Technical Details

- Built with vanilla JavaScript
- No external dependencies
- Responsive design
- Client-side processing (no data sent to server)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ehsanramezani/career.github.io.git
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   python -m http.server 8000
   ```

3. Visit `http://localhost:8000` in your browser

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Ehsan Ramezani - [ramezani.e@wehi.edu.au](mailto:ramezani.e@wehi.edu.au)

Project Link: [https://github.com/ehsanramezani/career.github.io](https://github.com/ehsanramezani/career.github.io) 