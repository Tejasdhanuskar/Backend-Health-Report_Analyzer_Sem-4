const mongoose= require("mongoose")

// creating schema in database with validations
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'name is require'],
    },
    email:{
        type:String,
        required:[true,'email is require'],
    },
    password:{
        type:String,
        required:[true,"password is require"],
    },
    isAdmin:{
        type: Boolean,
        default:false
    },
    isDoctor:{
        type:Boolean,
        default:false
    },
    notification:{
        type: Array,
        default:[]
    },
    seennotification: {
        type:Array,
        default:[]
    }
});

//users is the name of collection in the database
// and pass the schema ie userSchema
const userModel= mongoose.model('users', userSchema)

module.exports = userModel;