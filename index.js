const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const cors = require("cors");
app.use(cors());

const corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

const mongoose = require('mongoose')
// mongoose.connect('mongodb://0.0.0.0:27017/SocialMedia')
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Connection successful')
}).catch((e)=>{
    console.log("No connection")
})


const morgan = require('morgan')
const helmet = require('helmet')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')
const conversationRoute = require('./routes/Conversations')
const messageRoute = require('./routes/Message')

const port = process.env.PORT || 8000

const path = require("path")


// MIDDLEWARES
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);


// multer Documentation
const multer = require('multer')
const {handleUpload} = require('./helper')

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
            return reject(result);
        }
        return resolve(result);
    });
    });
  }
  
  const storage = multer.memoryStorage();
  const upload = multer({ storage });
  const myUploadMiddleware = upload.single("file");

  app.post('/api/upload', async(req, res)=>{
    try{
        await runMiddleware(req, res, myUploadMiddleware);
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        // console.log("Cloudinary responce - ", cldRes)
        return res.status(200).send(cldRes.url)
    }catch(error){
        console.log("Uploading Error - ", error);
        return res.status(400).send({message: error.message,});
    }
})

// const storage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, "public/images")
//     },
//     filename: (req, file, cb)=>{
//         cb(null, req.body.name)
//     }
// })

app.use('/images', express.static(path.join(__dirname, "public/images")))

// const upload = multer({storage});
// app.post('/api/upload',upload.single("file"), (req, res)=>{
//     try{
//         return res.status(200).send("File upload successfully")
//     }catch(err){
//         console.log("Uploading error");
//     }
// })





app.get('/', (req, res)=>{
    res.send('Welcomse to home page')
})

app.listen(port, ()=>{
    console.log(`Server is run at port ${port}`)
})

// C:\Users\tushar\Documents\Coding\Web Developmenr\Webs\Project6\API\public\images
// C:\Users\tushar\Documents\Coding\Web Developmenr\Webs\Project6\public\images\pos6.jpg