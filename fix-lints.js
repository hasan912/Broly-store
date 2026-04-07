const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /h-\[1px\]/g, replace: 'h-px' },
  { search: /tracking-\[0\.1em\]/g, replace: 'tracking-widest' },
  { search: /blur-\[40px\]/g, replace: 'blur-2xl' },
  { search: /\bflex-grow\b/g, replace: 'grow' },
  { search: /bg-gradient-to-r/g, replace: 'bg-linear-to-r' },
  { search: /bg-gradient-to-b/g, replace: 'bg-linear-to-b' },
  { search: /bg-gradient-to-br/g, replace: 'bg-linear-to-br' },
  { search: /bg-gradient-to-t/g, replace: 'bg-linear-to-t' },
  { search: /bg-gradient-to-l/g, replace: 'bg-linear-to-l' },
  { search: /bg-gradient-to-tl/g, replace: 'bg-linear-to-tl' },
  { search: /bg-gradient-to-tr/g, replace: 'bg-linear-to-tr' },
  { search: /bg-gradient-to-bl/g, replace: 'bg-linear-to-bl' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // recursively process
      if (!['node_modules', '.next', '.git'].includes(file)) {
        processDirectory(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      for (const { search, replace } of replacements) {
        if (search.test(content)) {
          content = content.replace(search, replace);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed lints in:', fullPath);
      }
    }
  }
}

// process app and components directories
processDirectory(path.join(__dirname, 'app'));
processDirectory(path.join(__dirname, 'components'));
console.log('Done!');
