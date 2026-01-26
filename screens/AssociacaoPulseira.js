import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from "react-native";

export default function AssociacaoPulseira({ onAssociar, styles }) {
  const [form, setForm] = useState({
    codigoPulseira: "",
    nomePulseira: ""
  });
  const [erros, setErros] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  function validarFormulario() {
    const novosErros = {};
    
    // Validação do código da pulseira
    if (!form.codigoPulseira || !form.codigoPulseira.trim()) {
      novosErros.codigoPulseira = "Código da pulseira é obrigatório";
    } else if (form.codigoPulseira.trim().length < 4) {
      novosErros.codigoPulseira = "Código deve ter pelo menos 4 caracteres";
    }
    
    // Validação do nome da pulseira
    if (!form.nomePulseira || !form.nomePulseira.trim()) {
      novosErros.nomePulseira = "Nome da pulseira é obrigatório";
    } else if (form.nomePulseira.trim().length < 3) {
      novosErros.nomePulseira = "Nome deve ter pelo menos 3 caracteres";
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit() {
    if (!validarFormulario()) return;
    
    setIsLoading(true);
    try {
      await onAssociar(form);
    } catch (error) {
      setErros({ geral: "Ocorreu um erro ao associar a pulseira. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      
      <View style={styles.container}>
        <Text style={[styles.titulo, { marginBottom: 20 }]}>Associação da Pulseira</Text>
        <Text style={styles.subtitulo}>Conecte a pulseira ao sistema</Text>

        {/* Formulário */}
        <View style={styles.loginForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Código da Pulseira (ID)</Text>
            <TextInput
              placeholder="Digite o código da pulseira"
              style={[styles.input, erros.codigoPulseira && styles.inputErro]}
              value={form.codigoPulseira}
              onChangeText={(v) => {
                setForm({ ...form, codigoPulseira: v.toUpperCase() });
                if (erros.codigoPulseira) setErros({ ...erros, codigoPulseira: "" });
              }}
              autoCapitalize="characters"
              maxLength={20}
            />
            {erros.codigoPulseira && <Text style={styles.textoErro}>{erros.codigoPulseira}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome da Pulseira</Text>
            <TextInput
              placeholder="Ex: Pulseira do Avô Manuel"
              style={[styles.input, erros.nomePulseira && styles.inputErro]}
              value={form.nomePulseira}
              onChangeText={(v) => {
                setForm({ ...form, nomePulseira: v });
                if (erros.nomePulseira) setErros({ ...erros, nomePulseira: "" });
              }}
              autoCapitalize="words"
              maxLength={50}
            />
            {erros.nomePulseira && <Text style={styles.textoErro}>{erros.nomePulseira}</Text>}
          </View>

          {erros.geral && (
            <View style={styles.erroGeral}>
              <Text style={styles.erroGeralTexto}>{erros.geral}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginBotao, isLoading && styles.botaoDesativado]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.loginBotaoTexto}>
              {isLoading ? "A processar..." : "Associar Pulseira"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Informação */}
        <View style={styles.loginFooter}>
          <Text style={styles.loginFooterTexto}>
            O código da pulseira encontra-se na etiqueta do dispositivo
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
