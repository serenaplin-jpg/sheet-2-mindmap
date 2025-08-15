/**
 * Configuration file for Google Apps Script Mindmap Generator
 * 
 * Copy this configuration section to your Code.gs file
 * and replace the placeholder values with your actual settings.
 */

// ===== OPENROUTER CONFIGURATION =====
const OPENROUTER_API_KEY = 'YOUR_OPENROUTER_API_KEY_HERE'; // Replace with your actual API key
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// ===== LLM MODEL CONFIGURATION =====
const MODEL_NAME = 'anthropic/claude-3.5-sonnet'; // Recommended for best results
// Alternative models you can use:
// const MODEL_NAME = 'openai/gpt-4'; // More expensive but very capable
// const MODEL_NAME = 'anthropic/claude-3-haiku'; // Faster and cheaper
// const MODEL_NAME = 'meta-llama/llama-3.1-8b-instruct'; // Open source option

// ===== SHEET CONFIGURATION =====
const SHEET_CONFIG = {
  // Header row (0-indexed, so row 4 = index 3)
  HEADER_ROW_INDEX: 3,
  
  // Column names to look for (must match exactly)
  COLUMNS: {
    MAJOR_CATEGORY: '大項',
    SUB_CATEGORY: '細項',
    FUNCTION_NAME: '2.0功能名稱',
    PLATFORM: '平台'
  },
  
  // Country availability markers
  AVAILABILITY_MARKERS: {
    AVAILABLE: 'V',
    NOT_AVAILABLE: 'X'
  }
};

// ===== LLM PROMPT CONFIGURATION =====
const PROMPT_CONFIG = {
  // Temperature for LLM responses (0.0 = very focused, 1.0 = very creative)
  TEMPERATURE: 0.3,
  
  // Maximum tokens for LLM response
  MAX_TOKENS: 4000,
  
  // System prompt template
  SYSTEM_PROMPT: `You are an expert at creating mindmap structures from business data. 
Your task is to organize banking and financial services functions into a logical, hierarchical mindmap structure.`
};

// ===== OUTPUT CONFIGURATION =====
const OUTPUT_CONFIG = {
  // Default filename for generated mindmaps
  DEFAULT_FILENAME: 'Banking_Functions_Mindmap',
  
  // File formats to generate
  FORMATS: {
    XMIND: true,
    JSON: true,
    INSTRUCTIONS: true
  },
  
  // Include metadata in output
  INCLUDE_METADATA: true
};

// ===== ERROR HANDLING CONFIGURATION =====
const ERROR_CONFIG = {
  // Retry failed API calls
  RETRY_ATTEMPTS: 3,
  
  // Delay between retries (in milliseconds)
  RETRY_DELAY: 1000,
  
  // Log level: 'debug', 'info', 'warn', 'error'
  LOG_LEVEL: 'info'
};

// ===== ADVANCED CONFIGURATION =====
const ADVANCED_CONFIG = {
  // Custom prompt templates (you can modify these)
  PROMPT_TEMPLATES: {
    BANKING_FUNCTIONS: `Based on the following banking/financial services data, create a well-organized mindmap structure in JSON format.

The data represents banking functions and their availability across different countries:
- Major categories (大項)
- Sub-categories (細項) 
- Function names (2.0功能名稱)
- Platform (平台)
- Country availability (V = Available, X = Not Available)

Please create a mindmap structure that:
1. Groups functions by major categories
2. Shows sub-categories under each major category
3. Includes function details and platform information
4. Highlights country availability patterns
5. Uses clear, logical organization

Focus on logical grouping and clear hierarchy. Return ONLY valid JSON.`,
    
    GENERAL_BUSINESS: `You are creating a mindmap from business data. Organize the information into logical categories and subcategories, showing relationships and hierarchies clearly. Return ONLY valid JSON.`
  },
  
  // Custom mindmap styling (for future enhancements)
  STYLING: {
    DEFAULT_THEME: 'default',
    COLOR_SCHEME: 'professional',
    LAYOUT: 'clockwise'
  }
};

// ===== EXAMPLE USAGE =====
/*
To use this configuration:

1. Copy the configuration constants above to your Code.gs file
2. Replace 'YOUR_OPENROUTER_API_KEY_HERE' with your actual API key
3. Modify any other settings as needed
4. Save and run your script

Example of changing the model:
const MODEL_NAME = 'openai/gpt-4';

Example of changing the temperature:
const PROMPT_CONFIG = {
  ...PROMPT_CONFIG,
  TEMPERATURE: 0.5
};
*/ 