const express = require('express');
const router = express.Router();
const Stat = require('../../models/Stat');
const passport = require('passport');

router.get("/", (req, res) => {
    State.find()
        .sort({ date: -1 })
        .then(stats => res.json(stats))
        .catch(err => res.status(404).json({ noStatsFound: 'No stats found' }));
});

router.get("/user/:user_id", (req, res) => {
    Stat.find({ user: req.params.user_id })
        .sort({ date: -1 })
        .then(stats => res.json(stats))
        .catch(err => res.status(404).json({ noTweetsFound: 'No stats found for that user' }));
});

router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
  
      const newStat = new Stat({
        score: req.body.score,
        user: req.user.id,
        handle: req.user.handle
      });
  
      newStat.save().then(stat => res.json(stat));
    }
);

module.exports = router;