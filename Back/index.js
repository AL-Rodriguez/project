require("dotenv").config();

const express = require("express"); 
const morgan = require("morgan"); 
const bodyparser = require("body-parser"); 
const fileupload = require("express-fileupload"); 
const cors = require("cors");

const app = express();

const DEFAULT_PORT = 3333
const currentPort = process.env.PORT || DEFAULT_PORT


app.use(morgan("dev"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(fileupload());
app.use(cors());
app.use('/images', express.static(__dirname +'/images'));


//**************************Middlewares */
const {isAdmin} = require("./middlewares/auth");
const questionExist = require("./middlewares/request");
const answerExist = require("./middlewares/solution");
const {isAuthenticated} = require("./middlewares/auth");

//Controllers
//**************************Users */
const {newUser,validate} = require("./controllers/users/newUser");
const loginUser = require("./controllers/users/loginUser");
const getUser = require("./controllers/users/getUser");
const editUser = require("./controllers/users/editUser");
const deleteUser = require("./controllers/users/deleteUser");
const editPassword = require("./controllers/users/editPassword")
const resetPassword = require("./controllers/users/resetPassword");
const recoverPassword = require("./controllers/users/recoverPassword");

//**************************Categories */
const getCategories = require("./controllers/categories/getCategories.js")
const getCategorie = require("./controllers/categories/getCategorie.js")
const postCategories = require("./controllers/categories/postCategories.js")
const editCategorie = require("./controllers/categories/editCategorie.js")
const deleteCategorie = require("./controllers/categories/deleteCategorie.js")

//**************************Request */
const getRequest = require("./controllers/request/getRequest.js")
const getUserRequest = require("./controllers/request/getUserRequest.js")
const getRequestForSolution = require("./controllers/request/getRequestForSolution.js")
const getSingleRequest = require("./controllers/request/getSingleRequest.js")
const postRequest = require("./controllers/request/postRequest.js")
const deleteRequest = require("./controllers/request/deleteRequest.js")
const editRequest = require("./controllers/request/editRequest.js")


//**************************Solutions */
const deleteSolution = require("./controllers/solutions/deleteSolution.js")
const postVote = require("./controllers/solutions/voteSolution.js")
const getSolutionsByUser = require("./controllers/solutions/getSolutionsByUser.js")
const getAllAnsweredRequest = require("./controllers/solutions/getAllAnsweredRequest.js")
const getAllAnsweredRequest = require("./controllers/solutions/getAllAnsweredRequest.js")
const postSolution = require("./controllers/solutions/postSolution.js")
const editSolution = require("./controllers/solutions/editSolution.js")

//Routing

//**************************Users */
app.post('/user/newUser', newUser)
app.post('/user/validate/:code', validate)
app.post('/user/login', loginUser)
app.get('/user/:id', getUser)
app.post('/user/editUser/:id', isAuthenticated, editUser)
app.post('/user/deleteUser/:id', deleteUser)
app.post('/user/editPassword/:id',isAuthenticated, editPassword)
app.post("/users/resetPassword", resetPassword);
app.post("/users/recoverPassword/", recoverPassword)

//**************************Categories */
app.get('/categories', getCategories)
app.get('/categories/:id', getCategorie)
app.post('/categories/newcategorie',isAuthenticated, isAdmin, postCategories)
app.post('/categories/edit/:categorieId',isAuthenticated, isAdmin, editCategorie)
app.post('/categories/delete/:categorieId',isAuthenticated, isAdmin, deleteCategorie)

//**************************Request */
app.get("/requests", getRequest);
app.get("/requests/getUserRequest",isAuthenticated, getUserRequest);
app.get("/requests/getRequestForSolution/:categorie",getRequestForSolution);
app.get("/requests/getSingleRequest/:id",getSingleRequest);
app.post("/requests/editRequest/:id",isAuthenticated, editRequest);
app.post("/requests/postRequest/",isAuthenticated, postRequest);
app.post("/requests/deleteRequest/:id",isAuthenticated, deleteRequest);

//**************************Solutions */
app.get('/solution/getSolutionsByUser/:id', getSolutionsByUser)
app.get('/solution/getAnsweredRequest/:id', getAnsweredRequest)
app.get('/solution/getAllAnsweredRequest/', getAllAnsweredRequest)
app.post('/solution/delete/:solutionId',isAuthenticated, deleteSolution)
app.post('/solution/vote/:solutionId',isAuthenticated, postVote)
app.post('/solution/postSolution/:request_id',isAuthenticated, postSolution)
app.post('/solution/postSolution/:solutionId',isAuthenticated, editSolution)

//const Prueba = require('./prueba')
//app.get('/prueba', isAdmin, Prueba)

console.log(`Running on port ${currentPort}`)
app.listen(currentPort)