const express = require("express");
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");


const app = express();
const dotenv = require("dotenv").config();

connectDb();
const port = process.env.PORT || 2000;


// middleware
app.use(express.json());
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
});