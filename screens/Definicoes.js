import { View, Text, TouchableOpacity } from "react-native";

export default function Definicoes({ setPagina, styles }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Definições</Text>
        <Text style={styles.subtitulo}>Configurações da aplicação</Text>
      </View>

      <View style={styles.definicoesContainer}>
        <Text style={styles.definicoesVazio}>Página de definições em desenvolvimento</Text>
        <Text style={styles.definicoesSubtexto}>Em breve poderá configurar as definições aqui</Text>
      </View>

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => setPagina("dashboard")}
      >
        <Text style={styles.botaoVoltarTexto}>← Voltar ao Painel</Text>
      </TouchableOpacity>
    </View>
  );
}
