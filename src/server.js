const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// ルートハンドラ
app.get('/', (req, res) => {
  res.send(`
<html>
  <head>
    <title>Sample Express App</title>
    <style>
      body { font-family: Arial, sans-serif; }
      h1 { color: #333; }
    </style>
  </head>
  <body>
    <h1>Welcome to the Sample Express App!</h1>
    <p>This is a simple server running on Node.js and Express.</p>
    <script src="/test.js"></script>
  </body>
`);
});

// JSONを返すAPI
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is a sample JSON response', status: 'success' });
});

app.get('/test.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(fs.readFileSync(path.resolve(__dirname, 'test.js'), 'utf8'));
});

// サーバ起動
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// シグナルハンドリング
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});
