# 🚀 Instalação Rápida - n8n Self-hosted

Guia rápido para instalar o node A2A em seu n8n self-hosted.

## ⚡ Instalação em 1 Comando (npm)

```bash
# Instalar diretamente do npm (Recomendado)
npm install n8n-nodes-a2a
```

## ⚡ Instalação via Script (GitHub)

```bash
# Baixar e executar o script de instalação do GitHub
curl -fsSL https://raw.githubusercontent.com/bruno-growthsales/n8n-nodes-a2a/main/install-a2a-node.sh | bash
```

## 📋 Pré-requisitos

- ✅ n8n self-hosted rodando
- ✅ Acesso SSH ao servidor
- ✅ Node.js e npm instalados
- ✅ Permissões para instalar pacotes npm

## 🛠️ Métodos de Instalação

### Método 1: Via npm (Recomendado - Mais Estável)

```bash
# 1. Navegar para o diretório do n8n
cd /opt/n8n  # ou onde seu n8n está instalado

# 2. Instalar do npm
npm install n8n-nodes-a2a

# 3. Reiniciar n8n
pm2 restart n8n
# ou
sudo systemctl restart n8n
```

### Método 2: Script Automático (GitHub)

```bash
# Baixar o script
wget https://raw.githubusercontent.com/bruno-growthsales/n8n-nodes-a2a/main/install-a2a-node.sh

# Tornar executável
chmod +x install-a2a-node.sh

# Executar (com parâmetros opcionais)
./install-a2a-node.sh [github-url] [caminho-n8n]

# Exemplo com parâmetros personalizados
./install-a2a-node.sh https://github.com/meu-usuario/n8n-nodes-a2a.git /home/n8n
```

### Método 3: Instalação Manual do GitHub

```bash
# 1. Navegar para o diretório do n8n
cd /opt/n8n  # ou onde seu n8n está instalado

# 2. Instalar diretamente do GitHub
npm install https://github.com/bruno-growthsales/n8n-nodes-a2a.git

# 3. Reiniciar n8n
pm2 restart n8n
# ou
sudo systemctl restart n8n
```

### Método 4: Via package.json

```bash
# 1. Editar package.json do n8n
nano /opt/n8n/package.json

# 2. Adicionar na seção dependencies:
"n8n-nodes-a2a": "^0.1.0"
# ou para versão do GitHub:
"n8n-nodes-a2a": "git+https://github.com/bruno-growthsales/n8n-nodes-a2a.git"

# 3. Instalar
npm install

# 4. Reiniciar n8n
pm2 restart n8n
```

## 🐳 Docker

### Dockerfile Personalizado

```dockerfile
FROM n8nio/n8n:latest

USER root
# Método 1: Via npm
RUN cd /usr/local/lib/node_modules/n8n && \
    npm install n8n-nodes-a2a

# Método 2: Via GitHub
# RUN cd /usr/local/lib/node_modules/n8n && \
#     npm install https://github.com/bruno-growthsales/n8n-nodes-a2a.git

USER node
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
```

## ✅ Verificação

### 1. Verificar Instalação

```bash
# No diretório do n8n
npm list n8n-nodes-a2a
```

### 2. Testar na Interface

1. Acesse: `http://localhost:5678`
2. Crie novo workflow
3. Procure por "A2A" nos nodes
4. Configure credenciais A2A

### 3. Verificar Logs

```bash
# PM2
pm2 logs n8n

# Systemd
journalctl -u n8n -f

# Logs diretos
tail -f ~/.n8n/logs/n8n.log
```

## 🔧 Troubleshooting

### Node não aparece na interface

```bash
# Limpar cache
rm -rf ~/.n8n/cache

# Reiniciar completamente
pm2 restart n8n
```

### Erro de módulo não encontrado

```bash
# Reinstalar
npm uninstall n8n-nodes-a2a
npm install https://github.com/bruno-growthsales/n8n-nodes-a2a.git
pm2 restart n8n
```

### Problemas de permissão

```bash
# Ajustar permissões
sudo chown -R n8n:n8n /opt/n8n/node_modules
```

## 🔄 Atualizações

```bash
# Atualizar para versão mais recente
npm uninstall n8n-nodes-a2a
npm install https://github.com/bruno-growthsales/n8n-nodes-a2a.git
pm2 restart n8n
```

## 📍 Caminhos Comuns do n8n

- `/opt/n8n` - Instalação padrão
- `/home/n8n` - Instalação de usuário
- `/usr/local/lib/node_modules/n8n` - Instalação global
- `~/n8n` - Instalação local

## 🆘 Suporte

Se encontrar problemas:

1. 📖 Consulte: [docs/N8N_SELFHOST_INSTALL.md](docs/N8N_SELFHOST_INSTALL.md)
2. 🐛 Reporte: [GitHub Issues](https://github.com/bruno-growthsales/n8n-nodes-a2a/issues)
3. 💬 Comunidade: [n8n Community](https://community.n8n.io/)

## 📝 Exemplo de Uso

Após a instalação:

```javascript
// Criar transferência
{
  "resource": "transfer",
  "operation": "create",
  "amount": 100.50,
  "currency": "USD",
  "fromAccountId": "acc_123456789",
  "toAccountId": "acc_987654321"
}
```

---

**🎉 Pronto! Seu node A2A está instalado e funcionando!** 
