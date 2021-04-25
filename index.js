import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import PassportGoogleOauth from 'passport-google-oauth';
import PassportJwt from 'passport-jwt';
import session from "express-session";
import connectSqlite3 from "connect-sqlite3"
import bodyParser from "body-parser";
import PrismaClient from '@prisma/client'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';
import * as u from './utils.js';

dotenv.config();

var SQLiteStore = connectSqlite3(session);

var JWTstrategy = PassportJwt.Strategy;
var ExtractJwt = PassportJwt.ExtractJwt;


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; 
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

console.log(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

var GoogleStrategy = PassportGoogleOauth.OAuth2Strategy;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient.PrismaClient();
const app = express()
const port = process.env.PORT || 3000 // import from env
const jwtSecret = process.env.SECRET; // import from env

app.use(session({ 
  secret: process.env.SECRET,
  store: new SQLiteStore()
})); // import from env
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())


// google oauth handling
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use('google', new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.DOMAIN_URL + "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    var email = profile._json.email;
    var name = profile._json.name;
    // find user or create user with email obtained from google
    const user = await u.getUserByEmail(email);

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
      const user = await u.getUserById(jwt_payload.id);
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
    const user = await u.getUserById(id);
    done(null, user)
  } catch(e) {
    done(e);
  }
});


app.use('/static', express.static('public'))



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
  if (req.query.from_extension) {
    req.session.from_extension = req.query.from_extension;
  }
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

    if (req.session.from_extension) {
      var extension_url = `chrome-extension://${req.session.from_extension}/login.html`
      delete req.session.from_extension
      // redirect to extension's url with jwt token in get param
      res.redirect(extension_url + '?token=' + jwt.sign({id: req.user.id}, jwtSecret, {expiresIn: '7d'}));
    } else {
      res.redirect(redirect || '/');
    }
    
});

app.get('/token',
  ensureAuthAPI,
  function(req, res) {
    var token = jwt.sign({id: req.user.id}, jwtSecret, {expiresIn: '7d'});
    res.json({token: token});
  })

app.get('/session',
  ensureAuthAPI,
  function(req, res) {
    res.json(req.user);
  });


app.post('/bookmark', ensureAuthAPI, async function(req, res) {
  var href = req.body.href;
  if (!href) {
    return res.status(400).json({error: "missing href"})
  }

  var timeout = req.body.timeout;
  if (!timeout) {
    timeout = u.timeNow2Date('2w'); // segt default time out of 2 weeks
  } else {
    timeout = u.timeNow2Date(timeout); // convert timeout to date format
  }

  var tags = req.body.tags || [];

  var link = await u.addLink(req.user, href, timeout, tags);
  
  res.json(link);
});

app.get('/is/bookmarked', ensureAuthAPI, async function(req, res) {
  var href = decodeURIComponent(req.query.href); 
  var link = href ? await u.getLinkByHref(req.user, href) : null;

  console.log(link, href)

  if (link) {
    return res.json(link);
  } else {
    return res.status(404).send();
  }
});

app.delete('/bookmark', ensureAuthAPI, async (req, res) => {
  var links = req.body.links;
  try {
    await Promise.all(links.map(linkId => u.deleteLinkById(linkId, req.user)))
    res.json(true)
  } catch(e) {
    res.json(false);
  }
  
})

app.post('/stopemails', ensureAuthAPI, async function(req, res) {
  if (req.body.type === 'user') {
    // stop all email notifications for all links for user
  } else if (req.body.type === 'link') {
    var links = req.body.links;
    var links = await Promise.all(links.map(async (linkId) => {
      return u.markLinkAsRead(linkId, req.user)
    }))
    // stop email notifications for these links
  } else if (req.body.type === 'tag') {
    var tag = req.body.tag;
    // stop email notifications for all links under this tag
  }
  res.json(links);
});


app.post('/updatesettings', ensureAuthAPI, async function(req, res) {
  var unsubscribeUser = req.body.unsubscribeUser;
  var unsubscribedTags = req.body.unsubscribedTags;
  var notifyStatus = !unsubscribeUser; // i.e if unsubscribeUser = true; then notifyUser = false;
  var user = await u.setNotifyStatus(req.user.id, notifyStatus);
  var tags = await u.setUnsubscribedTags(req.user.id, unsubscribedTags);

  return res.json({
    user, tags
  })
});

app.post('/startemails', ensureAuthAPI, async function(req, res) {
  if (req.body.type === 'user') {
    // stop all email notifications for all links for user
  } else if (req.body.type === 'link') {
    var links = req.body.links;
    var links = await Promise.all(links.map(async (linkId) => {
      return u.markLinkAsUnread(linkId)
    }))
    // stop email notifications for these links
  } else if (req.body.type === 'tag') {
    var tag = req.body.tag;
    // stop email notifications for all links under this tag
  }
  res.json(links);
});

app.get('/links', ensureAuthAPI, async function(req, res) {
  // fetch all links for the user
  var filter = req.query.filter && JSON.parse(req.query.filter)
  console.log(filter);
  var links = await u.getAllLinksByUser(req.user.id, filter || {});
  res.json(links);
});

app.get('/tags', ensureAuthAPI, async function(req, res) {
  var tags = await u.getAllTags(req.user.id);
  res.json(tags);
});

app.get('/open/:linktoken', async (req, res) => {
  var linktoken =  req.params.linktoken;
  var linkId = jwt.decode(linktoken, jwtSecret);
  try {
    linkId = parseInt(linkId);
    var link = await u.getLinkById(linkId);
    await u.markLinkAsReadById(linkId);
    res.redirect(link.href);
  } catch (e) {
    console.error(e, e.stack);
    res.status(404).send();
  }
});

app.get('/unsubscribe/:token', async (req, res) => {
  var token = req.params.token;
  var userId = parseInt(jwt.decode(token, jwtSecret));
  try {
    console.log('disabling emails for user: ' + userId);
    await u.setNotifyStatus(userId, false);
  }  catch (e) {
    // notify user that unsubscription failed
    console.log(e)
  }
  res.redirect('/settings')
});

app.get('/deleteaccount', ensureAuthAPI, async (req, res) => {
  var user = req.user;
  req.logout(); 
  await u.deleteAccount(user);
  res.sendFile(path.join( __dirname + '/public/deleted.html'));
})

app.get('/privacy', (req, res) => {
  res.sendFile(path.join( __dirname + '/public/privacy.html'));
})


app.get('/vote', (req, res) => {
  // dummy end point for recording interests in paid plan. 
  // I'm not interested in throwing in an website analystics tool now - largely due to privacy concerns.
  // I'm hoping this request will get logged by cloudfare and I can use cloudflare analytics to look at this data
  res.send('Thanks')
})

// render home page
app.get('/*', async (req, res) => {
  res.sendFile(path.join( __dirname + '/public/index.html'));
})

// start cron job
console.log('--------------------------------------');
console.log('Setting up cron job to run every monday')
console.log('--------------------------------------');
cron.schedule('0 7 * * 1', function() {
  console.log('Running Cron Job -- sending emails');
  u.sendMails();
});


app.listen(port, '0.0.0.0', () => console.log(`Example app listening at http://localhost:${port}`))