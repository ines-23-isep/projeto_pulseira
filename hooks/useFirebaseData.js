import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export function useFirebaseData() {
  const [historicoMovimentos, setHistoricoMovimentos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    const referencia = ref(database, "historico/pulseira001");

    onValue(referencia, (snapshot) => {
      const dados = snapshot.val();

      if (dados) {
        const lista = Object.keys(dados).map((key) => ({
          id: key,
          ...dados[key],
        }));

        setHistoricoMovimentos(lista.reverse());
      }
    });
  }, []);

  useEffect(() => {
    const refAlertas = ref(database, "alertas/pulseira001");

    onValue(refAlertas, (snapshot) => {
      const dados = snapshot.val();

      if (dados) {
        const lista = Object.keys(dados).map((key) => ({
          id: key,
          ...dados[key],
        }));

        setAlertas(lista.reverse());
      }
    });
  }, []);

  useEffect(() => {
    const refContactos = ref(database, "contactos/pulseira001");

    onValue(refContactos, (snapshot) => {
      const dados = snapshot.val();

      if (dados) {
        const lista = Object.keys(dados).map((id) => ({
          id,
          ...dados[id],
        }));

        setContactos(lista.sort((a, b) => a.prioridade - b.prioridade));
      } else {
        setContactos([]);
      }
    });
  }, []);

  return { historicoMovimentos, alertas, contactos };
}
