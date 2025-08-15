/**
 * Google Apps Script to generate XMind mindmap from Google Sheet data using OpenRouter LLM
 * 
 * This script:
 * 1. Reads data from the active Google Sheet
 * 2. Formats it for the LLM
 * 3. Calls OpenRouter API to generate mindmap structure
 * 4. Creates a downloadable XMind file
 */

// Configuration
const OPENROUTER_API_KEY = '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'; // Replace with your actual API key
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL_NAME = 'deepseek/deepseek-chat-v3-0324:free'; // Using DeepSeek Chat V3 (free model)

/**
 * Main function to generate mindmap from sheet data
 */
function generateMindmapFromSheet() {
  try {
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    if (!sheet) {
      throw new Error('No active sheet found');
    }
    
    // Read and process sheet data
    const sheetData = readSheetData(sheet);
    Logger.log('Sheet data processed: ' + sheetData.data.length + ' rows');
    
    // Generate mindmap structure using LLM
    const mindmapStructure = generateMindmapStructure(sheetData);
    Logger.log('Mindmap structure generated');
    
    // Create proper XMind file with XML format
    const filename = `Banking_Functions_Mindmap_${new Date().toISOString().split('T')[0]}.xmind`;
    const xmindFile = createXMindFile(mindmapStructure, filename);
    
    // Also create JSON version for backup
    const jsonFile = createJSONMindmap(mindmapStructure, `Banking_Functions_${new Date().toISOString().split('T')[0]}.json`);
    
    Logger.log('Mindmap generation completed successfully');
    Logger.log('XMind file: ' + xmindFile.getUrl());
    Logger.log('JSON file: ' + jsonFile.getUrl());
    
    return {
      xmind: xmindFile,
      json: jsonFile
    };
    
  } catch (error) {
    Logger.log('Error generating mindmap: ' + error.toString());
    throw error;
  }
}

/**
 * Read and process data from the Google Sheet
 */
function readSheetData(sheet) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Find the header row (usually row 4 based on your sheet structure)
  let headerRowIndex = 3; // 0-indexed, so row 4
  let headers = values[headerRowIndex];
  
  // Find column indices
  const majorCategoryCol = headers.indexOf('大項');
  const subCategoryCol = headers.indexOf('細項');
  const functionNameCol = headers.indexOf('2.0功能名稱');
  const platformCol = headers.indexOf('平台');
  
  // Find country columns (E to N)
  const countryColumns = [];
  for (let i = 4; i < headers.length; i++) {
    if (headers[i] && headers[i].toString().trim() !== '') {
      countryColumns.push({
        index: i,
        name: headers[i]
      });
    }
  }
  
  // Process data rows
  const processedData = [];
  for (let i = headerRowIndex + 1; i < values.length; i++) {
    const row = values[i];
    
    // Skip empty rows
    if (!row[majorCategoryCol] || !row[subCategoryCol]) continue;
    
    const rowData = {
      majorCategory: row[majorCategoryCol],
      subCategory: row[subCategoryCol],
      functionName: row[functionNameCol] || row[subCategoryCol],
      platform: row[platformCol] || 'web',
      countryAvailability: {}
    };
    
    // Process country availability
    countryColumns.forEach(countryCol => {
      const value = row[countryCol.index];
      rowData.countryAvailability[countryCol.name] = value === 'V' ? 'Available' : 'Not Available';
    });
    
    processedData.push(rowData);
  }
  
  return {
    headers: headers,
    countryColumns: countryColumns.map(col => col.name),
    data: processedData
  };
}

/**
 * Generate mindmap structure using OpenRouter LLM
 */
function generateMindmapStructure(sheetData) {
  try {
    // Prepare prompt for the LLM
    const prompt = createLLMPrompt(sheetData);
    
    // Call OpenRouter API
    const response = callOpenRouterAPI(prompt);
    
    // Parse the response to extract mindmap structure
    return parseLLMResponse(response, sheetData);
  } catch (error) {
    Logger.log('LLM generation failed, using fallback: ' + error.toString());
    return createFallbackStructure(sheetData);
  }
}

/**
 * Create a comprehensive prompt for the LLM
 */
function createLLMPrompt(sheetData) {
  const prompt = `# Task: Create Banking Functions Mindmap

You are a data visualization expert. Create a comprehensive mindmap structure in JSON format from the provided banking data.

## Requirements:
- Include ALL ${sheetData.data.length} functions from the input data
- Group by major categories (大項), then sub-categories (細項)
- For each function, list only countries where status = "Available"
- Use clear hierarchical organization

## Input Data:
${JSON.stringify(sheetData, null, 2)}

## Output Format:
Return ONLY valid JSON in this exact structure:

\`\`\`json
{
  "title": "Banking Functions Mindmap",
  "root": {
    "id": "root",
    "title": "存匯業務申請",
    "children": [
      {
        "id": "category_id",
        "title": "Major Category Name",
        "children": [
          {
            "id": "subcategory_id", 
            "title": "Sub-category Name",
            "children": [
              {
                "id": "function_id",
                "title": "Function Name",
                "details": {
                  "platform": "web",
                  "countries": ["Country1", "Country2"]
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
\`\`\`

## Critical Rules:
1. Include EVERY function from the data
2. Only list countries with "Available" status  
3. Return valid JSON only - no explanations
4. Use unique IDs for each node

Return ONLY JSON. No explanations. Start with { and end with }.`;

  return prompt;
}

/**
 * Call OpenRouter API
 */
function callOpenRouterAPI(prompt) {
  const url = `${OPENROUTER_BASE_URL}/chat/completions`;
  
  const payload = {
    model: MODEL_NAME,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2, // Slightly higher for DeepSeek's optimal performance
    max_tokens: 4000, // DeepSeek free tier limit
    // Note: DeepSeek works well with structured prompts and explicit instructions
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://script.google.com',
      'X-Title': 'Google Apps Script Mindmap Generator'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // This allows us to see the full error response
  };
  
  // Retry logic for handling temporary server errors
  const maxRetries = 3;
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      Logger.log(`API attempt ${attempt}/${maxRetries}`);
      
      const response = UrlFetchApp.fetch(url, options);
      const responseCode = response.getResponseCode();
      const responseText = response.getContentText();
      
      Logger.log(`Response code: ${responseCode}`);
      
      if (responseCode === 200) {
        const responseData = JSON.parse(responseText);
        
        if (responseData.choices && responseData.choices[0]) {
          return responseData.choices[0].message.content;
        } else {
          throw new Error('Invalid response structure from OpenRouter API');
        }
      } else if (responseCode === 500) {
        Logger.log(`Server error (500) on attempt ${attempt}: ${responseText}`);
        lastError = new Error(`OpenRouter server error (500): ${responseText}`);
        
        if (attempt < maxRetries) {
          Logger.log(`Waiting 2 seconds before retry...`);
          Utilities.sleep(2000); // Wait 2 seconds before retry
          continue;
        }
      } else if (responseCode === 429) {
        Logger.log(`Rate limit (429) on attempt ${attempt}: ${responseText}`);
        lastError = new Error(`Rate limited (429): ${responseText}`);
        
        if (attempt < maxRetries) {
          Logger.log(`Waiting 5 seconds before retry...`);
          Utilities.sleep(5000); // Wait 5 seconds for rate limit
          continue;
        }
      } else {
        Logger.log(`HTTP error ${responseCode}: ${responseText}`);
        throw new Error(`HTTP ${responseCode}: ${responseText}`);
      }
      
    } catch (error) {
      Logger.log(`Error on attempt ${attempt}: ${error.toString()}`);
      lastError = error;
      
      if (attempt < maxRetries) {
        Logger.log(`Waiting 1 second before retry...`);
        Utilities.sleep(1000);
      }
    }
  }
  
  // If we get here, all retries failed
  Logger.log('All API retry attempts failed');
  throw lastError;
}

/**
 * Parse LLM response to extract mindmap structure
 */
function parseLLMResponse(response, sheetData) {
  try {
    // Prefer fenced code block first
    const fenced = extractJsonFromCodeFence(response);
    if (fenced) {
      return JSON.parse(sanitizeJsonString(fenced));
    }

    // Fall back to first balanced JSON object in the text
    const balanced = extractFirstBalancedJson(response);
    if (balanced) {
      return JSON.parse(sanitizeJsonString(balanced));
    }

    // As a last resort, try naive braces match
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(sanitizeJsonString(jsonMatch[0]));
    }
    
    throw new Error('No JSON found in LLM response');
  } catch (error) {
    Logger.log('Error parsing LLM response: ' + error.toString());
    // Fallback: create a basic structure from the sheet data
    return createFallbackStructure(sheetData);
  }
}

/**
 * Extract JSON enclosed in a ```json ... ``` fenced block
 */
function extractJsonFromCodeFence(text) {
  if (!text) return null;
  const fenceRegex = /```\s*json\s*([\s\S]*?)\s*```/i;
  const anyFenceRegex = /```\s*([\s\S]*?)\s*```/i;
  let match = text.match(fenceRegex);
  if (match && match[1]) return match[1];
  match = text.match(anyFenceRegex);
  if (match && match[1]) return match[1];
  return null;
}

/**
 * Extract the first balanced JSON object string from arbitrary text
 */
function extractFirstBalancedJson(text) {
  if (!text) return null;
  const start = text.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        return text.substring(start, i + 1);
      }
    }
  }
  return null;
}

/**
 * Sanitize quasi-JSON to strict JSON: remove trailing commas, smart quotes, BOM, and comments
 */
function sanitizeJsonString(str) {
  if (!str) return str;
  let s = str;
  // Remove BOM and zero-width characters
  s = s.replace(/^\uFEFF/, '').replace(/[\u200B-\u200D\u2060\uFEFF]/g, '');
  // Normalize smart quotes
  s = s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  // Remove JS-style comments
  s = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '');
  // Remove trailing commas before } or ]
  s = s.replace(/,\s*([}\]])/g, '$1');
  // Trim code fence remnants if any slipped through
  s = s.replace(/```/g, '');
  return s.trim();
}

/**
 * Create fallback mindmap structure if LLM fails
 */
function createFallbackStructure(sheetData) {
  Logger.log('Creating fallback structure from sheet data');
  
  if (!sheetData || !sheetData.data || sheetData.data.length === 0) {
    return {
      title: "Banking Functions Mindmap",
      root: {
        id: "root",
        title: "存匯業務申請",
        children: []
      }
    };
  }
  
  // Group data by major categories
  const categories = {};
  
  sheetData.data.forEach((row, index) => {
    const majorCategory = row.majorCategory || 'Other';
    const subCategory = row.subCategory || 'Other';
    const functionName = row.functionName || row.subCategory || 'Unknown Function';
    
    if (!categories[majorCategory]) {
      categories[majorCategory] = {};
    }
    
    if (!categories[majorCategory][subCategory]) {
      categories[majorCategory][subCategory] = [];
    }
    
    // Get available countries
    const availableCountries = [];
    if (row.countryAvailability) {
      Object.keys(row.countryAvailability).forEach(country => {
        if (row.countryAvailability[country] === 'Available') {
          availableCountries.push(country);
        }
      });
    }
    
    categories[majorCategory][subCategory].push({
      id: `func_${index}`,
      title: functionName,
      details: {
        platform: row.platform || 'web',
        countries: availableCountries
      }
    });
  });
  
  // Convert to mindmap structure
  const children = [];
  let categoryIndex = 1;
  
  Object.keys(categories).forEach(majorCategoryName => {
    const categoryChildren = [];
    let subCategoryIndex = 1;
    
    Object.keys(categories[majorCategoryName]).forEach(subCategoryName => {
      const functions = categories[majorCategoryName][subCategoryName];
      
      categoryChildren.push({
        id: `cat${categoryIndex}_sub${subCategoryIndex}`,
        title: subCategoryName,
        children: functions
      });
      
      subCategoryIndex++;
    });
    
    children.push({
      id: `cat${categoryIndex}`,
      title: majorCategoryName,
      children: categoryChildren
    });
    
    categoryIndex++;
  });
  
  Logger.log(`Fallback structure created with ${children.length} major categories`);
  
  return {
    title: "Banking Functions Mindmap (Fallback)",
    root: {
      id: "root",
      title: "存匯業務申請",
      children: children
    }
  };
}

/**
 * Create XMind file content
 */
function createXMindContent(mindmapStructure) {
  // This is a simplified XMind structure
  // In a full implementation, you'd create proper XMind XML format
  
  const xmindContent = {
    title: mindmapStructure.title,
    root: mindmapStructure.root,
    metadata: {
      creator: "Google Apps Script",
      created: new Date().toISOString(),
      version: "1.0"
    }
  };
  
  return xmindContent;
}

/**
 * Create a downloadable file
 */
function createDownloadableFile(content, filename) {
  // For now, we'll create a text file with the mindmap structure
  // In a full implementation, you'd create proper XMind format
  
  const contentString = JSON.stringify(content, null, 2);
  const blob = Utilities.newBlob(contentString, 'application/json', filename);
  
  // Create a temporary file in Google Drive
  const file = DriveApp.createFile(blob);
  
  // Log the file ID for user to access
  Logger.log(`File created with ID: ${file.getId()}`);
  Logger.log(`File URL: ${file.getUrl()}`);
  
  return file;
}

/**
 * Test function to verify the setup
 */
function testSetup() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = readSheetData(sheet);
    Logger.log('Sheet data read successfully');
    Logger.log('Number of data rows: ' + data.data.length);
    Logger.log('Countries found: ' + data.countryColumns.join(', '));
    return true;
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
    return false;
  }
}

/**
 * Quick function to generate XMind file
 */
function generateXMind() {
  return generateMindmapFromSheet();
}

/**
 * Generate both XMind and JSON formats
 */
function generateAllFormats() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    if (!sheet) {
      throw new Error('No active sheet found');
    }
    
    // Read and process sheet data
    const sheetData = readSheetData(sheet);
    Logger.log('Sheet data processed: ' + sheetData.data.length + ' rows');
    
    // Generate mindmap structure using LLM
    const mindmapStructure = generateMindmapStructure(sheetData);
    Logger.log('Mindmap structure generated');
    
    // Create both formats
    const xmindFile = createXMindFile(mindmapStructure, 'Banking_Functions.xmind');
    const jsonFile = createJSONMindmap(mindmapStructure, 'Banking_Functions.json');
    
    Logger.log('All format generation completed successfully');
    Logger.log('XMind file: ' + xmindFile.getUrl());
    Logger.log('JSON file: ' + jsonFile.getUrl());
    
    return {
      xmind: xmindFile,
      json: jsonFile
    };
    
  } catch (error) {
    Logger.log('Error generating all formats: ' + error.toString());
    throw error;
  }
}

/**
 * Create proper XMind XML content
 */
function createXMindXMLContent(mindmapStructure) {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<xmap-content xmlns="urn:xmind:xmap:xmlns:content:2.0" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" timestamp="1440000000000" version="2.0">
  <sheet id="sheet-1">
    <topic id="${mindmapStructure.root.id}" structure-class="org.xmind.ui.map.clockwise">
      <title>${escapeXml(mindmapStructure.root.title)}</title>
      ${generateTopicsXML(mindmapStructure.root.children)}
    </topic>
  </sheet>
</xmap-content>`;

  return xmlContent;
}

/**
 * Generate XML for topics recursively
 */
function generateTopicsXML(topics) {
  if (!topics || topics.length === 0) return '';
  
  let xml = '';
  topics.forEach(topic => {
    xml += `
      <topic id="${topic.id}">
        <title>${escapeXml(topic.title)}</title>`;
    
    if (topic.details) {
      xml += `
        <children>
          <topics type="attached">
            <topic id="${topic.id}-platform">
              <title>Platform: ${escapeXml(topic.details.platform)}</title>
            </topic>`;
      
      if (topic.details.countries && topic.details.countries.length > 0) {
        xml += `
            <topic id="${topic.id}-countries">
              <title>Available in: ${escapeXml(topic.details.countries.join(', '))}</title>
            </topic>`;
      }
      
      xml += `
          </topics>
        </children>`;
    }
    
    if (topic.children && topic.children.length > 0) {
      xml += `
        <children>
          <topics type="attached">
            ${generateTopicsXML(topic.children)}
          </topics>
        </children>`;
    }
    
    xml += `
      </topic>`;
  });
  
  return xml;
}

/**
 * Escape XML special characters
 */
function escapeXml(text) {
  if (!text) return '';
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Create a proper XMind file (ZIP format with XML content)
 */
function createXMindFile(mindmapStructure, filename) {
  try {
    // Create the content.xml file
    const contentXml = createXMindXMLContent(mindmapStructure);
    
    // Create the manifest.xml file
    const manifestXml = createManifestXML();
    
    // Create the metadata.json file
    const metadataJson = createMetadataJSON(mindmapStructure);
    
    // For now, we'll create a text file with instructions
    // In a full implementation, you'd need to create a ZIP file
    const instructions = `XMind File Creation Instructions:

1. Create a new folder named "${filename.replace('.xmind', '')}"
2. Inside that folder, create these files:

content.xml:
${contentXml}

manifest.xml:
${manifestXml}

metadata.json:
${metadataJson}

3. Zip the folder and rename the .zip to .xmind
4. Open with XMind application

Note: Google Apps Script cannot create ZIP files directly.
You may need to use an external service or download the XML content
and manually create the XMind file.`;

    const blob = Utilities.newBlob(instructions, 'text/plain', filename + '_instructions.txt');
    const file = DriveApp.createFile(blob);
    
    Logger.log(`Instructions file created with ID: ${file.getId()}`);
    Logger.log(`File URL: ${file.getUrl()}`);
    
    return file;
    
  } catch (error) {
    Logger.log('Error creating XMind file: ' + error.toString());
    throw error;
  }
}

/**
 * Create manifest.xml for XMind
 */
function createManifestXML() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<manifest xmlns="urn:xmind:xmap:xmlns:manifest:1.0">
  <file-entry full-path="content.xml" media-type="text/xml"/>
  <file-entry full-path="metadata.json" media-type="application/json"/>
  <file-entry full-path="META-INF/" media-type=""/>
  <file-entry full-path="META-INF/manifest.xml" media-type="text/xml"/>
</manifest>`;
}

/**
 * Create metadata.json for XMind
 */
function createMetadataJSON(mindmapStructure) {
  const metadata = {
    creator: {
      name: "Google Apps Script",
      version: "1.0"
    },
    createTime: new Date().toISOString(),
    title: mindmapStructure.title || "Generated Mindmap",
    theme: {
      id: "default"
    }
  };
  
  return JSON.stringify(metadata, null, 2);
}

/**
 * Create a simple JSON mindmap file as alternative
 */
function createJSONMindmap(mindmapStructure, filename) {
  const jsonContent = {
    title: mindmapStructure.title,
    root: mindmapStructure.root,
    metadata: {
      creator: "Google Apps Script",
      created: new Date().toISOString(),
      version: "1.0",
      format: "JSON Mindmap"
    }
  };
  
  const contentString = JSON.stringify(jsonContent, null, 2);
  const blob = Utilities.newBlob(contentString, 'application/json', filename);
  const file = DriveApp.createFile(blob);
  
  Logger.log(`JSON mindmap file created with ID: ${file.getId()}`);
  Logger.log(`File URL: ${file.getUrl()}`);
  
  return file;
}

/**
 * Function to manually trigger mindmap generation
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Mindmap Generator')
    .addItem('Generate XMind File', 'generateXMind')
    .addItem('Generate All Formats', 'generateAllFormats')
    .addSeparator()
    .addItem('Generate Mindmap (Legacy)', 'generateMindmapFromSheet')
    .addItem('Test Setup', 'testSetup')
    .addToUi();
} 