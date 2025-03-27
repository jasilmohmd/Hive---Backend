import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import winston from "winston";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { Resource } from "@opentelemetry/resources";
import { context, trace } from '@opentelemetry/api';

// Initialize Tracer Provider with service name
const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    'service.name': 'my-chat-service',
    'deployment.environment': process.env.NODE_ENV || 'development'
  }),
});
tracerProvider.register();

// Register Winston instrumentation for OpenTelemetry
registerInstrumentations({
  instrumentations: [new WinstonInstrumentation()],
});


// Configure Winston Logger
// Configure Winston Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => {
          // Handle HTTP logs
          if (info.message === 'HTTP request') {
            const { method, path, status, duration_ms } = info as unknown as {
              method: string;
              path: string;
              status: number;
              duration_ms: number;
            };

            // Format timestamp as date + colored time
            const now = new Date();
            const date = now.toISOString().split('T')[0];
            const time = now.toISOString().split('T')[1].slice(0, -1); // Remove 'Z'

            let statusColor = '\x1b[32m'; // Green (2xx Success)
            if (status >= 500) statusColor = '\x1b[31m'; // Red (5xx Server Error)
            else if (status >= 400) statusColor = '\x1b[33m'; // Yellow (4xx Client Error)
            else if (status >= 300) statusColor = '\x1b[36m'; // Cyan (3xx Redirection)

            return [
              `\x1b[36m${date} \x1b[37m${time}\x1b[0m`, // Cyan date, normal time
              `[${info.level}]`,
              `\x1b[33m${method}\x1b[0m`, // Yellow method
              path,
              `${statusColor}${status}\x1b[0m`, // Colored status
              `\x1b[90m${duration_ms}ms\x1b[0m` // Grey duration
            ].join(' ');
          }
          
          // Default log format
          const now = new Date();
          const date = now.toISOString().split('T')[0];
          const time = now.toISOString().split('T')[1].slice(0, -1);
          return `\x1b[36m${date} \x1b[37m${time}\x1b[0m [${info.level}] ${info.message}`;
        })
      )
    }),
    new winston.transports.File({ filename: "logs/app.log" })
  ]
});


// Custom Morgan format for structured logging
const morganJsonFormat: morgan.FormatFn<express.Request, express.Response> = (
  tokens, req, res
) => JSON.stringify({
  message: `${tokens.method(req, res)} ${tokens.url(req, res)}`,
  method: tokens.method(req, res),
  path: tokens.url(req, res),
  status: Number(tokens.status(req, res)),
  duration_ms: Number(tokens['response-time'](req, res)),
  client_ip: tokens['remote-addr'](req, res),
  user_agent: tokens['user-agent'](req, res),
  referrer: tokens.referrer(req, res),
  protocol: `HTTP/${tokens['http-version'](req, res)}`,
  content_length: tokens.res(req, res, 'content-length'),
});


// Initialize the Express app
const app: Express = express();

const CORS_ORIGIN: string = process.env.CORS_ORIGIN ?? "http://localhost:4200";



// Middlewares
app.use(cors({
  origin: [CORS_ORIGIN],
  credentials: true
})); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies in request headers


app.use((req, res, next) => {
  // Sanitize sensitive headers
  const sanitizedHeaders = { ...req.headers };
  delete sanitizedHeaders.authorization;
  delete sanitizedHeaders.cookie;

  next();
});

// Enhanced Morgan middleware with log level differentiation
app.use(morgan(':method :url :status :response-time ms', {
  stream: {
    write: (message: string) => {
      const [method, url, status, responseTime] = message.split(' ');
      logger.info('HTTP request', {
        method,
        path: url,
        status: parseInt(status),
        duration_ms: parseFloat(responseTime)
      });
    }
  }
}));

import authRouter from "../router/auth.router";
import errorHandlerMiddleware from "../middlewares/error.middleware";
import friendRouter from "../router/friends.router";
import profileRouter from "../router/profile.router";
import communityRouter from "../router/community.router";
import channelRouter from "../router/channel.router";
import roleRouter from "../router/role.router";
import imageRouter from "../router/image.router";

app.use("/auth", authRouter); // auth router
app.use("/friends", friendRouter); // friend router
app.use("/profile", profileRouter); // Profile router
app.use("/community", communityRouter); // community router
app.use("/channel", channelRouter); // channel router
app.use("/role", roleRouter); // role router
app.use("/image", imageRouter); // image router

// Error-handling middleware should be the last middleware
app.use(errorHandlerMiddleware);

export default app;