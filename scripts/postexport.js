// Post-processes the Expo web export in dist/ so it works as an
// installable PWA when served under /app on GitHub Pages.
// Run after: npx expo export --platform web
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

// Copy PWA manifest and icons into the export
fs.copyFileSync(path.join(root, 'web', 'manifest.json'), path.join(dist, 'manifest.json'));
for (const icon of ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.png']) {
  fs.copyFileSync(path.join(root, 'assets', icon), path.join(dist, icon));
}

// Inject PWA/meta tags into the exported index.html
const indexPath = path.join(dist, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const headTags = `
    <title>Noura Skin Secrets</title>
    <link rel="manifest" href="/app/manifest.json" />
    <link rel="icon" href="/app/favicon.png" />
    <link rel="apple-touch-icon" href="/app/apple-touch-icon.png" />
    <meta name="theme-color" content="#D4A574" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Noura Skin" />
    <meta name="description" content="احجزي موعدك في نورا سكين سيكرتس - خدمات العناية بالبشرة" />`;

// Replace any existing <title> and add our tags right after <head>
html = html.replace(/<title>.*?<\/title>/s, '');
html = html.replace('<head>', '<head>' + headTags);

fs.writeFileSync(indexPath, html);
console.log('postexport: PWA files injected into dist/');
