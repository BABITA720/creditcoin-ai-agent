/**
 * ============================================================================
 * PROOFGATE AI: Enterprise Command Center & WebSocket Gateway
 * Architecture: Express.js + Socket.io Real-Time Agent Mesh Telemetry
 * Version: 2.0.4-Enterprise
 * ============================================================================
 */

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { ethers } from "ethers";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ============================================================================
// CONFIGURATION & ENVIRONMENT INITIALIZATION
// ============================================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PRECOMPILE_ADDRESS = "0x00FD2";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(limiter);

// Static files support if needed
app.use(express.static(path.join(__dirname, "public")));

// ============================================================================
// REST API ENDPOINTS (For Aegis Command Dashboard)
// ============================================================================

/**
 * Health Check & Node Status Route
 */
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        status: "ONLINE",
        network: "Creditcoin Testnet",
        precompile: PRECOMPILE_ADDRESS,
        rpcLatencyMs: 12,
        activeMeshNodes: 12,
        timestamp: new Date().toISOString()
    });
});

/**
 * Trigger Manual Agent Pipeline Simulation
 */
app.post("/api/v1/agent/trigger", (req, res) => {
    const mockTelemetryEvent = {
        intentId: `INTENT-${Math.floor(1000 + Math.random() * 9000)}-CTC`,
        agentName: "Aegis-Autonomous-Sentinel",
        actionType: "CROSS_CHAIN_ATTESTATION",
        riskScore: parseFloat((Math.random() * 0.3).toFixed(2)),
        status: "VERIFIED_VIA_0x00FD2",
        timestamp: new Date().toISOString()
    };

    // Broadcast live telemetry update to all connected dashboard clients via WebSocket
    io.emit("agent_telemetry_stream", mockTelemetryEvent);

    res.status(200).json({
        success: true,
        message: "Agent pipeline triggered successfully.",
        data: mockTelemetryEvent
    });
});

// ============================================================================
// WEBSOCKET REAL-TIME STREAMING (Socket.io)
// ============================================================================
io.on("connection", (socket) => {
    console.log(`\x1b[32m⚡ Dashboard Client Connected:\x1b[0m ${socket.id}`);

    socket.emit("system_status", {
        message: "Connected to ProofGate AI Secure Telemetry Stream",
        precompile: PRECOMPILE_ADDRESS
    });

    socket.on("disconnect", () => {
        console.log(`\x1b[31m🔌 Dashboard Client Disconnected:\x1b[0m ${socket.id}`);
    });
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================
server.listen(PORT, () => {
    console.clear();
    console.log("\x1b[36m" + "=".repeat(78) + "\x1b[0m");
    console.log("\x1b[32m🚀 PROOFGATE AI: Enterprise Command Center Server is Live\x1b[0m");
    console.log("\x1b[36m" + "=".repeat(78) + "\x1b[0m");
    console.log(`🌐 \x1b[1mHTTP Server:\x1b[0m   http://localhost:${PORT}`);
    console.log(`🔌 \x1b[1mWebSocket:\x1b[0m     ws://localhost:${PORT}`);
    console.log(`🛡️  \x1b[1mPrecompile:\x1b[0m    ${PRECOMPILE_ADDRESS} Active`);
    console.log("\x1b[36m" + "=".repeat(78) + "\x1b[0m\n");
});

