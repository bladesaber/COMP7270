/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': { view: 'pages/homepage' },
  '/': 'RealEstateCellController.home',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  'GET /test': { view: 'pages/test' },

  'GET /estate/home': 'RealEstateCellController.home',
  'GET /estate/search': 'RealEstateCellController.search',

  'GET /estate/create': 'RealEstateCellController.create',
  'POST /estate/create': 'RealEstateCellController.create',

  'GET /estate/admin': 'RealEstateCellController.admin',

  'GET /estate/update': 'RealEstateCellController.update',
  'POST /estate/update': 'RealEstateCellController.update',
  'POST /estate/delete': 'RealEstateCellController.delete',

  'GET /estate/detail': 'RealEstateCellController.detail',

  'POST /estate/search_items': 'RealEstateCellController.search_items',

  'GET /user/login': 'UserController.login',
  'POST /user/login': 'UserController.login',
  'POST /user/logout': 'UserController.logout',
  'GET /user/register': 'UserController.register',
  'POST /user/register': 'UserController.register',

  'GET /estate/rentStatus': 'RealEstateCellController.rentStatus',
  'POST /estate/rent_add': 'RealEstateCellController.add_rent',

  'POST /estate/rent_delete': 'RealEstateCellController.delete_rent',
  'DELETE /estate/rent_delete/:userId/:estateId': 'RealEstateCellController.delete_rent',

  'GET /estate/clientState': 'RealEstateCellController.clientState',
  'Get /estate/estateState': 'RealEstateCellController.estateState',

};
