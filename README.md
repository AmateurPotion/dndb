# DnDB

[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/dndb) [![HitCount](http://hits.dwyl.com/denyncrawford/dndb.svg)](http://hits.dwyl.com/denyncrawford/dndb)

DnDB is a javascript persistent database written for deno and available for typescript.

Inspired by NeDB, DnDB is a powerful but minimalist database engine written on JS that uses the mongo query API to edit and find data, making it 100% exportable to a mongojs environment.

> *Notice*: This project is under development, so it is subject to future improvements and changes.

## 📦 Importing

```javascript
import Datastore from 'https://x.nest.land/dndb@0.0.2/mod.js'
```

## 📖 Usage

DnDB works by instantiating collections stored in a specific file given by the user in the instance configuration. By default the created instance exposes the necessary methods to work the datastore.

All the api methods are asynchronous by default, so they return promises, but it's also possible to pass a callback to them to work in a traditional mongo way.

- [Instantiating a collection](/#instatiating-a-collection)
- [API](#inserting-documents)
   - [Inserting documents](#%EF%B8%8F-inserting-documents)
   - [Finding documents](#-finding-documents)
   - [Updating documents](#%EF%B8%8F-updating-documents)
   - [Removing documents](#-removing-documents)

## ✔️ Instantiating the collection

```javascript
import Datastore from 'https://x.nest.land/dndb@0.0.2/mod.js'

const db = new Datastore({ filname:"./database.db", autoload: true })

```

When you instantiate a collection you can pass it a config object with a couple of options:

- `filename`: The filename is the absolute path to your traget file. If no filename is provided, DnDB will automatically create one in the current working directory, and if a full path is not specified, it will resolve the file name within the CWD.

- `autoload`: The autoload option runs the `loadDatabase` method which creates the persistent file the first time DnDB is runing in your project, this is optional, but if the loadDatabase method is not executed, the instance will not work until the persistent file exists.

> *Notice*: The configuration content is currently in alpha, more options will be available soon.

## 🖋️ Inserting documents

All data types are allowed, but field names starting with '$' are reserved for data querying.

If the document does not contain an _id field, DnDB will automatically generated one for you (a RFC4122 UUID alphanumerical string). The _id of a document, once set, shouldn't be modified.

```javascript
let obj = {
  name: 'denyn',
  lastname: 'crawford'
}

let insertion = db.insert(obj);

// OR

db.insert(obj, (insertion) => {
  // ...foo(insetion)
})

```

To insert documents DnDB exposes the method:

- `insert`:
 
 - returns: Array/object with the inserted documents.

The insert method receives two arguments: 

- `data`: Json data to insert
- `callback`(optional): The callback function to get the data inserted.

You can also insert several documents at the same time by wrapping them in an array.

```javascript

let foo = "foo"

db.insert([ { name: 'denyn' }, { name: foo } ], (insertion) => {
  // ...foo(insetion)
})
```

## 🔍 Finding documents

To find documents DnDB exposes the methods:

- `find`: Finds all the documents that match the query.

  - returns: array of matching documents

- `findOne`: Finds the first document that matches the query.

  - returns: exact first matching objec

You can select documents based on field equality or use comparison operators (`$lt`, `$lte`, `$gt`, `$gte`, `$in`, `$nin`, `$ne`). You can also use logical operators `$or`, `$and`, `$not` and `$where`. See below for the syntax.

You can use regular expressions in two ways: in basic querying in place of a string, or with the $regex operator.

*Example of document querying:*

> *Notice*: See all rules and operators list [here](https://www.npmjs.com/package/mingo)

```javascript

db.find({name:"Denyn"}, {}, (docs) => {
  console.log(docs);
});

// or

let docs = await db.find({name:"Denyn"})

// Finding unique document

let docs = await db.findOne({username:"denyncrawford"})

// Deep querying syntax:

let docs = await db.find( { fullname: { lastname: "Crawford" } })

```

You can also use dot notation to find documents by deep querying.

```javascript

let docs = await db.find( { "fullname.lastname": "Crawford" })

// Using dot notation to fin inside arrays:

let docs = await db.find( { "list.games.0": "Doom" })

```

> If you want to know how to advance query documents please [read this](https://github.com/louischatriot/nedb/#basic-querying)

### Projections


You can give `find` and `findOne` an optional second argument, projections. The syntax is the same as MongoDB: `{ a: 1, b: 1 }` to return only the a and b fields, `{ a: 0, b: 0 }` to omit these two fields. You cannot use both modes at the time, except for _id which is by default always returned and which you can choose to omit. You can project on nested documents.

> *Notice*: See all rules and operators list [here](https://www.npmjs.com/package/mingo)

```javascript

db.find({ planet: 'Mars' }, { planet: 1, system: 1 }, function (docs) {
  // docs is [{ planet: 'Mars', system: 'solar', _id: 'id1' }]
});

```

## 🖌️ Updating documents

To update documents DnDB exposes the method:

- `update`
  
  - returns: array with the new updated collection

The update method follows the same query rules as in `find` and `findOne` at first argument to get the update target document and as a second agument it receives the aggregation operators that modifies the matching fileds values ​​by following the aggregation rules.

> *Notice*: See all rules and operators list [here](https://www.npmjs.com/package/mingo)

```javascript
db.update({ system: 'solar' }, { $set: { system: 'solar system' } }, (update) => {
  // ...foo(update)
});
```

## ❌ Removing documents

To remove documents DnDB exposes the method:

- `remove`

  - returns: array with the new updated collection

The remove method follows the same query rules as in `find` and `findOne` at first argument, it will remove all the documents that matches the query.

```javascript
db.remove({ _id: 'id2' }, {}, function (newdoc) {
  // ...foo(newDoc)
});
```

> *Notice*: If you want to unset a  value from the document you must use update with the $unset operator. See all rules and operators list [here](https://www.npmjs.com/package/mingo)

# :memo: TO DO

- Event hooks on all the api usage.
- Count method
- Improve documentation
- Create file integrity checker
- Prevent updating inmutable data
- Error handlers.
- SORT, SKIP, and LIMIT modifier methods support.

# :pushpin: This module is right now on Alpha, but the main API is pretty usable for production.

Since it is a standard, the API will not be subject to drastic changes, but its internal working will do, use with caution until the stable version.

# Support this project by donating on:
- [Paypal](https://paypal.me/DENYNCRAWFORD?locale.x=en_US).
- BTC address: 39ik7oyYvmiMeTXTscY3bb9rUFMHdjf5pd

# 📜 MIT License

Copyright (c) Crawford.

[Full license](/blob/master/LICENSE.md)