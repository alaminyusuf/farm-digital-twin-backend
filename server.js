const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const batchRoutes = require("./routes/cropBatchRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const simulationRoutes = require("./routes/simulationRoutes");
const connectDB = require("./config/db");
const validateEnv = require("./utils/validateEnv");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Validate environment variables on startup
if (process.env.NODE_ENV === "production") {
    validateEnv();
}

connectDB();

const swaggerOptions = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Hydro Manager API",
			version: "1.0.0",
			description: "API documentation for Hydroponic SaaS Application",
			contact: {
				name: "Developer",
			},
			servers: [
				{
					url: process.env.BACKEND_URL || "http://localhost:4000",
					description: "Development Server",
				},
			],
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [{ bearerAuth: [] }],
	},
	apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

// Security Middleware - Configure helmet to not block CORS
app.use(helmet({
	crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Logging Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", limiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// CORS Configuration - FIX for production
const allowedOrigins = process.env.NODE_ENV === "production"
    ? (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    : ["http://localhost:5173", "http://localhost:4000"];

app.use(cors({ 
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.length === 0) {
            // Production without FRONTEND_URL set - log warning
            console.warn("CORS: No allowed origins configured for production. Set FRONTEND_URL environment variable.");
            return callback(new Error("FRONTEND_URL not configured"));
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            console.warn(`CORS: Origin '${origin}' not allowed. Allowed origins: ${allowedOrigins.join(", ")}`);
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/simulation", simulationRoutes);

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const http = require("http");
const socketService = require("./utils/socket");

const server = http.createServer(app);
socketService.init(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, (err) => {
	if (err) throw err;
	console.log(`Server running on PORT ${PORT}`);
});
