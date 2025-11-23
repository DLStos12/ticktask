function adicionarTarefa() {
  const texto = document.getElementById("tarefa").value;
  const data = document.getElementById("data").value;

  if (texto.trim() === "") return;

  const tarefa = { texto, data, concluida: false };

  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas.push(tarefa);

  localStorage.setItem("tarefas", JSON.stringify(tarefas));

  renderizarTarefas();

  document.getElementById("tarefa").value = "";
  document.getElementById("data").value = "";
}

function concluirTarefa(index) {
  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas[index].concluida = true;
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  renderizarTarefas();
}

function excluirTarefa(index) {
  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas.splice(index, 1); // remove a tarefa pelo índice
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  renderizarTarefas();
}

function renderizarTarefas() {
  const pendentes = document.getElementById("lista-pendentes");
  const concluidas = document.getElementById("lista-concluidas");
  pendentes.innerHTML = "";
  concluidas.innerHTML = "";

  let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

  tarefas.forEach((tarefa, index) => {
    const li = document.createElement("li");

    if (!tarefa.concluida) {
      li.innerHTML = `
        <input type="checkbox" onchange="concluirTarefa(${index})">
        ${tarefa.texto} - <small>${tarefa.data}</small>
        <button onclick="excluirTarefa(${index})">Excluir</button>
      `;
      pendentes.appendChild(li);
    } else {
      li.innerHTML = `
        ${tarefa.texto} - <small>${tarefa.data}</small>
        <button onclick="excluirTarefa(${index})">Excluir</button>
      `;
      concluidas.appendChild(li);
    }
  });
}

window.onload = function() {
  renderizarTarefas();
  document.getElementById("btnAdd").addEventListener("click", adicionarTarefa);
};
