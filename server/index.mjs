import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Todo from './todo.mjs';
import path from "path";
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoUrl = process.env.MONGO_URL ||'mongodb+srv://lenalitvinen4ik_db_user:caztWOuzrWMoNAOs@cluster0.vtkrs8m.mongodb.net/madatabase?retryWrites=true&w=majority';

mongoose.connect(mongoUrl,  { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
ssl: true,
});
mongoose.connection.on('open', () => {
    console.log('Mongo DB is connected');
});
mongoose.connection.on('error', (err) => {
    console.log('Mongo DB is failed to connect', err);
});

const app = express();
const PORT = process.env.PORT || 5500;
const HOST = '0.0.0.0'

//app.use тоді app.get не потрібно
app.use(express.json()); // для читання JSON у body
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));//віддає index.html
// CRUD
//Read
app.get("/api/todo-list", async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (err) {
      res.status(500).send({ error: "DB read error" });
    }
  });

//Create 
app.post("/api/todo", async (req, res) => {
  try {
    const { text, isDone } = req.body;
    const newTodo = new Todo({ text, isDone });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).send({ error: "DB create error" });
  }
});
// UPDATE (зміна задачі)
app.put("/api/todo/:id", async (req, res) => {
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedTodo);
    } catch (err) {
      res.status(400).send({ error: "DB update error" });
    }
  });
  
  // DELETE (видалення задачі)
  app.delete("/api/todo/:id", async (req, res) => {
    try {
      await Todo.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(400).send({ error: "DB delete error" });
    }
  });
//старт сервера
app.listen(PORT, HOST, () => {
    console.log(` Server started on http://localhost:${PORT}`);
})