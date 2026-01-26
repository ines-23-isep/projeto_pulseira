import { useState, useEffect } from "react";
import { ref, onValue, push, set, get } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [doente, setDoente] = useState(null);
  const [pulseira, setPulseira] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se já existe cuidador, doente e pulseira
    const checkExistingData = async () => {
      try {
        // Verificar cuidador
        const cuidadorRef = ref(database, "cuidador");
        const cuidadorSnapshot = await get(cuidadorRef);
        
        if (cuidadorSnapshot.exists()) {
          const cuidadorData = cuidadorSnapshot.val();
          console.log("Cuidador encontrado:", cuidadorData);
          // Firebase retorna um objeto com IDs como chaves, precisamos extrair o primeiro valor
          const cuidadorId = Object.keys(cuidadorData)[0];
          const cuidadorInfo = cuidadorData[cuidadorId];
          console.log("ID do cuidador:", cuidadorId);
          console.log("Info do cuidador:", cuidadorInfo);
          setUser({ ...cuidadorInfo, id: cuidadorId });
          
          // Verificar doente
          const doenteRef = ref(database, "doente");
          const doenteSnapshot = await get(doenteRef);
          
          if (doenteSnapshot.exists()) {
            const doenteData = doenteSnapshot.val();
            console.log("Doente encontrado:", doenteData);
            // Firebase retorna um objeto com IDs como chaves, precisamos extrair o primeiro valor
            const doenteId = Object.keys(doenteData)[0];
            const doenteInfo = doenteData[doenteId];
            console.log("ID do doente:", doenteId);
            console.log("Info do doente:", doenteInfo);
            setDoente({ ...doenteInfo, id: doenteId });
            
            // Verificar pulseira
            const pulseiraRef = ref(database, "pulseira");
            const pulseiraSnapshot = await get(pulseiraRef);
            
            if (pulseiraSnapshot.exists()) {
              const pulseiraData = pulseiraSnapshot.val();
              console.log("Pulseira encontrada:", pulseiraData);
              setPulseira(pulseiraData);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao verificar dados existentes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingData();
  }, []);

  async function registrarCuidador(form) {
    const { email, password, nome, telemovel, relacao } = form;
    const cuidadorRef = ref(database, "cuidador");

    // Verificar se já existe cuidador
    const snapshot = await get(cuidadorRef);
    
    if (snapshot.exists()) {
      throw new Error("Já existe um cuidador registado. Aceda diretamente à dashboard.");
    }

    // Registro de novo cuidador
    const cuidadorId = push(cuidadorRef).key;
    const cuidadorData = {
      email,
      password, // Em produção, usar hash
      nome,
      telemovel,
      relacao,
      dataRegistro: new Date().toISOString(),
      id: cuidadorId
    };

    await set(ref(database, `cuidador/${cuidadorId}`), cuidadorData);
    
    // Adicionar cuidador como contacto de emergência principal
    const contactoData = {
      nome: cuidadorData.nome,
      relacao: cuidadorData.relacao,
      telemovel: `+351 ${cuidadorData.telemovel.replace(/\s/g, '')}`,
      prioridade: 1, // Principal
      codigoPais: "+351",
      isCuidador: true
    };
    
    await set(ref(database, "contactos/pulseira001/cuidador_principal"), contactoData);
    
    setUser(cuidadorData);
    return { success: true, needsDoente: true };
  }

  async function registrarDoente(form) {
    const doenteRef = ref(database, "doente");
    const doenteId = push(doenteRef).key;
    const doenteData = {
      ...form,
      idade: parseInt(form.idade),
      dataRegistro: new Date().toISOString(),
      cuidadorId: user.id,
      id: doenteId
    };

    await set(ref(database, `doente/${doenteId}`), doenteData);
    setDoente(doenteData);
    return { success: true };
  }

  async function associarPulseira(form) {
    const { codigoPulseira, nomePulseira } = form;
    
    try {
      // Validar dados de entrada
      if (!codigoPulseira || !codigoPulseira.trim()) {
        throw new Error("Código da pulseira é obrigatório");
      }
      
      if (!nomePulseira || !nomePulseira.trim()) {
        throw new Error("Nome da pulseira é obrigatório");
      }

      // Verificar se já existe pulseira associada
      const pulseiraRef = ref(database, "pulseira");
      const snapshot = await get(pulseiraRef);
      
      if (snapshot.exists()) {
        const existingData = snapshot.val();
        console.log("Pulseira já existe:", existingData);
        throw new Error("Já existe uma pulseira associada. Código: " + existingData.codigo);
      }

      // Associar nova pulseira
      const pulseiraData = {
        codigo: codigoPulseira.toUpperCase().trim(),
        nome: nomePulseira.trim(),
        dataAssociacao: new Date().toISOString(),
        cuidadorId: user.id,
        doenteId: doente.id
      };

      console.log("A associar pulseira:", pulseiraData);
      
      await set(pulseiraRef, pulseiraData);
      setPulseira(pulseiraData);
      
      console.log("Pulseira associada com sucesso!");
      return { success: true };
    } catch (error) {
      console.error("Erro detalhado ao associar pulseira:", error);
      throw error;
    }
  }

  async function atualizarCuidador(form) {
    if (!user || !user.id) {
      throw new Error("Cuidador não encontrado");
    }

    const cuidadorData = {
      ...form,
      dataAtualizacao: new Date().toISOString(),
    };

    await set(ref(database, `cuidador/${user.id}`), cuidadorData);
    setUser({ ...cuidadorData, id: user.id });
    return { success: true };
  }

  async function atualizarDoente(form) {
    if (!doente || !doente.id) {
      throw new Error("Doente não encontrado");
    }

    const doenteData = {
      ...form,
      idade: parseInt(form.idade),
      dataAtualizacao: new Date().toISOString(),
      cuidadorId: user.id,
      id: doente.id
    };

    await set(ref(database, `doente/${doente.id}`), doenteData);
    setDoente(doenteData);
    return { success: true };
  }

  function logout() {
    setUser(null);
    setDoente(null);
    setPulseira(null);
  }

  return {
    user,
    doente,
    pulseira,
    isLoading,
    registrarCuidador,
    registrarDoente,
    associarPulseira,
    atualizarCuidador,
    atualizarDoente,
    logout
  };
}
