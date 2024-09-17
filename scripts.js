const input = document.getElementById('input-busca');
const apiKey = 'a0aea1c859cfe51c97a0e20a77787ea3'

const clientId = '1719956c35ba4b86a22160a312c28f95'
const clientSecret = 'b86f6f14494b4e9ea56d9febf45c703c'

function movimentoInput(inputValue) {
  const visibility = input.style.visibility;

  inputValue && procurarCidade(inputValue);

  visibility === 'hidden' ? abrirInput() : fecharInput();
}

function botaoDeBusca() {
  const inputValue = input.value;
  
  movimentoInput(inputValue);
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


input.addEventListener('keyup', function (event) {
  if(event.keyCode === 13) {
    const valorInput = input.value;
    movimentoInput(valorInput)
  }
})

document.addEventListener("DOMContentLoaded", () => {
  fecharInput();
});

 async function procurarCidade(city) {
  try {
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`);
  
    if(dados.status === 200) {
      const resultado = await dados.json();

      obterTopAlbunsPorPais(resultado.sys.country);
      mostrarClimaNaTela(resultado);
    } else {
      throw new Error
    } 
  } catch {
    alert('Cidade não encontrada!');
  }
}

function mostrarClimaNaTela(resultado) {
  document.querySelector('.icone-tempo').src = `./assets/${resultado.weather[0].icon}.png`;
  document.querySelector('.nome-cidade').innerHTML = `${resultado.name}`;
  document.querySelector('.temperatura').innerHTML = `${resultado.main.temp.toFixed(0)}°C`;
  document.querySelector('.maxTemperatura').innerHTML = `máx: ${resultado.main.temp_max.toFixed(0)}°C`;
  document.querySelector('.minTemperatura').innerHTML = `mín: ${resultado.main.temp_min.toFixed(0)}°C`;
}

async function obterAcessoToken () {
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = btoa(credentials);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;

}

function obterDataAtual(){
  const currentDate = new Date();
  const ano = currentDate.getFullYear();
  const mes = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const dia = currentDate.getDate().toString().padStart(2, '0');
  
  return `${ano}-${mes}-${dia}`;

}

async function obterTopAlbunsPorPais(country) {
  try {
    const accessToken = await obterAcessoToken();
    const dataAtual = obterDataAtual();
    const url = `https://api.spotify.com/v1/browse/featured-playlists?country=${country}&timestamp=${dataAtual}T09%3A00&limit=3`;
  
    const resultado = await fetch(`${url}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });

    if (resultado.status === 200) {
      const data = await resultado.json();
      const result = data.playlists.items.map(item => ({
        name: item.name,
        Image: item.images[0].url
      }))

      console.log(result);

    } else {
      throw new Error
    }

  } catch {
    alert('Erro ao buscar musica!');
  }
}


// https://api.spotify.com/v1/browse/featured-playlists?country=${country}&timestamp=${dataAtual}T09%3A00&limit=3