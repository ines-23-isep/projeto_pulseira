import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function Planos({ setPagina, styles }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={[styles.container, { paddingTop: 40 }]}>
        <Text style={[styles.titulo, { marginBottom: 20 }]}>Planos</Text>
        <Text style={styles.subtitulo}>Escolha o plano ideal para si</Text>

        <View style={styles.planosContainer}>
          {/* Plano Normal */}
          <TouchableOpacity 
            style={[styles.planoCard, styles.planoNormal]}
            onPress={() => {
              // Lógica para selecionar plano normal
              console.log('Plano Normal selecionado');
            }}
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
          </TouchableOpacity>

          {/* Plano Premium */}
          <TouchableOpacity 
            style={[styles.planoCard, styles.planoPremium, styles.planoSelecionado]}
            onPress={() => {
              // Lógica para selecionar plano premium
              console.log('Plano Premium selecionado');
            }}
          >
            <View style={styles.planoHeader}>
              <FontAwesome5 name="crown" size={48} color="#3b82f6" />
            </View>
            <Text style={styles.planoTitulo}>Plano Premium</Text>
            <Text style={styles.planoPreço}>€9.99/mês</Text>
            <View style={styles.planoFeatures}>
              <Text style={styles.planoFeatureText}>• Tudo plano normal</Text>
              <Text style={styles.planoFeatureText}>• Histórico completo</Text>
              <Text style={styles.planoFeatureText}>• Contactos ilimitados</Text>
              <Text style={styles.planoFeatureText}>• Múltiplas pessoas monitorizar</Text>
            </View>
            <View style={styles.selecionadoBadge}>
              <Text style={styles.selecionadoTexto}>Atual</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Botões de Ação */}
        <View style={styles.planosBotoesContainer}>
          <TouchableOpacity
            style={[styles.planoBotao, styles.planoBotaoPrimario]}
            onPress={() => {
              console.log('Botão desativado');
            }}
          >
            <Text style={styles.planoBotaoTexto}>Mudar o meu plano</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planoBotao, styles.planoBotaoSecundario]}
            onPress={() => setPagina("compararPlanos")}
          >
            <Text style={styles.planoBotaoSecundarioTexto}>Comparar planos</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => setPagina("definicoes")}
        >
          <Text style={styles.botaoVoltarTexto}>← Voltar às Definições</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
