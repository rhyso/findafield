const express = require('express')
const path = require('path')
const cool = require('cool-ascii-faces')
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const router = express.Router();
const bodyParser = require ('body-parser')

const cors = require('cors')
const Fields = require('./models/fields')


mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost/your-app-name');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/db/fields', async (req, res) => {
    try {
    //   const client = await pool.connect()
    //   const result = await client.query('SELECT * FROM fields');
    //   const results = { 'results': (result) ? result.rows : null};
    //   res.render('pages/db', results );
    //   client.release();
    Fields.find((err, fields) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: fields });
    });
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
