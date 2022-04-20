const express = require('express')
const router = express.Router();
const client = require('../mongoclient');

router.get('/getDate', (req, res) => {
   // timestamp based on current timezone
   const options = {
          timeZone: 'America/Toronto',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
       },
       formatter = new Intl.DateTimeFormat([], options);
   let date = formatter.format(new Date());
   res.send(date);
});

module.exports = router;