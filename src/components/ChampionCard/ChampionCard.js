import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ChampionCard.css';
import Link from '../Link';

class ChampionCard extends React.Component {
  static propTypes = {
    champion: PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.shape({
        full: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };

  render() {
    return (
      <Link className={`${s.card} mdl-card mdl-shadow--4dp`} to={`/c/${this.props.champion.name}`}>
        <div className="mdl-card__media">
          <img
            className={s.champImage}
            src={`http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${this.props.champion.image.full}`}
            alt={this.props.champion.name}
          />
        </div>
        <div className="mdl-card__actions">
          <span className={`${s.nameButton} mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect`}>
            {this.props.champion.name}
          </span>
        </div>
      </Link>
    );
  }
}

export default withStyles(s)(ChampionCard);
