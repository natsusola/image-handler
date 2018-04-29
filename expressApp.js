const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(3001, () => {
  console.log('Server start at port 3001.');
});
