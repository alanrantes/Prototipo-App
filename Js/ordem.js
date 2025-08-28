let ordens = [];
let editIndex = null;

function gerarCodigoOrdem() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";
  let codigo = "OS-";
  for (let i = 0; i < 2; i++) {
    codigo += letras.charAt(Math.floor(Math.random() * letras.length));
  }
  for (let i = 0; i < 3; i++) {
    codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
  }
  return codigo;
}

function abrirModalCriar() {
  editIndex = null;
  document.getElementById("modalTitulo").textContent = "Nova Ordem";
  document.getElementById("problema").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("prioridade").value = "Média";
  document.getElementById("status").value = "Aberta";
  document.getElementById("modalOrdem").style.display = "flex";
}

function fecharModal(id) {
  document.getElementById(id).style.display = "none";
}

function salvarOrdem() {
  const problema = document.getElementById("problema").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const prioridade = document.getElementById("prioridade").value;
  const status = document.getElementById("status").value;

  if (!problema || !descricao) {
    alert("Preencha todos os campos!");
    return;
  }

  if (editIndex !== null) {
    // Editar ordem existente
    ordens[editIndex].problema = problema;
    ordens[editIndex].descricao = descricao;
    ordens[editIndex].prioridade = prioridade;
    ordens[editIndex].status = status;
  } else {
    // Criar nova ordem com código gerado
    const codigo = gerarCodigoOrdem();
    ordens.push({ codigo, problema, descricao, prioridade, status });
  }

  fecharModal("modalOrdem");
  renderOrdens();
}

function filtrarOrdens() {
  renderOrdens();
}

function renderOrdens() {
  const lista = document.getElementById("listaOrdens");
  lista.innerHTML = "";

  const filtroCodigo = document.getElementById("filtroCodigo").value.toLowerCase();

  ordens
    .filter(o =>
      !filtroCodigo ||
      o.codigo.toLowerCase().includes(filtroCodigo) ||
      o.descricao.toLowerCase().includes(filtroCodigo)
    )
    .forEach((ordem, index) => {
      const statusClass = ordem.status.replace(/\s/g, '-');
      const card = document.createElement("div");
      card.className = "ordem-card";
      card.innerHTML = `
        <div><strong>Código:</strong> ${ordem.codigo}</div>
        <div class="problema"><strong>Problema:</strong> ${ordem.problema}</div>
        <div><strong>Descrição:</strong> ${ordem.descricao}</div>
        <div><strong>Prioridade:</strong> ${ordem.prioridade}</div>
        <div class="status ${statusClass}">${ordem.status}</div>
        <button onclick="editarOrdem(${index})">Editar</button>
      `;
      lista.appendChild(card);
    });
}

function editarOrdem(index) {
  editIndex = index;
  const ordem = ordens[index];
  document.getElementById("modalTitulo").textContent = "Editar Ordem";
  document.getElementById("problema").value = ordem.problema;
  document.getElementById("descricao").value = ordem.descricao;
  document.getElementById("prioridade").value = ordem.prioridade;
  document.getElementById("status").value = ordem.status;
  document.getElementById("modalOrdem").style.display = "flex";
}
