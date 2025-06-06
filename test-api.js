// Simple test for the API
import handler from './api/index.ts';

const mockReq = { 
  method: 'GET', 
  url: '/api/debug' 
};

const mockRes = {
  setHeader: () => {},
  status: (code) => ({
    end: () => console.log('Status:', code),
    json: (data) => console.log('Response:', JSON.stringify(data, null, 2))
  }),
  json: (data) => console.log('Response:', JSON.stringify(data, null, 2))
};

// Test the handler
handler(mockReq, mockRes).catch(console.error);
