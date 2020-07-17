import express from 'express'
import PrismaClient from '@prisma/client'
// or const { PrismaClient } = require('@prisma/client')
const app = express()
const port = 3000

const prisma = new PrismaClient.PrismaClient()

const main = async () => {
    const allUsers = await prisma.user.findMany()
    console.log(allUsers)
}

main()

app.get('/', async (req, res) => {
    
    res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))