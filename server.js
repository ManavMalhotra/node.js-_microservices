import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";

import httpLogger from "./middleware/morgan/index.js";
import logger from "./common/logger/index.js";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();

app.use(httpLogger);

app.use(compression({ filter: shouldCompress }));

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

dotenv.config();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: true }));

app.use(cors());

app.get("/", (req, res) => res.send("API RUNNING"));

routes(app);

const PORT = process.env.SERVER_PORT || 3009;

app.listen(PORT, () => {
  console.log(`SERVER STARTED ON PORT ${PORT}`);
  logger.info("SERVER STARTED");
});
