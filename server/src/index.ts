import express from "express"; 
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cors from 'cors'; 
import helmet from "helmet";
import morgan from "morgan";

// routes import
import projectRoutes from './routes/projectRoutes.js'
import taskRouter from "./routes/taskRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import teamRoutes from "./routes/teamsRoutes.js";



// Route import 


//Configuration 
dotenv.config(); 
const app = express(); 
app.use(express.json()); 
app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"})); 
app.use(morgan("common")); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false})); 
app.use(cors()); 

// Home route 
app.get('/', (req, res) => {
    res.send("Fl SERVER IS RUNNING "); 
})

// Routes
app.use("/projects", projectRoutes); 
app.use("/tasks", taskRouter); 
app.use('/search', searchRoutes); 
app.use("/users", userRoutes); 
app.use("/teams", teamRoutes)


 
const port = Number(process.env.PORT) || 3000
app.listen(port, "0.0.0.0", () => {
    console.log(`APP IS LISTNING AT ${port}`); 
})