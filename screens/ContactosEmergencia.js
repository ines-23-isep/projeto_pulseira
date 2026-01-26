import { ScrollView, View, Text, TouchableOpacity, TextInput, Modal } from "react-native";

export default function ContactosEmergencia({ 
  setPagina, 
  styles, 
  mensagemSucesso, 
  form, 
  setForm, 
  erros, 
  setErros, 
  contactos, 
  mostrarModalPais, 
  setMostrarModalPais, 
  codigoPais, 
  setCodigoPais, 
  codigosPais, 
  confirmarEliminacao, 
  setConfirmarEliminacao, 
  guardarContacto, 
  formatarTelemovel, 
  eliminarContacto 
}) {
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
                  onPress={() => setConfirmarEliminacao(c)}
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
