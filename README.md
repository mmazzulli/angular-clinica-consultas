# Clínica de Consultas - Agenda e Gestão
Descrição do Projeto

Esta é uma aplicação web desenvolvida para gerenciar uma clínica de saúde, permitindo controle de usuários, agendamentos de consultas e especialidades médicas. O objetivo principal é oferecer uma plataforma segura e organizada para:

Registrar e gerenciar usuários (clientes, médicos, empresas e superadmins)

Agendar, atualizar e cancelar consultas

Controlar especialidades médicas e vincular médicos a elas

Enviar notificações por email para clientes, médicos e empresas

O projeto foi construído com Node.js, Express, Prisma e JWT para autenticação e controle de acesso baseado em roles (RBAC).

# Funcionalidades Implementadas
Controle de Usuários

Registro público de clientes (sign-up) sem token.

Registro protegido de superadmins, empresas e médicos (necessário token).

Login com geração de access token e refresh token.

CRUD de usuários respeitando RBAC:

Superadmin: acesso total.

Empresa: CRUD exceto superadmins.

Médico: CRUD próprio e de clientes vinculados.

Cliente: apenas seu próprio cadastro.

## Agendamento de Consultas

CRUD completo de consultas, com RBAC aplicado.

Emails automáticos enviados ao criar ou atualizar consultas:

Para clientes, médicos e empresas.

Paginação para listagem de consultas.

## Especialidades Médicas

CRUD de especialidades protegido por roles.

Listagem de especialidades e médicos vinculados a cada especialidade.

Paginação para listagens.

## Autenticação e Autorização

JWT com access e refresh tokens.

Middleware de autenticação global.

Controle de acesso por roles (RBAC) para todas as operações críticas.

## Integração com Frontend

Rotas e endpoints pensados para consumo por aplicações frontend (ex.: Angular).

Tecnologias Utilizadas

Backend: Node.js, Express

Banco de dados: Prisma ORM com SQLite/PostgreSQL (configurável)

Autenticação: JWT (access e refresh tokens)

Segurança: Bcrypt para senhas, RBAC para controle de acesso

Email: Nodemailer (para notificações de consultas)

Ferramentas de teste: Insomnia/Postman

Estrutura do Projeto
/controllers   -> lógica de controle das rotas
/services      -> regras de negócio e integração com Prisma
/routes        -> definição das rotas da API
/middleware    -> autenticação e autorização (RBAC)
/prisma        -> client e models do banco de dados
/index.js      -> ponto de entrada do servidor

### Como Testar

Clonar o repositório

Instalar dependências:

npm install


Configurar variáveis de ambiente no .env (JWT secrets, frontend origin, etc.)

Rodar o servidor:

npm run dev


## Testar endpoints com Insomnia ou Postman:

POST /api/v1/register para sign-up de cliente

POST /api/v1/login para obter tokens

Usar token no header Authorization: Bearer <ACCESS_TOKEN> para CRUD protegido

Observações

Apenas o primeiro registro de cliente pode ser feito sem token.

Todos os outros usuários e operações exigem autenticação via token, por isso, o primeiro superadmin deve ser criado na table do database. 

Emails de notificação são enviados em eventos de criação ou vinculação de consultas.

## 📌 Status
📍 Em desenvolvimento – primeira versão do sistema em construção.  

---

## 📝 Licença
Projeto desenvolvido para fins de estudo.  
