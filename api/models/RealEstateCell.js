/**
 * RealEstateCell.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    rented: {
      collection: 'User',
      via: 'rent'
    },

    title:{type: 'string'},
    imageURL:{type:'string'},
    estate:{type: 'string'},
    bedrooms:{type: 'number'},
    grossArea:{type: 'number'},
    expectedTenants:{type: 'number'},
    rent:{type: 'number'},
    highlighted:{type: 'boolean'},
  },

};

