const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('../db/knex');

require('dotenv').config();

/* GET login page. */
router.get('/', (req, res, next) => {
  res.render('login');
});

// login USER
router.post('/', (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  // take in username, email and password
  // find user in the DB
  knex('users')
  .where('email', email)
  .first()
  .then(user => {
    console.log(user)
    if(user){
      // user bcrypt.compare to input to hashed password in DB
      let passwordGood = bcrypt.compareSync(password, user.password)

      // if all good, create token, and attach it as a cookie attached to the response
      if(passwordGood){
        //create token
        let payload = { userId: user.id }
      //  let token = jwt.sign(payload, process.env.JWT_KEY, {
          let token = jwt.sign(payload, process.env.key_one, {

          expiresIn: '7days' //adds d expire field to the payload
        })
        // put the token into a cookie attached to the response
        res.cookie('token', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), //7days
          secure: router.get('env') === 'production' // SET form the NODE_ENV
        })
        let isBusinessPartner = user.user_type === 'business';
        res.status(200).send({isBusinessPartner: isBusinessPartner});

      } else {
        throw new Error('Wrong password')
      }
    } else {
      throw new Error('User not found')
    }
  })
  .catch((err) => {
    res.status(404).send({error: {message: err.message}})
  })
})


module.exports = router;
