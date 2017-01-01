import _ from 'lodash';
import React from 'react';
import Champion from './Champion';
import fetch from '../../core/fetch';
import Layout from '../../components/Layout';

async function fetchPageData(champDataLabel, buildDataLabel) {
  const urls = [
    `/champions/${champDataLabel}.json`,
    `/champion-builds/${buildDataLabel}.json`,
    '/item.json',
  ];

  const [champResp, buildsResp, itemsResp] = await Promise.all(
    _.map(urls, (url) => fetch(url, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }),
  ));

  const allStatuses = _.map([champResp, buildsResp, itemsResp], 'status');
  const uniqueStatuses = _.uniq(allStatuses);
  if (!(uniqueStatuses.length === 1 && uniqueStatuses[0] === 200)) {
    const niceErrorObj = _.zipObject(urls, allStatuses);
    throw new Error(`Non-zero status on one of the data requests: ${JSON.stringify(niceErrorObj)}`);
  }

  let champData = await champResp.json();
  const buildsData = await buildsResp.json();
  const itemsData = await itemsResp.json();

  if (!champData || !champData.data) throw new Error('Failed to load the champion data.');
  if (!buildsData) throw new Error('Failed to load the builds data.');
  if (!itemsResp) throw new Error('Failed to load the builds data.');

  champData = Object.values(champData.data);

  if (champData.length !== 1) {
    throw new Error(`Champion data was malformed, expected 1 entry got: ${champData.length}`);
  }

  champData = champData[0];

  return {
    champData,
    buildsData,
    itemsData,
  };
}

export default {
  path: '/c/:champion',

  children: [
    {
      path: '/',

      async action(context) {
        const { champData, buildsData, itemsData } = await fetchPageData(
          context.params.champion.replace(/ /g, ''),
          _.lowerCase(context.params.champion),
        );

        return {
          title: `${_.startCase(context.params.champion)} Builds`,
          component: (
            <Layout>
              <Champion
                champion={champData}
                builds={buildsData}
                items={itemsData}
                roleLabel="All Roles"
              />
            </Layout>
          ),
        };
      },
    },
    {
      path: '/:role',

      async action(context) {
        const { champData, buildsData, itemsData } = await fetchPageData(
          context.params.champion.replace(/ /g, ''),
          `${_.lowerCase(context.params.champion)}-${_.lowerCase(context.params.role)}`,
        );

        return {
          title:
            `${_.startCase(context.params.role)} ${_.startCase(context.params.champion)} Builds`,
          component: (
            <Layout>
              <Champion
                champion={champData}
                builds={buildsData}
                items={itemsData}
                roleLabel={context.params.role}
              />
            </Layout>
          ),
        };
      },
    },
  ],
};
