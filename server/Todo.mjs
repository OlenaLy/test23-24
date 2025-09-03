import mongoose from "mongoose";

const { Schema, model } = mongoose;

const todoSchema = new Schema({
    text: { type: String, required: true },
    isDone: { type: Boolean, default: false }
    // text: String,
    // isDone: Boolean
});

const Todo = model('Todo', todoSchema);

export default Todo;
