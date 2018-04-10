/* eslint no-underscore-dangle: 0 */
'use strict';

const persistence = require('./persistence')('petstore');

module.exports = {
  allPets: function allPets(callback) {
    persistence.listByField({}, {petName: 1, petType: 1, petPrice: 1}, callback);
  },

  getPet: function getPet(pet, callback) {
    persistence.getByField({petName: pet.petName, petType: pet.petType}, callback);
  },

  savePet: function savePet(pet, callback) {
    persistence.insert(pet, callback);
  },

  removePet: function removePet(pet, callback) {
    persistence.remove(pet, callback);
  },

  removeAllPets: function removeAllPets(callback) {
    persistence.removeAll(callback);
  }
};
