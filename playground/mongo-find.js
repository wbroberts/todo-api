const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5b16137e84a7475ce8e3d6c7')
  //   }).toArray().then(result => {
  //   console.log('Todos:')
  //   console.log(JSON.stringify(result, undefined, 2));
  // }).catch(error => {
  //   console.log('Unable to fetch', error)
  // })
  // db.collection('Todos').find().count().then(count => {
  //   console.log(`${count} todos`)
  // }).catch(error => {
  //   console.log('Unable to fetch', error)
  // })

  db.collection('Users').find({name: 'William'}).toArray().then(result => {
    console.log(JSON.stringify(result, undefined, 2));
  }).catch(error => {
    console.log(error)
  })

  // client.close();
});