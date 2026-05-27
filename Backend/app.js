const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customSiteTitle: "Tickets API Docs" }),
);
app.get("/api-docs.json", (_req, res) => res.json(swaggerSpec));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/tickets", require("./src/routes/tickets"));
app.use("/api/stats",   require("./src/routes/stats"));

app.use((_req, res) =>
  res.status(404).json({ message: "Rota não encontrada." }),
);
app.use(errorHandler);

module.exports = app;
