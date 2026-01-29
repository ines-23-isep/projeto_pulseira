import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function MudarPlano({ setPagina, styles }) {
  const [planoSelecionado, setPlanoSelecionado] = useState("premium");

  function handleConfirmarMudanca() {
    Alert.alert(
      "Confirmar Mudança",
      `Tem certeza que deseja mudar para o ${planoSelecionado === "premium" ? "Plano Premium" : "Plano Normal"}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => {
            Alert.alert(
              "Sucesso",
              "Sua mudança de plano foi processada com sucesso!",
              [
                {
                  text: "OK",
                  onPress: () => setPagina("planos")
                }
              ]
            );
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={[styles.container, { paddingTop: 40 }]}>
        <Text style={[styles.titulo, { marginBottom: 20 }]}>Mudar Plano</Text>
        <Text style={styles.subtitulo}>Escolha seu novo plano</Text>

        <View style={styles.planosContainer}>
          {/* Plano Normal */}
          <TouchableOpacity 
            style={[
              styles.planoCard, 
              styles.planoNormal,
              planoSelecionado === "normal" && styles.planoSelecionado
            ]}
            onPress={() => setPlanoSelecionado("normal")}
          >
            <View style={styles.planoHeader}>
              <MaterialIcons name="star" size={48} color="#f59e0b" />
            </View>
            <Text style={styles.planoTitulo}>Plano Normal</Text>
            <Text style={styles.planoPreço}>Gratuito</Text>
            <View style={styles.planoFeatures}>
              <Text style={styles.planoFeatureText}>• Monitorização tempo real</Text>
              <Text style={styles.planoFeatureText}>• Alertas de queda</Text>
              <Text style={styles.planoFeatureText}>• 2 contactos emergência</Text>
              <Text style={styles.planoFeatureText}>• 1 pessoa monitorizar</Text>
            </View>
            {planoSelecionado === "normal" && (
              <View style={styles.selecionadoBadge}>
                <Text style={styles.selecionadoTexto}>Selecionado</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Plano Premium */}
          <TouchableOpacity 
            style={[
              styles.planoCard, 
              styles.planoPremium,
              planoSelecionado === "premium" && styles.planoSelecionado
            ]}
            onPress={() => setPlanoSelecionado("premium")}
          >
            <View style={styles.planoHeader}>
              <FontAwesome5 name="crown" size={48} color="#1565c0" />
            </View>
            <Text style={styles.planoTitulo}>Plano Premium</Text>
            <Text style={styles.planoPreço}>€9.99/mês</Text>
            <View style={styles.planoFeatures}>
              <Text style={styles.planoFeatureText}>• Tudo plano normal</Text>
              <Text style={styles.planoFeatureText}>• Histórico completo</Text>
              <Text style={styles.planoFeatureText}>• Contactos ilimitados</Text>
              <Text style={styles.planoFeatureText}>• Múltiplas pessoas monitorizar</Text>
            </View>
            {planoSelecionado === "premium" && (
              <View style={styles.selecionadoBadge}>
                <Text style={styles.selecionadoTexto}>Selecionado</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Botão Confirmar */}
        <TouchableOpacity
          style={[styles.planoBotao, styles.planoBotaoPrimario, { marginTop: 20 }]}
          onPress={handleConfirmarMudanca}
        >
          <Text style={styles.planoBotaoTexto}>Confirmar Mudança</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => setPagina("planos")}
        >
          <Text style={styles.botaoVoltarTexto}>← Voltar aos Planos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
