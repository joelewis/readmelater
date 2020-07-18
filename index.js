import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import PrismaClient from '@prisma/client'
const app = express()
const port = 3000

app.use('/static', express.static('public'))

// const prisma = new PrismaClient.PrismaClient()
// const main = async () => {
//     const allUsers = await prisma.user.findMany()
//     console.log(allUsers)
// }
// main()

app.get('/', async (req, res) => {
    // res.send('Hello World!')
    res.sendFile(path.join( __dirname + '/public/index.html'));
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))