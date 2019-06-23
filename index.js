express = require('express')
const assert = require('assert')
const bodyParser = require('body-parser')
const { MongoClient, ObjectID } = require('mongodb')
var cors = require('cors')
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.use(cors())


const mongourl = 'mongodb://localhost:27017'
const database = 'first-api'

MongoClient.connect(mongourl, { useNewUrlParser: true }, (err, client) => {
  assert.equal(err, null, 'database connection failed')

  const db = client.db(database)

  app.delete('/delete_contact/:id', cors(), (req, res) => {
    let ID = ObjectID(req.params.id)
    db.collection('contacts').findOneAndDelete({ _id: ID }, (err, data) => {
      if (err) res.send(err)
      else res.send(data)
    })
  })

  app.post('/new_contact', (req, res) => {
    console.log(req.body)
    let new_product = req.body
    db.collection('contacts').insertOne(new_product, (err, data) => {
      if (err) res.send(err)
      else res.send(data)
    })
  })

  app.get('/contacts', cors(), (req, res) => {
    db.collection('contacts').find().toArray((err, data) => {
      if (err) res.send("error")
      else res.send(data)
    })
  })

  app.get('/contacts/:id', cors(), (req, res) => {
    let ID = ObjectID(req.params.id)
    db.collection('contacts').findOne({ _id: ID }, (err, data) => {
      if (err) res.send("error")
      else res.send(data)
    })
  })

  app.put('/update_contacts/:id', bodyParser.json(), (req, res) => {
    let ID = ObjectID(req.params.id)
    let modifiedContact = req.body
    db.collection('contacts').findOneAndUpdate({ _id: ID }, { $set: { ...modifiedContact } }, (err, data) => {
      if (err) res.send("error")
      else res.send(data)
    })
  })
})

// routes go here
app.listen(3000, () => {
  console.log(`http://localhost:3000`)
}) 