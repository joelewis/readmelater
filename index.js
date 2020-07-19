import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import PassportGoogleOauth from 'passport-google-oauth';
import PassportJwt from 'passport-jwt';
import session from "express-session";
import bodyParser from "body-parser";
import PrismaClient from '@prisma/client'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

var JWTstrategy = PassportJwt.Strategy;
var ExtractJwt = PassportJwt.ExtractJwt;

// import from env
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; 
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

var GoogleStrategy = PassportGoogleOauth.OAuth2Strategy;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient.PrismaClient();
const app = express()
const port = process.env.PORT || 3000 // import from env
const jwtSecret = "cats"; // import from env

app.use(session({ secret: "cats" })); // import from env
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

var getUserByEmail = async (email) => {
  return await prisma.user.findOne({
    where: {
        email: email
    }
  });
};

var getUserById = async (id) => {
  return await prisma.user.findOne({
    where: {
        id: id
    }
  });
};


// google oauth handling
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use('google', new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    var email = profile._json.email;
    var name = profile._json.name;
    // find user or create user with email obtained from google
    const user = await getUserByEmail(email);

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

// jwt based auth handling
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  'jwt',
  new JWTstrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await getUserById(jwt_payload.id);
      if (user) { 
        return done(null, user) 
      } else {
        done(null, false)
      }
    } catch (err) {
      done(err);
    }
  }),
);

const ensureAuth = (req, res, next) => {
  if (req.user) {
    next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};

const ensureAuthAPI = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    passport.authenticate('jwt', {session: false, failureMessage: 'invalid token'})(req, res, next)
  }
};

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


// google auth
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', (req, res, next) => {
  // detect if login attempt comes from extension, if so get extension url and redirect to it with the jwt token
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] })(req, res, next)
});

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    const redirect = req.session.returnTo;
    delete req.session.returnTo;

    if (req.session.extension_url) {
      // redirect to extension's url with jwt token in get param
      res.redirect(req.session.extention_url || '/?token=' + jwt.sign({id: req.user.id}, jwtSecret, {expiresIn: '7d'}));
    }
    res.redirect(redirect || '/');
});

app.get('/token',
  ensureAuthAPI,
  function(req, res) {
    var token = jwt.sign({id: req.user.id}, jwtSecret, {expiresIn: '7d'});
    res.json({token: token});
  })

app.get('/data',
  ensureAuthAPI,
  function(req, res) {
    res.json(req.user);
  });


// render home page
app.get('/*', async (req, res) => {
  res.sendFile(path.join( __dirname + '/public/index.html'));
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))