import React from 'react';
import StatItem from './stat_item';

export default class Ranks extends React.Component {
  componentDidMount() {
    this.props.fetchStats();

    const closeModal = document.getElementById("close-stats-modal");
    closeModal.addEventListener('click', () => {
      const stats = document.getElementById("stats-modal");
      stats.classList.add("hidden");
    });
  }

  render() {
    if (!this.props.stats) return <div>Loading...</div>

    const stats = this.props.stats.map(stat => {
      return <StatItem stat={stat} key={stat._id} />
    })
    return (
      <div className="stats-modal hidden" id="stats-modal">
        <p className="close-modal" id="close-stats-modal">X</p>
        <h1>Elite Hackers</h1>
        <ol>{ stats }</ol>
      </div>
    )
  }
}