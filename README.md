# 🎬 PlayApp

O **PlayApp** é um player de vídeo inteligente desenvolvido com **Electron**.  
Ele organiza automaticamente sua biblioteca local de filmes e séries e permite continuar assistindo exatamente **de onde você parou**.

Este projeto foi desenvolvido de forma independente com foco em **estudo, experimentação e prática** no desenvolvimento de aplicações desktop utilizando tecnologias web.

---

# 🚀 Como usar

O PlayApp foi projetado para ser simples de usar.  
Existem **duas formas de carregar sua biblioteca de vídeos**.

---

## 📁 Método 1 — Pasta automática

Na primeira execução do aplicativo:

1. O PlayApp verifica se existe uma pasta de vídeos.
2. Caso não exista, ele **cria automaticamente uma pasta chamada `videos`** dentro do diretório do aplicativo.
3. Basta colocar seus arquivos de vídeo dentro dessa pasta.

---

## 📂 Método 2 — Escolher qualquer pasta do computador

Agora o PlayApp também permite **selecionar qualquer pasta do seu computador** como biblioteca de mídia.

### Passos:

1. Abra o aplicativo.
2. Clique no botão **Selecionar Pasta**.
3. Escolha qualquer diretório do seu computador contendo filmes ou séries.

O PlayApp salvará esse caminho automaticamente e carregará seus vídeos a partir dessa pasta sempre que o aplicativo iniciar.

---

# 🗂 Organização da Biblioteca (Importante)

Para que o PlayApp identifique corretamente seus títulos, os arquivos **devem estar organizados em pastas**.

Cada pasta representa **um filme ou uma série**.

## Estrutura recomendada


videos/
│
├── Interestelar (2014)
│ └── filme.mp4
│
├── Breaking Bad
│ ├── S01E01.mp4
│ ├── S01E02.mkv
│ └── S01E03.mp4
│
└── Batman
└── batman.mp4



O nome da pasta será utilizado como **título exibido no aplicativo**.

---

# ✨ Funcionalidades

- ▶️ Player de vídeo integrado
- ⏯ Controles de reprodução (play / pause)
- ⏩ Avançar ou voltar episódios
- 🔊 Controle de volume
- ⌨ Atalhos de teclado
- 📺 Modo tela cheia
- 💾 Salvamento automático do progresso
- 👤 Nome de usuário personalizável
- 📁 Seleção de pasta personalizada para biblioteca
- 🔄 Continuação automática de onde você parou

---

# ⌨ Atalhos de teclado

| Tecla | Função |
|------|------|
| **Space** | Play / Pause |
| **F** | Tela cheia |
| **→** | Avançar 10s |
| **←** | Voltar 10s |
| **↑** | Aumentar volume |
| **↓** | Diminuir volume |
| **M** | Mutar áudio |

---

# 🛠 Tecnologias utilizadas

- **Electron**
- **JavaScript**
- **Node.js**
- **HTML5 Video API**
- **LocalStorage**

---

# 📚 Objetivo do projeto

O PlayApp foi desenvolvido como projeto de aprendizado para explorar:

- Desenvolvimento de aplicações **desktop com Electron**
- Manipulação de **arquivos locais**
- Integração entre **Node.js e interface web**
- Criação de **players personalizados**

---

# 📌 Status do projeto

🚧 Em desenvolvimento contínuo.

Novas funcionalidades e melhorias podem ser adicionadas conforme o projeto evolui.