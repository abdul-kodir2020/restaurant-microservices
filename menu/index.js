const express = require('express')
const app = express()

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 3000

const connectDB = async () =>{
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Base de données utilsateur connectée");
    })
    .catch(err => {
        console.log(err);
    })
}

app.get('/', (req, res) => {
  res.send('Hello World for menu')
})


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
connectDB()
