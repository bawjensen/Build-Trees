/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.css';

class Footer extends React.Component {
  render() {
    const rootClasses = `${s.root} mdl-mini-footer`;

    return (
      <footer className={rootClasses}>
        <div className="mdl-mini-footer__left-section">
          <p>
            Build Trees isn&#39;t endorsed by Riot Games and doesn&#39;t reflect the views or
            opinions of Riot Games or anyone officially involved in producing or managing League
            of Legends. League of Legends and Riot Games are trademarks or registered trademarks
            of Riot Games, Inc. League of Legends © Riot Games, Inc.
          </p>
        </div>
      </footer>
    );
  }
}

export default withStyles(s)(Footer);
