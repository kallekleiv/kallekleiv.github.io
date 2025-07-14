const esbuild = require('esbuild');
const path = require('node:path');
const fs = require('node:fs');

const isProduction = process.env.NODE_ENV === 'production';
const isDev = process.argv.includes('--dev');

const distDir = path.join(__dirname, 'dist');
const staticDir = path.join(distDir, 'static', 'js');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

const publicDir = path.join(__dirname, 'public');
const publicFiles = fs.readdirSync(publicDir);
for (const file of publicFiles) {
  fs.copyFileSync(path.join(publicDir, file), path.join(distDir, file));
}

const indexHtmlPath = path.join(distDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

indexHtml = indexHtml.replace(/%PUBLIC_URL%/g, '.');
indexHtml = indexHtml.replace(
  '<title>React App</title>',
  '<link rel="stylesheet" href="./static/js/main.css" />\n    <title>Kallekleiv GitHub page</title>',
);
indexHtml = indexHtml.replace(
  'content="Web site created using create-react-app"',
  'content="Personal website hosted on GitHub Pages"',
);

indexHtml = indexHtml.replace(
  '</body>',
  '    <script src="./static/js/main.js"></script>\n  </body>',
);

fs.writeFileSync(indexHtmlPath, indexHtml);

const buildOptions = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'dist/static/js/main.js',
  jsx: 'automatic',
  loader: {
    '.svg': 'dataurl',
    '.png': 'dataurl',
    '.jpg': 'dataurl',
    '.jpeg': 'dataurl',
    '.gif': 'dataurl',
    '.ico': 'dataurl',
    '.css': 'css',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
  },
  minify: isProduction,
  sourcemap: !isProduction,
  target: ['es2020'],
};

if (isDev) {
  esbuild.context(buildOptions).then(async (ctx) => {
    await ctx.watch();

    const { host, port } = await ctx.serve({
      servedir: 'dist',
      host: 'localhost',
      port: 3000,
    });

    console.log(`Development server running at http://${host || 'localhost'}:${port}`);
  });
} else {
  esbuild.build(buildOptions).catch(() => process.exit(1));
}
