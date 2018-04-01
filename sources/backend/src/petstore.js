/* eslint no-underscore-dangle: 0 */
'use strict';

const async = require('async');
const R = require('ramda');
const persistence = require('./persistence')('petstore');

function sortCaseInsensitive(objectlist) {
  return objectlist.sort((a, b) => naturalCmp(a.lastname.toLowerCase() + ' ' + a.firstname.toLowerCase(), b.lastname.toLowerCase() + ' ' + b.firstname.toLowerCase()));
}

module.exports = {
  allPets: function allPets(callback) {
    persistence.listByField({}, {petName: 1, petType: 1}, callback);
  },

  getPet: function getPet(pet, callback) {
    persistence.getByField({petName: pet.petName, petType: pet.petType}, callback);
  },

  savePet: function savePet(pet, callback) {
    persistence.save(pet, callback);
  },

  removePet: function removePet(pet, callback) {
    persistence.remove(member.id(), err => {
      logger.info('Member removed:' + JSON.stringify(member));
      callback(err);
    });
  },

  isSoCraTesSubscriber: function isSoCraTesSubscriber(id, callback) {
    subscriberPersistence.getById(id, (err, subscriber) => callback(err, !!subscriber));
  }
};


