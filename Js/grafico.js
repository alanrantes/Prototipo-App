let grafico1, grafico2;
let dadosAtuais = [];
let labelsAtuais = [];

function gerarGraficos() {
  const linha = document.getElementById("linha").value;
  const peca = document.getElementById("peca").value.trim();
  const periodo = document.getElementById("periodo").value;

  labelsAtuais = periodo === "diario"
    ? ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    : ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

  dadosAtuais = labelsAtuais.map(() => Math.floor(Math.random() * 500) + 100);

  const ctx1 = document.getElementById("grafico1").getContext("2d");
  const ctx2 = document.getElementById("grafico2").getContext("2d");

  if (grafico1) grafico1.destroy();
  if (grafico2) grafico2.destroy();

  grafico1 = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: labelsAtuais,
      datasets: [{
        label: `Produção ${periodo} - Linha ${linha}`,
        data: dadosAtuais,
        backgroundColor: "#000545",
        borderRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  grafico2 = new Chart(ctx2, {
    type: "line",
    data: {
      labels: labelsAtuais,
      datasets: [{
        label: `Peça ${peca || 'Todas'} - Linha ${linha}`,
        data: dadosAtuais.map(v => v - Math.floor(Math.random() * 100)),
        borderColor: "#000545",
        backgroundColor: "#dbe4ff",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  document.getElementById("prod-total").textContent = dadosAtuais.reduce((a,b) => a+b, 0);
  document.getElementById("pecas-dia").textContent = Math.floor(Math.random() * 50) + 10;
  document.getElementById("linhas-ativas").textContent = Math.floor(Math.random() * 3) + 1;
}

function exportarXLSX() {
  if (!labelsAtuais.length || !dadosAtuais.length) {
    alert("Gere os gráficos antes de exportar.");
    return;
  }

  const dadosParaExcel = [["Período", "Produção"]];
  for (let i = 0; i < labelsAtuais.length; i++) {
    dadosParaExcel.push([labelsAtuais[i], dadosAtuais[i]]);
  }

  const ws = XLSX.utils.aoa_to_sheet(dadosParaExcel);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Produção");

  XLSX.writeFile(wb, "dados_producao.xlsx");
}

function exportarPNG() {
  if (!grafico1 || !grafico2) {
    alert("Gere os gráficos antes de exportar.");
    return;
  }

  downloadCanvasImage('grafico1', 'grafico_producao_barra.png');
  setTimeout(() => {
    downloadCanvasImage('grafico2', 'grafico_pecas_linha.png');
  }, 1000);
}

function downloadCanvasImage(canvasId, filename) {
  const canvas = document.getElementById(canvasId);
  const link = document.createElement('a');
  link.download = filename;

  // Garantir fundo branco
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d');

  // fundo branco
  tempCtx.fillStyle = "#ffffff";
  tempCtx.fillRect(0, 0, w, h);

  // copiar o gráfico
  tempCtx.drawImage(canvas, 0, 0);

  tempCanvas.toBlob(function(blob) {
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  });
}
