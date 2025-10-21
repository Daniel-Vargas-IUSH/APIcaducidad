// server.js
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n--- Servidor Node.js (Express) para el Rastreador de Caducidad ---`);
    console.log(`API escuchando en http://localhost:${PORT}/api`);
    console.log(`Pruebe los endpoints con Postman.`);
    console.log(`------------------------------------------------------------------\n`);
});
