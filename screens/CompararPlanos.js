import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function CompararPlanos({ setPagina, styles }) {
  const funcionalidades = [
    { nome: "Monitorização tempo real", normal: true, premium: true },
    { nome: "Alertas de queda", normal: true, premium: true },
    { nome: "Contactos emergência", normal: "2", premium: "Ilimitados" },
    { nome: "Pessoas monitorizar", normal: "1", premium: "Múltiplas" },
    { nome: "Histórico completo", normal: false, premium: true },
    { nome: "Relatórios detalhados", normal: false, premium: true },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={[styles.container, { paddingTop: 40 }]}>
        <Text style={[styles.titulo, { marginBottom: 20 }]}>Comparar Planos</Text>
        <Text style={styles.subtitulo}>Compare todas as funcionalidades</Text>

        {/* Tabela de Comparação */}
        <View style={styles.comparacaoContainer}>
          {/* Cabeçalho */}
          <View style={styles.comparacaoHeader}>
            <View style={styles.comparacaoCelulaHeader}>
              <Text style={styles.comparacaoHeaderText}>Funcionalidade</Text>
            </View>
            <View style={[styles.comparacaoCelulaHeader, styles.comparacaoCelulaNormal]}>
              <MaterialIcons name="star" size={20} color="#f59e0b" />
              <Text style={styles.comparacaoHeaderText}>Normal</Text>
            </View>
            <View style={[styles.comparacaoCelulaHeader, styles.comparacaoCelulaPremium]}>
              <FontAwesome5 name="crown" size={20} color="#1565c0" />
              <Text style={styles.comparacaoHeaderText}>Premium</Text>
            </View>
          </View>

          {/* Linhas de Funcionalidades */}
          {funcionalidades.map((func, index) => (
            <View key={index} style={styles.comparacaoLinha}>
              <View style={styles.comparacaoCelula}>
                <Text style={styles.comparacaoTexto}>{func.nome}</Text>
              </View>
              <View style={[styles.comparacaoCelula, styles.comparacaoCelulaNormal]}>
                {func.normal === true ? (
                  <Text style={styles.comparacaoCheck}>✓</Text>
                ) : func.normal === false ? (
                  <Text style={styles.comparacaoX}>✗</Text>
                ) : (
                  <Text style={styles.comparacaoTexto}>{func.normal}</Text>
                )}
              </View>
              <View style={[styles.comparacaoCelula, styles.comparacaoCelulaPremium]}>
                {func.premium === true ? (
                  <Text style={styles.comparacaoCheck}>✓</Text>
                ) : func.premium === false ? (
                  <Text style={styles.comparacaoX}>✗</Text>
                ) : (
                  <Text style={styles.comparacaoTexto}>{func.premium}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Preços */}
        <View style={styles.comparacaoPrecos}>
          <View style={styles.comparacaoPrecoCard}>
            <Text style={styles.comparacaoPrecoTitulo}>Plano Normal</Text>
            <Text style={styles.comparacaoPrecoValor}>Gratuito</Text>
          </View>
          <View style={styles.comparacaoPrecoCard}>
            <Text style={styles.comparacaoPrecoTitulo}>Plano Premium</Text>
            <Text style={styles.comparacaoPrecoValor}>€9.99/mês</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => setPagina("planos")}
        >
          <Text style={styles.botaoVoltarTexto}>← Voltar aos Planos</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
