'use strict';
const async = require('async');
let ourDB;

const DBSTATE = {OPEN: 'OPEN', CLOSED: 'CLOSED', OPENING: 'OPENING'};
let ourDBConnectionState = DBSTATE.CLOSED;

module.exports = function (collectionName) {
  let persistence;

  function performInDB(callback) {
    if (ourDBConnectionState === DBSTATE.OPEN) {
      return callback(null, ourDB);
    }
    persistence.openDB();
    setTimeout(function () {
      performInDB(callback);
    }, 100);
  }

  persistence = {
    list: function list(sortOrder, callback) {
      this.listByField({}, sortOrder, callback);
    },

    listByField: function listByField(searchObject, sortOrder, callback) {
      this.listByFieldWithOptions(searchObject, {}, sortOrder, callback);
    },

    listByFieldWithOptions: function listByFieldWithOptions(searchObject, options, sortOrder, callback) {
      performInDB((err, db) => {
        if (err) { return callback(err); }
        const cursor = db.collection(collectionName).find(searchObject, options).sort(sortOrder);
        cursor.count((err1, result) => {
          if (err1) { return callback(err1); }
          if (!result) {
            // If no items found, return empty array
            return callback(null, []);
          }
          cursor.batchSize(result);
          cursor.toArray((err2, result1) => {
            if (err2) { return callback(err2); }
            callback(null, result1);
          });
        });
      });
    },

    getByField: function getByField(fieldAsObject, callback) {
      performInDB((err, db) => {
        if (err) { return callback(err); }
        db.collection(collectionName).find(fieldAsObject).toArray((err1, result) => {
          if (err1) { return callback(err1); }
          callback(err1, result[0]);
        });
      });
    },

    insert: function insert(object, callback) {
      performInDB((err, db) => {
        if (err) { return callback(err); }
          db.collection(collectionName).insertOne(object, err1 => {
          if (err1) { return callback(err1); }
          callback(null);
        });
      });
    },

    remove: function remove(objectFilter, callback) {
      performInDB((err, db) => {
        if (err) { return callback(err); }
          db.collection(collectionName).deleteOne(objectFilter, err1 => {
          callback(err1);
        });
      });
    },

    removeAll: function remove(callback) {
      performInDB((err, db) => {
        if (err) { return callback(err); }
          db.collection(collectionName).deleteMany({}, err1 => {
          callback(err1);
        });
      });
    },

    saveAll: function saveAll(objects, outerCallback) {
      const self = this;
      async.each(objects, (each, callback) => { self.save(each, callback); }, outerCallback);
    },

    drop: function drop(callback) {
      performInDB((err, db) => {
        if (err) { return callback(err); }
        logger.info('Drop ' + collectionName + ' called!');
        db.dropCollection(collectionName, err1 => {
          callback(err1);
        });
      });
    },

    openDB: function openDB() {
      if (ourDBConnectionState !== DBSTATE.CLOSED) {
        return;
      }

      ourDBConnectionState = DBSTATE.OPENING;

      const MongoClient = require('mongodb').MongoClient;
      MongoClient.connect('mongodb://localhost:27017/cdct', (err, db) => {
        if (err) {
          ourDBConnectionState = DBSTATE.CLOSED;
          return logger.error(err);
        }
        ourDB = db;
        ourDBConnectionState = DBSTATE.OPEN;
      });
    },

    closeDB: function closeDB(callback) {
      if (ourDBConnectionState === DBSTATE.CLOSED) {
        if (callback) { callback(); }
        return;
      }
      performInDB(() => {
        ourDB.close();
        ourDB = undefined;
        ourDBConnectionState = DBSTATE.CLOSED;
        if (callback) { callback(); }
      });
    }
  };

  persistence.openDB();
  return persistence;
};
