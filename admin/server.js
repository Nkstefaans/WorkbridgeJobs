#!/usr/bin/env node

// Simple HTTP server for WorkBridge Admin Panel
// Run with: node admin/server.js

import { readFileSync } from 'fs';
import { createServer } from 'http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.ADMIN_PORT || 3001;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function getContentType(filePath) {
    const ext = filePath.substring(filePath.lastIndexOf('.'));
    return mimeTypes[ext] || 'text/plain';
}

const server = createServer((req, res) => {
    // Remove query parameters and decode URL
    let filePath = req.url.split('?')[0];
    filePath = decodeURIComponent(filePath);

    // Default to index.html for root requests
    if (filePath === '/' || filePath === '') {
        filePath = '/index.html';
    }

    // Security: prevent directory traversal
    if (filePath.includes('..')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    // Construct absolute file path
    const absolutePath = join(__dirname, filePath);

    try {
        const content = readFileSync(absolutePath);
        const contentType = getContentType(filePath);
        
        // Add CORS headers for development
        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        
        res.end(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .error { color: #e74c3c; }
                        .back { color: #3498db; text-decoration: none; }
                    </style>
                </head>
                <body>
                    <h1 class="error">404 - Page Not Found</h1>
                    <p>The requested file <code>${filePath}</code> was not found.</p>
                    <a href="/" class="back">← Back to Admin Panel</a>
                </body>
                </html>
            `);
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
        }
        console.error(`Error serving ${filePath}:`, error.message);
    }
});

server.listen(PORT, () => {
    console.log('🚀 WorkBridge Admin Panel Server Started');
    console.log(`📋 Admin Panel: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log('');
    console.log('🎯 Quick Access:');
    console.log(`   • Admin Panel: http://localhost:${PORT}`);
    console.log(`   • Post Jobs: http://localhost:${PORT}/#post-job`);
    console.log(`   • Manage Jobs: http://localhost:${PORT}/#manage-jobs`);
    console.log(`   • View Applications: http://localhost:${PORT}/#applications`);
    console.log('');
    console.log('📝 Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down WorkBridge Admin Panel Server...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n\n👋 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});
