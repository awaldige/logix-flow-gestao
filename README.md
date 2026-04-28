# 🚀 LogixFlow — Sistema de Gestão de Frota

O **LogixFlow** é uma aplicação fullstack para gerenciamento de frotas, motoristas, viagens, abastecimentos e manutenções.

Projeto desenvolvido com foco em performance, organização e escalabilidade.

---

## 🧠 Funcionalidades

- 🚗 Gestão de veículos
- 👨‍✈️ Cadastro de motoristas
- 🛣️ Controle de viagens (início e fim)
- ⛽ Registro de abastecimentos
- 🔧 Controle de manutenções
- 📊 Estrutura pronta para dashboards

---

## 🏗️ Arquitetura

---

## ⚙️ Tecnologias

### 🔹 Frontend
- Next.js 15
- React
- Tailwind CSS

### 🔹 Backend
- Node.js
- Express
- Prisma ORM
- SQLite / PostgreSQL (adaptável)

---

## 🚀 Como rodar o projeto

### 🔹 1. Clonar o repositório

🔹 2. Backend
cd logix-flow
npm install
npx prisma migrate dev
npm run dev

Servidor rodando em:

http://localhost:3000

🔹 3. Frontend
cd logix-web
npm install
npm run dev

Acesse:

http://localhost:3001

🔐 Variáveis de Ambiente

Crie um arquivo .env no backend:

DATABASE_URL="file:./dev.db"

📦 Scripts úteis

Backend

npm run dev

npx prisma studio
Frontend

npm run dev

npm run build

npm run start

🌐 Deploy
Frontend:
Vercel

Backend:
Render / Railway

📸 Preview



📌 Status do Projeto

🚧 Em desenvolvimento contínuo
🔥 Base sólida pronta para evolução

🤝 Contribuição

Contribuições são bem-vindas!

Fork do projeto
Crie uma branch
Commit suas mudanças
Push e abra um PR

📄 Licença

Este projeto está sob a licença MIT.

👨‍💻 Autor

Desenvolvido por André Waldige
