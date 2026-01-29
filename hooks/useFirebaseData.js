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
  const [dadosBatimentos, setDadosBatimentos] = useState({
    bpm: "72 bpm",
    spo2: "98 %",
    tempC: "36.5 ºC",
    timestamp: "Atualizado agora"
  });
  const [historicoBatimentos, setHistoricoBatimentos] = useState([]);
  const [historicoTemperatura, setHistoricoTemperatura] = useState([]);
  const [historicoOxigenacao, setHistoricoOxigenacao] = useState([]);

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
    const refBatimentos = ref(database, "batimentos");

    onValue(refBatimentos, (snapshot) => {
      const dados = snapshot.val();

      if (dados) {
        // Obter todos os batimentos
        const lista = Object.keys(dados).map((key) => ({
          id: key,
          ...dados[key],
        }));

        // Função para converter timestamp
        const parseTimestamp = (timestamp) => {
          const partes = timestamp.split(' ');
          if (partes.length === 2) {
            const dataPartes = partes[0].split('/');
            const horaPartes = partes[1].split(':');
            
            if (dataPartes.length === 3 && horaPartes.length === 3) {
              return new Date(
                parseInt(dataPartes[2]), // ano
                parseInt(dataPartes[1]) - 1, // mês (0-11)
                parseInt(dataPartes[0]), // dia
                parseInt(horaPartes[0]), // hora
                parseInt(horaPartes[1]), // minuto
                parseInt(horaPartes[2]) // segundo
              );
            }
          }
          return new Date(0);
        };

        // Ordenar por timestamp (mais recente primeiro)
        lista.sort((a, b) => {
          return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
        });

        // Filtrar últimos 48 horas
        const agora = new Date();
        const quarentaOitoHorasAtras = new Date(agora.getTime() - 48 * 60 * 60 * 1000);
        
        const historicoUltimas48h = lista.filter(item => {
          const dataItem = parseTimestamp(item.timestamp);
          return dataItem >= quarentaOitoHorasAtras && dataItem <= agora;
        });

        // Separar por tipo de dado
        const historicoBpm = historicoUltimas48h
          .filter(item => item.bpm)
          .map(item => ({
            id: item.id,
            valor: item.bpm,
            timestamp: item.timestamp,
            data: parseTimestamp(item.timestamp)
          }));

        const historicoTemp = historicoUltimas48h
          .filter(item => item.tempC)
          .map(item => ({
            id: item.id,
            valor: item.tempC,
            timestamp: item.timestamp,
            data: parseTimestamp(item.timestamp)
          }));

        const historicoSpo2 = historicoUltimas48h
          .filter(item => item.spo2)
          .map(item => ({
            id: item.id,
            valor: item.spo2,
            timestamp: item.timestamp,
            data: parseTimestamp(item.timestamp)
          }));

        // Atualizar estados
        setHistoricoBatimentos(historicoBpm);
        setHistoricoTemperatura(historicoTemp);
        setHistoricoOxigenacao(historicoSpo2);

        // Manter lógica original para o mais recente
        if (lista.length > 0) {
          const maisRecente = lista[0];
          setDadosBatimentos({
            bpm: maisRecente.bpm || "72 bpm",
            spo2: maisRecente.spo2 || "98 %",
            tempC: maisRecente.tempC || "36.5 ºC",
            timestamp: maisRecente.timestamp || "Atualizado agora"
          });
        }
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

        // Verificar quedas nos últimos 5 minutos
        const verificarQuedasUltimaHora = (quedasLista) => {
          const agora = new Date();
          const cincoMinutosAtras = new Date(agora.getTime() - 5 * 60 * 1000);
          
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
                  
                  if (dataQueda >= cincoMinutosAtras && dataQueda <= agora) {
                    return true; // Encontrou queda nos últimos 5 minutos
                  }
                }
              }
            }
          }
          return false; // Não há quedas nos últimos 5 minutos
        };

        // Verificar se há nova queda (após a primeira carga)
        if (lista.length > ultimaQuedaCount && ultimaQuedaCount > 0) {
          setQuedaDetetadaAgora(true);
          // Auto-ocultar alerta após 5 segundos
          setTimeout(() => {
            setQuedaDetetadaAgora(false);
          }, 5000);
        }

        // Verificar estado baseado em quedas nos últimos 5 minutos
        const temQuedaUltimaHora = verificarQuedasUltimaHora(lista);
        if (temQuedaUltimaHora) {
          setEstadoAtual("Queda Detetada");
          setTextoAtualizacao("Atualizado últimos 5 min");
        } else {
          setEstadoAtual("Normal");
          setTextoAtualizacao("Atualizado últimos 5 min");
        }

        setQuedas(lista.reverse());
        setUltimaQuedaCount(lista.length);
      } else {
        setQuedas([]);
        setUltimaQuedaCount(0);
      }
    });
  }, []);

  // Verificação periódica para voltar ao estado normal após 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (quedas.length > 0) {
        // Verificar quedas nos últimos 5 minutos
        const verificarQuedasUltimaHora = (quedasLista) => {
          const agora = new Date();
          const cincoMinutosAtras = new Date(agora.getTime() - 5 * 60 * 1000);
          
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
                  
                  if (dataQueda >= cincoMinutosAtras && dataQueda <= agora) {
                    return true; // Encontrou queda nos últimos 5 minutos
                  }
                }
              }
            }
          }
          return false; // Não há quedas nos últimos 5 minutos
        };

        const temQuedaUltimaHora = verificarQuedasUltimaHora(quedas);
        if (!temQuedaUltimaHora) {
          setEstadoAtual("Normal");
          setTextoAtualizacao("Atualizado últimos 5 min");
        }
      }
    }, 60000); // Verificar a cada minuto (60 segundos)

    return () => clearInterval(interval);
  }, [quedas]);

  return { 
    historicoMovimentos, 
    alertas, 
    contactos, 
    quedas, 
    quedaDetetadaAgora, 
    estadoAtual, 
    textoAtualizacao, 
    dadosBatimentos,
    historicoBatimentos,
    historicoTemperatura,
    historicoOxigenacao
  };
}
