const bcrypt = require('bcryptjs')

const salt = bcrypt.genSaltSync(10)
const hashedPassword = bcrypt.hashSync('station123', salt)

console.log(hashedPassword)

//console.log(bcrypt.compareSync('station123', '$2a$10$imTq0wuV8/nFCJjBeuGfIO9maKc7iUGtPR3pr/CC9hGBmhRpaB11O'))