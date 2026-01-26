import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase/firebaseConfig";
import { sendFakeMovement } from "./services/sendFakeMovement";
import { sendFakeAlert } from "./services/sendFakeAlert";


export default function App() {
  const [pagina, setPagina] = useState("dashboard");
  const [historicoMovimentos, setHistoricoMovimentos] = useState([]);
  const [alertas, setAlertas] = useState([]);


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




  // dados simulados
  const estado = "Normal"; // Normal | Em risco | Alerta


  function corEstado() {
    if (estado === "Normal") return "#2ecc71";
    if (estado === "Em risco") return "#f1c40f";
    if (estado === "Alerta") return "#e74c3c";
  }

  function iconeEstado() {
    if (estado === "Normal") return "✔️";
    if (estado === "Em risco") return "⚠️";
    if (estado === "Alerta") return "🚨";
  }

  // ---------------- DASHBOARD ----------------
  if (pagina === "dashboard") {
    return (
      <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ padding: 20, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View>
              <Text style={styles.saudacao}>Olá, Utilizador</Text>
              <Text style={styles.dataAtual}>{new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
            </View>
          </View>
          <Text style={styles.titulo}>Monitorização em Tempo Real</Text>
          <Text style={styles.subtitulo}>Acompanhe todas as atividades</Text>
        </View>

        {/* Cartão de Status */}
        <View style={[styles.estadoCard, { 
          backgroundColor: corEstado(),
          shadowColor: corEstado(),
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 15,
          elevation: 5,
        }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.estadoIconeContainer}>
                <Text style={styles.estadoIcone}>{iconeEstado()}</Text>
              </View>
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.estadoTexto}>Estado Atual</Text>
                <Text style={styles.estadoValor}>{estado}</Text>
              </View>
            </View>
            <View style={styles.estadoDetalhes}>
              <Text style={styles.estadoDetalhesTexto}>Atualizado agora</Text>
            </View>
          </View>
        </View>

        {/* Cards de Informação */}
        <View style={styles.cardsContainer}>
          {/* Card Batimentos Cardíacos */}
          <View style={[styles.card, styles.cardElevated]}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>❤️</Text>
            </View>
            <Text style={styles.cardTitulo}>Batimentos</Text>
            <Text style={styles.cardValor}>72 <Text style={styles.cardUnidade}>bpm</Text></Text>
            <View style={styles.cardStatus}>
              <View style={[styles.statusIndicator, {backgroundColor: '#10b981'}]} />
              <Text style={styles.cardInfo}>Normal</Text>
            </View>
          </View>

          {/* Card Localização */}
          <View style={[styles.card, styles.cardElevated]}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>📍</Text>
            </View>
            <Text style={styles.cardTitulo}>Localização</Text>
            <Text style={styles.cardValor}>Casa</Text>
            <Text style={[styles.cardInfo, {marginTop: 4}]}>Porto, Portugal</Text>
          </View>
        </View>

        {/* Botões de Simulação (Temporários) */}
        <View style={styles.simulacaoContainer}>
          <Text style={styles.simulacaoTitulo}>🔧 Ferramentas de Desenvolvimento</Text>
          
          <View style={styles.botoesSimulacao}>
            <TouchableOpacity
              style={[styles.botaoSimulacao, {backgroundColor: '#e0f2fe'}]}
              onPress={sendFakeMovement}
            >
              <Text style={[styles.botaoSimulacaoTexto, {color: '#0369a1'}]}>➕ Simular Movimento</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.botaoSimulacao, {backgroundColor: '#fef3c7'}]}
              onPress={sendFakeAlert}
            >
              <Text style={[styles.botaoSimulacaoTexto, {color: '#92400e'}]}>⚠️ Simular Alerta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navegação */}
        <View style={styles.botoesContainer}>
          <View style={styles.botoesLinha}>
            <View style={styles.botaoWrapper}>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => setPagina("historico")}
              >
                <Text style={styles.botaoTexto}>📋 Histórico</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.botaoWrapper}>
              <TouchableOpacity
                style={styles.botaoSecundario}
                onPress={() => setPagina("alertas")}
              >
                <Text style={styles.botaoSecundarioTexto}>🔔 Alertas</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.botoesLinha, {marginTop: 10}]}>
            <View style={styles.botaoWrapper}>
              <TouchableOpacity
                style={[styles.botao, {width: '100%'}]}
                onPress={() => setPagina("contatos")}
              >
                <Text style={styles.botaoTexto}>📞 Contatos de Emergência</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </ScrollView>
    );
  }
  // ---------------- ALERTAS ----------------
  if (pagina === "alertas") {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, width: '100%' }}>
          <View style={[styles.header, { marginBottom: 15 }]}>
            <Text style={[styles.titulo, { fontSize: 28 }]}>Alertas</Text>
            <Text style={styles.subtitulo}>Histórico de notificações e alertas</Text>
          </View>

          <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 30 }}>
            {alertas.length === 0 ? (
              <View style={styles.semDadosContainer}>
                <Text style={styles.semDadosTexto}>Nenhum alerta registado.</Text>
                <Text style={[styles.semDadosTexto, { marginTop: 10, fontSize: 14 }]}>
                  Use o botão "Simular Alerta" para testar.
                </Text>
              </View>
            ) : (
              alertas.map((item) => (
                <View key={item.id} style={[
                  styles.cardAlerta,
                  {
                    borderLeftWidth: 4,
                    borderLeftColor: item.estado === "Confirmado" ? "#ef4444" : "#f59e0b"
                  }
                ]}>
                  <View style={styles.cabecalhoAlerta}>
                    <Text style={styles.tipoAlerta}>{item.tipo || 'Alerta'}</Text>
                    <Text style={[
                      styles.estadoAlerta,
                      { color: item.estado === "Confirmado" ? "#ef4444" : "#f59e0b" }
                    ]}>
                      {item.estado}
                    </Text>
                  </View>
                  
                  <View style={styles.infoAlerta}>
                    <Text style={styles.textoAlerta}><Text style={styles.rotuloAlerta}>Local:</Text> {item.localizacao || 'Local não especificado'}</Text>
                    <Text style={styles.textoAlerta}><Text style={styles.rotuloAlerta}>Hora:</Text> {item.hora || 'Hora não disponível'}</Text>
                    {item.detalhes && (
                      <Text style={[styles.textoAlerta, { marginTop: 8 }]}>{item.detalhes}</Text>
                    )}
                  </View>
                  
                  <Text style={styles.horaAlerta}>{item.hora || ''}</Text>
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => setPagina("dashboard")}
          >
            <Text style={styles.botaoVoltarTexto}>← Voltar ao Painel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ---------------- HISTÓRICO ----------------
  if (pagina === "historico") {
    return (
      <View style={styles.container}>
        <View style={[styles.container, { paddingTop: 40 }]}>
          <Text style={[styles.titulo, { marginBottom: 20 }]}>Histórico de Movimentos</Text>
          <Text style={styles.subtitulo}>Registos recentes</Text>

          <ScrollView>
            {historicoMovimentos.length === 0 ? (
              <Text style={{ color: "#6b7280", textAlign: "center", marginTop: 20 }}>
                Nenhum movimento registado.
              </Text>
            ) : (
              historicoMovimentos.map((item) => (
                <View key={item.id} style={styles.cardHistorico}>
                  <Text style={styles.historicoTexto}>{item.texto}</Text>
                  <Text style={styles.historicoHora}>{item.hora}</Text>
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => setPagina("dashboard")}
          >
            <Text style={styles.botaoTexto}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ---------------- CONTATOS DE EMERGÊNCIA ----------------
  if (pagina === "contatos") {
    return (
      <View style={styles.container}>
        <View style={[styles.container, { paddingTop: 40 }]}>
          <Text style={[styles.titulo, { marginBottom: 20 }]}>Contatos de Emergência</Text>
          <Text style={styles.subtitulo}>Lista de contatos importantes</Text>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: "#6b7280", textAlign: "center", marginTop: 20 }}>
              Página em desenvolvimento
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => setPagina("dashboard")}
          >
            <Text style={styles.botaoTexto}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 25,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
  },
  saudacao: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 2,
  },
  dataAtual: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  titulo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 6,
    lineHeight: 34,
  },
  subtitulo: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 5,
  },

  // ESTADO
  estadoCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    backgroundColor: "#4f46e5",
  },
  estadoIconeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  estadoIcone: {
    fontSize: 28,
    color: "#ffffff",
  },
  estadoDetalhes: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  estadoDetalhesTexto: {
    color: '#e0e7ff',
    fontSize: 12,
    fontWeight: '500',
  },
  estadoTexto: {
    color: "#e0e7ff",
    fontSize: 16,
    marginTop: 5,
    fontWeight: "500",
  },
  estadoValor: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 5,
  },

  // CARDS
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    width: "48%",
    position: 'relative',
    overflow: 'hidden',
  },
  cardElevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitulo: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  cardValor: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 4,
  },
  cardUnidade: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: '500',
  },
  cardInfo: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 2,
  },
  cardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  // BOTÕES
  botoesContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  botoesLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  botaoWrapper: {
    width: '48%',
  },
  botao: {
    backgroundColor: "#4f46e5",
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  botaoSecundario: {
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  botaoTexto: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  botaoSecundarioTexto: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 16,
  },
  
  // Botões de Simulação
  simulacaoContainer: {
    marginTop: 20,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  simulacaoTitulo: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  botoesSimulacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoSimulacao: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoSimulacaoTexto: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  botaoTextoSec: {
    color: "#111827",
    fontWeight: "bold",
  },

  // ESTILOS PARA SEM DADOS
  semDadosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginTop: 20,
  },
  semDadosTexto: {
    color: '#64748b',
    fontSize: 16,
    textAlign: 'center',
  },

  // ESTILOS DE ALERTA
  cardAlerta: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  cabecalhoAlerta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tipoAlerta: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  estadoAlerta: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#fffbeb',
  },
  infoAlerta: {
    marginBottom: 8,
  },
  rotuloAlerta: {
    fontWeight: '600',
    color: '#475569',
  },
  textoAlerta: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 4,
  },
  horaAlerta: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'right',
    marginTop: 4,
  },

  // HISTÓRICO
  cardHistorico: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  historicoTexto: {
    flex: 1,
    fontSize: 15,
    color: "#334155",
    fontWeight: "500",
  },
  historicoHora: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
    marginLeft: 10,
  },

  botaoVoltar: {
    backgroundColor: "#4f46e5",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  botaoVoltarTexto: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
