import { ScrollView, View, Text, TouchableOpacity, StatusBar } from "react-native";
import { sendFakeMovement } from "../services/sendFakeMovement";
import { sendFakeAlert } from "../services/sendFakeAlert";

export default function Dashboard({ setPagina, styles, estado, corEstado, iconeEstado }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ padding: 20, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
        
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerTopo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View>
              <Text style={styles.saudacao}>Olá, Utilizador</Text>
              <Text style={styles.dataAtual}>{new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.botaoDefinicoesHeader}
            onPress={() => setPagina("definicoes")}
          >
            <Text style={styles.botaoDefinicoesHeaderTexto}>⚙️</Text>
          </TouchableOpacity>
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

      {/* NAVEGAÇÃO */}
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
              onPress={() => setPagina("contactos")}
            >
              <Text style={styles.botaoTexto}>📞 Contactos de Emergência</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
