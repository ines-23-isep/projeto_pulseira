import { ScrollView, View, Text, TouchableOpacity, StatusBar, Alert } from "react-native";
import { useEffect } from "react";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function Dashboard({ setPagina, styles, estado, corEstado, iconeEstado, quedaDetetadaAgora, estadoAtual, textoAtualizacao, user }) {
  
  useEffect(() => {
    if (quedaDetetadaAgora) {
      Alert.alert(
        "⚠️ Queda Detetada!",
        "Foi detetada uma queda agora. Verifique o histórico para mais detalhes.",
        [
          {
            text: "Ver Histórico",
            onPress: () => setPagina("historico"),
            style: "default",
          },
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  }, [quedaDetetadaAgora]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
        
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerTopo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={32} color="#64748b" />
            </View>
            <View>
              <Text style={styles.saudacao}>Olá, {user?.nome || 'Utilizador'}</Text>
              <Text style={styles.dataAtual}>{new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.botaoDefinicoesHeader}
            onPress={() => setPagina("definicoes")}
          >
            <Ionicons name="settings-outline" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
        <Text style={styles.titulo}>Monitorização em</Text>
        <Text style={styles.subtitulo}>Tempo Real</Text>
      </View>

      {/* Cartão de Status */}
      <View style={[styles.estadoCard, { 
        backgroundColor: corEstado(estadoAtual),
        shadowColor: corEstado(estadoAtual),
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 5,
      }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.estadoIconeContainer}>
            {estadoAtual === "Queda Detetada" ? (
              <FontAwesome5 name="exclamation-triangle" size={28} color="#ffffff" />
            ) : (
              <MaterialIcons name="check-circle" size={28} color="#ffffff" />
            )}
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.estadoTexto}>Estado Atual</Text>
            <Text style={styles.estadoValor}>{estadoAtual}</Text>
            <View style={styles.estadoDetalhes}>
              <Text style={styles.estadoDetalhesTexto}>{textoAtualizacao}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cards de Informação */}
      <View style={styles.cardsContainer}>
        {/* Card Batimentos Cardíacos */}
        <View style={[styles.card, styles.cardElevated]}>
          <View style={styles.cardIconContainer}>
            <FontAwesome5 name="heartbeat" size={22} color="#ef4444" />
          </View>
          <Text style={styles.cardTitulo}>Batimentos</Text>
          <Text style={styles.cardValor}>72 <Text style={styles.cardUnidade}>bpm</Text></Text>
          <View style={styles.cardStatus}>
            <View style={[styles.statusIndicator, {backgroundColor: '#10b981'}]} />
            <Text style={styles.cardInfo}>Normal</Text>
          </View>
        </View>

        {/* Card Oxigenação */}
        <View style={[styles.card, styles.cardElevated]}>
          <View style={styles.cardIconContainer}>
            <FontAwesome5 name="lungs" size={22} color="#3b82f6" />
          </View>
          <Text style={styles.cardTitulo}>Oxigenação</Text>
          <Text style={styles.cardValor}>{95 + Math.floor(Math.random() * 5)} <Text style={styles.cardUnidade}>%</Text></Text>
          <View style={styles.cardStatus}>
            <View style={[styles.statusIndicator, {backgroundColor: '#10b981'}]} />
            <Text style={styles.cardInfo}>Normal</Text>
          </View>
        </View>
      </View>

      
      {/* NAVEGAÇÃO */}
      <View style={styles.botoesContainer}>
        <View style={styles.botoesLinha}>
          <View style={styles.botaoWrapper}>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => setPagina("historico")}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="history" size={22} color="#ffffff" style={{ marginRight: 1 }} />
                <Text style={[styles.botaoTexto, {textAlign: 'center'}]}>Histórico de Quedas</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.botaoWrapper}>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => setPagina("contactos")}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="phone" size={22} color="#ffffff" style={{ marginRight: 1 }} />
                <Text style={[styles.botaoTexto, {textAlign: 'center'}]}>Contactos de Emergência</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
