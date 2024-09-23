const input = document.getElementById("input-busca");
const apiKey = "a0aea1c859cfe51c97a0e20a77787ea3";

const clientID = "1719956c35ba4b86a22160a312c28f95";
const clientSecret = "102d1dbe55794721ac5daf3f8d7fc39b";
const ulElement = document.querySelector(".playlist-caixa");
const liElement = ulElement.querySelectorAll("li");

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

  inputValue && procurarCidade(inputValue);

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

async function procurarCidade(city) {
  try {
    const dados = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
    );

    if (dados.status === 200) {
      const resultado = await dados.json();

      console.log(resultado);

      obterTopAlbunsPorPais(resultado.sys.country);
      mostrarClimaNaTela(resultado);
      mostrarEnvelope();
      recarregarVideosNaTela();
    } else {
      throw new Error("Erro ao buscar a cidade");
    }
  } catch {
    alert("A pesquisa por cidade deu errado!");
    console.error(error);
  }
}

function mostrarClimaNaTela(resultado) {
  document.querySelector(
    ".icone-tempo"
  ).src = `./assets/${resultado.weather[0].icon}.png`;
  document.querySelector(".nome-cidade").innerHTML = `${resultado.name}`;
  document.querySelector(
    ".temperatura"
  ).innerHTML = `${resultado.main.temp.toFixed(0)}°C`;
  document.querySelector(
    ".maxTemperatura"
  ).innerHTML = `máx: ${resultado.main.temp_max.toFixed(0)}°C`;
  document.querySelector(
    ".minTemperatura"
  ).innerHTML = `mín: ${resultado.main.temp_min.toFixed(0)}°C`;
}

async function obterAcessoToken() {
  const credentials = `${clientID}:${clientSecret}`;
  const encodedCredentials = btoa(credentials);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  return data.access_token;
}

function obterDataAtual() {
  const currentDate = new Date();
  const ano = currentDate.getFullYear();
  const mes = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const dia = currentDate.getDate().toString().padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

async function obterTopAlbunsPorPais(country) {
  try {
    const accessToken = await obterAcessoToken();
    const dataAtual = obterDataAtual();
    const url = `https://api.spotify.com/v1/browse/featured-playlists?country=${country}&timestamp=${dataAtual}T09%3A00%3A00&limit=3`;

    const resultado = await fetch(`${url}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (resultado.status === 200) {
      const data = await resultado.json();

      const result = data.playlists.items.map((item) => ({
        name: item.name,
        image: item.images[0].url,
      }));

      mostrarMusicaNaTela(result);
    } else {
      throw new Error("Erro ao buscar playlists no Spotify");
    }
  } catch (error) {
    alert("A pesquisa por música deu errado!");
    console.error(error);
  }
}

function mostrarMusicaNaTela(dados) {
  liElement.forEach((liElement, index) => {
    const imgElement = liElement.querySelector("img");
    const pElement = liElement.querySelector("p");

    imgElement.src = dados[index].image;
    pElement.textContent = dados[index].name;
  });
  document.querySelector(".playlist-caixa").style.visibility = "visible";
}
