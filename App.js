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

export default function App() {
  const [pagina, setPagina] = useState("dashboard");
  const [historicoMovimentos, setHistoricoMovimentos] = useState([]);

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
      <View style={styles.container}>
        <StatusBar style="dark" />

        <Text style={styles.titulo}>Dashboard</Text>
        <Text style={styles.subtitulo}>Monitorização em tempo real</Text>

        {/* ESTADO */}
        <View style={[styles.estadoCard, { backgroundColor: corEstado() }]}>
          <Text style={styles.estadoIcone}>{iconeEstado()}</Text>
          <Text style={styles.estadoTexto}>Estado atual</Text>
          <Text style={styles.estadoValor}>{estado}</Text>
        </View>

        {/* CARD BATIMENTOS */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>❤️ Batimentos cardíacos</Text>
          <Text style={styles.cardValor}>72 bpm</Text>
          <Text style={styles.cardInfo}>Última atividade há 5 min</Text>
        </View>

        {/* CARD LOCALIZAÇÃO */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>📍 Localização</Text>
          <Text style={styles.cardValor}>Casa – Porto</Text>
        </View>
        <TouchableOpacity
        style={[styles.botao, { marginTop: 15 }]}
        onPress={sendFakeMovement}
        >
        <Text style={styles.botaoTexto}>Simular movimento</Text>
        </TouchableOpacity>

        {/* BOTÕES */}
        <View style={styles.botoes}>
          <TouchableOpacity
            style={styles.botao}
            onPress={() => setPagina("historico")}
          >
            <Text style={styles.botaoTexto}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoSecundario}>
            <Text style={styles.botaoTextoSec}>Contactos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ---------------- HISTÓRICO ----------------
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.titulo}>Histórico de Movimentos</Text>
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
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    padding: 20,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 40,
  },
  subtitulo: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 20,
  },

  // ESTADO
  estadoCard: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
  },
  estadoIcone: {
    fontSize: 30,
  },
  estadoTexto: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  estadoValor: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },

  // CARDS
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
  },
  cardTitulo: {
    fontSize: 15,
    color: "#6b7280",
  },
  cardValor: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  cardInfo: {
    marginTop: 5,
    color: "#9ca3af",
  },

  // BOTÕES
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  botao: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    width: "48%",
    alignItems: "center",
  },
  botaoSecundario: {
    backgroundColor: "#e5e7eb",
    padding: 16,
    borderRadius: 14,
    width: "48%",
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  botaoTextoSec: {
    color: "#111827",
    fontWeight: "bold",
  },

  // HISTÓRICO
  cardHistorico: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historicoTexto: {
    fontSize: 16,
  },
  historicoHora: {
    color: "#6b7280",
  },

  botaoVoltar: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
});
