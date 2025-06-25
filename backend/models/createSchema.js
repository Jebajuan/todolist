const mdb = require('mongoose')

const createSchema = mdb.Schema({
    userName:String,
    taskName:String,
    taskList:[String]
})

const create_Schema = mdb.model("todolistgroup",createSchema)
module.exports = create_Schema