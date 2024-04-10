const fs = require('fs');
const path = require('path');


function logAction(administrator, action, details) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        administrator: administrator,
        action: action,
        details: details
    };

    const logFilePath = path.join(__dirname, 'audit-trail.log');

    
    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
            console.error('Error writing to audit trail:', err);
        } else {
            console.log('Action logged successfully:', logEntry);
        }
    });
}
module.exports = logAction;