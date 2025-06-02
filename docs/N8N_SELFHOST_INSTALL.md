# Instalação do Node A2A em n8n Self-hosted

Este guia mostra como instalar o node A2A em uma instância n8n self-hosted usando o código do GitHub.

## Pré-requisitos

- n8n self-hosted rodando
- Acesso SSH ao servidor
- Node.js e npm instalados
- Acesso ao repositório GitHub

## Método 1: Instalação Direta do GitHub (Recomendado)

### Passo 1: Conectar ao servidor n8n

```bash
ssh usuario@seu-servidor-n8n
```

### Passo 2: Navegar para o diretório do n8n

```bash
cd /caminho/para/seu/n8n
# Exemplo comum: cd /opt/n8n ou cd ~/n8n
```

### Passo 3: Instalar o node diretamente do GitHub

```bash
# Instalar diretamente do repositório GitHub
npm install https://github.com/seu-usuario/n8n-nodes-a2a.git

# Ou especificar uma branch específica
npm install https://github.com/seu-usuario/n8n-nodes-a2a.git#main
```

### Passo 4: Reiniciar o n8n

```bash
# Se usando PM2
pm2 restart n8n

# Se usando systemd
sudo systemctl restart n8n

# Se rodando diretamente
# Pare o processo e inicie novamente
n8n start
```

## Método 2: Clonagem e Build Local

### Passo 1: Clonar o repositório

```bash
# Em um diretório temporário
cd /tmp
git clone https://github.com/seu-usuario/n8n-nodes-a2a.git
cd n8n-nodes-a2a
```

### Passo 2: Instalar dependências e fazer build

```bash
npm install
npm run build
```

### Passo 3: Criar link global

```bash
npm link
```

### Passo 4: Linkar no n8n

```bash
cd /caminho/para/seu/n8n
npm link n8n-nodes-a2a
```

### Passo 5: Reiniciar n8n

```bash
pm2 restart n8n
# ou
sudo systemctl restart n8n
```

## Método 3: Modificar package.json do n8n

### Passo 1: Editar package.json

```bash
cd /caminho/para/seu/n8n
nano package.json
```

### Passo 2: Adicionar dependência

Adicione no `package.json` do n8n:

```json
{
  "dependencies": {
    "n8n-nodes-a2a": "git+https://github.com/seu-usuario/n8n-nodes-a2a.git",
    // ... outras dependências
  }
}
```

### Passo 3: Instalar dependências

```bash
npm install
```

### Passo 4: Reiniciar n8n

```bash
pm2 restart n8n
```

## Método 4: Docker (Se usando Docker)

### Dockerfile personalizado

Crie um `Dockerfile` baseado na imagem oficial do n8n:

```dockerfile
FROM n8nio/n8n:latest

USER root

# Instalar o node A2A
RUN cd /usr/local/lib/node_modules/n8n && \
    npm install https://github.com/seu-usuario/n8n-nodes-a2a.git

USER node
```

### Build e run

```bash
# Build da imagem personalizada
docker build -t n8n-with-a2a .

# Rodar o container
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8n-with-a2a
```

### Docker Compose

```yaml
version: '3.8'
services:
  n8n:
    build: .
    ports:
      - "5678:5678"
    volumes:
      - ~/.n8n:/home/node/.n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=password
```

## Verificação da Instalação

### 1. Verificar se o node foi instalado

```bash
# No diretório do n8n
npm list n8n-nodes-a2a
```

### 2. Verificar logs do n8n

```bash
# Se usando PM2
pm2 logs n8n

# Se usando systemd
journalctl -u n8n -f

# Logs diretos
tail -f ~/.n8n/logs/n8n.log
```

### 3. Testar no n8n UI

1. Acesse a interface do n8n
2. Crie um novo workflow
3. Procure por "A2A" nos nodes disponíveis
4. O node deve aparecer na lista

## Troubleshooting

### Erro: "Cannot find module 'n8n-nodes-a2a'"

```bash
# Verificar se foi instalado corretamente
npm list n8n-nodes-a2a

# Reinstalar se necessário
npm uninstall n8n-nodes-a2a
npm install https://github.com/seu-usuario/n8n-nodes-a2a.git
```

### Erro: "Node not appearing in UI"

```bash
# Limpar cache do n8n
rm -rf ~/.n8n/cache

# Reiniciar completamente
pm2 restart n8n
```

### Erro de permissões

```bash
# Ajustar permissões se necessário
sudo chown -R n8n:n8n /caminho/para/n8n/node_modules
```

## Atualizações

### Para atualizar o node:

```bash
# Método 1: Reinstalar do GitHub
npm uninstall n8n-nodes-a2a
npm install https://github.com/seu-usuario/n8n-nodes-a2a.git

# Método 2: Se usando git
cd /tmp/n8n-nodes-a2a
git pull origin main
npm run build
npm link

# Reiniciar n8n
pm2 restart n8n
```

## Configuração de Produção

### 1. Usar versões específicas

No `package.json`:

```json
{
  "dependencies": {
    "n8n-nodes-a2a": "git+https://github.com/seu-usuario/n8n-nodes-a2a.git#v0.1.0"
  }
}
```

### 2. Backup antes de atualizações

```bash
# Backup do n8n
cp -r ~/.n8n ~/.n8n.backup.$(date +%Y%m%d)
```

### 3. Monitoramento

```bash
# Verificar se o node está funcionando
curl -X GET http://localhost:5678/rest/nodes
```

## Exemplo de Script de Instalação

```bash
#!/bin/bash

# Script de instalação automática
set -e

echo "Instalando n8n-nodes-a2a..."

# Navegar para diretório do n8n
cd /opt/n8n

# Fazer backup
cp package.json package.json.backup

# Instalar o node
npm install https://github.com/seu-usuario/n8n-nodes-a2a.git

# Reiniciar n8n
pm2 restart n8n

echo "Instalação concluída!"
echo "Verifique em: http://localhost:5678"
```

## Suporte

Se encontrar problemas:

1. Verifique os logs do n8n
2. Confirme que o build foi bem-sucedido
3. Verifique permissões de arquivo
4. Teste em ambiente de desenvolvimento primeiro 
