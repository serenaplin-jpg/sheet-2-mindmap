# 🧠 Excel to Mindmap Converter

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen)](https://serenaplin-jpg.github.io/sheet-2-mindmap/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with React](https://img.shields.io/badge/Made%20with-React-blue.svg)](https://reactjs.org/)
[![Powered by D3.js](https://img.shields.io/badge/Powered%20by-D3.js-orange.svg)](https://d3js.org/)

Transform your Excel data into beautiful, interactive mindmaps with country comparisons and advanced search functionality. No installation required - runs entirely in your browser!

## 🚀 [Live Demo](https://serenaplin-jpg.github.io/sheet-2-mindmap/)

## ✨ Features

### 📊 **Data Management**
- **Excel Upload**: Drag & drop .xlsx/.xls files
- **Interactive Table Editor**: Edit data with user-friendly toggles
- **Sample Datasets**: Try with pre-loaded examples
- **Real-time Editing**: Instant updates as you type

### 🎨 **Visualization**
- **Interactive Mindmaps**: D3.js-powered visualizations
- **Country Comparison**: Side-by-side feature comparison
- **Color-coded Nodes**: 
  - 🟢 Available in both countries
  - 🔵 Available in first country only
  - 🟠 Available in second country only
  - ⚪ Not available in either
- **Zoom & Pan**: Navigate large datasets easily

### 🔍 **Navigation**
- **Smart Search**: Find functions with autocomplete
- **Expand/Collapse**: Control visibility of categories
- **Statistics Panel**: Real-time counts per country
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🌐 **Multi-language Support**
- **Bilingual Headers**: Supports English/Chinese column names
- **Unicode Symbols**: Handles √/× and V/X formats
- **Asian Markets**: Optimized for regional comparisons

## 📋 Data Format

Your Excel file should follow this structure:

| Category | Sub-item | Function Name | Platform | Taiwan | China | Hong Kong | ... |
|----------|----------|---------------|----------|---------|--------|-----------|-----|
| Banking | Account Balance | 帳戶餘額查詢 | Web | √ | √ | √ | ... |
| Banking | Fund Transfer | 資金轉帳 | Web/App | √ | × | √ | ... |

### Required Columns
- **Category**: Groups functions (can be empty for sub-items)
- **Function Name**: The feature name (required)
- **Country Columns**: Any number of countries/regions

### Supported Values
- **Available**: `√`, `V`, `v`, `Yes`, `True`, `1`
- **Not Available**: `×`, `X`, `x`, `No`, `False`, `0`, empty

## 🛠️ How to Use

### 1. Upload Data
- Drag & drop your Excel file, or
- Try a sample dataset to understand the format

### 2. Edit Data
- Use toggle switches for availability (√/×)
- Edit text fields for names and categories
- Add/remove rows as needed

### 3. Generate Mindmap
- Click "Generate Mindmap" to visualize
- Select countries to compare
- Search for specific functions
- Expand/collapse categories

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18**: UI framework
- **D3.js v7**: Data visualization
- **Tailwind CSS**: Styling
- **SheetJS**: Excel parsing

### Key Features
- **Client-side Only**: No server required
- **CDN Dependencies**: No build process
- **Responsive Design**: Mobile-friendly
- **Dark Mode**: Automatic theme detection

## 📁 Project Structure

```
excel-to-mindmap/
├── index.html              # Main application
├── data/                   # Sample datasets
│   ├── gmb-banking-functions.json
│   └── financial-services-template.json
├── README.md               # This file
└── local-runnable/         # Development files
    ├── excel-to-mindmap.html
    └── sample-data.csv
```

## 🚀 Deployment

### GitHub Pages (Recommended)

1. **Fork this repository**
2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
3. **Access your site**: `https://yourusername.github.io/excel-to-mindmap/`

### Alternative Hosting

- **Netlify**: Drag & drop deployment
- **Vercel**: Connect GitHub repository
- **Surge.sh**: Command-line deployment
- **Local**: Open `index.html` in browser

## 🔧 Customization

### Adding Sample Datasets

1. Create JSON file in `/data/` directory
2. Update `SAMPLE_DATASETS` array in `index.html`:

```javascript
{
    id: 'your-dataset',
    name: 'Your Dataset Name',
    description: 'Description of your dataset',
    countries: ['Country1', 'Country2'],
    functions: 25,
    url: './data/your-dataset.json'
}
```

### Styling

Modify CSS variables in the `<style>` section:
- Colors: Update color values for nodes and UI
- Fonts: Change font families and sizes
- Layout: Adjust spacing and dimensions

### Functionality

Key functions to customize:
- `transformToMindmapFormat()`: Data processing logic
- `getNodeColor()`: Node coloring rules
- `SAMPLE_DATASETS`: Pre-loaded datasets

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Contribution Ideas
- 📊 New sample datasets
- 🎨 UI/UX improvements
- 🌐 Additional language support
- 📱 Mobile optimizations
- 🔧 New export formats

## 📊 Sample Datasets

### GMB Banking Functions
- **105 functions** across 10 Asian markets
- Real banking feature comparison
- Bilingual (Chinese/English) headers

### Financial Services Template
- **27 common features** for financial institutions
- 4-country comparison template
- English headers with platform indicators

## 🐛 Troubleshooting

### Common Issues

**"Failed to parse Excel file"**
- Ensure file has proper headers
- Check for merged cells (not supported)
- Verify file isn't corrupted

**Search not working**
- Check spelling and try partial matches
- Search is case-insensitive
- Clear search field and try again

**Mindmap appears cut off**
- Use "Center" button to reset view
- Try zooming out with mouse wheel
- Check browser zoom level

**Toggle switches not working**
- Ensure columns are detected as country columns
- Check that column headers don't contain excluded patterns
- Refresh page and try again

## 📈 Performance Tips

- **Large datasets**: Use categories to organize functions
- **Many countries**: Limit to 10-15 for optimal performance  
- **Browser**: Use Chrome or Firefox for best D3.js performance
- **File size**: Keep Excel files under 5MB for faster loading

## 🔒 Privacy & Security

- **Local Processing**: All data stays in your browser
- **No Server**: Files never leave your computer
- **No Tracking**: No analytics or user tracking
- **Open Source**: Full transparency of code

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **D3.js** for powerful data visualization
- **React** for component architecture
- **SheetJS** for Excel parsing
- **Tailwind CSS** for styling
- **GitHub Pages** for free hosting

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/serenaplin-jpg/sheet-2-mindmap/issues)
- 💡 **Feature Requests**: [Request a feature](https://github.com/serenaplin-jpg/sheet-2-mindmap/issues)
- 📧 **Email**: Contact via GitHub issues
- 💬 **Discussions**: [GitHub Discussions](https://github.com/serenaplin-jpg/sheet-2-mindmap/discussions)

---

<div align="center">

**Made with ❤️ for data visualization**

[⭐ Star this repo](https://github.com/serenaplin-jpg/sheet-2-mindmap) | [🍴 Fork it](https://github.com/serenaplin-jpg/sheet-2-mindmap/fork) | [📝 Report Bug](https://github.com/serenaplin-jpg/sheet-2-mindmap/issues)

</div>