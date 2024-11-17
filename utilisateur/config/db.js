const mongoose = require('mongoose')

const connectDB = async () =>{
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Base de données utilsateur connectée");
    })
    .catch(err => {
        console.log(err);
    })
}

module.exports = connectDB