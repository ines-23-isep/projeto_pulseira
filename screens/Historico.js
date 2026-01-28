import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function Historico({ setPagina, styles, quedas }) {
  return (
    <View style={styles.container}>
      <View style={[styles.container, { paddingTop: 40 }]}>
        <Text style={[styles.titulo, { marginBottom: 20 }]}>Histórico de Quedas</Text>
        
        <ScrollView>
          {quedas.length === 0 ? (
            <Text style={{ color: "#6b7280", textAlign: "center", marginTop: 20 }}>
              Nenhuma queda registada.
            </Text>
          ) : (
            quedas.map((queda) => (
              <View key={queda.id} style={[styles.cardHistorico, { borderLeftColor: "#dc2626" }]}>
                <Text style={[styles.historicoTexto, { color: "#dc2626", fontWeight: "bold" }]}>
                  🚨 Queda Detetada
                </Text>
                <Text style={styles.historicoHora}>
                  {queda.timestamp || new Date(queda.id).toLocaleString()}
                </Text>
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
