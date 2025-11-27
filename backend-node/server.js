import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());

// Servir public/
app.use(express.static(path.join(__dirname, "../public")));

// Manejar cualquier ruta (Express nuevo no soporta "*")
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor Node corriendo en http://localhost:${PORT}`);
});
