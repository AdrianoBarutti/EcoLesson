// Script para atualizar automaticamente as informações de build
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  // Obtém o hash do commit atual
  const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  
  // Obtém a data do commit no formato YYYY-MM-DD
  const commitDate = execSync('git log -1 --format=%ci HEAD', { encoding: 'utf-8' })
    .trim()
    .split(' ')[0]; // Pega apenas a data (YYYY-MM-DD)
  
  // Caminho do arquivo de build info
  const buildInfoPath = path.join(__dirname, '..', 'src', 'config', 'buildInfo.ts');
  
  // Lê o arquivo app.json para obter a versão
  const appJsonPath = path.join(__dirname, '..', 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
  const version = appJson.expo.version;
  const appName = appJson.expo.name;
  
  // Gera o conteúdo do arquivo
  const content = `// Informações de build do app
// ⚠️ Este arquivo é gerado automaticamente pelo script scripts/update-build-info.js
// NÃO edite manualmente - suas alterações serão sobrescritas

export const buildInfo = {
  appName: '${appName}',
  version: '${version}',
  commitHash: '${commitHash}',
  buildDate: '${commitDate}',
};
`;

  // Escreve o arquivo
  fs.writeFileSync(buildInfoPath, content, 'utf-8');
  
  console.log('✅ Build info atualizado automaticamente!');
  console.log(`   Commit: ${commitHash.substring(0, 7)}`);
  console.log(`   Data: ${commitDate}`);
  console.log(`   Versão: ${version}`);
  
} catch (error) {
  console.error('❌ Erro ao atualizar build info:', error.message);
  console.error('   Certifique-se de que você está em um repositório Git');
  // Não falha o processo, apenas mostra o erro
}

