const filmesContainer = document.getElementById("filmes");
const dropdownPersonagens = document.getElementById("dropdownPersonagens");
const modalTitulo = document.getElementById("personagensModalLabel");
const detalhesPersonagem = document.getElementById("detalhesPersonagem");
const checkboxes = document.querySelectorAll(".infoCheckbox");

let personagensDoFilme = [];
let personagemAtual = null;

async function carregarFilmes() {
  try {
    const res = await fetch("https://ghibliapi.vercel.app/films");
    const filmes = await res.json();

    filmesContainer.innerHTML = "";
    filmes.forEach(filme => {
      const col = document.createElement("div");
      col.className = "col";

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${filme.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${filme.original_title}</h6>
            <p class="card-text small">${filme.description.substring(0, 120)}...</p>
            <button class="btn btn-primary btn-sm" data-id="${filme.id}" data-bs-toggle="modal" data-bs-target="#personagensModal">
              Ver Personagens
            </button>
          </div>
          <div class="card-footer text-muted">
            Diretor: ${filme.director} | Ano: ${filme.release_date}
          </div>
        </div>
      `;
      filmesContainer.appendChild(col);
    });

    document.querySelectorAll("[data-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        carregarPersonagens(btn.dataset.id, btn.closest(".card").querySelector(".card-title").innerText);
      });
    });
  } catch {
    filmesContainer.innerHTML = `<p class="text-danger">Erro ao carregar filmes.</p>`;
  }
}

async function carregarPersonagens(filmeId, tituloFilme) {
  modalTitulo.textContent = `👤 Personagens de ${tituloFilme}`;
  dropdownPersonagens.innerHTML = `<option value="">-- Escolha um personagem --</option>`;
  detalhesPersonagem.innerHTML = "";

  try {
    const res = await fetch("https://ghibliapi.vercel.app/people");
    let personagens = await res.json();

    personagens = personagens.filter(p => p.films && p.films.includes(`https://ghibliapi.vercel.app/films/${filmeId}`));

    if (personagens.length === 0) {
      detalhesPersonagem.innerHTML = `<p class="text-muted">Nenhum personagem encontrado para este filme.</p>`;
      personagensDoFilme = [];
      return;
    }

    personagensDoFilme = personagens.map(p => ({ ...p, url: p.id })); // usamos id como value
    personagensDoFilme.forEach(p => {
      const option = document.createElement("option");
      option.value = p.url;
      option.textContent = p.name;
      dropdownPersonagens.appendChild(option);
    });

  } catch {
    detalhesPersonagem.innerHTML = `<p class="text-danger">Erro ao carregar personagens.</p>`;
  }
}

function carregarDetalhesPersonagem(id) {
  detalhesPersonagem.innerHTML = `<p class="text-muted">Carregando...</p>`;
  personagemAtual = personagensDoFilme.find(p => p.url === id);
  atualizarDetalhesSelecionados();
}

async function atualizarDetalhesSelecionados() {
  if (!personagemAtual) return;

  let html = "";
  const camposSelecionados = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  if (camposSelecionados.includes("name")) html += `<div><strong>Nome:</strong> ${personagemAtual.name}</div>`;
  if (camposSelecionados.includes("gender")) html += `<div><strong>Gênero:</strong> ${personagemAtual.gender || "Desconhecido"}</div>`;
  if (camposSelecionados.includes("age")) html += `<div><strong>Idade:</strong> ${personagemAtual.age || "Não informada"}</div>`;

  if (camposSelecionados.includes("species")) {
    let especie = "Desconhecida";
    if (personagemAtual.species && !personagemAtual.species.includes("species")) {
      try {
        const r = await fetch(personagemAtual.species);
        const e = await r.json();
        especie = e.name || especie;
      } catch {}
    }
    html += `<div><strong>Espécie:</strong> ${especie}</div>`;
  }

  if (camposSelecionados.includes("vehicles")) {
    html += `<h6 class="mt-2">🚗 Veículos:</h6>`;
    if (personagemAtual.vehicles && personagemAtual.vehicles.length > 0 && !personagemAtual.vehicles[0].includes("vehicles")) {
      for (const vUrl of personagemAtual.vehicles) {
        try {
          const vRes = await fetch(vUrl);
          const v = await vRes.json();
          html += `<div>- ${v.name} (${v.vehicle_class})</div>`;
        } catch {}
      }
    } else {
      html += `<p class="text-muted">Nenhum veículo registrado.</p>`;
    }
  }

  detalhesPersonagem.innerHTML = html;
}

dropdownPersonagens.addEventListener("change", (e) => {
  if (e.target.value) carregarDetalhesPersonagem(e.target.value);
});
checkboxes.forEach(cb => cb.addEventListener("change", atualizarDetalhesSelecionados));

carregarFilmes();
