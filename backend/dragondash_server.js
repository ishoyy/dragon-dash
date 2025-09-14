const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

let bestScore = 0;

app.get('/best-score', (req, res) => {
  res.json({ bestScore });
});

app.post('/best-score', (req, res) => {
  const { score } = req.body;
  if (score > bestScore) {
    bestScore = score;
  }
  res.json({ bestScore });
});

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});
