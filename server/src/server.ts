import express from 'express';
import path from 'path';
const app = express();

const rootPath = path.join(__dirname, '../..');
app.use(express.static(path.join(rootPath, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(rootPath, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
