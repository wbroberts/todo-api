const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b17f15f3716b16dbc6f6e6e')
  }, {
    $inc: {
      age: 1
    },
    $set: {
      location: 'Salt Lake City, UT',
    },
    $currentDate: {
      updated: true,
      time: {$type: 'timestamp'}
    }
  }, {
    returnOriginal: false
  }).then(result => {
    console.log(JSON.stringify(result, undefined, 2))
  }).catch(error => {
    console.log(JSON.stringify(error, undefined, 2))
  })

});