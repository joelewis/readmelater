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

export const addLink = async (user, href, timeout, tags) => {
    return await prisma.link.create({
        data: {
            user: {
                connect: {
                    id: user.id
                }
            },
            href: href,
            timeout: timeout,
            // tags: tags
        }
    })
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
