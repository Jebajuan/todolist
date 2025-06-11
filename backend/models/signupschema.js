const mdb = require('mongoose')

const signupSchema = mdb.Schema({
    userName:String,
    password:String,
    email:String,
})

const signup_Schema = mdb.model("todolistsignup",signupSchema)
module.exports = signup_Schema