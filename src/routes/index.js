/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import homeRoutes from './home';
import championRoutes from './champion';
import notFoundRoutes from './notFound';

// The top-level (parent) route
export default {

  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    homeRoutes,

    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    championRoutes,
    notFoundRoutes,
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = route.title || 'Untitled Page';
    route.description = route.description || '';

    return route;
  },

};
