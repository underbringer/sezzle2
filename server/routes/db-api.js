var express = require('express');
var router = express.Router();

const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');
router.post('/add',function(req, res, next){
  const userName = req.body.nickname;
  const answer = req.body.num;
  const date = req.body.date;
  var newData = {name:userName, num:answer,date: date};
  // console.log(newData);
  req.db.collection('calculator').insertOne(newData);
  res.json({
    res:'insert success'
  });
})

module.exports = router;
