# Excel to Mindmap Converter

A browser-based application that converts Excel files into interactive mindmaps with country comparison functionality. No installation required - just open the HTML file in your browser!

## Features

- **Excel File Upload**: Drag & drop or browse to upload .xlsx/.xls files
- **Interactive Mindmap**: D3.js-powered visualization with expandable/collapsible nodes
- **Country Comparison**: Compare availability across different countries/regions
- **Search Functionality**: Find specific functions with autocomplete suggestions
- **Color-coded Visualization**: 
  - 🟢 Green: Available in both selected countries
  - 🔵 Blue: Available only in first selected country
  - 🟠 Orange: Available only in second selected country
  - ⚪ Gray: Not available in either country
- **Statistics Panel**: Real-time counts of available functions per country
- **Responsive Controls**: Expand all, collapse all, center view, and zoom

## How to Use

### 1. Prepare Your Excel File

Your Excel file should have the following structure:

| Category | Name | Country1 | Country2 | Country3 | ... |
|----------|------|----------|----------|----------|-----|
| Banking | Account Balance | V | V | X | ... |
| Banking | Fund Transfer | V | X | V | ... |
| Investment | Mutual Funds | V | X | V | ... |

**Required Columns:**
- **Name**: Function or feature name (required)
- **Category**: Grouping category (optional, defaults to "General")
- **Country Columns**: Any number of country/region columns

**Availability Values:**
- `V`, `Yes`, `True`, `1` = Available
- `X`, `No`, `False`, `0`, or empty = Not available

### 2. Open the Application

1. Open `excel-to-mindmap.html` in any modern web browser
2. No installation or server setup required!

### 3. Upload Your Data

1. Drag and drop your Excel file onto the upload area, or
2. Click the upload area to browse and select your file
3. Wait for the file to be processed (usually takes a few seconds)

### 4. Explore Your Mindmap

1. **Select Countries**: Use the dropdown menus to choose two countries for comparison
2. **Navigate**: Click on nodes to expand/collapse categories
3. **Search**: Type in the search box to find specific functions
4. **Zoom & Pan**: Use mouse wheel to zoom, drag to pan around the mindmap
5. **Controls**: Use the control buttons for quick actions:
   - "Expand All": Opens all categories
   - "Collapse All": Closes all categories  
   - "Center": Returns to the center view

### 5. Interpret the Results

- **Legend**: Shows what each color represents
- **Statistics**: Displays counts of available functions per country
- **Node Colors**: Immediately see availability patterns across your data

## Sample Data

A sample CSV file (`sample-data.csv`) is included to demonstrate the expected format. You can:
1. Open it in Excel or Google Sheets
2. Save it as an .xlsx file
3. Upload it to test the application

## Technical Details

### Technologies Used
- **React 18**: UI framework
- **D3.js v7**: Mindmap visualization
- **SheetJS**: Excel file parsing
- **Tailwind CSS**: Styling
- **Babel Standalone**: JSX compilation in browser

### Browser Compatibility
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

### File Size Limits
- Recommended: Under 1MB Excel files
- Maximum: ~5MB (browser memory dependent)
- Optimal: Under 1000 rows for best performance

## Troubleshooting

### Common Issues

**"Failed to parse Excel file"**
- Ensure your file has a "Name" column
- Check that the file isn't corrupted
- Try saving the file in a different Excel format

**"Please upload an Excel file"**
- Only .xlsx and .xls files are supported
- CSV files need to be converted to Excel format first

**Search not working**
- Make sure the search term matches function names in your data
- Search is case-insensitive but requires partial matches

**Mindmap appears cut off**
- Use the "Center" button to return to default view
- Try zooming out with your mouse wheel
- Resize your browser window and refresh

### Performance Tips

- For large datasets (500+ items), consider grouping similar functions
- Use meaningful category names to organize your data better
- Limit country comparisons to 10 or fewer for optimal performance

## Data Privacy

- All processing happens locally in your browser
- No data is uploaded to external servers
- Your Excel files remain on your computer

## Customization

The application can be customized by modifying the HTML file:
- Colors: Update the CSS color values
- Layout: Modify the Tailwind classes
- Functionality: Edit the React components

## License

This project is open source and available under the MIT License.