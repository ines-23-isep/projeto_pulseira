import { ref, push } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export function sendFakeMovement() {
  const movimentos = [
    "Caminhada normal",
    "Sentou-se",
    "Levantou-se",
    "Movimento brusco",
    "Deitado",
  ];

  const movimento = {
    texto: movimentos[Math.floor(Math.random() * movimentos.length)],
    hora: new Date().toLocaleTimeString().slice(0, 5),
  };

  push(ref(database, "historico/pulseira001"), movimento);
}
