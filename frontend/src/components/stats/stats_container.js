import { connect } from 'react-redux';
import { fetchStats } from '../../actions/stat_actions';
import Stats from './stats';

const mapStateToProps = state => ({
  stats: state.stats.topTenScores
});

const mapDispatchToProps = dispatch => ({
  fetchStats: () => dispatch(fetchStats())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stats);