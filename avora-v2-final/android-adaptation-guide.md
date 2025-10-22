# Diretrizes para Adaptação do Avora para Android

## Introdução

Este documento fornece diretrizes para adaptar o aplicativo web Avora para uma aplicação Android nativa. A adaptação será feita usando o Capacitor, que permite empacotar aplicativos web como aplicativos nativos.

## Pré-requisitos

1. **Android Studio** - Necessário para compilação e emulação
2. **Node.js e npm** - Já instalados no projeto
3. **JDK 11+** - Necessário para desenvolvimento Android

## Passos para Adaptação

### 1. Instalar Capacitor no Projeto

```bash
# Instalar Capacitor CLI e Core
cd avora-calendar
npm install @capacitor/cli @capacitor/core

# Inicializar Capacitor no projeto
npx cap init Avora com.avora.app --web-dir=build
```

### 2. Adicionar Plataforma Android

```bash
# Instalar plataforma Android
npm install @capacitor/android

# Adicionar plataforma Android ao projeto
npx cap add android
```

### 3. Modificações Necessárias para Compatibilidade Mobile

#### Ajustes de Responsividade

- Atualizar o CSS para melhor adaptação a telas menores
- Implementar gestos de toque para navegação no calendário
- Ajustar tamanhos de fonte e elementos para melhor legibilidade em dispositivos móveis

#### Modificações no arquivo `public/index.html`

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#7c3aed">
```

#### Adicionar Suporte a Gestos de Toque

Instalar biblioteca de gestos:

```bash
npm install react-swipeable
```

Implementar na aplicação para permitir navegação entre dias/meses.

### 4. Construir o Aplicativo

```bash
# Criar build de produção
npm run build

# Copiar arquivos web para o projeto Android
npx cap copy android

# Sincronizar plugins e dependências
npx cap sync android
```

### 5. Personalizar o Aplicativo Android

#### Ícones e Splash Screen

Gerar ícones e splash screen para Android:

```bash
npm install @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#7c3aed' --splashBackgroundColor '#7c3aed'
```

#### Configurar `android/app/src/main/AndroidManifest.xml`

Adicionar permissões necessárias:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 6. Testar no Emulador

```bash
# Abrir projeto no Android Studio
npx cap open android

# Ou executar diretamente no emulador
npx cap run android
```

### 7. Compilar APK para Distribuição

No Android Studio:
1. Build > Generate Signed Bundle/APK
2. Selecionar APK
3. Criar ou usar uma keystore existente
4. Selecionar variante de build (release)
5. Finalizar o processo

## Considerações Adicionais

### Armazenamento de Dados

- Substituir localStorage por capacitor-community/storage para melhor persistência
- Implementar backup e sincronização de dados

### Notificações

- Adicionar notificações para lembretes de agendamentos:

```bash
npm install @capacitor/push-notifications
```

### Integração com Recursos Nativos

- Adicionar integração com calendário do dispositivo:

```bash
npm install @capacitor/calendar
```

- Adicionar compartilhamento:

```bash
npm install @capacitor/share
```

## Estrutura de Arquivos Após Adaptação

```
avora-calendar/
├── android/           # Projeto Android gerado pelo Capacitor
├── build/             # Build de produção do aplicativo web
├── capacitor.config.ts # Configuração do Capacitor
├── public/            # Arquivos públicos do aplicativo web
├── src/               # Código-fonte do aplicativo
└── package.json       # Dependências do projeto
```

## Próximos Passos

1. Implementar funcionalidades específicas para dispositivos móveis
2. Otimizar desempenho para dispositivos com recursos limitados
3. Adicionar testes específicos para a plataforma Android
4. Preparar para publicação na Google Play Store
