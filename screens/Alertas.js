import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function Alertas({ setPagina, styles, alertas }) {
  return (
    <View style={styles.container}>
      <View style={[styles.container, { paddingTop: 40 }]}>
        <Text style={[styles.titulo, { marginBottom: 20 }]}>Alertas</Text>
        <Text style={styles.subtitulo}>Histórico de notificações e alertas</Text>

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
