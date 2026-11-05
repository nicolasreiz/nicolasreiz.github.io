# Portfólio: Nicolas dos Reis Neves

Site pessoal feito com **HTML, CSS e JavaScript puros**, sem frameworks e sem build.
Visual de monitor de fósforo verde: o site inteiro funciona como uma sessão de terminal.

## Estrutura

```
Site pessoal/
├── index.html           estrutura (o "esqueleto")
├── css/style.css        aparência (cores, layout, animações)
├── js/main.js           comportamento (interatividade) e o conteúdo
└── assets/img/          imagens (sua foto)
```

## Como abrir

- **Simples:** dois cliques no `index.html`.
- **Melhor:** no VS Code, instale a extensão **Live Server**, clique com o botão direito no `index.html` e escolha **Open with Live Server**. A página recarrega sozinha a cada vez que você salva.

## Onde editar

| Quero...                          | Onde mexer                                      |
|-----------------------------------|-------------------------------------------------|
| Trocar links e contatos           | `js/main.js` → objeto `CONFIG`                  |
| Adicionar um projeto              | `js/main.js` → array `PROJETOS`                 |
| Atualizar o que estou estudando   | `js/main.js` → array `FERRAMENTAS`              |
| Adicionar um marco na trajetória  | `js/main.js` → array `HISTORICO` (git log)      |
| Mudar as falas do robô            | `js/main.js` → `FALAS` em `iniciarRobo`         |
| Criar um comando no terminal      | `js/main.js` → objeto `COMANDOS`                |
| Mudar as cores                    | `css/style.css` → variáveis em `:root`          |
| Trocar a foto                     | substitua `assets/img/nicolas.jpg`              |

## Publicar de graça (GitHub Pages)

1. Crie um repositório no GitHub chamado **`nicolasreiz.github.io`**
2. Envie os arquivos:
   ```bash
   git init
   git add .
   git commit -m "Meu portfólio"
   git branch -M main
   git remote add origin https://github.com/nicolasreiz/nicolasreiz.github.io.git
   git push -u origin main
   ```
3. Em alguns minutos o site estará em **https://nicolasreiz.github.io**

## Segredos

- Teclas P, C e T levam a projetos, contato e terminal.
- Passe o mouse sobre o nome no topo: os LEDs fogem e voltam.
- Clique em qualquer lugar: sai uma onda pela grade do fundo.
- Clique no robô para ele falar.
- No terminal, digite `help` (↑ ↓ mostram o histórico, Tab completa).
- Código Konami no teclado (↑ ↑ ↓ ↓ ← → ← → B A) ou `matrix` no terminal: liga a chuva.
