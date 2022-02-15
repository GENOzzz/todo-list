const port=5000
//node_modules 내 express 관련 코드를 가져옴
const express = require('express')
//cors설정 => 동일 출처정책(보안)
var cors=require('cors')
//logger설정
var logger=require('morgan')
//mongoose
var mgs=require('mongoose')
var routes = require('./src/routes')
var birds=require('./birds')


var corsOption={//cors옵션
    origin:'http://localhost:5000',
    credentials:true
}

const CONNECT_URL='mongodb://localhost:27017/geno'
mgs.connect(CONNECT_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("mongodb connected ..."))
  .catch(e => console.log(`failed to connect mongodb: ${e}`))

const app=express()
//미들웨어
app.set('case sensitive routing',true)

app.use(cors(corsOption))//cors설정
app.use(express.json())//request body 파싱
app.use(logger('tiny'))//로거 설정


app.use("/api", routes)

app.get('/hello', (req, res) => { // URL 응답 테스트
    res.send(`<html>
                <head></head>
                <body>
                    <h1>Hello world !</h1>
                    <input type='button' value='Submit'/>
                </body>
                </html>`
                )
})

app.get('/hellofile',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
})

const blockFirstUser = (req, res, next) => {
    if (req.params.name === "kim") {
      res.status(401).send("you are not authorized to this page !")
    }
    next()
}
const blockSecondUser = (req, res, next) => {
    if (req.params.name === "park") {
      res.status(401).send("you are not authorized to this page !")
    }
    next()
}
  
const allowThisUser = (req, res) => {
    res.send("you can see this home page !")
}
  
app.get("/home/users/:name", [//배열로 여러개 줄수있음.순서대로 동작
    blockFirstUser,
    blockSecondUser,
    allowThisUser
])

app.get('/users/contact',(req,res)=>{
    res.send("contact page !")
})

//정규식/  /앞에는\붙여야하고 d{정수} 정수개만큼 숫자 허용
app.get(/^\/users\/(\d{4})$/, (req, res) => {
    console.log(req.params)
    res.send(`user id ${req.params[0]} found successfully !`)
})
//또다른 표현식
app.get("/users/:userId([0-9]{4})", (req, res) => {
    console.log(req.params)
    res.send(`user id ${req.params.userId} found successfully2 !`)
})

app.get(
    "/users/:name/comments",
    (req, res, next) => {
      if (req.params.name !== "geno") {
        res.status(401).send("you are not authorized to this page !")
      }
      next()
    },
    (req, res) => {
      res.send("this is page to update your comments!") //  댓글 수정 페이지 보여주기
    }
)

app.get('/users*',(req,res)=>{
    res.send("users wildcards !")
})
//아래 url은 실행이 안됨.(위에 와일드 카드로 빠지기 때문에.)
app.get('/users/city',(req,res)=>{
    res.send("city page !")
})

//+앞의 표현식이 1회이상 연속으로 반복되면 매칭
app.get("/go+gle", (req, res) => {
    res.send("google site")
  })

app.get("/sylee((mo)+)?", (req, res) => {
  res.send("sylee is definitely shown ! and other string is optional !")
})


app.get("/chance", (req, res, next) => {
    if (Math.random() < 0.5) return next()//조건문에 따라 같은 url로 다른로직 처리가능
    res.send("first one")
})
app.get("/chance", (req, res) => {
    res.send("second one")
})

app.get(
    "/fruits/:name",
    (req, res, next) => {
      if (req.params.name !== "apple") return next()
      res.send("[logic 1] you choose apple for your favorite fruit !")
    },
    (req, res, next) => {
      if (req.params.name !== "banana") return next()
      res.send("[logic 2] you choose banana for your favorite fruit !")
    },
    (req, res) => {
      res.send(`[logic 3] you choose ${req.params.name} for your favorite fruite !`)
    }
)

app.get("/shirts", (req, res) => {
    res.send(`feature - color : ${req.query.color} / size: ${req.query.size}`)
})

app.use('/birds',birds);

app.use( (req, res, next) => {  // 사용자가 요청한 페이지가 없는 경우 에러처리
    res.status(404).send("Sorry can't find page")
})

app.use((err,req,res,next)=>{
    console.log(err.stack)//express서버 콘솔에 err출력
    res.status(500).send("something is broken on server!")
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}...`)
})

