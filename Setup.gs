/**
 * Setup and Testing Script for Google Apps Script Mindmap Generator
 * 
 * Run this script to test your configuration and verify everything is working.
 */

/**
 * Test the complete setup
 */
function testCompleteSetup() {
  console.log('=== Testing Complete Setup ===');
  
  try {
    // Test 1: Check if we can read the sheet
    console.log('1. Testing sheet data reading...');
    const sheetTest = testSheetReading();
    if (sheetTest.success) {
      console.log('✅ Sheet reading: SUCCESS');
      console.log(`   - Found ${sheetTest.data.data.length} data rows`);
      console.log(`   - Countries: ${sheetTest.data.countryColumns.join(', ')}`);
    } else {
      console.log('❌ Sheet reading: FAILED');
      console.log(`   - Error: ${sheetTest.error}`);
      return false;
    }
    
    // Test 2: Check OpenRouter API configuration
    console.log('2. Testing OpenRouter API configuration...');
    const apiTest = testOpenRouterConfig();
    if (apiTest.success) {
      console.log('✅ OpenRouter API config: SUCCESS');
      console.log(`   - Model: ${apiTest.model}`);
      console.log(`   - Base URL: ${apiTest.baseUrl}`);
    } else {
      console.log('❌ OpenRouter API config: FAILED');
      console.log(`   - Error: ${apiTest.error}`);
      return false;
    }
    
    // Test 3: Test API connection (optional - requires API key)
    if (OPENROUTER_API_KEY !== 'YOUR_OPENROUTER_API_KEY_HERE') {
      console.log('3. Testing OpenRouter API connection...');
      const connectionTest = testAPIConnection();
      if (connectionTest.success) {
        console.log('✅ API connection: SUCCESS');
        console.log(`   - Response time: ${connectionTest.responseTime}ms`);
      } else {
        console.log('❌ API connection: FAILED');
        console.log(`   - Error: ${connectionTest.error}`);
        console.log('   - Note: This is not critical for basic functionality');
      }
    } else {
      console.log('3. Skipping API connection test (API key not configured)');
    }
    
    // Test 4: Test mindmap generation (without API call)
    console.log('4. Testing mindmap generation logic...');
    const mindmapTest = testMindmapGeneration();
    if (mindmapTest.success) {
      console.log('✅ Mindmap generation logic: SUCCESS');
      console.log(`   - Generated structure with ${mindmapTest.nodeCount} nodes`);
    } else {
      console.log('❌ Mindmap generation logic: FAILED');
      console.log(`   - Error: ${mindmapTest.error}`);
      return false;
    }
    
    console.log('\n=== All Tests Passed! ===');
    console.log('Your setup is ready to use.');
    console.log('Run generateXMindMindmap() to create your first mindmap.');
    
    return true;
    
  } catch (error) {
    console.log('❌ Setup test failed with error: ' + error.toString());
    return false;
  }
}

/**
 * Test sheet data reading
 */
function testSheetReading() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    if (!sheet) {
      return { success: false, error: 'No active sheet found' };
    }
    
    const data = readSheetData(sheet);
    
    if (!data || !data.data || data.data.length === 0) {
      return { success: false, error: 'No data found in sheet' };
    }
    
    return { success: true, data: data };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Test OpenRouter API configuration
 */
function testOpenRouterConfig() {
  try {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE') {
      return { success: false, error: 'API key not configured' };
    }
    
    if (!OPENROUTER_BASE_URL) {
      return { success: false, error: 'Base URL not configured' };
    }
    
    if (!MODEL_NAME) {
      return { success: false, error: 'Model name not configured' };
    }
    
    return { 
      success: true, 
      model: MODEL_NAME,
      baseUrl: OPENROUTER_BASE_URL
    };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Test API connection (optional)
 */
function testAPIConnection() {
  try {
    const startTime = Date.now();
    
    // Make a simple test call
    const testPrompt = "Hello, this is a test. Please respond with 'Test successful'.";
    const response = callOpenRouterAPI(testPrompt);
    
    const responseTime = Date.now() - startTime;
    
    if (response && response.includes('Test successful')) {
      return { success: true, responseTime: responseTime };
    } else {
      return { success: false, error: 'Unexpected response format' };
    }
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Test mindmap generation logic
 */
function testMindmapGeneration() {
  try {
    // Create a simple test structure
    const testStructure = {
      title: "Test Mindmap",
      root: {
        id: "root",
        title: "Root",
        children: [
          {
            id: "cat1",
            title: "Category 1",
            children: [
              {
                id: "func1",
                title: "Function 1",
                details: {
                  platform: "web",
                  countries: ["Test Country"]
                }
              }
            ]
          }
        ]
      }
    };
    
    // Test XMind XML generation
    const xmlContent = createXMindXMLContent(testStructure);
    if (!xmlContent || !xmlContent.includes('<xmap-content')) {
      return { success: false, error: 'XMind XML generation failed' };
    }
    
    // Count nodes in the structure
    const nodeCount = countNodes(testStructure.root);
    
    return { success: true, nodeCount: nodeCount };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Count nodes in mindmap structure
 */
function countNodes(node) {
  let count = 1; // Count current node
  
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      count += countNodes(child);
    });
  }
  
  return count;
}

/**
 * Quick configuration check
 */
function checkConfiguration() {
  console.log('=== Configuration Check ===');
  
  console.log('OpenRouter API Key:', 
    OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE' ? '❌ NOT CONFIGURED' : '✅ CONFIGURED');
  
  console.log('Model Name:', MODEL_NAME || '❌ NOT SET');
  console.log('Base URL:', OPENROUTER_BASE_URL || '❌ NOT SET');
  
  console.log('Sheet Config:', 
    SHEET_CONFIG ? '✅ CONFIGURED' : '❌ NOT CONFIGURED');
  
  console.log('Prompt Config:', 
    PROMPT_CONFIG ? '✅ CONFIGURED' : '❌ NOT CONFIGURED');
  
  console.log('Output Config:', 
    OUTPUT_CONFIG ? '✅ CONFIGURED' : '❌ NOT CONFIGURED');
}

/**
 * Generate a sample mindmap for testing
 */
function generateSampleMindmap() {
  console.log('Generating sample mindmap...');
  
  try {
    // Create sample data structure
    const sampleData = {
      headers: ['大項', '細項', '2.0功能名稱', '平台', '台灣', '香港', '新加坡'],
      countryColumns: ['台灣', '香港', '新加坡'],
      data: [
        {
          majorCategory: '存款查詢',
          subCategory: '存款歸戶查詢',
          functionName: '存款歸戶查詢',
          platform: 'web',
          countryAvailability: {
            '台灣': 'Available',
            '香港': 'Available',
            '新加坡': 'Available'
          }
        },
        {
          majorCategory: '票據查詢',
          subCategory: '電子回單',
          functionName: '電子回單',
          platform: 'web',
          countryAvailability: {
            '台灣': 'Not Available',
            '香港': 'Not Available',
            '新加坡': 'Not Available'
          }
        }
      ]
    };
    
    // Generate mindmap structure
    const mindmapStructure = {
      title: "Sample Banking Functions Mindmap",
      root: {
        id: "root",
        title: "存匯業務申請",
        children: [
          {
            id: "deposit",
            title: "存款查詢",
            children: [
              {
                id: "deposit-query",
                title: "存款歸戶查詢",
                details: {
                  platform: "web",
                  countries: ["台灣", "香港", "新加坡"]
                }
              }
            ]
          },
          {
            id: "bill",
            title: "票據查詢",
            children: [
              {
                id: "e-receipt",
                title: "電子回單",
                details: {
                  platform: "web",
                  countries: []
                }
              }
            ]
          }
        ]
      }
    };
    
    // Create files
    const xmindFile = createXMindFile(mindmapStructure, 'Sample_Mindmap.xmind');
    const jsonFile = createJSONMindmap(mindmapStructure, 'Sample_Mindmap.json');
    
    console.log('✅ Sample mindmap generated successfully!');
    console.log(`XMind file ID: ${xmindFile.getId()}`);
    console.log(`JSON file ID: ${jsonFile.getId()}`);
    
    return { xmind: xmindFile, json: jsonFile };
    
  } catch (error) {
    console.log('❌ Error generating sample mindmap: ' + error.toString());
    throw error;
  }
}

/**
 * Setup menu for easy access
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Mindmap Generator')
    .addItem('Generate Mindmap', 'generateXMindMindmap')
    .addItem('Generate All Formats', 'generateAllFormats')
    .addSeparator()
    .addItem('Test Setup', 'testCompleteSetup')
    .addItem('Check Configuration', 'checkConfiguration')
    .addItem('Generate Sample', 'generateSampleMindmap')
    .addToUi();
} 