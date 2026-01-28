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
  const [estadoAtual, setEstadoAtual] = useState("Normal");
  const [textoAtualizacao, setTextoAtualizacao] = useState("Atualizado agora");

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

        // Verificar quedas nos últimos 30 minutos
        const verificarQuedasUltimaHora = (quedasLista) => {
          const agora = new Date();
          const trintaMinutosAtras = new Date(agora.getTime() - 30 * 60 * 1000);
          
          for (const queda of quedasLista) {
            if (queda.timestamp) {
              // Tentar parse do timestamp no formato "dd/mm/yyyy hh:mm:ss"
              const partes = queda.timestamp.split(' ');
              if (partes.length === 2) {
                const dataPartes = partes[0].split('/');
                const horaPartes = partes[1].split(':');
                
                if (dataPartes.length === 3 && horaPartes.length === 3) {
                  const dataQueda = new Date(
                    parseInt(dataPartes[2]), // ano
                    parseInt(dataPartes[1]) - 1, // mês (0-11)
                    parseInt(dataPartes[0]), // dia
                    parseInt(horaPartes[0]), // hora
                    parseInt(horaPartes[1]), // minuto
                    parseInt(horaPartes[2]) // segundo
                  );
                  
                  if (dataQueda >= trintaMinutosAtras && dataQueda <= agora) {
                    return true; // Encontrou queda nos últimos 30 minutos
                  }
                }
              }
            }
          }
          return false; // Não há quedas nos últimos 30 minutos
        };

        // Verificar se há nova queda (após a primeira carga)
        if (lista.length > ultimaQuedaCount && ultimaQuedaCount > 0) {
          setQuedaDetetadaAgora(true);
          // Auto-ocultar alerta após 5 segundos
          setTimeout(() => {
            setQuedaDetetadaAgora(false);
          }, 5000);
        }

        // Verificar estado baseado em quedas nos últimos 30 minutos
        const temQuedaUltimaHora = verificarQuedasUltimaHora(lista);
        if (temQuedaUltimaHora) {
          setEstadoAtual("Queda Detetada");
          setTextoAtualizacao("Atualizado últimos 30 min");
        } else {
          setEstadoAtual("Normal");
          setTextoAtualizacao("Atualizado últimos 30 min");
        }

        setQuedas(lista.reverse());
        setUltimaQuedaCount(lista.length);
      } else {
        setQuedas([]);
        setUltimaQuedaCount(0);
      }
    });
  }, []);

  return { historicoMovimentos, alertas, contactos, quedas, quedaDetetadaAgora, estadoAtual, textoAtualizacao };
}
