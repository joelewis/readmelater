import PrismaClient from '@prisma/client'
import exphbs from 'express-handlebars';
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const hbs = exphbs.create({});
const prisma = new PrismaClient.PrismaClient();
AWS.config.update({region: 'us-east-2'});

export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

export const getUserByStripeId = async (id) => {
    return await prisma.user.findUnique({
      where: {
        stripeCustomerId: id,
      },
    });
  };

export const getTag = async (user, tag) => {
    return await prisma.tag.findUnique({
        where: {
          userId_tag: {
              userId: user.id,
              tag: tag
          }
        }
    });
}

export const createTag = async (user, tag) => {
    return await prisma.tag.create({
        data: {
          tag: tag,
          user: {
              connect: {
                  id: user.id
              }
          }
        }
    });
}

export const getLinkByHref = async (user, href) => {
    return await prisma.link.findUnique({
        where: {
            userId_href: {
                userId: user.id,
                href: href
            },
        },
        include: {
            tags: true
        }
    })
}

export const getLinkById = async (id) => {
    return await prisma.link.findUnique({
        where: {
            id: id
        },
        include: {
            tags: true
        }
    })
}

export const deleteLinkById = async (id, user) => {
    var link = await getLinkById(id);
    if (link.userId != user.id) { throw new Error('user not authorized to access this API') }
    return await prisma.link.delete({
        where: {
            id: id
        }
    })
}

export const markLinkAsReadById = async (id) => {
    return await prisma.link.update({
        where: {
            id: id
        },
        data: {
            notify: false
        }
    })
}

export const markLinkAsRead = async (id, user) => {
    var link = await getLinkById(id);
    if (link.userId != user.id) { throw new Error('user not authorized to access this API') }
    return await markLinkAsReadById(id)
}

export const markLinkAsUnread = async (id, user) => {
    var link = await getLinkById(id);
    if (link.userId != user.id) { throw new Error('user not authorized to access this API') }
    return await prisma.link.update({
        where: {
            id: id
        },
        data: {
            notify: true
        }
    })
}

export const setTags2Link = async (link, tags) => {
    console.log(link, tags);
    return await prisma.link.update({
        where: { id: link.id },
        data: {
            tags: {
                set: tags.map(t => {
                    return {id: t.id}
                })
            }
        }, 
        include: {
            tags: true
        }
    })
}

export const addLink = async (user, href, timeout, tags) => {
    
    var tags = await Promise.all(tags.map(async tag => {
        var t =  await getTag(user, tag) || await createTag(user, tag)
        return t;
    }))

    var link = await getLinkByHref(user, href);

    if (!link) { // if link is not present create everything
        var link = await prisma.link.create({
            data: {
                user: {
                    connect: {
                        id: user.id
                    }
                },
                href: href,
                timeout: timeout
            }
        })
    } else { // if link is already bookmarked just update timeout and tags
        console.log(`updating timeout value for link: ${link.id} as timeout: ${timeout}`)
        await prisma.link.update({
            where: {id: link.id},
            data: {
                timeout: timeout
            }
        })
    }

    // update link's tags
    return await setTags2Link(link, tags);
}

export const timeNow2Date = function(keyString) { // key = 'xd, xw, xm'
  var keyArr = keyString.split("");
  var unit = keyArr.pop();
  var value = parseInt(keyArr.join(""))
  switch (unit) {
    case 'd': {
      var date = new Date();
      date.setDate(date.getDate() + value);
      return date;
    }

    case 'w': {
      var date = new Date();
      date.setDate(date.getDate() + (7 * value));
      return date;
    }

    case 'm': {
      var date = new Date();
      date.setMonth(date.getMonth() + value);
      return date;
    }

    default: {
      console.log('Invalid key');
    }
  }
}


export const mail = async (from, to, subject, text, html) => {
    var params = {
        Destination: { /* required */
          ToAddresses: [
            to
            /* more items */
          ]
        },
        Message: { /* required */
          Body: { /* required */
            Text: {
             Charset: "UTF-8",
             Data: text
            }
           },
           Subject: {
            Charset: 'UTF-8',
            Data: subject
           }
          },
        Source: from, /* required */
    };

    if (html) {
        params.Message.Body.Html = {
            Charset: "UTF-8",
            Data: html
        }
    }
    
    try {
        // Create the promise and SES service object
        var data = await new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
        console.log('mail-sent for: ', to);
        return data;
    } catch (err) {
        console.error(err, err.stack);
        return {};
    }

    // Handle promise's fulfilled/rejected states
}

export const getRemainingDays = (futureDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((new Date() - futureDate) / oneDay));
}

export const getAllLinksByUser = async (userId, filters) => {
    
    var query = {
        where: {
            userId: userId
        },
        include: {
            tags: true
        }
    };
    if (filters.tags && filters.tags.length) {
        query.where.OR = filters.tags.map(t => {
            return {
                tags: {
                    some: {
                        tag: t
                    }
                }
            }
        });
    }
    
    if (filters.link) {
        query.where.href = {
            contains: filters.link
        }
    }

    return await prisma.link.findMany(query)
}

export const getAllTags = async (userId) => {
    return await prisma.tag.findMany({
        where: {
            userId: userId
        }
    })
}
 
export const getPendingLinksByUser = async (userId) => {
    return await prisma.link.findMany({
        where: {
            userId: userId,
            timeout: {
                gte: new Date()
            }
        },
        include: {
            tags: true
        }
    })
}

export const setNotifyStatus = async (userId, notify) => {
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            notify: notify
        }
    });
}

export const setUnsubscribedTags = async (userId, tags) => {
    
    // first set all tags notify = true, and then selectively set notify = false from tags
    await prisma.tag.updateMany({
        where: {
            userId: userId
        },
        data: {
            notify: true
        }
    })

    console.log('settings notify=false for these tags: ', {
        where: {
            AND: tags.map(t => ({
                    userId: userId,
                    tag: t
            }))
        },
        data: {
            notify: false
        }
    });
    
        await prisma.tag.updateMany({
            where: {
                OR: tags.map(t => ({
                    userId: userId,
                    tag: t
                }))
            },
            data: {
                notify: false
            }
        })
};

export const deleteAccount = async (user) => {
    // delete links
    // delete tags
    // delete emaillog
    // delete user
    await prisma.link.deleteMany({
        where: {userId: user.id}
    });

    await prisma.tag.deleteMany({
        where: {userId: user.id}
    });

    try {
        await prisma.emailLog.deleteMany({
            where: {userId: user.id}
        });
    } catch (e) {
        
    }


    return await prisma.user.delete({
        where: {id: user.id}
    });
};

export const fetchPocketBookmarksForLastWeek = async (user) => {
    var since = new Date(); // points to today
    since.setDate(since.getDate()-7); // now points to a week before

    // convert to unix timestamp
    since = Math.floor(since.getTime()/1000)

    var params = {
        consumer_key: process.env.POCKET_CONSUMER_KEY,
        access_token: user.pocketToken.token,
        tag: 'readlater',
        since: since
      };

    try {
        var response = await axios({
            method: 'post',
            url: 'https://getpocket.com/v3/get',
            data: params,
            headers: {
              'X-Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        })

        return Object.values(response.data.list);
    } catch (e) {
        console.log(`Error while fetching pocket links for user: ${user.id}`)
        return []
    }
}

export const collectPocketLinks = async () => {
    var users = await prisma.user.findMany({
        where: {
            notify: true,
            pocketConnected: true,
            paymentStatus: 'subscribed'
        },
        include: {
            pocketToken: true
        }
    })

    var timeout = timeNow2Date('2w');

    users.forEach(async user => {
        var links = await fetchPocketBookmarksForLastWeek(user);
        links.forEach(async pocketlink => {
            var link = await addLink(user, pocketlink.given_url, timeout, []);
        })
    })
}

export const sendMails = async () => {
    // fetch users
    // for each user
    //  if user.notify == true:
    //      fetch all links for the user where link.notify = true && link.timeout > currentDate
    //      filter each link in links:
    //          based on if sumOfTagsNotifyBoolean(link.tags) === true
    //      collect filtered links and generate mail content
    //      send email to user

    var users = await prisma.user.findMany({
        where: {
            notify: true
        }
    })

    users.forEach(async user => {
        var links = await prisma.link.findMany({
            where: {
                userId: user.id,
                notify: true,
                timeout: {
                    gte: new Date()
                }
            },
            include: {
                tags: true
            }
        })

        links = links.filter(l => {
            return l.tags.length === 0 || l.tags.filter(t => t.notify).length // atleast one tag with notify = true
        }).map(l => {
            l.closeTabLink = "http://closetab.email/open/" + jwt.sign(l.id, process.env.SECRET)
            l.remainingDays = getRemainingDays(new Date(l.timeout))
            l.isTagged = l.tags.length > 0
            return l;
        })

        if (!links.length) {
            console.log('no links to send emails to: ' + user.email);
            // return; // no links to send email for
        }

        var html = await hbs.render('./emailtemplates/weekly_reminder.html', {
            name: user.name,
            links: links,
            nolinks: !links.length,
            unsubscribeLinkToken: jwt.sign(user.id, process.env.SECRET),
            domain: process.env.DOMAIN_URL
        })

        

        var text = await hbs.render('./emailtemplates/weekly_reminder.txt', {
            name: user.name,
            links: links,
            nolinks: !links.length,
            unsubscribeLinkToken: jwt.sign(user.id, process.env.SECRET),
            domain: process.env.DOMAIN_URL
        })

        console.log(text)

        // send email to users
        var result = await mail(
            "digest@closetab.email",
            user.email,
            "CloseTab.email - stuff to read this week.",
            text,
            html
        )

        // record mail delivery
        await prisma.emailLog.create({
            data: {
                user: {
                    connect: {
                        id: user.id
                    }
                },
                html: html,
                text: text,
                mailId: result.MessageId || ''
            }
        })

    })
}

export const saveStripeId = async (user, customerId) => {
    await prisma.user.update({
        where: {id: user.id},
        data: {stripeCustomerId: customerId}
    })
}

export const markUserAsPaid = async (user) => {
    await prisma.user.update({
        where: {id: user.id},
        data: {paymentStatus: 'subscribed'}
    })
}

export const markUserAsUnpaid = async (user) => {
    await prisma.user.update({
        where: {id: user.id},
        data: {paymentStatus: 'unsubscribed'}
    })
}

export const deletePocketToken = async (user) => {
    /**
     * Ideally only one will exist, but prisma has made it so difficult to find out how to query for one unique
     * token, so I'm using this findMany query to get a list of one :(
     */
    var pocketTokens = await prisma.pocketToken.findMany({
        where: {userId: user.id}
    })
    if (pocketTokens.length) {
        var pocketToken = pocketTokens[0];
        await prisma.pocketToken.delete({
            where: {id: pocketToken.id}
        })

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                pocketConnected: false
            }
        })
    }

}

export const savePocketToken = async (user, pocketToken) => {
    // clear previous tokens if any
    await deletePocketToken(user)


    await prisma.pocketToken.create({
        data: {
            user: {
                connect: {
                    id: user.id
                }
            },

            token: pocketToken
        }
    })

    await prisma.user.update({
        where: {id: user.id},
        data: {pocketConnected: true}
    })
}