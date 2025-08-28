let ocorrencias = [];
let editIndex = null;

function gerarCodigoOcorrencia() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";
  let codigo = "OC-";
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
  document.getElementById("modalTitulo").textContent = "Nova Ocorrência";
  document.getElementById("codigo").value = gerarCodigoOcorrencia();
  document.getElementById("galpao").value = "";
  document.getElementById("area").value = "";
  document.getElementById("registro").value = "";
  document.getElementById("ute").value = "";
  document.getElementById("relato").value = "";
  document.getElementById("modalOcorrencia").style.display = "flex";
}

function fecharModal(id) {
  document.getElementById(id).style.display = "none";
}

function salvarOcorrencia() {
  const codigo = document.getElementById("codigo").value.trim();
  const galpao = document.getElementById("galpao").value.trim();
  const area = document.getElementById("area").value.trim();
  const registro = document.getElementById("registro").value.trim();
  const ute = document.getElementById("ute").value.trim();
  const relato = document.getElementById("relato").value.trim();

  if (!galpao || !area || !registro || !ute || !relato) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  const ocorrencia = { codigo, galpao, area, registro, ute, relato };

  if (editIndex !== null) {
    ocorrencias[editIndex] = ocorrencia;
  } else {
    ocorrencias.push(ocorrencia);
  }

  fecharModal("modalOcorrencia");
  renderOcorrencias();
}

function filtrarOcorrencias() {
  renderOcorrencias();
}

function renderOcorrencias() {
  const lista = document.getElementById("listaOcorrencias");
  lista.innerHTML = "";

  const filtroCodigo = document.getElementById("filtroCodigo").value.trim().toUpperCase();
  const filtroGalpao = document.getElementById("filtroGalpao").value.trim();

  const filtradas = ocorrencias.filter(o => {
    const codigoOk = !filtroCodigo || o.codigo.toUpperCase().includes(filtroCodigo);
    const galpaoOk = !filtroGalpao || o.galpao.includes(filtroGalpao);
    return codigoOk && galpaoOk;
  });

  if (filtradas.length === 0) {
    lista.innerHTML = `<p style="text-align:center; color:#777; margin-top:20px;">Nenhuma ocorrência encontrada.</p>`;
    return;
  }

  filtradas.forEach((o, index) => {
    const card = document.createElement("div");
    card.className = "ocorrencia-card";
    card.innerHTML = `
      <div><strong>Código:</strong> ${o.codigo}</div>
      <div><strong>Galpão:</strong> ${o.galpao}</div>
      <div><strong>Área:</strong> ${o.area}</div>
      <div><strong>Registro:</strong> ${o.registro}</div>
      <div><strong>UTE:</strong> ${o.ute}</div>
      <div><strong>Relato:</strong> ${o.relato}</div>
      <button class="btn-excluir" onclick="excluirOcorrencia(${index})">Excluir</button>
    `;
    lista.appendChild(card);
  });
}

function excluirOcorrencia(index) {
  if (confirm("Tem certeza que deseja excluir esta ocorrência?")) {
    ocorrencias.splice(index, 1);
    renderOcorrencias();
  }
}

// Inicializa a lista
document.addEventListener("DOMContentLoaded", () => {
  renderOcorrencias();
});
