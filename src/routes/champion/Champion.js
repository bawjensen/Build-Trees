import _ from 'lodash';
import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Champion.css';
import Link from '../../components/Link';
import ChampionBuilds from '../../components/ChampionBuilds';
import ROLES from '../../data/roles';

class Champion extends React.Component {
  static propTypes = {
    champion: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    builds: PropTypes.object.isRequired,
    items: PropTypes.object.isRequired,
    roleLabel: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <h6 className={s.explanation}>
              Click on an item to expand/collapse.
              Size of branches shows how many times that item was bought.
              Color of branches indicates the winrate of that particular build.
            </h6>
          </div>
          {_.concat([{ label: 'All', id: '' }], ...ROLES).map((role) => (
            <div
              className={`${s.roleLinkContainer} mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-card mdl-shadow--4dp`}
              key={role.id}
            >
              <div className="mdl-card__actions">
                <Link
                  className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                  to={`/c/${this.props.champion.id}/${role.id}`}
                >
                  {role.label}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <ChampionBuilds
          builds={this.props.builds}
          champion={this.props.champion}
          items={this.props.items}
          roleLabel={this.props.roleLabel}
        />
      </div>
    );
  }
}

export default withStyles(s)(Champion);
