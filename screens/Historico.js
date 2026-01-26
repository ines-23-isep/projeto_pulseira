import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function Historico({ setPagina, styles, historicoMovimentos }) {
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
