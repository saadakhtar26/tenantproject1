const bcrypt = require('bcryptjs')

const salt = bcrypt.genSaltSync(10)
//const hashedPassword = bcrypt.hashSync('station123', salt)

//console.log(hashedPassword)

console.log(bcrypt.compareSync('abc123', '$2a$10$YxK4lCBoaiiefcaAdi/0euD/iVFHuhR77ky1bqc3r9KnkooeFABCe'))