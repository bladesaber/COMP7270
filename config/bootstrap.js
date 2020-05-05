/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

sails_bcrypt = require('bcryptjs');
const saltRounds = 10;

module.exports.bootstrap = async function () {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  if (await RealEstateCell.count() > 0) {
    return;
  }else{
    await RealEstateCell.createEach([
      {title: "酒店式靓装，有游泳池会所", imageURL: "/images/example1.jpg", estate:"Festival City", bedrooms:3, grossArea:700, expectedTenants:10, rent:18000, highlighted:true },
      {title: "2房实用，交通方便", imageURL: "/images/example2.jpg", estate:"City One Shatin", bedrooms:3, grossArea:550, expectedTenants:10, rent:12000, highlighted:true },
      {title: "沙田第一城 套3房刚翻新", imageURL: "/images/example3.jpg", estate:"Tin Ma Court", bedrooms:3, grossArea:900, expectedTenants:5, rent:25000, highlighted:true },
      {title: "平绝同区", imageURL: "/images/example4.jpg", estate:"Festival City", bedrooms:3, grossArea:700, expectedTenants:10, rent:15000, highlighted:true },
  
      {title: "租房1", imageURL: "/images/example5.jpg", estate:"Festival City", bedrooms:3, grossArea:10, expectedTenants:10, rent:2000, highlighted:true },
      {title: "租房2", imageURL: "/images/example6.jpg", estate:"Festival City", bedrooms:3, grossArea:10, expectedTenants:10, rent:2000, highlighted:true },
      {title: "租房3", imageURL: "/images/example7.jpg", estate:"b", bedrooms:1, grossArea:10, expectedTenants:10, rent:2000, highlighted:true },
    ]);
  }

  if(await User.count()>0){
    return;
  }else{

    const hash = await sails_bcrypt.hash('123456', saltRounds);

    await User.createEach([
      {username:"admin", password:hash, role:"admin"},
      {username:"Quan", password:hash, role:"client"},
      {username:"Wu", password:hash, role:"client"},
    ]);
    
  }

};
