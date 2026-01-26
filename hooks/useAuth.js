import { useState, useEffect } from "react";
import { ref, onValue, push, set, get } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [doente, setDoente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se já existe cuidador e doente
    const checkExistingData = async () => {
      try {
        // Verificar cuidador
        const cuidadorRef = ref(database, "cuidador");
        const cuidadorSnapshot = await get(cuidadorRef);
        
        if (cuidadorSnapshot.exists()) {
          const cuidadorData = cuidadorSnapshot.val();
          setUser(cuidadorData);
          
          // Verificar doente
          const doenteRef = ref(database, "doente");
          const doenteSnapshot = await get(doenteRef);
          
          if (doenteSnapshot.exists()) {
            setDoente(doenteSnapshot.val());
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
    const { email, password, nome } = form;
    const cuidadorRef = ref(database, "cuidador");

    // Verificar se já existe cuidador
    const snapshot = await get(cuidadorRef);
    
    if (snapshot.exists()) {
      throw new Error("Já existe um cuidador registado. Aceda diretamente à dashboard.");
    }

    // Registro de novo cuidador
    const cuidadorData = {
      email,
      password, // Em produção, usar hash
      nome,
      dataRegistro: new Date().toISOString(),
      id: push(cuidadorRef).key
    };

    await set(ref(database, `cuidador/${cuidadorData.id}`), cuidadorData);
    setUser(cuidadorData);
    return { success: true, needsDoente: true };
  }

  async function registrarDoente(form) {
    const doenteRef = ref(database, "doente");
    const doenteData = {
      ...form,
      idade: parseInt(form.idade),
      dataRegistro: new Date().toISOString(),
      cuidadorId: user.id
    };

    await set(doenteRef, doenteData);
    setDoente(doenteData);
    return { success: true };
  }

  function logout() {
    setUser(null);
    setDoente(null);
  }

  return {
    user,
    doente,
    isLoading,
    registrarCuidador,
    registrarDoente,
    logout
  };
}
