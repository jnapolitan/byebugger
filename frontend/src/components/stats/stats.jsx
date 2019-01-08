import React from 'react';
import StatItem from './stat_item';

export default class Ranks extends React.Component {
  componentDidMount() {
    this.props.fetchStats();
  }

  render() {
    if (!this.props.stats) return <div>Loading...</div>

    const stats = this.props.stats.map(stat => {
      return <StatItem stat={stat} key={stat._id} />
    })
    return (
      <ul>{ stats }</ul>
    )
  }
}