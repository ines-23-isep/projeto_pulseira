import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ref, onValue, push, set, update } from "firebase/database";
import { database } from "./firebase/firebaseConfig";
import { sendFakeMovement } from "./services/sendFakeMovement";
import { sendFakeAlert } from "./services/sendFakeAlert";
import { TextInput } from "react-native";




export default function App() {
  const [pagina, setPagina] = useState("dashboard");
  const [historicoMovimentos, setHistoricoMovimentos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nome: "",
    relacao: "",
    telemovel: "",
    prioridade: "",
  });
  const [confirmarEliminacao, setConfirmarEliminacao] = useState(null);
  const [erros, setErros] = useState({});
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [codigoPais, setCodigoPais] = useState("+351");
  const [mostrarModalPais, setMostrarModalPais] = useState(false);



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
useEffect(() => {
  const refAlertas = ref(database, "alertas/pulseira001");

  onValue(refAlertas, (snapshot) => {
    const dados = snapshot.val();

    if (dados) {
      const lista = Object.keys(dados).map((key) => ({
        id: key,
        ...dados[key],
      }));

      setAlertas(lista.reverse());
    }
  });
}, []);
useEffect(() => {
  const refContactos = ref(database, "contactos/pulseira001");

  onValue(refContactos, (snapshot) => {
    const dados = snapshot.val();

    if (dados) {
      const lista = Object.keys(dados).map((id) => ({
        id,
        ...dados[id],
      }));

      setContactos(lista.sort((a, b) => a.prioridade - b.prioridade));
    } else {
      setContactos([]);
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
  function guardarContacto() {
  if (!validarFormulario()) return;

  const baseRef = ref(database, "contactos/pulseira001");
  const dadosContacto = {
    nome: form.nome ? form.nome.trim() : "",
    relacao: form.relacao ? form.relacao.trim() : "",
    telemovel: form.telemovel ? `${codigoPais} ${form.telemovel.replace(/\s/g, '')}` : "", // Inclui código do país
    prioridade: parseInt(String(form.prioridade).trim()), // Converte para número
    codigoPais: codigoPais, // Guarda o código do país
  };

  if (form.id) {
    update(ref(database, `contactos/pulseira001/${form.id}`), dadosContacto);
    mostrarMensagemSucesso("✅ Contacto atualizado com sucesso!");
  } else {
    const novo = push(baseRef);
    set(novo, dadosContacto);
    mostrarMensagemSucesso("✅ Contacto adicionado com sucesso!");
  }

  // Limpar formulário e erros
  setForm({ id: null, nome: "", relacao: "", telemovel: "", prioridade: "" });
  setErros({});
}

function eliminarContacto(id) {
  const refContacto = ref(database, `contactos/pulseira001/${id}`);
  set(refContacto, null);
  setConfirmarEliminacao(null);
  mostrarMensagemSucesso("🗑️ Contacto eliminado com sucesso!");
}

function mostrarConfirmacaoEliminacao(contacto) {
  setConfirmarEliminacao(contacto);
}

// Lista de códigos de países com suas regras de validação
const codigosPais = [
  { codigo: "+351", nome: "Portugal", bandeira: "🇵🇹", regex: /^9[1236]\d{7}$|^2\d{8}$|^800\d{6}$|^808\d{6}$/, digits: 9 },
  { codigo: "+34", nome: "Espanha", bandeira: "🇪🇸", regex: /^[6-7]\d{8}$/, digits: 9 },
  { codigo: "+33", nome: "França", bandeira: "🇫🇷", regex: /^[6-7]\d{8}$/, digits: 9 },
  { codigo: "+44", nome: "Reino Unido", bandeira: "🇬🇧", regex: /^7\d{9}$/, digits: 10 },
  { codigo: "+49", nome: "Alemanha", bandeira: "🇩🇪", regex: /^1[5-9]\d{8}$/, digits: 10 },
  { codigo: "+39", nome: "Itália", bandeira: "🇮🇹", regex: /^3\d{8,9}$/, digits: 9 },
];

function validarTelemovel(telemovel) {
  // Remove espaços e caracteres especiais
  const limpo = telemovel.replace(/\s/g, '').replace(/-/g, '');
  
  // Encontra o país selecionado
  const pais = codigosPais.find(p => p.codigo === codigoPais);
  if (!pais) return false;
  
  // Verifica se tem o número correto de dígitos
  if (limpo.length !== pais.digits) return false;
  
  // Valida com o regex do país
  return pais.regex.test(limpo);
}

function validarFormulario() {
  const novosErros = {};
  
  // Validação do nome
  if (!form.nome || !form.nome.trim()) {
    novosErros.nome = "Nome é obrigatório";
  } else if (form.nome.trim().length < 3) {
    novosErros.nome = "Nome deve ter pelo menos 3 caracteres";
  } else if (form.nome.trim().length > 50) {
    novosErros.nome = "Nome não pode ter mais de 50 caracteres";
  }
  
  // Validação do telemóvel
  if (!form.telemovel || !form.telemovel.trim()) {
    novosErros.telemovel = "Telemóvel é obrigatório";
  } else if (!validarTelemovel(form.telemovel)) {
    novosErros.telemovel = "Formato de telemóvel inválido. Use: 9xx xxx xxx";
  }
  
  // Validação da relação
  if (!form.relacao || !form.relacao.trim()) {
    novosErros.relacao = "Relação é obrigatória";
  } else if (form.relacao.trim().length > 30) {
    novosErros.relacao = "Relação não pode ter mais de 30 caracteres";
  }
  
  // Validação da prioridade
  if (!form.prioridade) {
    novosErros.prioridade = "Prioridade é obrigatória";
  } else {
    // Converte para string se for número
    const prioridadeStr = String(form.prioridade).trim();
    const prioridadeNum = parseInt(prioridadeStr);
    
    if (isNaN(prioridadeNum) || prioridadeNum < 1) {
      novosErros.prioridade = "Prioridade deve ser um número positivo";
    } else if (prioridadeNum > 99) {
      novosErros.prioridade = "Prioridade não pode ser maior que 99";
    } else {
      // Verificar duplicação de prioridade (apenas para novos contactos)
      const existePrioridade = contactos.some(c => 
        c.prioridade === prioridadeNum && c.id !== form.id
      );
      if (existePrioridade) {
        novosErros.prioridade = `Já existe um contacto com prioridade ${prioridadeNum}`;
      }
    }
  }
  
  setErros(novosErros);
  return Object.keys(novosErros).length === 0;
}

function formatarTelemovel(texto) {
  // Remove caracteres não numéricos
  const numeros = texto.replace(/\D/g, '');
  
  // Encontra o país selecionado para limitar dígitos
  const pais = codigosPais.find(p => p.codigo === codigoPais);
  const maxDigitos = pais ? pais.digits : 9;
  
  // Limita ao número de dígitos do país
  const limitado = numeros.slice(0, maxDigitos);
  
  // Formatação para Portugal (9 dígitos): 9xx xxx xxx
  if (codigoPais === "+351" && maxDigitos === 9) {
    if (limitado.length <= 3) return limitado;
    if (limitado.length <= 6) return `${limitado.slice(0, 3)} ${limitado.slice(3)}`;
    return `${limitado.slice(0, 3)} ${limitado.slice(3, 6)} ${limitado.slice(6)}`;
  }
  
  // Formatação para Espanha/França/Itália (9 dígitos): xxx xxx xxx
  if (maxDigitos === 9) {
    if (limitado.length <= 3) return limitado;
    if (limitado.length <= 6) return `${limitado.slice(0, 3)} ${limitado.slice(3)}`;
    return `${limitado.slice(0, 3)} ${limitado.slice(3, 6)} ${limitado.slice(6)}`;
  }
  
  // Formatação para Reino Unido/Alemanha (10 dígitos): xxxx xxx xxx
  if (maxDigitos === 10) {
    if (limitado.length <= 4) return limitado;
    if (limitado.length <= 7) return `${limitado.slice(0, 4)} ${limitado.slice(4)}`;
    return `${limitado.slice(0, 4)} ${limitado.slice(4, 7)} ${limitado.slice(7)}`;
  }
  
  return limitado;
}

function mostrarMensagemSucesso(texto) {
  setMensagemSucesso(texto);
  setTimeout(() => setMensagemSucesso(""), 3000);
}


  // ---------------- DASHBOARD ----------------
  if (pagina === "dashboard") {
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
  // ---------------- ALERTAS ----------------
  if (pagina === "alertas") {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, width: '100%' }}>
          <View style={[styles.header, { marginBottom: 15 }]}>
            <Text style={[styles.titulo, { fontSize: 28 }]}>Alertas</Text>
            <Text style={styles.subtitulo}>Histórico de notificações e alertas</Text>
          </View>

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

  // ---------------- HISTÓRICO ----------------
  if (pagina === "historico") {
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

  // ---------------- CONTACTOS DE EMERGÊNCIA ----------------
  if (pagina === "contactos") {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
    >
      <View style={styles.header}>
        <Text style={styles.titulo}>Contactos de Emergência</Text>
        <Text style={styles.subtitulo}>Quem será avisado primeiro</Text>
      </View>

      {/* MENSAGEM DE SUCESSO */}
      {mensagemSucesso && (
        <View style={styles.mensagemSucesso}>
          <Text style={styles.mensagemSucessoTexto}>{mensagemSucesso}</Text>
        </View>
      )}

      {/* FORMULÁRIO */}
      <View style={[styles.cardElevated, styles.formularioCard]}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitulo}>
            {form.id ? "✏️ Editar Contacto" : "➕ Novo Contacto"}
          </Text>
          {form.id && (
            <TouchableOpacity 
              style={styles.botaoLimpar}
              onPress={() => {
                setForm({ id: null, nome: "", relacao: "", telemovel: "", prioridade: "" });
                setErros({});
              }}
            >
              <Text style={styles.botaoLimparTexto}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nome Completo</Text>
          <TextInput
            placeholder="Ex: João Silva"
            style={[styles.input, erros.nome && styles.inputErro]}
            value={form.nome}
            onChangeText={(v) => {
              setForm({ ...form, nome: v });
              if (erros.nome) setErros({ ...erros, nome: "" });
            }}
          />
          {erros.nome && <Text style={styles.textoErro}>{erros.nome}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Relação</Text>
          <TextInput
            placeholder="Ex: Filho, Esposa, Amigo"
            style={[styles.input, erros.relacao && styles.inputErro]}
            value={form.relacao}
            onChangeText={(v) => {
              setForm({ ...form, relacao: v });
              if (erros.relacao) setErros({ ...erros, relacao: "" });
            }}
          />
          {erros.relacao && <Text style={styles.textoErro}>{erros.relacao}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Telemóvel</Text>
          <View style={[styles.phoneInputContainer, erros.telemovel && styles.phoneInputContainerErro]}>
            <TouchableOpacity
              style={styles.codigoPaisButton}
              onPress={() => {
                setMostrarModalPais(true);
              }}
            >
              <Text style={styles.codigoPaisTexto}>
                {codigosPais.find(p => p.codigo === codigoPais)?.bandeira || "🇵🇹"} {codigoPais}
              </Text>
              <Text style={styles.codigoPaisSeta}>▼</Text>
            </TouchableOpacity>
            <TextInput
              placeholder={codigosPais.find(p => p.codigo === codigoPais)?.digits === 10 ? "xxxx xxx xxx" : "9xx xxx xxx"}
              keyboardType="phone-pad"
              style={[styles.input, styles.phoneInput, erros.telemovel && styles.inputErro]}
              value={form.telemovel}
              onChangeText={(v) => {
                const formatado = formatarTelemovel(v);
                setForm({ ...form, telemovel: formatado });
                if (erros.telemovel) setErros({ ...erros, telemovel: "" });
              }}
              maxLength={codigosPais.find(p => p.codigo === codigoPais)?.digits === 10 ? 13 : 12}
            />
          </View>
          {erros.telemovel && <Text style={styles.textoErro}>{erros.telemovel}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Prioridade</Text>
          <View style={styles.priorityContainer}>
            <TextInput
              placeholder="1"
              keyboardType="numeric"
              style={[styles.input, styles.priorityInput, erros.prioridade && styles.inputErro]}
              value={form.prioridade}
              onChangeText={(v) => {
                setForm({ ...form, prioridade: v });
                if (erros.prioridade) setErros({ ...erros, prioridade: "" });
              }}
              maxLength={2}
            />
            <Text style={styles.priorityHint}>1 = primeiro a ser avisado</Text>
          </View>
          {erros.prioridade && <Text style={styles.textoErro}>{erros.prioridade}</Text>}
        </View>

        <TouchableOpacity 
          style={[styles.botao, styles.botaoPrimario, (!form.nome || !form.telemovel || !form.prioridade) && styles.botaoDesativado]} 
          onPress={guardarContacto}
          disabled={!form.nome || !form.telemovel || !form.prioridade}
        >
          <Text style={styles.botaoTexto}>
            {form.id ? "💾 Atualizar" : "💾 Adicionar Contacto"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA DE CONTACTOS */}
      <View style={styles.listaHeader}>
        <Text style={styles.listaTitulo}>Contactos Registados</Text>
        <Text style={styles.listaContador}>{contactos.length} contacto{contactos.length !== 1 ? 's' : ''}</Text>
      </View>

      {contactos.length === 0 ? (
        <View style={styles.semContactosContainer}>
          <Text style={styles.semContactosIcon}>📞</Text>
          <Text style={styles.semContactosTexto}>Ainda não tem contactos</Text>
          <Text style={styles.semContactosSubtexto}>Adicione pelo menos um contacto de emergência</Text>
        </View>
      ) : (
        <View style={styles.contactosLista}>
          {contactos.map((c, index) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.cardContacto, index === 0 && styles.primeiroContacto]}
              onPress={() => {
                const formularioEditado = {
                  ...c,
                  telemovel: formatarTelemovel(c.telemovel), // Formata ao editar
                  prioridade: String(c.prioridade) // Converte para string
                };
                setForm(formularioEditado);
                setErros({});
              }}
            >
              <View style={styles.contactoHeader}>
                <View style={styles.prioridadeBadge}>
                  <Text style={styles.prioridadeTexto}>{c.prioridade}</Text>
                </View>
                {index === 0 && (
                  <View style={styles.primeiroBadge}>
                    <Text style={styles.primeiroTexto}>Principal</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.contactoInfo}>
                <Text style={styles.contactoNome}>{c.nome}</Text>
                <Text style={styles.contactoRelacao}>{c.relacao}</Text>
                <Text style={styles.contactoTelemovel}>📱 {c.telemovel}</Text>
              </View>
              
              <View style={styles.contactoBotoes}>
                <TouchableOpacity
                  style={styles.botaoEditar}
                  onPress={() => {
                    const formularioEditado = {
                      ...c,
                      telemovel: formatarTelemovel(c.telemovel), // Formata ao editar
                      prioridade: String(c.prioridade) // Converte para string
                    };
                    setForm(formularioEditado);
                    setErros({});
                  }}
                >
                  <Text style={styles.botaoEditarTexto}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botaoEliminar}
                  onPress={() => mostrarConfirmacaoEliminacao(c)}
                >
                  <Text style={styles.botaoEliminarTexto}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* MODAL DE SELEÇÃO DE PAÍS */}
      <Modal
        visible={mostrarModalPais}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMostrarModalPais(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Selecionar País</Text>
              <TouchableOpacity
                style={styles.modalFechar}
                onPress={() => setMostrarModalPais(false)}
              >
                <Text style={styles.modalFecharTexto}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.paisesLista}>
              {codigosPais.map((pais) => (
                <TouchableOpacity
                  key={pais.codigo}
                  style={[
                    styles.paisItem,
                    codigoPais === pais.codigo && styles.paisItemSelecionado
                  ]}
                  onPress={() => {
                    setCodigoPais(pais.codigo);
                    setMostrarModalPais(false);
                    // Limpa o telemóvel atual ao mudar de país
                    setForm({ ...form, telemovel: "" });
                    setErros({ ...erros, telemovel: "" });
                  }}
                >
                  <View style={styles.paisInfo}>
                    <Text style={styles.paisBandeira}>{pais.bandeira}</Text>
                    <View style={styles.paisDetalhes}>
                      <Text style={styles.paisNome}>{pais.nome}</Text>
                      <Text style={styles.paisCodigo}>{pais.codigo}</Text>
                    </View>
                  </View>
                  {codigoPais === pais.codigo && (
                    <Text style={styles.paisSelecionado}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => setPagina("dashboard")}
      >
        <Text style={styles.botaoVoltarTexto}>← Voltar ao Painel</Text>
      </TouchableOpacity>

      {/* DIÁLOGO DE CONFIRMAÇÃO DE ELIMINAÇÃO */}
      {confirmarEliminacao && (
        <View style={styles.dialogoOverlay}>
          <View style={styles.dialogoContainer}>
            <View style={styles.dialogoHeader}>
              <Text style={styles.dialogoIcon}>⚠️</Text>
              <Text style={styles.dialogoTitulo}>Confirmar Eliminação</Text>
            </View>
            
            <View style={styles.dialogoContent}>
              <Text style={styles.dialogoTexto}>
                Tem a certeza que pretende eliminar o contacto:
              </Text>
              <View style={styles.dialogoContacto}>
                <Text style={styles.dialogoContactoNome}>{confirmarEliminacao.nome}</Text>
                <Text style={styles.dialogoContactoDetalhes}>
                  {confirmarEliminacao.relacao} • 📱 {confirmarEliminacao.telemovel}
                </Text>
              </View>
              <Text style={styles.dialogoAviso}>
                Esta ação não pode ser desfeita.
              </Text>
            </View>
            
            <View style={styles.dialogoBotoes}>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => setConfirmarEliminacao(null)}
              >
                <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoConfirmarEliminar}
                onPress={() => eliminarContacto(confirmarEliminacao.id)}
              >
                <Text style={styles.botaoConfirmarEliminarTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
  }

  // ---------------- DEFINIÇÕES ----------------
  if (pagina === "definicoes") {
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

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 25,
  },
  headerTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
  },
  botaoDefinicoesHeader: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  botaoDefinicoesHeaderTexto: {
    fontSize: 20,
  },
  saudacao: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 2,
  },
  dataAtual: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  titulo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 6,
    lineHeight: 34,
  },
  subtitulo: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 5,
  },

  // ESTADO
  estadoCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    backgroundColor: "#4f46e5",
  },
  estadoIconeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  estadoIcone: {
    fontSize: 28,
    color: "#ffffff",
  },
  estadoDetalhes: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  estadoDetalhesTexto: {
    color: '#e0e7ff',
    fontSize: 12,
    fontWeight: '500',
  },
  estadoTexto: {
    color: "#e0e7ff",
    fontSize: 16,
    marginTop: 5,
    fontWeight: "500",
  },
  estadoValor: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 5,
  },

  // CARDS
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    width: "48%",
    position: 'relative',
    overflow: 'hidden',
  },
  cardElevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitulo: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  cardValor: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 4,
  },
  cardUnidade: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: '500',
  },
  cardInfo: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 2,
  },
  cardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  // BOTÕES
  botoesContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  botoesLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  botaoWrapper: {
    width: '48%',
  },
  botao: {
    backgroundColor: "#4f46e5",
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  botaoSecundario: {
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  botaoTexto: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  botaoSecundarioTexto: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 16,
  },
  
  // Botões de Simulação
  simulacaoContainer: {
    marginTop: 20,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  simulacaoTitulo: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  botoesSimulacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoSimulacao: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoSimulacaoTexto: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  botaoTextoSec: {
    color: "#111827",
    fontWeight: "bold",
  },

  // ESTILOS PARA SEM DADOS
  semDadosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginTop: 20,
  },
  semDadosTexto: {
    color: '#64748b',
    fontSize: 16,
    textAlign: 'center',
  },

  // ESTILOS DE ALERTA
  cardAlerta: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  cabecalhoAlerta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tipoAlerta: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  estadoAlerta: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#fffbeb',
  },
  infoAlerta: {
    marginBottom: 8,
  },
  rotuloAlerta: {
    fontWeight: '600',
    color: '#475569',
  },
  textoAlerta: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 4,
  },
  horaAlerta: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'right',
    marginTop: 4,
  },

  // HISTÓRICO
  cardHistorico: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  historicoTexto: {
    flex: 1,
    fontSize: 15,
    color: "#334155",
    fontWeight: "500",
  },
  historicoHora: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
    marginLeft: 10,
  },

  botaoVoltar: {
    backgroundColor: "#4f46e5",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  botaoVoltarTexto: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },

  // ESTILOS DOS CONTACTOS DE EMERGÊNCIA
  formularioCard: {
    padding: 25,
    marginBottom: 25,
  },
  mensagemSucesso: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mensagemSucessoTexto: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  formTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  botaoLimpar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  botaoLimparTexto: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1.5,
  },
  inputErro: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  textoErro: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInputContainerErro: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
    borderWidth: 1.5,
    borderRadius: 12,
  },
  phonePrefix: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 8,
    fontWeight: '500',
  },
  codigoPaisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  codigoPaisTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 4,
  },
  codigoPaisSeta: {
    fontSize: 12,
    color: '#6b7280',
  },
  phoneInput: {
    flex: 1,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityInput: {
    width: 80,
    marginRight: 12,
  },
  priorityHint: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  botaoPrimario: {
    marginTop: 10,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  botaoDesativado: {
    backgroundColor: '#d1d5db',
    shadowColor: 'transparent',
    elevation: 0,
  },
  listaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listaTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  listaContador: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  semContactosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    borderStyle: 'dashed',
  },
  semContactosIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  semContactosTexto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  semContactosSubtexto: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  contactosLista: {
    gap: 12,
  },
  cardContacto: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  primeiroContacto: {
    borderColor: '#10b981',
    borderWidth: 2,
    backgroundColor: '#f0fdf4',
  },
  contactoHeader: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },
  prioridadeBadge: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  prioridadeTexto: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  primeiroBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primeiroTexto: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  contactoInfo: {
    flex: 1,
  },
  contactoNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  contactoRelacao: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  contactoTelemovel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  botaoEditar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoEditarTexto: {
    fontSize: 16,
  },
  contactoBotoes: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 15,
  },
  botaoEliminar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoEliminarTexto: {
    fontSize: 16,
  },

  // ESTILOS DO DIÁLOGO DE CONFIRMAÇÃO
  dialogoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialogoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  dialogoHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dialogoIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  dialogoTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  dialogoContent: {
    marginBottom: 25,
  },
  dialogoTexto: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  dialogoContacto: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  dialogoContactoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 5,
  },
  dialogoContactoDetalhes: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  dialogoAviso: {
    fontSize: 13,
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: '500',
  },
  dialogoBotoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoCancelar: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  botaoCancelarTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  botaoConfirmarEliminar: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  botaoConfirmarEliminarTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  // ESTILOS DO MODAL DE SELEÇÃO DE PAÍS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '90%',
    height: '60%',
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  modalFechar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFecharTexto: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  paisesLista: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  paisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  paisItemSelecionado: {
    backgroundColor: '#f0f9ff',
  },
  paisInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paisBandeira: {
    fontSize: 24,
    marginRight: 12,
  },
  paisDetalhes: {
    flex: 1,
  },
  paisNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  paisCodigo: {
    fontSize: 14,
    color: '#6b7280',
  },
  paisSelecionado: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '700',
  },

  // ESTILOS DA PÁGINA DE DEFINIÇÕES
  definicoesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  definicoesVazio: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 10,
  },
  definicoesSubtexto: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
