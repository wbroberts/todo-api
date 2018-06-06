const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('Todos').deleteMany({text: 'Get some sleep'}).then(result => {
  //   console.log(result)
  // })

  // db.collection('Todos').deleteOne({text: 'Get some sleep'}).then(result => console.log(result.result));

  // db.collection('Todos').findOneAndDelete({completed: false}).then(result => console.log(result));

  // db.collection('Users').findOneAndDelete({
  //   _id: new ObjectID('5b173f962a7d6227e6c119e6')
  // }).then(result => console.log(result));

  db.collection('Users').find().toArray().then(result => console.log(JSON.stringify(result, undefined, 2)));

  // db.collection('Users').deleteMany({name: 'William'}).then(result => console.log(`Deleted ${result.result.n} todos`));

  // client.close();
});