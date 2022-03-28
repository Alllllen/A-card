const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

//DB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log('DB connect success'))
  .catch((err) => {
    console.log(err.message);
  });
const port = process.env.PORT;

//server
const server = app.listen(port, () => {
  console.log(`Server Run on port ${port}`);
});
