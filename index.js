import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import PassportGoogleOauth from 'passport-google-oauth';
import session from "express-session";
import bodyParser from "body-parser";
import PrismaClient from '@prisma/client'

const GOOGLE_CLIENT_ID = '877323248885-3lf5c6ms7crannivpombjdbqh5lqbtrp.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'WyizCq6jvb8HMHp-RkfnZgIt';

var GoogleStrategy = PassportGoogleOauth.OAuth2Strategy;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient.PrismaClient();
const app = express()
const port = 3000

app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


// google oauth handling
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    var email = profile._json.email;
    var name = profile._json.name;
    // find user or create user with email obtained from google
    const user = await prisma.user.findOne({
        where: {
            email: email
        }
    });

    if (user) {
        return done(null, user);
    }

    try {
      // create user
      const user = await prisma.user.create({
        data: { email: email, name: name }
      });
      done(null, user)
    } catch (e) {
      done(e);
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await prisma.user.findOne({where: {id: id}});
    done(null, user)
  } catch(e) {
    done(e);
  }
});


app.use('/static', express.static('public'))

// const main = async () => {
//     const allUsers = await prisma.user.findMany()
//     console.log(allUsers)
// }
// main()


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// render home page
app.get('/*', async (req, res) => {
    // res.send('Hello World!')
    console.log(req.user);
    res.sendFile(path.join( __dirname + '/public/index.html'));
})


// google auth
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))