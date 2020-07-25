import PrismaClient from '@prisma/client'
const prisma = new PrismaClient.PrismaClient();
import AWS from 'aws-sdk';
AWS.config.update({region: 'us-east-2'});

export const getUserByEmail = async (email) => {
  return await prisma.user.findOne({
    where: {
      email: email,
    },
  });
};

export const getUserById = async (id) => {
  return await prisma.user.findOne({
    where: {
      id: id,
    },
  });
};

export const getTag = async (user, tag) => {
    return await prisma.tag.findOne({
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
    return await prisma.link.findOne({
        where: {
            userId_href: {
                userId: user.id,
                href: href
            }
        }
    })
}

export const setTags2Link = async (link, tags) => {
    return await prisma.link.update({
        where: { id: link.id },
        data: {
            tags: {
                set: tags.map(t => {
                    return {id: t.id}
                })
            }
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
        await prisma.link.create({
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
        prisma.link.update({
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
        var sendPromise = await new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    } catch (err) {
        function(err) {
        console.error(err, err.stack);
    }

    console.log('EMAIL SENT!!!')
    
    return sendPromise;
    // Handle promise's fulfilled/rejected states
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
            console.log(l.tags);
            return l.tags.length === 0 || l.tags.filter(t => t.notify).length // atleast one tag with notify = true
        })
        
        // console.log(links)
        // send email to users
        mail(
            
        )
    })

    // Create sendEmail params 
}

