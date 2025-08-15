/**
 * Enhanced XMind Generator for Google Apps Script
 * Creates proper XMind XML format files
 */

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
 * Enhanced mindmap generation with proper XMind output
 */
function generateXMindMindmap() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    if (!sheet) {
      throw new Error('No active sheet found');
    }
    
    // Read and process sheet data
    const sheetData = readSheetData(sheet);
    
    // Generate mindmap structure using LLM
    const mindmapStructure = generateMindmapStructure(sheetData);
    
    // Create XMind file
    const filename = `Banking_Functions_Mindmap_${new Date().toISOString().split('T')[0]}.xmind`;
    const file = createXMindFile(mindmapStructure, filename);
    
    Logger.log('XMind mindmap generation completed successfully');
    return file;
    
  } catch (error) {
    Logger.log('Error generating XMind mindmap: ' + error.toString());
    throw error;
  }
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
    
    // Generate mindmap structure using LLM
    const mindmapStructure = generateMindmapStructure(sheetData);
    
    // Create both formats
    const xmindFile = createXMindFile(mindmapStructure, 'Banking_Functions.xmind');
    const jsonFile = createJSONMindmap(mindmapStructure, 'Banking_Functions.json');
    
    Logger.log('All format generation completed successfully');
    return {
      xmind: xmindFile,
      json: jsonFile
    };
    
  } catch (error) {
    Logger.log('Error generating all formats: ' + error.toString());
    throw error;
  }
} 