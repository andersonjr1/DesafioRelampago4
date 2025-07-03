# 🚀 Servidor WebSocket

Um servidor WebSocket completo construído com Node.js, Express e TypeScript, oferecendo comunicação em tempo real entre clientes.

## ✨ Funcionalidades

- **Conexões WebSocket em tempo real**
- **Sistema de nicknames personalizados**
- **Chat em tempo real com broadcast**
- **Sistema de salas (rooms) para chat segmentado**
- **Criação e gerenciamento de salas**
- **Entrada e saída de salas**
- **Listagem de salas disponíveis**
- **Ping/Pong para verificação de conectividade**
- **API REST para monitoramento**
- **Notificações de entrada/saída de usuários**
- **Notificações de entrada/saída de salas**
- **Tratamento robusto de erros**
- **Logs detalhados de atividades**

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express** - Framework web
- **ws** - Biblioteca WebSocket
- **http** - Servidor HTTP nativo

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute em modo de desenvolvimento:
```bash
npm run dev
```

3. Ou compile e execute em produção:
```bash
npm run build
npm start
```

### Configuração

O servidor roda por padrão na porta `3001`. Você pode alterar isso definindo a variável de ambiente `PORT`:

```bash
PORT=8080 npm run dev
```

## 📡 Endpoints

### WebSocket
- **Endpoint:** `ws://localhost:3001`
- **Protocolo:** WebSocket

## 🌐 Endpoints HTTP (REST API)

### GET /status
Retorna o status do servidor e estatísticas de conexão.

**Resposta:**
```json
{
  "status": "online",
  "uptime": "2h 30m 15s",
  "totalClients": 5,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /clients
Retorna a lista de clientes conectados.

**Resposta:**
```json
{
  "totalClients": 3,
  "clients": [
    {
      "id": "client-123",
      "nickname": "João",
      "connected": true,
      "connectedAt": "2024-01-15T10:25:00.000Z",
      "roomId": "room-456"
    }
  ]
}
```

### GET /rooms
Retorna a lista de todas as salas criadas.

**Resposta:**
```json
{
  "totalRooms": 2,
  "rooms": [
    {
      "id": "room-123",
      "name": "Sala Geral",
      "clientsCount": 3,
      "maxClients": 10,
      "createdAt": "2024-01-15T10:20:00.000Z",
      "clients": [
        {
          "id": "client-123",
          "nickname": "João"
        }
      ]
    }
  ]
}
```

### GET /rooms/:roomId
Retorna informações detalhadas de uma sala específica.

**Resposta:**
```json
{
  "id": "room-123",
  "name": "Sala Geral",
  "clientsCount": 3,
  "maxClients": 10,
  "createdAt": "2024-01-15T10:20:00.000Z",
  "clients": [
    {
      "id": "client-123",
      "nickname": "João",
      "connected": true
    }
  ]
}
```

## 📨 Protocolo de Mensagens WebSocket

### Mensagens do Cliente para o Servidor

#### Definir Nickname
```json
{
  "type": "set_nickname",
  "nickname": "MeuNickname"
}
```

#### Enviar Mensagem de Chat
```json
{
  "type": "chat_message",
  "message": "Olá, pessoal!"
}
```

#### Ping (Teste de Latência)
```json
{
  "type": "ping"
}
```

#### Criar Sala
```json
{
  "type": "create_room",
  "roomName": "string",
  "maxClients": "number (opcional, padrão: 10)"
}
```

#### Entrar em Sala
```json
{
  "type": "join_room",
  "roomId": "string"
}
```

#### Sair da Sala
```json
{
  "type": "leave_room"
}
```

#### Listar Salas
```json
{
  "type": "list_rooms"
}
```

### Mensagens do Servidor para o Cliente

#### Boas-vindas
```json
{
  "type": "welcome",
  "clientId": "abc123def456",
  "message": "Conectado ao servidor WebSocket!"
}
```

#### Usuário Conectado
```json
{
  "type": "user_connected",
  "clientId": "xyz789uvw012",
  "message": "Usuário xyz789uvw012 se conectou"
}
```

#### Usuário Desconectado
```json
{
  "type": "user_disconnected",
  "clientId": "xyz789uvw012",
  "nickname": "Maria",
  "message": "Maria saiu do chat"
}
```

#### Nickname Definido
```json
{
  "type": "nickname_set",
  "clientId": "abc123def456",
  "nickname": "João",
  "message": "João entrou no chat"
}
```

#### Mensagem de Chat
```json
{
  "type": "chat_message",
  "clientId": "abc123def456",
  "nickname": "João",
  "message": "Olá, pessoal!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "roomId": "string (opcional)"
}
```

#### Pong (Resposta ao Ping)
```json
{
  "type": "pong",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Erro
```json
{
  "type": "error",
  "message": "Formato de mensagem inválido"
}
```

#### Sala Criada
```json
{
  "type": "room_created",
  "roomId": "string",
  "roomName": "string",
  "maxClients": "number"
}
```

#### Entrou na Sala
```json
{
  "type": "room_joined",
  "roomId": "string",
  "roomName": "string",
  "clientsCount": "number"
}
```

#### Saiu da Sala
```json
{
  "type": "room_left",
  "message": "Você saiu da sala"
}
```

#### Lista de Salas
```json
{
  "type": "rooms_list",
  "rooms": [
    {
      "id": "string",
      "name": "string",
      "clientsCount": "number",
      "maxClients": "number",
      "createdAt": "ISO string"
    }
  ]
}
```

#### Usuário Entrou na Sala
```json
{
  "type": "user_joined_room",
  "nickname": "string",
  "roomId": "string"
}
```

#### Usuário Saiu da Sala
```json
{
  "type": "user_left_room",
  "nickname": "string",
  "roomId": "string"
}
```

## 🧪 Testando o Servidor

### Usando o Cliente HTML de Exemplo

1. Abra o arquivo `example-client.html` no seu navegador
2. Clique em "Conectar" para estabelecer a conexão
3. Defina um nickname
4. Envie mensagens e teste as funcionalidades

### Usando JavaScript no Navegador

```javascript
// Conectar ao WebSocket
const ws = new WebSocket('ws://localhost:3001');

// Eventos
ws.onopen = () => console.log('Conectado!');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Mensagem recebida:', data);
};

// Definir nickname
ws.send(JSON.stringify({
  type: 'set_nickname',
  nickname: 'MeuNome'
}));

// Enviar mensagem
ws.send(JSON.stringify({
  type: 'chat_message',
  message: 'Olá, mundo!'
}));
```

### Usando Node.js

```javascript
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
  console.log('Conectado!');
  
  // Definir nickname
  ws.send(JSON.stringify({
    type: 'set_nickname',
    nickname: 'Bot'
  }));
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  console.log('Recebido:', message);
});
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo de desenvolvimento com hot reload
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Executa a versão compilada
- `npm run prod` - Compila e executa em produção

## 📁 Estrutura do Projeto

```
game-server/
├── src/
│   └── index.ts          # Arquivo principal do servidor
├── dist/                 # Arquivos compilados (gerado automaticamente)
├── example-client.html   # Cliente de exemplo para testes
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração do TypeScript
└── README.md            # Este arquivo
```

## 🛡️ Tratamento de Erros

O servidor inclui tratamento robusto de erros:

- Mensagens malformadas são rejeitadas com erro específico
- Conexões perdidas são detectadas e limpas automaticamente
- Logs detalhados para debugging
- Graceful shutdown em caso de encerramento do processo

## 🚀 Próximos Passos

Possíveis melhorias e funcionalidades:

- [ ] Autenticação de usuários
- [ ] Salas/canais separados
- [ ] Persistência de mensagens
- [ ] Rate limiting
- [ ] Compressão de mensagens
- [ ] Reconexão automática no cliente
- [ ] Métricas e monitoramento
- [ ] Testes automatizados

## 📝 Licença

Este projeto está sob a licença ISC.