/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    rent: {
      collection: 'RealEstateCell',
      via: 'rented'
    },

    username: {
      type: "string",

      unique: true,
      required: true
    },

    password: {
      type: "string"
    },

    email:{
      type: "string"
    },

    phone:{
      type: "number"
    },

    role: {
      type: 'string',
      isIn: ['admin', 'client'],
      defaultsTo: 'visitor'
    },

  },

  // customToJSON: function () {
  //   // Return a shallow copy of this record with the password removed.
  //   return _.omit(this, ['password'])
  // },

};

