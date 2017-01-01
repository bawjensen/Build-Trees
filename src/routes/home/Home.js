import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import ChampionCard from '../../components/ChampionCard';

class Home extends React.Component {
  static propTypes = {
    champions: PropTypes.objectOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })).isRequired,
  };

  render() {
    return (
      <div className="mdl-grid">
        <div className={`${s.welcome} mdl-cell mdl-cell--12-col`}>
          <h1>Welcome!</h1>
          <h6>
            This site is all about League of Legends champions and the build paths they can take.
          </h6>
        </div>
        {Object.keys(this.props.champions).map((key) => (
          <div key={key} className="mdl-cell mdl-cell--1-col">
            <ChampionCard champion={this.props.champions[key]} />
          </div>
        ))}
      </div>
    );
  }
}

export default withStyles(s)(Home);
