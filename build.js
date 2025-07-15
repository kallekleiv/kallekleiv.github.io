const esbuild = require('esbuild');
const path = require('node:path');
const fs = require('node:fs');
const { sassPlugin } = require('esbuild-sass-plugin');

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
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ port: 3001 });

  const clients = new Set();

  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
  });

  esbuild
    .context({
      ...buildOptions,
      plugins: [
        sassPlugin(),
        {
          name: 'live-reload',
          setup(build) {
            build.onEnd((result) => {
              if (result.errors.length === 0) {
                console.log('✅ Build completed - notifying clients...');
                for (const ws of clients) {
                  if (ws.readyState === WebSocket.OPEN) {
                    ws.send('reload');
                  }
                }
              } else {
                console.log('❌ Build failed:', result.errors);
              }
            });
          },
        },
      ],
    })
    .then(async (ctx) => {
      await ctx.watch();

      const { port } = await ctx.serve({
        servedir: 'dist',
        host: 'localhost',
        port: 3000,
      });

      console.log(`🚀 Dev server: http://localhost:${port}`);
      console.log('👀 Watching for changes (with live reload)...');

      process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down...');
        await ctx.dispose();
        wss.close();
        process.exit(0);
      });
    });
} else {
  // Production build
  esbuild
    .build({
      ...buildOptions,
      plugins: [sassPlugin()],
    })
    .then(() => {
      console.log('✅ Production build completed');
    })
    .catch(() => process.exit(1));
}
