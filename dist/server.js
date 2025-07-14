"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
let server;
// 🔴 Handle uncaught synchronous errors
process.on("uncaughtException", (err) => {
    console.error("🛑 Uncaught Exception. Shutting down...");
    console.error(err);
    process.exit(1);
});
// 🔁 Start server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect("mongodb+srv://sumaya:sumaya123456@cluster0.ju1bs.mongodb.net/tour-management-backend?retryWrites=true&w=majority&appName=Cluster0");
        console.log("✅ MongoDB Connected");
        server = app_1.default.listen(5000, () => {
            console.log("🚀 Server is running on port 5000");
        });
    }
    catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err); // ✅ use template string or single argument
        process.exit(1);
    }
    // ⚠️ This should be outside try-catch and startServer()
});
// 🟡 Handle unhandled async promise rejections
process.on("unhandledRejection", (reason) => {
    console.error("🛑 Unhandled Rejection. Shutting down...");
    console.error(reason);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// ✅ Handle graceful shutdown signals from OS
const gracefulShutdown = (signal) => {
    console.log(`🔻 ${signal} received. Shutting down gracefully...`);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
startServer();
