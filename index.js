import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { toJSON } from "@reis/mongoose-to-json";


await mongoose.connect(process.env.MONGO_URI).then(() => console.log("Database connected successfully")).catch((error) => console.log("Error connecting to database", error));

const app = express();
const port = process.env.PORT ||
5000;

app.use(express.json());


app.use(cors());
app.use(express.json());


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});