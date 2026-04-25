import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PAGES_BRANCH = 'pages';
const COMMIT_MESSAGE = 'chore: auto deploy to Gitee Pages';
// TODO: 如仓库地址变化，请改成你的 Gitee 仓库 SSH 地址
const GITEE_REPO_URL = 'git@gitee.com:killua33/bati.git';

const run = (command, cwd) => {
  execSync(command, { cwd, stdio: 'inherit' });
};

const readGitConfig = (key, cwd) => {
  try {
    return execSync(`git config --get ${key}`, {
      cwd,
      stdio: ['ignore', 'pipe', 'ignore']
    })
      .toString()
      .trim();
  } catch {
    return '';
  }
};

try {
  console.log('\n[1/5] 开始构建项目...');
  run('npm run build', ROOT_DIR);
  console.log('[1/5] 构建完成');

  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('未找到 dist 目录，请检查 Vite build 输出目录配置。');
  }

  console.log('\n[2/5] 切换到 dist 目录并准备 Git 环境...');
  process.chdir(DIST_DIR);

  const distGitDir = path.join(DIST_DIR, '.git');
  if (fs.existsSync(distGitDir)) {
    fs.rmSync(distGitDir, { recursive: true, force: true });
    console.log('[2/5] 已清理 dist 目录中的旧 .git');
  }

  console.log('\n[3/5] 初始化仓库并提交静态文件...');
  run('git init', DIST_DIR);
  const userName = readGitConfig('user.name', ROOT_DIR);
  const userEmail = readGitConfig('user.email', ROOT_DIR);
  if (userName) {
    run(`git config user.name "${userName}"`, DIST_DIR);
  }
  if (userEmail) {
    run(`git config user.email "${userEmail}"`, DIST_DIR);
  }
  run('git add -A', DIST_DIR);
  run(`git commit -m "${COMMIT_MESSAGE}"`, DIST_DIR);
  console.log('[3/5] 提交完成');

  console.log('\n[4/5] 强制推送到 Gitee Pages 分支...');
  run(`git push -f ${GITEE_REPO_URL} HEAD:${PAGES_BRANCH}`, DIST_DIR);
  console.log('[4/5] 推送完成');

  console.log('\n[5/5] 部署完成');
  console.log(`已将 dist 静态文件推送到 ${GITEE_REPO_URL} 的 ${PAGES_BRANCH} 分支。`);
} catch (error) {
  console.error('\n部署失败：', error.message);
  process.exit(1);
}
