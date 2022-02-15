const mgs=require('mongoose')
const todo=require('./Todo')

const userSchema=mgs.Schema({
    namd:{type:String,required:true,trim:true},
    age:{type:Number,required:true},
    email:{type:String,required:true,trim:true},
    todos:{type:[todo],required:true}
})

const User=mgs.model('User',userSchema)
module.exports=User