# Desafio Relâmpago 04

## 🃏 Sobre o Projeto

Consiste num projeto fullstack desenvolvido como parte de um desafio prático proposto pela Alpha Edtech. O objetivo foi replicar a experiência do clássico jogo UNO em um ambiente digital, proporcionando partidas multiplayer em tempo real, autenticação de usuários, histórico de jogos, e uma interface moderna e responsiva. O sistema foi pensado para ser robusto e pronto para produção, incluindo integração completa com banco de dados PostgreSQL, deploy automatizado com Docker, comunicação em tempo real via WebSocket e servidores seguros utilizando Nginx com HTTPS via Let's Encrypt. Mais do que um simples jogo, o projeto explora boas práticas de desenvolvimento web, DevOps e entrega contínua, servindo como uma demonstração prática de arquitetura moderna, escalável e segura — um verdadeiro desafio que integra todos os pilares da formação Alpha Edtech.

---

## 🕹️ Tecnologias Utilizadas

- **Frontend:**  
  React, TypeScript, Material UI (MUI)  
  Interface moderna, responsiva e de fácil usabilidade.

- **Backend:**  
  Node.js, Express, WebSocket, TypeScript
  Lógica do jogo, gerenciamento de salas e comunicação em tempo real entre os jogadores.

- **Banco de Dados:**  
  PostgreSQL  
  Armazenamento seguro de usuários, partidas e histórico de jogos.

- **Deploy & DevOps:**  
  Docker, Docker Compose  
  Nginx (proxy reverso e HTTPS automático via Certbot/Let's Encrypt)  
  Ambiente preparado para produção e fácil de escalar.

- **Qualidade de Código & Extras:**  
  ESLint, Prettier (padronização e qualidade de código)  
  Variáveis de ambiente (.env)  
  Certificados SSL automáticos para segurança  
  Práticas modernas de CI/CD (deploy contínuo)

---

## ✨ Funcionalidades

- Autenticação de usuário (registro, login, sessão persistente)
- Criação e entrada em salas (Lobby)
- Partidas multiplayer em tempo real (WebSocket)
- Regras originais do UNO, cartas especiais, compra de cartas, "UNO!" e mais
- Detecção de vencedor e histórico de partidas
- Interface responsiva, tema moderno
- Deploy automatizado, HTTPS/SSL integrado

---

## 🗂️ Estrutura do Projeto

```
DESAFIORELAMPAGO4/
├── backend/                # Código do backend (API, lógica de jogo, banco, etc)
├── frontend/               # Código do frontend (React, assets, etc)
├── .env                    # Variáveis de ambiente
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore              # Arquivos e pastas ignorados pelo Git
├── docker-compose.yml      # Orquestração dos serviços Docker
├── generate-nginx.sh       # Script para gerar nginx.conf com variáveis do .env
├── nginx.template.conf     # Template do arquivo de configuração do NGINX
```

---

## 🚦 Como Rodar o Projeto

Este projeto utiliza **Docker** e **Docker Compose** para orquestrar todos os serviços (frontend, backend, banco de dados, nginx reverso e SSL).

> **Atenção:** Certifique-se de que as portas **80** e **443** estão liberadas no seu servidor.

---

### 1. Clone o repositório

```bash
git clone https://github.com/andersonjr1/DesafioRelampago4.git
cd DesafioRelampago4
```

---

### 2. Crie o arquivo `.env`

---

### 3. Deixe o script executável

```
chmod +x generate-nginx.sh
```

---

### 4. Gere o `nginx.conf`

```
./generate-nginx.sh
```

---

### 5. Ajuste temporário do NGINX

Antes de subir o nginx pela primeira vez, comente o bloco abaixo no arquivo nginx.conf (raiz do projeto):

```
# server {
#     listen 443 ssl;
#     server_name ${LETSENCRYPT_DOMAIN};
#
#     ssl_certificate /etc/letsencrypt/live/${LETSENCRYPT_DOMAIN}/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/${LETSENCRYPT_DOMAIN}/privkey.pem;
#
#     location / {
#         proxy_pass http://frontend:80;
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#     }
#
#     location /api/ {
#         proxy_pass http://backend:3000;
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#     }
#
#     location /ws/ {
#         proxy_pass http://backend:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection "upgrade";
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#     }
# }
```

---

### 6. Suba o serviço do NGINX (sem certificado ainda)

```
docker compose up nginx
```

---

### 7. Gere o certificado SSL com o Certbot

Este comando utiliza automaticamente as variáveis do .env:

```
docker compose run --rm certbot
```

---

### 8. Derrubar o NGINX

```
docker compose down
```

---

### 9. Suba todos os serviços (frontend, backend, banco etc.)

```
docker compose up -build
```

---

## 📜 Licença

MIT