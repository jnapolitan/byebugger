const express = require('express');
const router = express.Router();
const Stat = require('../../models/Stat');
const passport = require('passport');

router.get("/", (req, res) => {
    Stat.find()
        .sort({ score: -1 })
        .limit(10)
        .then(stats => res.json(stats))
        .catch(err => res.status(404).json({ noStatsFound: 'No stats found' }));
});

router.post('/', (req, res) => {
      const newStat = new Stat({
        score: req.body.score,
        player: req.body.player
      });
  
      newStat.save()
        .then(stat => res.json(stat))
        .catch(err => console.log(err));
    }
);

module.exports = router;
