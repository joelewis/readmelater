# Read Me Later
Bookmark with a snooze button. Bookmark, buffer and complete your reading list. 


## Manifesto
A good bookmark service should help me do two things: 
1.  I've read something over the internet. I'm pretty sure I will need it at a later point of time, so I want a place to dump links that I don't want to forget. 
2.  I've come across something interesting, but I don't have the time to read it entirely right now. I want to dump it somewhere and come back to it later when I find time.

While most bookmark services are good at #1, most suck at #2. A good bookmark service should help me complete my reading list than just being a dumb bucket. It should have three basic properties:

1. I should be able to bookmark a link with a timeout within which I'd like to read it.
2. The service should remind me of pending items in my reading list.
3. The service shouldn't work like an annoying alarm clock. It should remind me in a way I *enjoy* completing my reading list.
4. I signed up for a bookmarking service, not a social network. It shouldn't run funny algorithms and recommend me friends or internet links.

Here's one version of a bookmarking service that I envison:

+ It should orchestrate well with my current workflow. Ideally it should reach out to me, via email.  
+ It should help me tag a link, with a custom #hashtag.  
+ When reminding me of my pending links, it should also encourage me by mentioning a rough estimate of reading time to complete articles per hashtag.  
+ It should help me find links by hashtags.  
+ It should have an easy way to detect or manually mark a link as read. So that I only get reminders of relevant links.   
+ It should boost my reading habit by periodically presenting me with good metrics on how well I did over number of articles, time spent or hashtag coverage.   
+ When the number of pending links of an hashtag grows beyond limit, it should present me with a plan to handle that load, likely by recommending me with a time estimate over the weekend to complete a portion of pending items.  
+ Most important of all, it shouldn't make me guilty of having a huge list of pending lists.  


This project is one initiative on that direction. Most of the above can be acheived a frictionless authentication layer and a very light browser extension and a server process for metrics calculation and sending reminders. 





