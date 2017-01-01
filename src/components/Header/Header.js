import React from 'react';
import Link from '../Link';

class Header extends React.Component {
  render() {
    return (
      <header
        className="mdl-layout__header mdl-layout__header--transparent mdl-layout__header--scroll"
      >
        <div className="mdl-layout__header-row">
          <span className="mdl-layout__title">
            <Link className="mdl-button mdl-js-button mdl-button--colored mdl-button--raised mdl-js-ripple-effect" to="/">
              Build Trees
            </Link>
          </span>
        </div>
      </header>
    );
  }
}

export default Header;
