/* ==========================================================================
   main.js — o "cérebro" do site
   💡 INSIGHT #10 — Organização
   O arquivo é dividido em blocos pequenos, cada um com UMA responsabilidade.
   Leia de cima para baixo: primeiro os DADOS, depois as funções que os usam,
   e no final a inicialização que liga tudo.
   ========================================================================== */
"use strict"; // 💡 modo rigoroso: o JS avisa sobre erros comuns em vez de ignorar

/* ==========================================================================
   1. CONFIGURAÇÃO — seus dados num lugar só
   ========================================================================== */
const CONFIG = {
  nome: "Nicolas dos Reis Neves",
  whatsapp: "5511982569125", // 55 (Brasil) + 11 (DDD) + número
  email: "nickreisnreis16@gmail.com",
  github: "https://github.com/nicolasreiz",
  linkedin: "https://www.linkedin.com/in/nicolas-dos-reis-neves-a191a1230",
};

/* ==========================================================================
   2. DADOS — o conteúdo do site
   💡 INSIGHT #11 — Dados separados da apresentação
   Ferramentas, histórico e projetos são ARRAYS de OBJETOS. Funções transformam
   isso em HTML. Para adicionar um projeto: copie um objeto, cole e edite.
   (É a mesma ideia que React e Vue usam por baixo dos panos.)
   ========================================================================== */
const FERRAMENTAS = [
  { titulo: "foco atual", itens: ["Python", "Fundamentos de Machine Learning", "Álgebra linear e estatística"] },
  { titulo: "uso em projetos", itens: ["JavaScript e Node.js", "HTML e CSS", "Git e GitHub"] },
  { titulo: "na fila", itens: ["Pandas e scikit-learn", "PyTorch", "Redes neurais"] },
];

// ⚠️ Troque os textos de "quando" por datas reais (ex.: "mar 2024")
const HISTORICO = [
  { hash: "e4c21aa", tipo: "wip", msg: "primeiro modelo de Machine Learning", quando: "em andamento", head: true },
  { hash: "9b7f0d3", tipo: "feat", msg: "portfólio pessoal com terminal e o robô NicoBot", quando: "2026" },
  { hash: "51ad8e2", tipo: "feat", msg: "NicoBot, bot de figurinhas para WhatsApp", quando: "primeiro projeto usado por outras pessoas" },
  { hash: "0a1b2c3", tipo: "init", msg: "entrei em Ciência da Computação", quando: "o começo" },
];

const PROJETOS = [
  {
    nome: "NicoBot",
    tipo: "bot para WhatsApp",
    status: "online", // "online" ou "dev"
    descricao:
      "Você manda uma imagem, um GIF ou um vídeo curto e ele devolve a figurinha pronta. Foi meu primeiro projeto usado por outras pessoas, e me ensinou a lidar com mídia, filas de mensagens e usuários reais.",
    destaques: ["Converte imagens em figurinhas", "Aceita GIFs e vídeos curtos (figurinhas animadas)", "Responde a comandos no chat"],
    stack: "JavaScript, Node.js",
    github: CONFIG.github, // 💡 troque pelo link do repositório, se ele for público
  },
  {
    nome: "Primeiro modelo",
    tipo: "Machine Learning",
    status: "dev",
    descricao:
      "Meu primeiro projeto de ML: escolher um conjunto de dados público, treinar um classificador e documentar cada etapa, inclusive os erros.",
    destaques: ["Limpeza e exploração dos dados", "Treino com scikit-learn", "Avaliação com métricas honestas"],
    stack: "Python, Pandas, scikit-learn",
    github: null,
  },
  {
    nome: "Este site",
    tipo: "portfólio",
    status: "online",
    descricao:
      "Sem frameworks: HTML semântico, CSS e JavaScript puro. O nome no topo é desenhado ponto a ponto num canvas, e o robô é um SVG animado.",
    destaques: ["Painel de LED que reage ao mouse", "Terminal com comandos", "Formulário que abre no WhatsApp"],
    stack: "HTML, CSS, JavaScript, Canvas",
    github: CONFIG.github,
  },
];

/* ==========================================================================
   3. ÍCONES — SVGs de linha (estilo da biblioteca open source Lucide)
   💡 Usam stroke="currentColor": herdam a cor do texto ao redor.
   ========================================================================== */
const ICONES = {
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
};

/* ==========================================================================
   4. UTILITÁRIOS
   ========================================================================== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Lê uma variável do CSS (assim o canvas usa as mesmas cores do style.css)
const corCSS = (nome) => getComputedStyle(document.body).getPropertyValue(nome).trim();

let toastTimer;
function mostrarToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}

// 💡 SEGURANÇA (XSS): texto digitado por visitantes NUNCA vai cru para o innerHTML.
// Esta função troca < > & " ' por versões inofensivas.
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ==========================================================================
   5. PAINEL DE LED COM O NOME
   💡 INSIGHT #12 — Transformar texto em pontos
   1) Escrevemos o nome num canvas INVISÍVEL e minúsculo, onde cada pixel = 1 LED.
   2) Lemos os pixels com getImageData: onde tem tinta, o LED fica aceso.
   3) Cada LED aceso vira um objeto com posição "de casa" e uma mola física:
      o mouse empurra, a mola puxa de volta.
   É exatamente assim que uma rede neural "enxerga" uma imagem: como uma grade de números!
   ========================================================================== */
function iniciarPainelNome() {
  const canvas = $("#led-name");
  const ctx = canvas.getContext("2d");
  let leds = [];          // LEDs acesos (as letras)
  let cols = 0, rows = 0, P = 6, W = 0, H = 0;
  let inicio = 0;
  let visivel = true;
  const mouse = { x: -9999, y: -9999 };
  const RAIO = 70;        // alcance do "empurrão" do mouse, em pixels

  function construir() {
    W = canvas.clientWidth;
    const estreito = W < 560;
    const linhas = estreito ? ["NICOLAS", "NEVES"] : ["NICOLAS NEVES"];
    P = estreito ? 5 : 6;               // distância entre LEDs
    cols = Math.floor(W / P);

    // Canvas invisível onde 1 pixel = 1 LED
    const off = document.createElement("canvas");
    const o = off.getContext("2d", { willReadFrequently: true });

    // Mede o texto a 100px e calcula o tamanho de fonte que cabe na largura
    o.font = "100px VT323";
    const maior = Math.max(...linhas.map((l) => o.measureText(l).width));
    const fs = Math.floor((100 * (cols - 2)) / maior);
    o.font = `${fs}px VT323`;

    // 💡 actualBoundingBox* dá a altura REAL das letras desenhadas (sem espaço sobrando)
    const medidas = linhas.map((l) => o.measureText(l));
    const alturas = medidas.map((m) => Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent));
    const espaco = Math.round(fs * 0.12);
    rows = alturas.reduce((a, b) => a + b, 0) + espaco * (linhas.length - 1) + 2;

    off.width = cols;
    off.height = rows;
    o.font = `${fs}px VT323`;   // mudar o tamanho do canvas apaga a fonte, então definimos de novo
    o.fillStyle = "#fff";
    let y = 1;
    linhas.forEach((l, i) => {
      o.fillText(l, 1, y + medidas[i].actualBoundingBoxAscent);
      y += alturas[i] + espaco;
    });

    // Lê os pixels: o array vem como [R,G,B,A, R,G,B,A, ...], 4 números por pixel
    const px = o.getImageData(0, 0, cols, rows).data;
    leds = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const alfa = px[(r * cols + c) * 4 + 3]; // o 4º número é a transparência
        if (alfa > 110) leds.push({ c, hx: c * P + P / 2, hy: r * P + P / 2, ox: 0, oy: 0, vx: 0, vy: 0 });
      }
    }

    // Ajusta o canvas real à tela (devicePixelRatio = nitidez em telas retina)
    H = rows * P;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function quadro(agora) {
    requestAnimationFrame(quadro);
    if (!visivel) return; // 💡 fora da tela? não gasta processamento desenhando

    const fosforo = corCSS("--phosphor");
    const apagado = corCSS("--phosphor-dim");
    // Animação de "ligar": uma varredura da esquerda para a direita, só uma vez
    const progresso = reduzMovimento ? 1 : Math.min((agora - inicio) / 1200, 1);
    const colLimite = progresso * cols;

    ctx.clearRect(0, 0, W, H);

    // 1) Todos os LEDs apagados, num único desenho (mais rápido)
    ctx.fillStyle = apagado;
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    const s = P * 0.42;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) ctx.rect(c * P + (P - s) / 2, r * P + (P - s) / 2, s, s);
    }
    ctx.fill();

    // 2) LEDs acesos com física de mola
    ctx.fillStyle = fosforo;
    const t = P * 0.72;
    for (const L of leds) {
      if (L.c > colLimite) continue;

      const x = L.hx + L.ox;
      const y = L.hy + L.oy;
      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < RAIO) {
        const forca = (1 - d / RAIO) * 2.2;
        L.vx += (dx / d) * forca;   // empurra para LONGE do mouse
        L.vy += (dy / d) * forca;
      }
      // 💡 Lei de Hooke (mola): a força de volta é proporcional à distância de casa
      L.vx += -L.ox * 0.07;
      L.vy += -L.oy * 0.07;
      L.vx *= 0.84;                 // atrito, para não ficar balançando para sempre
      L.vy *= 0.84;
      L.ox += L.vx;
      L.oy += L.vy;

      // Brilho (halo) + o LED em si
      ctx.globalAlpha = 0.14;
      ctx.fillRect(x - t, y - t, t * 2, t * 2);
      ctx.globalAlpha = 1;
      ctx.fillRect(x - t / 2, y - t / 2, t, t);
    }
    ctx.globalAlpha = 1;
  }

  // Posição do mouse RELATIVA ao canvas
  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  // 💡 INSIGHT #13 — IntersectionObserver para economizar bateria
  // Avisa quando o painel entra/sai da tela; fora dela, a animação pausa.
  new IntersectionObserver(([entrada]) => (visivel = entrada.isIntersecting)).observe(canvas);

  // Recalcula ao redimensionar, mas só depois que a pessoa PARA de redimensionar
  // (técnica chamada "debounce": evita refazer o cálculo 100x por segundo)
  let espera;
  window.addEventListener("resize", () => {
    clearTimeout(espera);
    espera = setTimeout(construir, 150);
  });

  // 💡 INSIGHT #14 — Esperar a fonte carregar
  // Se desenharmos antes da VT323 chegar do Google Fonts, o nome sai na fonte errada.
  // document.fonts.load devolve uma Promise: o .then roda quando a fonte estiver pronta.
  document.fonts.load("100px VT323").then(() => {
    construir();
    inicio = performance.now();
    requestAnimationFrame(quadro);
  });
}

/* ==========================================================================
   6. FUNDO: GRADE DE PONTOS QUE ACENDE COM O MOUSE
   💡 Cada célula da grade tem uma "energia" de 0 a 1, guardada num Float32Array
   (um array só de números, como um tensor do NumPy/PyTorch). O mouse e os
   cliques aumentam a energia; a cada quadro ela diminui um pouco, então o
   rastro vai apagando sozinho. No modo chuva, "gotas" caem por cada coluna.
   ========================================================================== */
function iniciarFundo() {
  const canvas = $("#bg");
  const ctx = canvas.getContext("2d");
  const CEL = 22;
  const CHARS = "01<>/{}[]=+*#$&01";
  const RAIO = 5;
  let cols = 0, rows = 0, energia, chars, gotas = [];
  const ondas = [];
  const mouse = { col: -99, row: -99 };

  const charAleatorio = () => CHARS[Math.floor(Math.random() * CHARS.length)];
  // 💡 A grade é 2D, mas o array é 1D: índice = linha * colunas + coluna
  const idx = (c, r) => r * cols + c;

  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(innerWidth / CEL);
    rows = Math.ceil(innerHeight / CEL);
    energia = new Float32Array(cols * rows);
    chars = Array.from({ length: cols * rows }, charAleatorio);
    gotas = Array.from({ length: cols }, () => ({ y: Math.random() * -rows, v: 0.15 + Math.random() * 0.35 }));
  }

  function acender(c, r, v) {
    if (c < 0 || r < 0 || c >= cols || r >= rows) return;
    const i = idx(c, r);
    if (v > energia[i]) energia[i] = v;
  }

  function atualizar() {
    const chuva = document.body.classList.contains("rain");
    for (let i = 0; i < energia.length; i++) energia[i] *= chuva ? 0.92 : 0.94;

    for (let dr = -RAIO; dr <= RAIO; dr++) {
      for (let dc = -RAIO; dc <= RAIO; dc++) {
        const d = Math.hypot(dc, dr); // distância pelo teorema de Pitágoras
        if (d <= RAIO) acender(mouse.col + dc, mouse.row + dr, 1 - d / RAIO);
      }
    }

    for (let k = ondas.length - 1; k >= 0; k--) {
      const o = ondas[k];
      o.raio += 0.6;
      o.forca *= 0.97;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.abs(Math.hypot(c - o.col, r - o.row) - o.raio) < 0.8) acender(c, r, o.forca);
        }
      }
      if (o.forca < 0.05) ondas.splice(k, 1);
    }

    if (chuva) {
      gotas.forEach((g, c) => {
        g.y += g.v;
        acender(c, Math.floor(g.y), 1);
        if (g.y > rows + Math.random() * 20) g.y = Math.random() * -20;
      });
    }
  }

  function desenhar() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const cor = corCSS("--phosphor");

    ctx.fillStyle = cor;
    ctx.globalAlpha = 0.07;
    ctx.beginPath();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (energia[idx(c, r)] < 0.06) ctx.rect(c * CEL + CEL / 2 - 1, r * CEL + CEL / 2 - 1, 2, 2);
      }
    }
    ctx.fill();

    ctx.font = `500 ${CEL * 0.6}px "IBM Plex Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = idx(c, r);
        const e = energia[i];
        if (e < 0.06) continue;
        if (Math.random() < 0.04 * e) chars[i] = charAleatorio();
        ctx.globalAlpha = Math.min(e, 1) * 0.8;
        ctx.fillText(chars[i], c * CEL + CEL / 2, r * CEL + CEL / 2);
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop() {
    atualizar();
    desenhar();
    requestAnimationFrame(loop); // 💡 ~60 quadros por segundo, pausa sozinho com a aba escondida
  }

  window.addEventListener("resize", redimensionar);
  window.addEventListener("pointermove", (e) => {
    mouse.col = Math.floor(e.clientX / CEL);
    mouse.row = Math.floor(e.clientY / CEL);
  });
  document.addEventListener("mouseleave", () => (mouse.col = mouse.row = -99));
  window.addEventListener("pointerdown", (e) => {
    ondas.push({ col: e.clientX / CEL, row: e.clientY / CEL, raio: 0, forca: 1 });
  });

  redimensionar();
  loop();
}

/* ==========================================================================
   7. ROBÔ
   💡 INSIGHT #15 — Trigonometria para os olhos seguirem o mouse
   Math.atan2(dy, dx) dá o ÂNGULO entre o robô e o mouse; cos e sin desse
   ângulo dizem quanto mover os olhos em X e em Y. Mesma conta que jogos usam para mirar.
   ========================================================================== */
let roboFalar = () => {}; // vira a função real quando o robô inicia

function iniciarRobo() {
  const robo = $("#robot");
  const olhos = $("#robot-eyes");
  const texto = $("#robot-text");

  const FALAS = [
    "Sou o NicoBot. Cuido deste site enquanto o Nicolas programa.",
    "Ele estuda Ciência da Computação e mexe com Machine Learning e IA.",
    "Passa o mouse no nome dele. Os LEDs fogem.",
    "Aperta P, C ou T no teclado. Eu espero.",
    "Tem um terminal funcionando mais pra baixo. Digita help.",
    "Clique em qualquer lugar da tela e veja a onda.",
    "01101111 01101001. Isso é 'oi' em binário.",
    "Quer falar com ele? O formulário lá embaixo vai direto pro WhatsApp.",
    "↑ ↑ ↓ ↓ ← → ← → B A. Não conta pra ninguém.",
  ];
  let i = 0;
  let digitando;

  window.addEventListener("pointermove", (e) => {
    const r = robo.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.42;
    const ang = Math.atan2(e.clientY - cy, e.clientX - cx);
    const longe = Math.min(Math.hypot(e.clientX - cx, e.clientY - cy) / 200, 1);
    olhos.style.transform = `translate(${Math.cos(ang) * 10 * longe}px, ${Math.sin(ang) * 7 * longe}px)`;
  });

  // Piscar em intervalos aleatórios parece mais vivo que um ritmo fixo
  function piscar() {
    robo.classList.add("blink");
    setTimeout(() => robo.classList.remove("blink"), 140);
    setTimeout(piscar, 2500 + Math.random() * 3500);
  }
  if (!reduzMovimento) setTimeout(piscar, 2500);

  roboFalar = (frase) => {
    clearInterval(digitando);
    robo.classList.add("talking", "happy");
    let n = 0;
    digitando = setInterval(() => {
      texto.textContent = frase.slice(0, ++n);
      if (n >= frase.length) {
        clearInterval(digitando);
        robo.classList.remove("talking");
        setTimeout(() => robo.classList.remove("happy"), 600);
      }
    }, reduzMovimento ? 0 : 26);
  };

  robo.addEventListener("click", () => {
    roboFalar(FALAS[i]);
    i = (i + 1) % FALAS.length; // 💡 % faz o índice voltar ao 0 no fim da lista
  });

  setTimeout(() => roboFalar("Oi. Clique em mim se quiser saber mais."), 1500);
}

/* ==========================================================================
   8. RENDERIZAÇÃO — transforma os dados em HTML
   💡 Template literals (crases) aceitam várias linhas e ${variáveis}.
   .map() gera um pedaço de HTML por item; .join("") junta tudo.
   ========================================================================== */
function renderizar() {
  $("#tools").innerHTML = FERRAMENTAS.map((g) => `
    <div>
      <dt>${g.titulo}</dt>
      <dd><ul>${g.itens.map((x) => `<li>${x}</li>`).join("")}</ul></dd>
    </div>`).join("");

  $("#gitlog").innerHTML = HISTORICO.map((h) => `
    <li>
      <span class="hash">${h.hash}</span>
      <span class="msg"><b>${h.tipo}:</b> ${h.msg}${h.head ? '<span class="head">HEAD</span>' : ""}</span>
      <span class="when">${h.quando}</span>
    </li>`).join("");

  $("#projects").innerHTML = PROJETOS.map((p, n) => `
    <li>
      <button class="proj-row" aria-expanded="false" aria-controls="proj-${n}">
        <span class="proj-name">${p.nome}</span>
        <span class="proj-kind">${p.tipo}</span>
        <span class="proj-status ${p.status === "dev" ? "dev" : ""}">${p.status === "dev" ? "em construção" : "online"}</span>
        <span class="proj-toggle" aria-hidden="true">+</span>
      </button>
      <div class="proj-detail" id="proj-${n}" inert>
        <div>
          <div class="proj-body">
            <p>${p.descricao}</p>
            <ul>${p.destaques.map((d) => `<li>${d}</li>`).join("")}</ul>
            <p class="stack">feito com: ${p.stack}</p>
            ${p.github ? `<div class="proj-links"><a href="${p.github}" target="_blank" rel="noopener">ver no GitHub</a></div>` : ""}
          </div>
        </div>
      </div>
    </li>`).join("");

  $$("[data-icon]").forEach((el) => {
    el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONES[el.dataset.icon] || ""}</svg>`;
  });
}

/* ==========================================================================
   9. PROJETOS QUE ABREM E FECHAM
   💡 INSIGHT #16 — aria-expanded e inert
   aria-expanded avisa leitores de tela se o item está aberto.
   inert deixa o conteúdo fechado "inativo": o Tab não para em links escondidos.
   ========================================================================== */
function iniciarProjetos() {
  // 💡 Delegação de eventos: UM listener na lista inteira, em vez de um por botão
  $("#projects").addEventListener("click", (e) => {
    const botao = e.target.closest(".proj-row");
    if (!botao) return;
    const aberto = botao.getAttribute("aria-expanded") === "true";
    const detalhe = document.getElementById(botao.getAttribute("aria-controls"));
    botao.setAttribute("aria-expanded", String(!aberto));
    botao.querySelector(".proj-toggle").textContent = aberto ? "+" : "−";
    detalhe.classList.toggle("open", !aberto);
    detalhe.inert = aberto;
  });
}

/* ==========================================================================
   10. NAVEGAÇÃO — menu do celular e link da seção atual
   ========================================================================== */
function iniciarNavegacao() {
  const btn = $("#menu-btn");
  const nav = $("#nav");

  btn.addEventListener("click", () => {
    const aberto = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(aberto));
    btn.textContent = aberto ? "fechar" : "menu";
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "menu";
    }
  });

  // Marca o link da seção que está no meio da tela
  // 💡 rootMargin encolhe a "área de detecção" para uma faixa no meio da tela
  const links = $$(".nav a");
  const obs = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((s) => obs.observe(s));
}

/* ==========================================================================
   11. TERMINAL
   💡 INSIGHT #17 — Objeto como tabela de comandos
   Chave = nome do comando, valor = função que responde.
   Criar um comando novo é só adicionar uma linha, sem if/else gigante.
   ========================================================================== */
function iniciarTerminal() {
  const saida = $("#term-output");
  const input = $("#term-input");
  const corpo = $("#term-body");
  const historico = [];
  let pos = 0;
  const abrir = (url) => window.open(url, "_blank", "noopener");

  const COMANDOS = {
    help: () => `comandos:
  <span class="ok">sobre</span>      quem é o Nicolas
  <span class="ok">ferramentas</span> o que ele estuda e usa
  <span class="ok">projetos</span>   lista de projetos
  <span class="ok">contato</span>    endereços
  <span class="ok">whatsapp</span>   abre uma conversa
  <span class="ok">linkedin</span>   abre o LinkedIn
  <span class="ok">github</span>     abre o GitHub
  <span class="ok">robo</span>       faz o NicoBot falar
  <span class="ok">matrix</span>     liga ou desliga a chuva
  <span class="ok">clear</span>      limpa a tela`,
    sobre: () => `${CONFIG.nome}, 22 anos.
Ciência da Computação, com foco em Machine Learning e IA.`,
    ferramentas: () => FERRAMENTAS.map((g) => `${g.titulo}:\n  ${g.itens.join("\n  ")}`).join("\n"),
    projetos: () => PROJETOS.map((p) => `${p.nome.padEnd(18)} ${p.tipo.padEnd(20)} [${p.status}]`).join("\n"),
    contato: () => `e-mail    ${CONFIG.email}
whatsapp  +${CONFIG.whatsapp}
linkedin  ${CONFIG.linkedin}
github    ${CONFIG.github}`,
    whatsapp: () => { abrir(`https://wa.me/${CONFIG.whatsapp}`); return "abrindo o WhatsApp..."; },
    linkedin: () => { abrir(CONFIG.linkedin); return "abrindo o LinkedIn..."; },
    github: () => { abrir(CONFIG.github); return "abrindo o GitHub..."; },
    robo: () => { roboFalar("Alguém me chamou pelo terminal?"); return "sinal enviado ao NicoBot (lá no topo)."; },
    matrix: () => (alternarChuva() ? "Wake up, Neo..." : "chuva desligada."),
    sudo: () => `<span class="err">permissão negada.</span>`,
    clear: () => { saida.innerHTML = ""; return null; },
  };

  function imprimir(html, classe = "") {
    const div = document.createElement("div");
    if (classe) div.className = classe;
    div.innerHTML = html;
    saida.appendChild(div);
    corpo.scrollTop = corpo.scrollHeight;
  }

  imprimir(`Terminal do Nicolas. Digite <span class="ok">help</span> para ver os comandos.`);

  $("#term-form").addEventListener("submit", (e) => {
    e.preventDefault(); // 💡 impede o formulário de recarregar a página
    const bruto = input.value.trim();
    input.value = "";
    if (!bruto) return;
    historico.push(bruto);
    pos = historico.length;

    imprimir(escapeHTML(bruto), "cmd-echo");
    const cmd = bruto.toLowerCase().split(" ")[0];
    // 💡 hasOwn evita que "toString" ou "constructor" virem comandos por acidente
    const fn = Object.hasOwn(COMANDOS, cmd) ? COMANDOS[cmd] : null;
    if (!fn) {
      imprimir(`<span class="err">comando não encontrado: ${escapeHTML(cmd)}</span>. Digite <span class="ok">help</span>.`);
      return;
    }
    const resposta = fn();
    if (resposta !== null) imprimir(resposta);
  });

  // ↑ ↓ navegam no histórico, Tab completa o comando
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && pos > 0) {
      e.preventDefault();
      input.value = historico[--pos];
    } else if (e.key === "ArrowDown") {
      pos = Math.min(pos + 1, historico.length);
      input.value = historico[pos] || "";
    } else if (e.key === "Tab" && input.value) {
      e.preventDefault();
      const achou = Object.keys(COMANDOS).find((c) => c.startsWith(input.value.toLowerCase()));
      if (achou) input.value = achou;
    }
  });

  corpo.addEventListener("click", () => input.focus({ preventScroll: true }));
}

/* ==========================================================================
   12. CONTATO → WHATSAPP
   ========================================================================== */
function iniciarContato() {
  const form = $("#contact-form");
  const msg = $("#mensagem");
  const contador = $("#count");
  const campos = form.querySelectorAll("input, select, textarea");

  msg.addEventListener("input", () => (contador.textContent = `${msg.value.length}/500`));

  // Tira o aviso de erro assim que o campo fica válido
  campos.forEach((c) =>
    c.addEventListener("input", () => {
      if (c.checkValidity()) c.closest(".field").classList.remove("invalid");
    })
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // 💡 checkValidity() usa as regras escritas no HTML (required, minlength...)
    let primeiroErro = null;
    campos.forEach((c) => {
      const ok = c.checkValidity() && c.value.trim().length > 0;
      c.closest(".field").classList.toggle("invalid", !ok);
      if (!ok && !primeiroErro) primeiroErro = c;
    });
    if (primeiroErro) {
      primeiroErro.focus(); // leva a pessoa direto ao campo com problema
      return;
    }

    const texto =
      `Olá, Nicolas! Vim pelo seu portfólio.\n\n` +
      `*Nome:* ${$("#nome").value.trim()}\n` +
      `*Assunto:* ${$("#assunto").value}\n\n` +
      msg.value.trim();

    // 💡 INSIGHT #18 — encodeURIComponent
    // URLs não aceitam espaços, acentos nem quebras de linha. Essa função converte
    // tudo para um formato seguro: "Olá mundo" vira "Ol%C3%A1%20mundo".
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    mostrarToast("Mensagem aberta no WhatsApp. É só enviar por lá.");
    form.reset();
    contador.textContent = "0/500";
  });

  $$(".copy").forEach((b) =>
    b.addEventListener("click", async () => {
      // 💡 async/await: espera a cópia terminar sem travar a página
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        mostrarToast("E-mail copiado.");
      } catch {
        mostrarToast(`Não deu para copiar. O e-mail é ${b.dataset.copy}`);
      }
    })
  );

  $$(".js-linkedin").forEach((a) => (a.href = CONFIG.linkedin));
}

/* ==========================================================================
   13. MODO CHUVA (código Konami) e extras
   ========================================================================== */
function alternarChuva() {
  const ligado = document.body.classList.toggle("rain");
  mostrarToast(ligado ? "Chuva ligada. Digite matrix no terminal para desligar." : "Chuva desligada.");
  roboFalar(ligado ? "Wake up, Neo... Siga o coelho branco." : "De volta à realidade.");
  return ligado;
}

function iniciarExtras() {
  // 💡 Guardamos as últimas 10 teclas e comparamos com a sequência Konami
  const KONAMI = "arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a";
  let teclas = [];
  window.addEventListener("keydown", (e) => {
    teclas = [...teclas, e.key.toLowerCase()].slice(-10);
    if (teclas.join(",") === KONAMI) alternarChuva();
  });
}

/* Atalhos P / C / T (ver INSIGHT #19 no index.html) */
function iniciarAtalhos() {
  const ATALHOS = { p: "#projetos", c: "#contato", t: "#terminal" };

  window.addEventListener("keydown", (e) => {
    // 💡 Ignora quando a pessoa está DIGITANDO num campo, senão escrever "pc"
    // no formulário faria a página pular. Também ignora Ctrl+C, Ctrl+T etc.
    const alvo = e.target;
    if (alvo.closest("input, textarea, select") || e.ctrlKey || e.metaKey || e.altKey) return;

    const destino = ATALHOS[e.key.toLowerCase()];
    if (!destino) return;
    $(destino).scrollIntoView();
    if (destino === "#terminal") $("#term-input").focus({ preventScroll: true });
  });
}

/* ==========================================================================
   14. INICIALIZAÇÃO
   💡 A ORDEM importa: primeiro criamos o HTML a partir dos dados,
   depois ligamos os comportamentos que dependem desses elementos.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderizar();
  iniciarProjetos();
  iniciarPainelNome();
  iniciarFundo();
  iniciarRobo();
  iniciarNavegacao();
  iniciarTerminal();
  iniciarContato();
  iniciarExtras();
  iniciarAtalhos();
  console.log("%cOlhando o código? Boa. Fala comigo: " + CONFIG.email, "color:#5dff8f;font-size:13px");
});
