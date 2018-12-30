const express = require('express');
const router = express.Router();
const Stat = require('../../models/Stat');

router.post('/', (req, res) => {
  
      const newStat = new Stat({
        user: req.user.id,
        score: req.body.score
      });
  
      newStat.save().then(stat => res.json(stat));
    }
  );

module.exports = router;