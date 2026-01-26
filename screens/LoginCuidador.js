import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from "react-native";

export default function LoginCuidador({ onRegistro, styles }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: ""
  });
  const [erros, setErros] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  function validarFormulario() {
    const novosErros = {};
    
    // Validação do nome
    if (!form.nome || !form.nome.trim()) {
      novosErros.nome = "Nome é obrigatório";
    } else if (form.nome.trim().length < 3) {
      novosErros.nome = "Nome deve ter pelo menos 3 caracteres";
    }
    
    // Validação do email
    if (!form.email || !form.email.trim()) {
      novosErros.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      novosErros.email = "Email inválido";
    }
    
    // Validação da password
    if (!form.password || !form.password.trim()) {
      novosErros.password = "Password é obrigatória";
    } else if (form.password.length < 6) {
      novosErros.password = "Password deve ter pelo menos 6 caracteres";
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit() {
    if (!validarFormulario()) return;
    
    setIsLoading(true);
    try {
      await onRegistro(form);
    } catch (error) {
      setErros({ geral: "Ocorreu um erro. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ padding: 20, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      
      <View style={styles.loginContainer}>
        {/* Cabeçalho */}
        <View style={styles.loginHeader}>
          <View style={styles.loginLogo}>
            <Text style={styles.loginLogoText}>👨‍⚕️</Text>
          </View>
          <Text style={styles.loginTitulo}>Registro do Cuidador</Text>
          <Text style={styles.loginSubtitulo}>
            Crie a sua conta para começar a monitorizar
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.loginForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome Completo</Text>
            <TextInput
              placeholder="O seu nome completo"
              style={[styles.input, erros.nome && styles.inputErro]}
              value={form.nome}
              onChangeText={(v) => {
                setForm({ ...form, nome: v });
                if (erros.nome) setErros({ ...erros, nome: "" });
              }}
              autoCapitalize="words"
            />
            {erros.nome && <Text style={styles.textoErro}>{erros.nome}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              placeholder="seu@email.com"
              style={[styles.input, erros.email && styles.inputErro]}
              value={form.email}
              onChangeText={(v) => {
                setForm({ ...form, email: v });
                if (erros.email) setErros({ ...erros, email: "" });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {erros.email && <Text style={styles.textoErro}>{erros.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              placeholder="Mínimo 6 caracteres"
              style={[styles.input, erros.password && styles.inputErro]}
              value={form.password}
              onChangeText={(v) => {
                setForm({ ...form, password: v });
                if (erros.password) setErros({ ...erros, password: "" });
              }}
              secureTextEntry
            />
            {erros.password && <Text style={styles.textoErro}>{erros.password}</Text>}
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
              {isLoading ? "A processar..." : "Criar Conta"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Informação */}
        <View style={styles.loginFooter}>
          <Text style={styles.loginFooterTexto}>
            Após o registro, irá preencher os dados do paciente
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
