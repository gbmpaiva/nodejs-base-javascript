const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
const axios = require('axios');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
      const email = profile.email;
      const response = await axios.get(`http://localhost:3331/api/users/${email}`);

      console.log('Dados do Google:', {
        displayName: profile.displayName,
        email: profile.email,
        picture: profile.picture
      });   
  
      if (response.status === 404 || response.data.isDelete) {
        return done(null, false, { message: 'Acesso negado' });
      }
  
      
      const userData = {
        ...response.data,
        id: profile.id, // ID do Google
        name: profile.displayName, // Nome do Google
        email: profile.email,
        photo: profile.picture
      };
  
      return done(null, userData);
      
    } catch (error) {
      return done(error, false);
    }
  }

  
));

// Serialização/Desserialização
passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const response = await axios.get(`http://localhost:3331/api/users/${email}`);
    
    if (response.status === 404 || response.data.isDelete) {
      return done(null, false);
    }

    done(null, response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return done(null, false);
    }
    done(error, null);
  }
});

