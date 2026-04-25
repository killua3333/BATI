import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const run = (command, cwd = process.cwd()) => {
  execSync(command, { cwd, stdio: 'inherit' });
};

const getGitConfigValue = (key, cwd) => {
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

const main = async () => {
  const repo = process.env.GITEE_REPO || process.argv[2];
  const branch = process.env.GITEE_PAGES_BRANCH || 'pages';
  const commitMessage =
    process.env.GITEE_COMMIT_MESSAGE ||
    `deploy: gitee pages ${new Date().toISOString()}`;

  if (!repo) {
    console.error(
      '缺少 Gitee 仓库地址。请传参或设置环境变量 GITEE_REPO。示例：node deploy-gitee-pages.mjs git@gitee.com:your_name/BATI.git'
    );
    process.exit(1);
  }

  const projectRoot = process.cwd();
  const distDir = path.join(projectRoot, 'dist');
  const userName = getGitConfigValue('user.name', projectRoot);
  const userEmail = getGitConfigValue('user.email', projectRoot);

  run('npm run build', projectRoot);

  if (!existsSync(distDir)) {
    console.error('构建完成后未找到 dist 目录。');
    process.exit(1);
  }

  await rm(path.join(distDir, '.git'), { recursive: true, force: true });

  run('git init', distDir);
  run('git checkout -B temp-pages', distDir);
  if (userName) {
    run(`git config user.name "${userName}"`, distDir);
  }
  if (userEmail) {
    run(`git config user.email "${userEmail}"`, distDir);
  }
  run('git add .', distDir);
  run(`git commit -m "${commitMessage}"`, distDir);
  run(`git push -f ${repo} HEAD:${branch}`, distDir);

  console.log(`已部署到 ${repo} 的 ${branch} 分支。`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
