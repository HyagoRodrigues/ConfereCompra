# ConfereCompra

Aplicativo móvel para gerenciamento e verificação de compras através da leitura de QR Code de NFC-e.

## Estrutura do Projeto

O projeto está dividido em dois serviços principais:

### Mobile (/mobile)
Aplicativo React Native para interação com o usuário.

### Backend (/backend)
API REST desenvolvida com Nest.js para processamento e armazenamento dos dados.

## Funcionalidades

- Leitura de QR Code de NFC-e
- Exibição detalhada das informações de compra
- Sistema de conferência manual
- Histórico de compras
- Dashboard de gastos
- Autenticação de usuário
- Sincronização com a nuvem
- Exportação de dados

## Requisitos

- Node.js 16+
- React Native CLI
- Android Studio
- Git

## Instalação

### Mobile
1. Entre na pasta mobile:
```cd mobile```
2. Instale as dependências:
```npm install```
3. Execute a aplicação:
```npx react-native run-android```

### Backend
1. Entre na pasta backend:
```cd backend```
2. Instale as dependências:
```npm install```
3. Execute o servidor:
```npm run start:dev```

## Stack Tecnológica

### Mobile
- React Native
- TypeScript
- Redux Toolkit
- React Navigation
- Realm/SQLite

### Backend
- Nest.js
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication