# 🎬 PlayApp

O **PlayApp** é um player de vídeo inteligente desenvolvido com **Electron**. Ele foi projetado para organizar sua biblioteca local de filmes e séries, permitindo que você acompanhe seu progresso de onde parou de forma totalmente automática.

Este projeto nasceu de forma independente, com foco em estudo, experimentação e prática de desenvolvimento de aplicações desktop utilizando tecnologias web.

---

## 🚀 Como usar (Guia Rápido)

O PlayApp foi pensado para ser prático: você não precisa configurar caminhos complexos ou bancos de dados.

1.  **Baixe e Execute:** Baixe a versão compilada do aplicativo e execute-a.
2.  **Criação Automática:** Na primeira execução, o app verificará se a pasta de mídia existe. Caso não exista, ele a **criará automaticamente** no diretório de recursos do programa.
3.  **Adicione seu Conteúdo:** Basta mover seus arquivos de vídeo para dentro dessa pasta recém-criada.

---

## 📂 Organização da Biblioteca (Importante)

Para que o PlayApp identifique seus títulos corretamente, os arquivos **devem estar dentro de subpastas nomeadas**. O nome da pasta será usado pelo aplicativo como o título do filme ou da série.

### Exemplo de Estrutura Correta:

```text
/videos
  ├── Interestelar (2014)
  │    └── filme.mp4
  ├── Breaking Bad
  │    ├── S01E01.mp4
  │    └── S01E02.mkv
  └── Batman
       └── batman.mp4