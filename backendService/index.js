const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = './data.json';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const readData = () => {
  const data = fs.readFileSync(path);
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};


app.post('/api/items', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const items = readData();
  const newItem = { id: Date.now(), title, description };
  items.push(newItem);
  writeData(items);

  res.status(201).json(newItem);
});

app.get('/api/items', (req, res) => {
  const items = readData();
  res.json({ items });
});

app.put('/api/items/:id', (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  let items = readData();
  const itemIndex = items.findIndex((item) => item.id === parseInt(id));

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  items[itemIndex] = { id: parseInt(id), title, description };
  writeData(items);

  res.json(items[itemIndex]);
});

app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  let items = readData();
  const itemIndex = items.findIndex((item) => item.id === parseInt(id));

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  items = items.filter((item) => item.id !== parseInt(id));
  writeData(items);

  res.json({ deleted: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
