import { connect } from 'react-redux';
import Hud from './hud';


const mapStateToProps = state => ({
  score: state.stats.currentPlayerScore,
  health: state.health
});

export default connect(
  mapStateToProps
)(Hud);