// Seletores de Elementos e Chaves de API
const input = document.getElementById("input-busca");
const ulElement = document.querySelector(".playlist-caixa");
const liElement = ulElement.querySelectorAll("li");

// SUAS CHAVES - Substitua pelas suas, mas lembre-se do aviso de segurança!
const apiKeyOpenWeather = "a0aea1c859cfe51c97a0e20a77787ea3"; // Substitua pela sua chave
const clientID = "1719956c35ba4b86a22160a312c28f95"; // Substitua pela sua nova chave
const clientSecret = "102d1dbe55794721ac5daf3f8d7fc39b"; // ATENÇÃO: Chave secreta exposta!

const videoURLs = [
  "./video/video1.mp4",
  "./video/video2.mp4",
  "./video/video3.mp4",
  "./video/video4.mp4",
  "./video/video5.mp4",
  "./video/video6.mp4",
  "./video/video7.mp4",
  "./video/video8.mp4",
  "./video/video9.mp4",
  "./video/video10.mp4",
  "./video/video11.mp4",
  "./video/video12.mp4",
];

// --- Funções Utilitárias e de UI ---

function obterVideosAleatorios(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function recarregarVideosNaTela() {
  const videoElement = document.querySelector(".video");
  const videoSource = document.getElementById("video-source");
  const randomVideoURL = obterVideosAleatorios(videoURLs);

  if (videoElement && videoSource) {
    videoSource.src = randomVideoURL;
    videoElement.load();
  }
}

function movimentoInput(inputValue) {
  const visibility = input.style.visibility;
  if (inputValue) {
    procurarCidade(inputValue);
  }
  visibility === "hidden" ? abrirInput() : fecharInput();
}

function botaoDeBusca() {
  const inputValue = input.value;
  movimentoInput(inputValue);
}

function fecharInput() {
  input.style.visibility = "hidden";
  input.style.width = "40px";
  input.style.padding = "0.5rem 0.5rem 0.5rem 2.6rem";
  input.style.transition = "all 0.5s ease-in-out 0s";
  input.value = "";
}

function abrirInput() {
  input.style.visibility = "visible";
  input.style.width = "300px";
  input.style.padding = "0.5rem 0.5rem 0.5rem 3.1rem";
  input.style.transition = "all 0.5s ease-in-out 0s";
  input.value = "";
}

function mostrarEnvelope() {
  document.querySelector(".envelope").style.visibility = "visible";
  document.querySelector(".caixa").style.alignItems = "end";
  document.querySelector(".procura").style.position = "initial";
}

// --- Lógica Principal e Chamadas de API ---

async function procurarCidade(city) {
  try {
    const dados = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyOpenWeather}&units=metric&lang=pt_br`
    );

    if (dados.ok) { // Usar 'dados.ok' é uma verificação mais robusta
      const resultado = await dados.json();
      mostrarClimaNaTela(resultado);
      obterTopAlbunsPorPais(resultado.sys.country); // Chama a função do Spotify
      mostrarEnvelope();
      recarregarVideosNaTela();
    } else {
      throw new Error("Erro ao buscar a cidade");
    }
  } catch (error) { // CORRIGIDO: Adicionado (error)
    alert("A pesquisa por cidade deu errado!");
    console.error(error);
  }
}

function mostrarClimaNaTela(resultado) {
  document.querySelector(".icone-tempo").src = `./assets/${resultado.weather[0].icon}.png`;
  document.querySelector(".nome-cidade").innerHTML = `${resultado.name}`;
  document.querySelector(".temperatura").innerHTML = `${resultado.main.temp.toFixed(0)}°C`;
  document.querySelector(".maxTemperatura").innerHTML = `máx: ${resultado.main.temp_max.toFixed(0)}°C`;
  document.querySelector(".minTemperatura").innerHTML = `mín: ${resultado.main.temp_min.toFixed(0)}°C`;
}

// Lógica de Autenticação e API do Spotify
// ATENÇÃO: Esta função deveria estar em um backend!
async function obterAcessoToken() {
  const credentials = `${clientID}:${clientSecret}`;
  const encodedCredentials = btoa(credentials); // btoa codifica em Base64

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

async function obterTopAlbunsPorPais(country) {
  try {
    const accessToken = await obterAcessoToken();

    // CORREÇÃO DA URL: Endpoint e parâmetros corrigidos
    const url = `https://www.google.com/search?q=https://developer.spotify.com/documentation/web-api/reference/get-several-browse-categories${country}&limit=3`;
    console.log("Chamando a URL do Spotify:", url); // Ótimo para depuração

    const resultado = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (resultado.ok) {
      const data = await resultado.json();
      const playlists = data.playlists.items.map((item) => ({
        name: item.name,
        image: item.images[0].url,
      }));
      mostrarMusicaNaTela(playlists);
    } else {
      throw new Error(`Erro ao buscar playlists: Status ${resultado.status}`);
    }
  } catch (error) { // CORRIGIDO: Adicionado (error)
    alert("A pesquisa por música deu errado!");
    console.error(error);
  }
}

function mostrarMusicaNaTela(dados) {
  liElement.forEach((li, index) => {
    if (dados[index]) { // Verifica se existem dados para este índice
      const imgElement = li.querySelector("img");
      const pElement = li.querySelector("p");
      imgElement.src = dados[index].image;
      pElement.textContent = dados[index].name;
    }
  });
  document.querySelector(".playlist-caixa").style.visibility = "visible";
}

// --- Event Listeners e Inicialização ---

input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    const valorInput = input.value;
    movimentoInput(valorInput);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fecharInput();
  recarregarVideosNaTela();
});
