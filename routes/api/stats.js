const express = require('express');
const router = express.Router();
const Stat = require('../../models/Stat');
const passport = require('passport');

router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
  
      const newStat = new Stat({
        score: req.body.score,
        user: req.user.id
      });
  
      newStat.save().then(stat => res.json(stat));
    }
);

module.exports = router;