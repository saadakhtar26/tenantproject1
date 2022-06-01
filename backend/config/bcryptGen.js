const bcrypt = require('bcryptjs')

const salt = bcrypt.genSaltSync(10)
const hashedPassword = bcrypt.hashSync('station123', salt)

//console.log(hashedPassword)

//console.log(bcrypt.compareSync('abc123', '$2a$10$uPfBtnudCY4hdKgGaKEm0uj/jI9HSLubIA.zX80mIyNM8UGQtPo2O'))