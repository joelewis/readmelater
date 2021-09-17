import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import PassportGoogleOauth from 'passport-google-oauth';
import PassportTwitter from 'passport-twitter';
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
import Stripe from 'stripe';
import axios from 'axios';


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

const POCKET_CONSUMER_KEY = process.env.POCKET_CONSUMER_KEY

var stripe = Stripe(STRIPE_SECRET_KEY);

dotenv.config();

var SQLiteStore = connectSqlite3(session);

var JWTstrategy = PassportJwt.Strategy;
var ExtractJwt = PassportJwt.ExtractJwt;

var GoogleStrategy = PassportGoogleOauth.OAuth2Strategy;
var TwitterStrategy = PassportTwitter.Strategy;

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
// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/stripe-webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
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

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.DOMAIN_URL + "/auth/twitter/callback",
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
  },
  async function(accessToken, refreshToken, profile, done) {

    console.log(profile);

    var email = profile._json.email;
    var name = profile._json.name;
    var username = profile.username;
    // find user or create user with email obtained from google
    const user = await u.getUserByEmail(email);

    if (user) {
      // if not set already, add twitterUsername
      if (!user.twitterUsername) { 
        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            twitterUsername: username
          }
        })
      }
      // login the user
      return done(null, user);
    }

    try {
      // create user
      const user = await prisma.user.create({
        data: { email: email, name: name, twitterUsername: username }
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
    passport.authenticate('jwt', { session: false, failureMessage: 'invalid token' })(req, res, next)
  }
};

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await u.getUserById(id);
    done(null, user)
  } catch (e) {
    done(e);
  }
});


app.use('/static', express.static('public'))



app.get('/logout', function(req, res) {
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
  if (req.query.from_extension_url) {
    req.session.from_extension_url = req.query.from_extension_url;
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

    if (req.session.from_extension_url) {
      var extension_url = `${req.session.from_extension_url}login.html`
      delete req.session.from_extension_url
      // redirect to extension's url with jwt token in get param
      res.redirect(extension_url + '?token=' + jwt.sign({ id: req.user.id }, jwtSecret, { expiresIn: '7d' }));
    } else if (req.session.from_extension) {
      var extension_url = `chrome-extension://${req.session.from_extension}/login.html`
      delete req.session.from_extension
      // redirect to extension's url with jwt token in get param
      res.redirect(extension_url + '?token=' + jwt.sign({ id: req.user.id }, jwtSecret, { expiresIn: '7d' }));
    } else {
      res.redirect(redirect || '/');
    }

});

// twitter auth
app.get('/auth/twitter', (req, res, next) => {
  // detect if login attempt comes from extension, if so get extension url and redirect to it with the jwt token
  if (req.query.from_extension) {
    req.session.from_extension = req.query.from_extension;
  }
  if (req.query.from_extension_url) {
    req.session.from_extension_url = req.query.from_extension_url;
  }
  passport.authenticate('twitter')(req, res, next)
});

// twitter auth
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    const redirect = req.session.returnTo;
    delete req.session.returnTo;

    if (req.session.from_extension_url) {
      var extension_url = `${req.session.from_extension_url}login.html`
      delete req.session.from_extension_url
      // redirect to extension's url with jwt token in get param
      res.redirect(extension_url + '?token=' + jwt.sign({ id: req.user.id }, jwtSecret, { expiresIn: '7d' }));
    } else if (req.session.from_extension) {
      var extension_url = `chrome-extension://${req.session.from_extension}/login.html`
      delete req.session.from_extension
      // redirect to extension's url with jwt token in get param
      res.redirect(extension_url + '?token=' + jwt.sign({ id: req.user.id }, jwtSecret, { expiresIn: '7d' }));
    } else {
      res.redirect(redirect || '/');
    }

});

app.get('/auth/pocket', ensureAuthAPI, (req, res) => {
  // obtain a request token
  var params = {
    consumer_key: POCKET_CONSUMER_KEY,
    redirect_uri: process.env.DOMAIN_URL + '/auth/pocket/complete'
  };
  axios({
    method: 'post',
    url: 'https://getpocket.com/v3/oauth/request',
    data: params,
    headers: {
      'X-Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(function(resp) {
    req.session.pocketRequestCode = resp.data.code;
    var redirectUrl = `https://getpocket.com/auth/authorize?request_token=${resp.data.code}&redirect_uri=${params.redirect_uri}`;
    res.redirect(redirectUrl);
  }).catch(err => {
    console.log(err)
    res.status(400).send()
  })
})

app.get('/auth/pocket/complete', ensureAuthAPI, async (req, res) => { 
  // convert request token into access token

  if (!req.session.pocketRequestCode) {
    res.status(400).send()
  }

  var params = {
    consumer_key: POCKET_CONSUMER_KEY,
    code: req.session.pocketRequestCode
  }

  axios({
    method: 'post',
    url: 'https://getpocket.com/v3/oauth/authorize',
    data: params,
    headers: {
      'X-Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(async function(resp) {
    delete req.session.pocketRequestCode;
    var accessToken = resp.data.access_token;
    // save user's access token
    await u.savePocketToken(req.user, accessToken);
    res.redirect('/settings')
  }).catch(err => {
    console.log(err)
    res.status(400).send()
  })

})

app.get('/token',
  ensureAuthAPI,
  function(req, res) {
    var token = jwt.sign({ id: req.user.id }, jwtSecret, { expiresIn: '100d' });
    res.json({ token: token });
  })

app.get('/session',
  ensureAuthAPI,
  function(req, res) {
    res.json(req.user);
  });


app.post('/bookmark', ensureAuthAPI, async function(req, res) {
  var href = req.body.href;
  if (!href) {
    return res.status(400).json({ error: "missing href" })
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
  } catch (e) {
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
      return u.markLinkAsUnread(linkId, req.user)
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
  var links = await u.getAllLinksByUser(req.user.id, filter || {});
  res.json(links);
});

app.get('/tags', ensureAuthAPI, async function(req, res) {
  var tags = await u.getAllTags(req.user.id);
  res.json(tags);
});

app.get('/open/:linktoken', async (req, res) => {
  var linktoken = req.params.linktoken;
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
  } catch (e) {
    // notify user that unsubscription failed
    console.log(e)
  }
  res.redirect('/settings')
});

app.get('/deleteaccount', ensureAuthAPI, async (req, res) => {
  var user = req.user;
  req.logout();
  await u.deleteAccount(user);
  res.sendFile(path.join(__dirname + '/public/deleted.html'));
})

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/privacy.html'));
})

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/terms.html'));
})


app.get('/vote', (req, res) => {
  // dummy end point for recording interests in paid plan.
  // I'm not interested in throwing in an website analystics tool now - largely due to privacy concerns.
  // I'm hoping this request will get logged by cloudfare and I can use cloudflare analytics to look at this data
  res.send('Thanks')
})

// app.get('/downgrade', ensureAuthAPI, async (req, res) => {
// SINCE WE HAVE STRIPE PROVIDING US WITH A NICE BILLING SELF SERVICE PORTAL, WE SHOULDN'T NEED THIS
// })

app.post('/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  const webhookSecret = STRIPE_WEBHOOK_SECRET;
  console.log('secret: ', webhookSecret);
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event;
  let signature = req.headers["stripe-signature"];
  console.log('signature: ', signature);

  // var rawBody = JSON.stringify(req.body)
  console.log('body: ', req.body);

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error(err);
    console.log(`Webhook signature verification failed.`);
    return res.sendStatus(400);
  }
  // Extract the object from the event.
  data = event.data;
  eventType = event.type;
  console.log(eventType, data);
  switch (eventType) {
      case 'checkout.session.completed':
        // Payment is successful and the subscription is created.
        // We should provision the subscription and save the customer ID to our database.
        var user = await u.getUserByStripeId(data.object.customer);
        await u.markUserAsPaid(user);
        break;
      case 'invoice.paid':
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in our database and check when a user accesses our service.
        // This approach helps us avoid hitting rate limits.
        var user = await u.getUserByStripeId(data.object.customer);
        await u.markUserAsPaid(user);
        break;
      case 'invoice.payment_failed':
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify our customer and send them to the
        // customer portal to update their payment information.

        // no op for now. Let users avail the service even if subsequent renewals fail.
        break;
      case  'customer.subscription.deleted':
        var user = await u.getUserByStripeId(data.object.customer);
        await u.markUserAsUnpaid(user);
        
      default:
      // Unhandled event type
    }

  res.sendStatus(200);
})

// payments related page
app.post('/start-payment-session', ensureAuthAPI, async (req, res) => {
  const { priceId } = req.body;
  // create stripe customer if not already created. Will help us match with the webhook event

  var customerId = req.user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: req.user.email
    });
    customerId = customer.id;
    await u.saveStripeId(req.user, customerId);
  }

  // now create checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: process.env.DOMAIN_URL + '/settings/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.DOMAIN_URL + '/settings',
    });

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }

});

app.post('/create-customer-portal-session', ensureAuthAPI, async (req, res) => {
  var customerId = req.user.stripeCustomerId;
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.DOMAIN_URL + '/settings',
  });

  res.redirect(session.url);
})

// render home page
app.get('/*', async (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.get('/app', async (req, res) => {
  res.sendFile(path.join(__dirname + '/react-public/index.html'));
})


// start cron job
console.log('--------------------------------------');
console.log('Setting up cron job to run every monday')
console.log('--------------------------------------');
cron.schedule('0 7 * * 1', function() {
  console.log('Running Cron Job -- sending emails');
  u.sendMails();
  u.collectPocketLinks();
});





app.listen(port, '0.0.0.0', () => console.log(`Listening at http://localhost:${port}`))