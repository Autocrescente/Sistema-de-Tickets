const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

if (process.env.APP_BASE_PATH) {
  const prodUrl = `https://app.autocrescente.com${process.env.APP_BASE_PATH}`;
  swaggerSpec.servers.unshift({ url: prodUrl, description: "Produção" });
}

if (swaggerSpec.paths) {
  const fixed = {};
  for (const [p, v] of Object.entries(swaggerSpec.paths)) {
    fixed[p.replace(/^\/api\//, "/")] = v;
  }
  swaggerSpec.paths = fixed;
}

// Inject schemas not yet in swagger.js
swaggerSpec.components.schemas.Recipient = {
  type: "object",
  properties: {
    _id:        { type: "string" },
    name:       { type: "string", example: "João Silva" },
    email:      { type: "string", example: "joao@empresa.com" },
    department: { type: "string", example: "Informática" },
    createdAt:  { type: "string", format: "date-time" },
  },
};
if (swaggerSpec.components.schemas.Ticket) {
  swaggerSpec.components.schemas.Ticket.properties.cc = {
    type: "array", items: { type: "string" }, example: ["chefe@empresa.com"],
  };
}

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

app.use("/tickets",    require("./src/routes/tickets"));
app.use("/stats",      require("./src/routes/stats"));
app.use("/recipients", require("./src/routes/recipients"));

app.use((_req, res) =>
  res.status(404).json({ message: "Rota nao encontrada." }),
);
app.use(errorHandler);

module.exports = app;
