const bcrypt = require('bcryptjs')

const salt = bcrypt.genSaltSync(10)
//const hashedPassword = bcrypt.hashSync('police123', salt)

//console.log(hashedPassword)

//console.log(bcrypt.compareSync('station123', '$2a$10$u5szrJebbaXMeLRzfP2S6eTP2cOdWuUZZiGCrY9foGT8gBHB2gK.i'))