import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/usersRoutes.js";
import urlsRoutes from "./routes/urlsRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use(usersRoutes);
app.use(urlsRoutes)

app.listen(process.env.PORT_SERVER, () => console.log(`Server running on port ${process.env.PORT_SERVER}`));