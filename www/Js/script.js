console.log("Script carregado!");

const menu = document.getElementById('menu-lateral');
const backdrop = document.getElementById('menu-backdrop');

function toggleMenu() {
    const isOpen = menu.classList.toggle('show');
    if (isOpen) {
        backdrop.classList.add('show');
    } else {
        backdrop.classList.remove('show');
    }
}

// Fecha menu ao clicar no backdrop
backdrop.addEventListener('click', () => {
    menu.classList.remove('show');
    backdrop.classList.remove('show');
});

// Botões de navegação
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn1").addEventListener("click", () => navegar("1"));
    document.getElementById("btn2").addEventListener("click", () => navegar("2"));
    document.getElementById("btn3").addEventListener("click", () => navegar("3"));
    document.getElementById("btn4").addEventListener("click", () => navegar("4"));

    // Fecha o menu ao clicar em algum link do menu lateral (opcional)
    document.querySelectorAll('.navbar-nav a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('show');
            backdrop.classList.remove('show');
        });
    });
});

// Função para navegar entre as páginas
function navegar(pagina) {
    switch (pagina) {
        case "1":
            window.location.href = "pagina.html";
            break;
        case "2":
            window.location.href = "pagina.html";
            break;
        case "3":
            window.location.href = "pagina.html";
            break;
        case "4":
            window.location.href = "pagina.html";
            break;
        default:
            console.error("Página não encontrada:", pagina);
    }
}
