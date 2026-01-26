import { ref, push } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export function sendFakeAlert() {
  const tipos = [
    "Queda detetada",
    "Longo período sem movimento",
    "Batimentos fora do normal",
    "Botão de emergência pressionado",
  ];

  const alerta = {
    tipo: tipos[Math.floor(Math.random() * tipos.length)],
    hora: new Date().toLocaleTimeString().slice(0, 5),
    localizacao: "Casa – Porto",
    estado: Math.random() > 0.5 ? "Confirmado" : "Falso alarme",
  };

  push(ref(database, "alertas/pulseira001"), alerta);
}
