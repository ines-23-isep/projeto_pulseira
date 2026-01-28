import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export function useFirebaseData() {
  const [historicoMovimentos, setHistoricoMovimentos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [quedas, setQuedas] = useState([]);
  const [quedaDetetadaAgora, setQuedaDetetadaAgora] = useState(false);
  const [ultimaQuedaCount, setUltimaQuedaCount] = useState(0);

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

  useEffect(() => {
    const refQuedas = ref(database, "quedas");

    onValue(refQuedas, (snapshot) => {
      const dados = snapshot.val();

      if (dados) {
        const lista = Object.keys(dados).map((key) => ({
          id: key,
          ...dados[key],
        }));

        // Para teste: mostrar alerta sempre que há quedas
        console.log("Verificando quedas - lista.length:", lista.length, "ultimaQuedaCount:", ultimaQuedaCount);
        if (lista.length > 0) {
          console.log("Quedas encontradas! Ativando alerta para teste...");
          setQuedaDetetadaAgora(true);
          // Auto-ocultar alerta após 5 segundos
          setTimeout(() => {
            setQuedaDetetadaAgora(false);
          }, 5000);
        } else {
          console.log("Nenhuma queda encontrada");
        }

        setQuedas(lista.reverse());
        setUltimaQuedaCount(lista.length);
      } else {
        setQuedas([]);
        setUltimaQuedaCount(0);
      }
    });
  }, []);

  return { historicoMovimentos, alertas, contactos, quedas, quedaDetetadaAgora };
}
