# Read Me Later
A smarter bookmarking system to help you complete your reading list. If you want to use this right away: https://closetab.email 

*In loving memory of my friend [Karthik](https://github.com/karthikricssion) who helped me write some of the code for this project. He lost his battle against cancer but won the hearts of many with his cheerful smile, stupid jokes and by just being there for us whenever we needed him*

## Manifesto
A good bookmark service should help me at two things: 
1.  I've read something. I don't want to lose it.  
2.  I don't have the time to read something at the moment. I want to buffer it and come back to it later.

While good at #1, most suck at #2. A good bookmark service should help me complete my reading list than just being a dumb bucket. It should have three basic properties:

1. I should be able to bookmark a link with a timeout within which I'd like to read it.
2. The service should remind me of pending items in my reading list.
3. The service shouldn't work like an annoying alarm clock. It should remind me in a way I *enjoy* completing my reading list.
4. I signed up for a bookmarking service, not a social network. It shouldn't run funny algorithms and recommend me friends or internet links.

Here's one version of a bookmarking service that I envison:

+ It should orchestrate well with my current workflow. Ideally it should reach out to me, via email.  
+ It should help me #tag a link.  
+ When reminding me of my pending links, it should also encourage me by mentioning a rough estimate of reading time to complete articles per tag.  
+ It should help me find / sort links by hashtags.  
+ It should have an email inbox like view to mark a link as read. So that I only get reminders of relevant links.   
+ It should boost my reading habit by periodically presenting me with good metrics on how well I did over number of articles, time spent or hashtag coverage.   
+ When the number of pending links of an hashtag grows beyond limit, it should present me with a plan to handle that load, likely by recommending me with a time estimate over the weekend to complete a portion of pending items.  
+ Most important of all, it shouldn't make me guilty of having a huge list of pending lists.  


This project is one initiative in that direction. Most of the above can be acheived with an authentication layer and a very light browser extension and a server process for metrics calculation and sending reminders. 


## LICENSE

The source code is released under MIT License. 


## Contributors

+ [Karthikeyan](http://karthyk.dev) - Thank you for helping me develop the chrome extension and designing a quick UX for the inbox view!
+ [Alin Panaitiu](https://github.com/alin23) - Thank you for porting the extension to a version supported by most browsers!
+ [Joe Lewis](http://joe-lewis.com)  


## Setup

1. Clone repo
2. `npm install`
3. `cp sample.env .env`
4. `cp client/sample.env client/.env`
5.  Edit .env files to configure database, auth keys and other configurations
3. `DEBUG="*" npx prisma migrate dev --name init` to setup migration scripts and create tables. 
4. `DEBUG="*" npx prisma generate` to create the tables. // we don't need this step in newer versions of prisma. `migrate` creates the client as well
5. `cd client`
6. `npm install` to install client project's dependencies
7. `yarn build` to build client files and push into ../public folder
6. `cd .. && node index.js` to run the server or use your favourite process manager for production
7. The reminder emails use AWS SES service in production. You might want to override it with your own service/implementation. Look at `mail()` function from `utils.js`. If you do intend to use AWS SES, sign up for an AWS account and manage your API keys as suggested by AWS - either by dropping your keys in .env file or creating ~/.aws/credentials file with keys.



## To Debug prisma APIs open node interpreter and paste below code
```
var PrismaClient = require('@prisma/client')
const prisma = new PrismaClient.PrismaClient();
var pp = function(promise) { promise.then(r => console.log(r)) }
pp(prisma.link.findMany())
```
