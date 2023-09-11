import express from "express";
import db from './utils/database.js'; 
import Todo from "./models/todosModels.js"; 
import 'dotenv/config'

Todo; 

const PORT = process.env.PORT ?? 8000;

console.log(process);



db.authenticate()
.then(() => {console.log('Conexion correcta')})
.catch(error =>console.log(error));

db.sync()
.then(()=>console.log('base de datos sincronizada'))
.catch(error=>console.log(error))


const app = express();

app.use(express.json());

app.get('/todos',async(req,res)=>{
   
     try {
        const todos = await Todo.findAll();
         res.json(todos);
      } catch (error) {
         res.status(400).json(error);
      }
});

//cuando se haga una request a /todos POST crear una tarea
app.post('/todos',async(req,res)=>{
    try {
        const todo = req.body;
        console.log(todo)
       await Todo.create(todo);
        res.status(201).json(todo);
      } catch (error) {
        res.status(400).json(error);
      }


});
app.get("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await Todo.findByPk(id);
      res.json(todo);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.delete("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await Todo.destroy({where:{id:id}});
      res.status(204).json(todo)
    } catch (error) {
      res.status(400).json(error);
    }
  });

  app.put("/todos/:id", async (req, res) => {
    try {
        const {id} = req.params;
    const {title, description, completed} = req.body;
    const updatedToDo = await Todo.update({title, description, completed} , {where: {id:id}, returning:true});
      
      res.status(204).json(updatedToDo)
    } catch (error) {
      res.status(400).json(error);
    }
  });




app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puertO ${PORT}`);
});