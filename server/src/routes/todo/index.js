const express = require('express')
const TodoRouter = express.Router()
const Todo = require("../../models/Todo");


TodoRouter.route('/').get(async (req, res) => {
    //데이터베이스에서 전체 할일 목록 조회
    const todos= await Todo.find()
    res.json({status:200,todos})
})

TodoRouter.route('/:id').get((req,res)=>{
    Todo.findById(req.params.id,(err,todo)=>{
        if(err)throw err;
        res.json({status:200,todo})
    })
})

TodoRouter.route('/:name').get((req,res)=>{
    Todo.findById(req.body.name,(err,todo)=>{
        if(err)throw err;
        res.json({status:200,todo})
    })
})

TodoRouter.route('/').post( (req, res) => {
    console.log(`name: ${req.body.name}`)
    Todo.findOne({ name: req.body.name, done: false }, async (err, todo) => { // 중복체크
        if(err) throw err;
        if(!todo){ // 데이터베이스에서 해당 할일을 조회하지 못한 경우
            const newTodo = new Todo(req.body);
            await newTodo.save().then( () => {
                res.json({ status: 201, msg: 'new todo created in db !', newTodo})
            })

        }else{ // 생성하려는 할일과 같은 이름이고 아직 끝내지 않은 할일이 이미 데이터베이스에 존재하는 경우
            const msg = 'this todo already exists in db !'
            console.log(msg) 
            res.json({ status: 204, msg})
        }
    })
})

TodoRouter.route('/:id').put( (req, res) => {
    Todo.findByIdAndUpdate(req.params.id,req.body,{new:true},(err,todo)=>{
        if(err) throw err;
        res.json({status:204,msg:`todo${req.params.id}updated in db!`,todo})
    })
})

TodoRouter.route('/:id').delete( (req, res) => {
    res.send(`todo ${req.params.id} removed`)
})

module.exports = TodoRouter