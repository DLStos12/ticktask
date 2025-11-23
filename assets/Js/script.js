import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
    import { 
      getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy 
    } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyArvcsxh_3dfARji17RW851Odl8BhkQ-fw",
      authDomain: "ticktask-dks.firebaseapp.com",
      projectId: "ticktask-dks",
      storageBucket: "ticktask-dks.appspot.com",
      messagingSenderId: "19968198294",
      appId: "1:19968198294:web:05e8e7ffed72d71eab64b7",
      measurementId: "G-F5434NN23L"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore(app);

    const inputTexto = document.getElementById("tarefa");
    const inputData = document.getElementById("data");
    const btnAdd = document.getElementById("btnAdd");
    const listaPendentes = document.getElementById("lista-pendentes");
    const listaConcluidas = document.getElementById("lista-concluidas");

    // Adicionar tarefa
    btnAdd.addEventListener("click", async () => {
      const texto = inputTexto.value.trim();
      const data = inputData.value;
      if (!texto) return;

      await addDoc(collection(db, "tarefas"), {
        texto,
        data,
        concluida: false,
        criadaEm: serverTimestamp()
      });

      inputTexto.value = "";
      inputData.value = "";
    });

    // Escuta em tempo real
    const q = query(collection(db, "tarefas"), orderBy("criadaEm", "asc"));
    onSnapshot(q, (snapshot) => {
      listaPendentes.innerHTML = "";
      listaConcluidas.innerHTML = "";

      snapshot.forEach((docSnap) => {
        const tarefa = docSnap.data();
        const li = document.createElement("li");

        if (!tarefa.concluida) {
          li.innerHTML = `
            <input type="checkbox" /> 
            ${tarefa.texto} - <small>${tarefa.data || ""}</small>
            <button class="btn-excluir">Excluir</button>
          `;

          // marcar como concluída
          li.querySelector("input[type='checkbox']").addEventListener("change", async () => {
            await updateDoc(doc(db, "tarefas", docSnap.id), { concluida: true });
          });

          // excluir pendente
          li.querySelector(".btn-excluir").addEventListener("click", async () => {
            await deleteDoc(doc(db, "tarefas", docSnap.id));
          });

          listaPendentes.appendChild(li);
        } else {
          li.innerHTML = `
            ${tarefa.texto} - ${tarefa.data || ""} 
            <button class="btn-excluir">Excluir</button>
          `;

          // excluir concluída
          li.querySelector(".btn-excluir").addEventListener("click", async () => {
            await deleteDoc(doc(db, "tarefas", docSnap.id));
          });

          listaConcluidas.appendChild(li);
        }
      });
    });