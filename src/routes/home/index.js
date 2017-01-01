import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';
import Layout from '../../components/Layout';

export default {

  path: '/',

  async action() {
    const resp = await fetch('/champion.json', {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await resp.json();

    if (!data || !data.data) throw new Error('Failed to load the champion data.');

    return {
      title: 'Build Trees',
      component: <Layout><Home champions={data.data} /></Layout>,
    };
  },

};
