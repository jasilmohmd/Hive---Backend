import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from 'morgan';


// Initialize the Express app
const app: Express = express();

const CORS_ORIGIN: string = process.env.CORS_ORIGIN ?? "http://localhost:4200";

import authRouter from "../router/auth.router";
import errorHandlerMiddleware from "../middlewares/error.middleware";
import friendRouter from "../router/friends.router";

// Middlewares
app.use(cors({
  origin: [CORS_ORIGIN],
  credentials: true
})); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies in request headers
app.use(morgan("dev")); // Loging all http requests in detail

app.use("/auth", authRouter); // auth router
app.use("/friends", friendRouter); // friend router

// Error-handling middleware should be the last middleware
app.use(errorHandlerMiddleware);

export default app;