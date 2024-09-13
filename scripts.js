const input = document.getElementById('input-busca');

function botaoDeBusca() {
  const inputValue = input.value;

  movimentoInput();
}

function fecharInput() {
  input.style.visibility = "hidden";
  input.style.width = "40px";
  input.style.padding =
    "0.5rem 0.5rem 0.5rem 2.6rem";
  input.style.transition =
    "all 0.5s ease-in-out 0s";
  input.value = "";
}

function abrirInput() {
  input.style.visibility = "visible";
  input.style.width = "300px";
  input.style.padding =
    "0.5rem 0.5rem 0.5rem 3.1rem";
  input.style.transition =
    "all 0.5s ease-in-out 0s";
  input.value = "";
}

function movimentoInput() {
  const visibility = input.style.visibility;

  visibility === 'hidden' ? abrirInput() : fecharInput();
}

document.addEventListener("DOMContentLoaded", () => {
  fecharInput();
});
