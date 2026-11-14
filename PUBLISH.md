# 上传 GitHub：维护者操作手册

面向仓库维护者。以下命令在 **Git Bash**（Windows）或任意 POSIX shell 中执行；仓库根目录是 `word-master/`。

> **当前状态（2026-11-14）：已上线。** 公开仓库 <https://github.com/ALLEN20071028/word-master> 已创建，默认分支 `main`，本地提交与 16 个文件全部推送成功，远程验收通过。下文保留完整流程供日后重建或换账号复用，标注「✅ 已完成」的步骤无需再执行。

---

## 0. 本次上线验收记录

| 项目 | 实测结果 |
| --- | --- |
| 仓库 | `ALLEN20071028/word-master`，Public，默认分支 `main` |
| 推送 | `git push -u origin main` → `main -> main`（new branch），退出码 0 |
| 远程提交 | `6d8e225` / `1ed3c51` / `f0a4b74`，与本地一致 |
| 根目录文件数 | 16，与 `git ls-files` 完全一致 |
| 本地工作区 | `git status` 干净 |

远程根目录清单（API `GET /repos/ALLEN20071028/word-master/contents/`）：

```text
.gitattributes  .gitignore  CONTRIBUTING.md  LICENSE  PUBLISH.md  README.md
confused.js  index.html  package.json  server.js  validate.js
words4.js  words6.js  words_advanced.js  words_extra.js  words_reading.js
```

认证采用一次性 HTTP header 注入（`git -c http.extraHeader=...`），**令牌未写入 `.git/config` 的 remote URL，也未写入任何仓库文件**；remote 保持干净的 `https://github.com/ALLEN20071028/word-master.git`。该临时令牌用后应立即在 GitHub 设置中删除。

---

## 1. 前置检查

```bash
git --version
node --version
```

首次使用 Git 先设身份：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

确认没有把个人数据带进仓库：

```bash
cd <你的本地路径>/word-master
git status
```

`.gitignore` 已忽略 `*-progress.json`、`progress-backup*.json`、`.env`、`*.pem`。工作区上一级的 `word-master.zip` 不在仓库目录内，不会被提交。

---

## 2. 创建空仓库 ✅ 已完成

本次采用 **REST API + classic 个人访问令牌** 建仓：`POST /user/repos` 返回 201，参数 `name=word-master`、`private=false`、`auto_init=false`。仓库已存在，**不要重复执行**。

替代做法（换账号重建时可用）：

1. 打开 <https://github.com/new>，登录。
2. **Repository name** 填 `word-master`，选 **Public**。
3. **不要勾选** `Add a README file`、`Add .gitignore`、`Choose a license`。本地已有这三个文件，勾选会导致推送冲突。
4. 点 **Create repository**，复制仓库 URL `https://github.com/ALLEN20071028/word-master.git`。

---

## 3. 命令行认证（三选一）

命令行推送不能用 GitHub 账号密码，密码认证已移除。

| 方式 | 做法 |
| --- | --- |
| **A. GitHub CLI（最省事）** | 安装 GitHub CLI → `gh auth login` → 选 GitHub.com / HTTPS / 浏览器登录 |
| **B. HTTPS + 个人访问令牌** | GitHub → Settings → Developer settings → Personal access tokens → 生成 `repo` scope 的 classic 令牌 → 推送时代替密码输入；可装 Git Credential Manager 缓存 |
| **C. SSH** | 生成密钥对、把公钥加到 GitHub 账号 → remote 用 `git@github.com:ALLEN20071028/word-master.git` |
| ✗ GitHub 连接器（排障记录） | 实测：身份认证有效（`get_me` 返回 `ALLEN20071028`），但 `create_repository` 返回 `403 Resource not accessible by integration`。REST 文档说明 `POST /user/repos` 需 `Administration`(write) 或 `Repository creation`(write) 权限，故更可能是连接器未被授予该权限（**推断，待核**），并非「集成令牌不能建个人仓库」。最终改用方式 B 完成 |

本次实际用的是 **方式 B**，且为避免凭据落盘，未把令牌拼进 remote URL，而是单次传入：

```bash
AUTH=$(node -e "process.stdout.write(Buffer.from('x-access-token:'+process.env.TOKEN).toString('base64'))")
GIT_TERMINAL_PROMPT=0 git -c "http.extraHeader=Authorization: Basic $AUTH" push -u origin main
```

> 令牌等同密码：别写进仓库、别贴到聊天里，用完立即删除。令牌 expiration 到期后会被自动撤销，届时不能再用于 Git/API 认证，需重新认证；**已推送的代码与仓库不受影响**。**待核**：令牌创建入口、可选项与权限名称随 GitHub 界面调整，以官方文档为准。

---

## 4. 本地初始化并推送 ✅ 已完成

```bash
cd <你的本地路径>/word-master

git init -b main                 # Git >= 2.28
# 老版本 Git 用：git init && git symbolic-ref HEAD refs/heads/main

git add .
git status                       # 核对文件清单，确认无进度 JSON / 密钥
git commit -m "Initial commit: 单词斩 四六级词汇"

git remote add origin https://github.com/ALLEN20071028/word-master.git
git remote -v                    # 核对 URL
git push -u origin main
```

`ALLEN20071028` 换成你的 GitHub 用户名。若用 SSH：

```bash
git remote set-url origin git@github.com:ALLEN20071028/word-master.git
```

`README.md` 的 clone 地址、本文 remote 地址、`package.json` 的 `repository` / `homepage` / `bugs` 均已写入实际用户名 `ALLEN20071028`（来源：公开 API `GET /users/ALLEN20071028` 返回 200）。推送后核对：

```bash
git status
git remote -v
git log --oneline -3
```

---

## 5. 验收 ✅ 已完成

- 远程根目录 16 个文件，与本地一致；README 在仓库页渲染，LICENSE 识别为 MIT。
- 本地 `git status` 干净。
- 另找一台机器（或临时目录）验证克隆可运行：

```bash
git clone https://github.com/ALLEN20071028/word-master.git
cd word-master
npm start
```

浏览器打开 <http://localhost:8080> 应能看到首页；`npm run validate` 应输出「✅ 数据校验通过」。

> 说明：第 0 节的验收由 API 与本地 git 完成，「另机克隆后运行」尚未实际执行（**待核**）；本地已验证 `npm run check` 通过、静态服务器 8099 端口首页与词库脚本均 200，按上述命令可自行复现。

---

## 6. 日常更新

```bash
git add .
git commit -m "说明本次改动"
git push
```

本次使用的临时令牌删除后，`git push` 会要求重新认证；建议改用 Git Credential Manager 或 SSH，避免每次新建令牌。

---

## 7. 可选：GitHub Pages 在线预览（本次未开启）

纯静态项目可直接托管：仓库 **Settings → Pages → Build and deployment → Deploy from a branch → 选 `main` / `/ (root)` → Save**。`index.html` 在仓库根目录、无构建步骤，部署后可用生成的地址访问。

> **待核**：Pages 设置项名称与位置随 GitHub 界面调整，以当前页面为准。

---

## 参考资料（MLA）

- GitHub. "Adding locally hosted code to GitHub." *GitHub Docs*, docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github. Accessed 14 Nov. 2026.
- GitHub. "About Git." *GitHub Docs*, docs.github.com/cn/get-started/using-git/about-git. Accessed 14 Nov. 2026.
- GitHub. "About authentication to GitHub." *GitHub Docs*, docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github. Accessed 14 Nov. 2026.
- GitHub. "Token expiration and revocation." *GitHub Docs*, docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation. Accessed 14 Nov. 2026.
- GitHub. "Create a repository for the authenticated user." *GitHub Docs*, docs.github.com/en/rest/repos/repos. Accessed 14 Nov. 2026.
- Open Source Initiative. "The MIT License." *Open Source Initiative*, opensource.org/license/mit. Accessed 14 Nov. 2026.
