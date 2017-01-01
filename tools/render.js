/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import _ from 'lodash';
import path from 'path';
import fetch from 'node-fetch';
import { writeFile, makeDir } from './lib/fs';
import runServer from './runServer';
import ROLES from '../src/data/roles';

// Enter your paths here which you want to render as static
// Example:
// const routes = [
//   '/',           // => build/public/index.html
//   '/page',       // => build/public/page.html
//   '/page/',      // => build/public/page/index.html
//   '/page/name',  // => build/public/page/name.html
//   '/page/name/', // => build/public/page/name/index.html
// ];
const routes = [
  '/',
  '/c/Alistar/',
  '/404', // https://help.github.com/articles/creating-a-custom-404-page-for-your-github-pages-site/
];

async function render() {
  const server = await runServer();

  const roles = _.concat([{ id: '' }], ...ROLES);

  // add dynamic routes for champions
  const championData = await fetch(`http://${server.host}/champion.json`).then(res => res.json());
  _.slice(Object.values(championData.data), 0, 10).forEach(champion => routes.push(
    ...roles.map(role => `/c/${champion.id}/${role.id}`),
  ));

  await Promise.all(routes.map(async (route, index) => {
    const url = `http://${server.host}${route}`;
    const fileName = route.endsWith('/') ? 'index.html' : `${path.basename(route, '.html')}.html`;
    const dirName = path.join('build/public', route.endsWith('/') ? route : path.dirname(route));
    const dist = `${dirName}${fileName}`;
    const timeStart = new Date();
    const response = await fetch(url);
    const timeEnd = new Date();
    const text = await response.text();
    await makeDir(dirName);
    await writeFile(dist, text);
    const time = timeEnd.getTime() - timeStart.getTime();
    console.log(`#${index + 1} ${dist} => ${response.status} ${response.statusText} (${time} ms)`);
  }));

  server.kill('SIGTERM');
}

export default render;
