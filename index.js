import express from "express";
// import { writeFile, readFile } from "node:fs/promises";
import fs from "fs";
import cors from "cors";

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileContent = fs.readFileSync("repertorio.json", "utf8");
const cancionesParse = JSON.parse(fileContent);

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    try {
        res.sendFile(__dirname + "/index.html");
        res.status(200);
    } catch (error) {
        res.json({ message: "Recurso no disponible" });
        res.status(404);
    }
});

app.get("/canciones", (req, res) => {
    try {
        cancionesParse;
        res.status(200).json(cancionesParse);
    } catch (error) {
        res.status(500).json({ error: "Error al procesar solicitud" });
        console.error("Error al procesar solicitud", error);
    }
});

app.post("/canciones", (req, res) => {
    try {
        const cancion = req.body;
        cancionesParse;
        cancionesParse.push(cancion);
        fs.writeFileSync("repertorio.json", JSON.stringify(cancionesParse));
        res.status(200).send("Canción agregada con éxito");
    } catch (error) {
        res.status(500).json({ error: "Error al procesar solicitud" });
        console.error("Error al procesar solicitud", error);
    }
});

app.put("/canciones/:id", (req, res) => {
    try {
        const { id } = req.params;
        const cancion = req.body;
        // We need to read the json before editing
        const repertorioContent = fs.readFileSync("repertorio.json", "utf8");
        const cancionesParse = JSON.parse(repertorioContent);
        const index = cancionesParse.findIndex((c) => c.id == id);
        // We have to make sure we find the correct index
        if (index !== -1) {
            cancionesParse[index] = { ...cancionesParse[index], ...cancion };
            fs.writeFileSync("repertorio.json", JSON.stringify(cancionesParse));
            res.status(200).json({ message: "Canción editada con éxito" });
        } else {
            res.status(404).json({ error: "Canción no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al procesar solicitud" });
        console.error("Error al procesar solicitud:", error);
    }
});

app.delete("/canciones/:id", (req, res) => {
    try {
        const { id } = req.params;
        const index = cancionesParse.findIndex((c) => c.id == id);
        cancionesParse.splice(index, 1);
        fs.writeFileSync("repertorio.json", JSON.stringify(cancionesParse));
        res.status(204).send("Canción modificada con éxito");
    } catch (error) {
        res.status(500).json({ error: "Error al procesar solicitud" });
        console.error("Error al procesar solicitud:", error);
    }
});

app.listen(5000, () => {
    console.log("Server on");
});
