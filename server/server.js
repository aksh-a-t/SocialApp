const express =require("express");
const app = express();
const cors = require("cors");
const dotEnv = require("dotenv");
const mongoose = require('mongoose');
const {Server} = require("socket.io");
const http = require("http");
const cron = require('node-cron');
const User = require("./models/UserSchema")

const server = http.createServer(app);
// const io = socketio(server);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  
const initializeio = require('./SocketServer');
initializeio(io);

const deletefunction=async()=>{
    try{

        let time = Date.now()-2*60*60*1000;
        await User.deleteMany({otpexpire:{$lte:time}});
        await User.updateMany({forgotexpire:{$lte:time}},{forgotLink:null,forgotexpire:null});
    }
    catch(e){
        console.log(e);
    }
}
cron.schedule("58 23 * * *",deletefunction);

app.use(cors());
app.use(express.json());

dotEnv.config({path:'./env/.env'});

const Expressport = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_DB_CLOUD_URL,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
}).then((response)=>{
    console.log("Connected to Mongodb ...");
}).catch((error)=>{
    console.error(error);    
});

app.use('/api/users',require('./Routes/UserRoute'));
app.use('/api/posts',require('./Routes/PostRoute'));
server.listen(Expressport,()=>{
    console.log("Express Server Started..");
});
