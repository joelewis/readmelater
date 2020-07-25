import PrismaClient from '@prisma/client'
const prisma = new PrismaClient.PrismaClient();

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
    return await prisma.user.findOne({
        where: {
          userId: user.id,
          tag: tag
        }
    });
}

export const createTag = async (user, tag) => {
    return await prisma.user.create({
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
            user: user,
            href: href
        }
    })
}

export const addTags2Link = async (link, tags) => {
    return await prisma.link.update({
        where: { id: link.id },
        data: {
            tags: tags
        }
    })
}

export const addLink = async (user, href, timeout, tags) => {
    
    var tagIds = tags.map(async tag => {
        var t = await getTag(user, tag) || await createTag(user, tag)
    })

    console.log(tagIds)

    var link = await getLinkByHref(user, href) || await prisma.link.create({
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

    return await addTags2Link(link, tagIds);

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
