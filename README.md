# EcoLesson

Plataforma educacional focada em cursos, vagas, empresas e certificados relacionados à educação e sustentabilidade.

## 👥 Integrantes

- **Adriano Barutti** - RM: 556760
- **Vitor Kenzo** - RM: 557245

## 📱 Sobre o Projeto

O EcoLesson é um aplicativo mobile desenvolvido em React Native com Expo que oferece:

- **Cursos**: Acesso a diversos cursos educacionais
- **Vagas**: Oportunidades de emprego na área de sustentabilidade
- **Empresas**: Informações sobre empresas parceiras
- **Certificados**: Gerenciamento de certificados obtidos
- **Perfil**: Gerenciamento de perfil do usuário

## 🛠️ Tecnologias

- React Native
- Expo
- TypeScript
- Firebase Authentication
- React Navigation

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado (versão 16 ou superior)
- npm ou yarn
- Expo CLI instalado globalmente (opcional, mas recomendado)
- Conta Expo (para desenvolvimento)
- Git

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd EcoLesson
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

4. **Execute no dispositivo/emulador**
   
   Para Android:
   ```bash
   npm run android
   ```
   
   Para iOS:
   ```bash
   npm run ios
   ```
   
   Para Web:
   ```bash
   npm run web
   ```

### Execução

Após executar `npm start`, você verá um QR Code no terminal. Escaneie com o app Expo Go (disponível nas lojas Android e iOS) ou pressione:
- `a` para abrir no Android
- `i` para abrir no iOS
- `w` para abrir no navegador web

## 📁 Estrutura do Projeto

```
EcoLesson/
├── screens/          # Telas do aplicativo
├── src/
│   ├── config/      # Configurações (build info)
│   └── services/    # Serviços (Firebase)
├── assets/          # Imagens e recursos
├── App.tsx          # Componente principal
└── package.json     # Dependências do projeto
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento (atualiza build info automaticamente)
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS
- `npm run web` - Executa no navegador
- `npm run update-build-info` - Atualiza informações de build manualmente

## 📝 Notas

- As informações de build (hash do commit e data) são atualizadas automaticamente antes de iniciar o app
- É necessário configurar o Firebase para autenticação funcionar corretamente
- O projeto utiliza Firebase Authentication para login e cadastro de usuários



