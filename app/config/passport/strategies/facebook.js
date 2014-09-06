var passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy,
User = require('../../../models').User,

FACEBOOK_APP_ID = '1451750288423459',
FACEBOOK_APP_SECRET = 'ff03e49369c91ea824c9107480301e98',

generatePassword = require('password-generator');

module.exports = function () {
  passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      enableProof: false
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        User
        .find({
          where: {
            fb_id: profile.id
          }
        })
        .success(function(user) {
          if(user) {
            // User with this fb_id exist, authenticating.
            return done(null, user);
          } else {
          /**
           * User with this fb_id does not exist, checking if there
           * is a user with this email address.
           */
            User
            .find({
              where: {
                email: profile.emails[0].value
              }
            })
            .success(function(user) {
              if(!user) {
                /**
                 * User with this email address does not exist
                 * either, creating a new one.
                 */
                var password = generatePassword(12, false);

                User
                  .create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: password,
                    username: profile.displayName.toString().toLowerCase().replace(/ /g, ''),
                    fb_id: profile.id
                  })

                  .success(function(user) { // Authenticating the new user.
                    return done(null, user);
                  });
              } else {
                // /**
                //  * User with this email exists, setting his fb_id
                //  * with the same as his facebook account for good!
                //  */
                // User
                //   .update({
                //     fb_id: profile.id
                //   }, {
                //     id: user.id
                //   })

                //   .success(function(user) {
                //     done(null, user);
                //   });

                return done(null, user);
              }
            });
          }
        });        
      });
    }
  ));
};