import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';

class Header extends React.Component {
  render() {
    return (
      <header className={s.root}>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <span className="mdl-layout__title">
              <Link className="mdl-button mdl-js-button mdl-button--colored mdl-button--raised mdl-js-ripple-effect" to="/">
                Build Trees
              </Link>
            </span>
          </div>
        </div>
      </header>
    );
  }
}

export default withStyles(s)(Header);
