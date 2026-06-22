const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/OceanCatch/g, 'Sea Harvest Premium Seafoods');
  content = content.replace(/\+91 9656200209/g, '8086607878');
  content = content.replace(/midhunprathap\.in@gmail\.com/g, 'tonykannala@gmail.com');
  
  // Handle COMPANY_PHONE
  content = content.replace(/const COMPANY_PHONE = '8086607878'/g, "const COMPANY_PHONE = '8086607878'\nconst COMPANY_WHATSAPP = '8089993930'");
  content = content.replace(/COMPANY_PHONE\.replace\(\/\[\^0-9\]\/g, ''\)/g, 'COMPANY_WHATSAPP');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  });
}

walkDir('./src');
console.log('Done');
