#!/bin/bash

# Script de Instalação Automática do Node A2A para n8n Self-hosted
# Uso: ./install-a2a-node.sh [--github] [github-url] [n8n-path]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações padrão
DEFAULT_PACKAGE="n8n-nodes-a2a"
DEFAULT_GITHUB_URL="https://github.com/bruno.growthsales/n8n-nodes-a2a.git"
DEFAULT_N8N_PATH="/opt/n8n"

# Variáveis
USE_GITHUB=false
PACKAGE_SOURCE=""
N8N_PATH=""

# Processar argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        --github)
            USE_GITHUB=true
            shift
            ;;
        *)
            if [ -z "$PACKAGE_SOURCE" ]; then
                if [ "$USE_GITHUB" = true ]; then
                    PACKAGE_SOURCE="$1"
                else
                    N8N_PATH="$1"
                fi
            elif [ -z "$N8N_PATH" ]; then
                N8N_PATH="$1"
            fi
            shift
            ;;
    esac
done

# Definir valores padrão
if [ "$USE_GITHUB" = true ]; then
    PACKAGE_SOURCE=${PACKAGE_SOURCE:-$DEFAULT_GITHUB_URL}
else
    PACKAGE_SOURCE=$DEFAULT_PACKAGE
fi
N8N_PATH=${N8N_PATH:-$DEFAULT_N8N_PATH}

echo -e "${BLUE}=== Instalador do Node A2A para n8n Self-hosted ===${NC}"
if [ "$USE_GITHUB" = true ]; then
    echo -e "${YELLOW}Método: GitHub${NC}"
    echo -e "${YELLOW}GitHub URL: ${PACKAGE_SOURCE}${NC}"
else
    echo -e "${YELLOW}Método: npm (Recomendado)${NC}"
    echo -e "${YELLOW}Pacote: ${PACKAGE_SOURCE}${NC}"
fi
echo -e "${YELLOW}n8n Path: ${N8N_PATH}${NC}"
echo ""

# Função para log
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar se o diretório do n8n existe
if [ ! -d "$N8N_PATH" ]; then
    error "Diretório do n8n não encontrado: $N8N_PATH"
fi

# Verificar se package.json existe
if [ ! -f "$N8N_PATH/package.json" ]; then
    error "package.json não encontrado em: $N8N_PATH"
fi

# Fazer backup do package.json
log "Fazendo backup do package.json..."
cp "$N8N_PATH/package.json" "$N8N_PATH/package.json.backup.$(date +%Y%m%d_%H%M%S)"

# Navegar para o diretório do n8n
cd "$N8N_PATH"

# Verificar se o node já está instalado
if npm list n8n-nodes-a2a >/dev/null 2>&1; then
    warning "Node A2A já está instalado. Removendo versão anterior..."
    npm uninstall n8n-nodes-a2a
fi

# Instalar o node
if [ "$USE_GITHUB" = true ]; then
    log "Instalando node A2A do GitHub..."
else
    log "Instalando node A2A do npm..."
fi
npm install "$PACKAGE_SOURCE"

# Verificar se a instalação foi bem-sucedida
if npm list n8n-nodes-a2a >/dev/null 2>&1; then
    log "Node A2A instalado com sucesso!"
else
    error "Falha na instalação do node A2A"
fi

# Detectar como o n8n está rodando e reiniciar
log "Detectando como o n8n está rodando..."

if command -v pm2 >/dev/null 2>&1 && pm2 list | grep -q n8n; then
    log "Reiniciando n8n via PM2..."
    pm2 restart n8n
elif systemctl is-active --quiet n8n; then
    log "Reiniciando n8n via systemctl..."
    sudo systemctl restart n8n
else
    warning "Não foi possível detectar como o n8n está rodando."
    warning "Por favor, reinicie o n8n manualmente."
fi

# Verificar se o n8n está rodando
sleep 5
if curl -s http://localhost:5678 >/dev/null; then
    log "n8n está rodando e acessível!"
else
    warning "n8n pode não estar rodando. Verifique manualmente."
fi

echo ""
echo -e "${GREEN}=== Instalação Concluída! ===${NC}"
echo -e "${BLUE}Próximos passos:${NC}"
echo "1. Acesse o n8n em: http://localhost:5678"
echo "2. Crie um novo workflow"
echo "3. Procure por 'A2A' nos nodes disponíveis"
echo "4. Configure suas credenciais A2A"
echo ""
echo -e "${YELLOW}Para verificar a instalação:${NC}"
echo "npm list n8n-nodes-a2a"
echo ""
echo -e "${YELLOW}Para desinstalar:${NC}"
echo "npm uninstall n8n-nodes-a2a"
echo ""
echo -e "${BLUE}Exemplos de uso:${NC}"
echo "# Instalar do npm (padrão):"
echo "./install-a2a-node.sh /opt/n8n"
echo ""
echo "# Instalar do GitHub:"
echo "./install-a2a-node.sh --github"
echo "./install-a2a-node.sh --github https://github.com/bruno-growthsales/n8n-nodes-a2a.git /home/n8n"
