const mgs=require('mongoose')

//데이터 모델(스키마) 정의
const todoSchema=mgs.Schema({
    name:{type:String,required:true,trim:true},
    done:{type:Boolean,default:false},//required설정없이>자동으로 false}
    description:{type:String,required:true,trim:true}
})

const Todo=mgs.model('Todo',todoSchema)//실제 메모리에 모델 생성
module.exports=Todo