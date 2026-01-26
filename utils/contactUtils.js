// Lista de códigos de países com suas regras de validação
export const codigosPais = [
  { codigo: "+351", nome: "Portugal", bandeira: "🇵🇹", regex: /^9[1236]\d{7}$|^2\d{8}$|^800\d{6}$|^808\d{6}$/, digits: 9 },
  { codigo: "+34", nome: "Espanha", bandeira: "🇪🇸", regex: /^[6-7]\d{8}$/, digits: 9 },
  { codigo: "+33", nome: "França", bandeira: "🇫🇷", regex: /^[6-7]\d{8}$/, digits: 9 },
  { codigo: "+44", nome: "Reino Unido", bandeira: "🇬🇧", regex: /^7\d{9}$/, digits: 10 },
  { codigo: "+49", nome: "Alemanha", bandeira: "🇩🇪", regex: /^1[5-9]\d{8}$/, digits: 10 },
  { codigo: "+39", nome: "Itália", bandeira: "🇮🇹", regex: /^3\d{8,9}$/, digits: 9 },
];

export function validarTelemovel(telemovel, codigoPais) {
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

export function formatarTelemovel(texto, codigoPais) {
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

export function validarFormulario(form, codigoPais, contactos) {
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
  } else if (!validarTelemovel(form.telemovel, codigoPais)) {
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
  
  return novosErros;
}
