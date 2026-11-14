# 上传 GitHub：维护者操作手册

面向仓库维护者。以下命令在 **Git Bash**（Windows）或任意 POSIX shell 中执行；仓库根目录是 `word-master/`。

> 本地 `git init`、首次提交与 `remote add` 已代跑完成；远程仓库尚未创建、尚未 push。已实测：WorkBuddy 的 GitHub 连接器身份认证有效（`get_me` 返回 `ALLEN20071028`），但创建仓库接口返回 `403 Resource not accessible by integration`。GitHub 官方文档说明 `POST /user/repos` 支持 GitHub App installation tokens，但需 `Administration`(write) 或 `Repository creation`(write) 权限；因此更可能是该连接器未被授予此权限（**推断，待核**），并非「集成令牌不能建个人仓库」。绕过办法：个人访问令牌，或网页建仓后浏览器授权。GitHub 界面入口与认证细节可能更新，以官方文档为准（见文末）。

---

## 0. 前置检查

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
cd C:/Users/27564/WorkBuddy/2026-09-30-22-41-08/word-master
git status          # 尚未 init 时会报错，可跳过
```

`.gitignore` 已忽略 `*-progress.json`、`progress-backup*.json`、`.env`、`*.pem`。工作区上一级的 `word-master.zip` 不在仓库目录内，不会被提交。

---

## 1. 网页端创建空仓库

1. 打开 <https://github.com/new>，登录。
2. **Repository name** 填 `word-master`。
3. 选 **Public**。
4. **不要勾选** `Add a README file`、`Add .gitignore`、`Choose a license`。本地已有这三个文件，勾选会导致推送冲突。
5. 点 **Create repository**。
6. 在 Quick Setup 页复制仓库 URL（`https://github.com/ALLEN20071028/word-master.git`），下一步要用。

---

## 2. 命令行认证（三选一）

命令行推送不能用 GitHub 账号密码，密码认证已移除。

| 方式 | 做法 |
| --- | --- |
| **A. GitHub CLI（最省事）** | 安装 GitHub CLI → `gh auth login` → 选 GitHub.com / HTTPS / 浏览器登录 |
| **B. HTTPS + 个人访问令牌** | GitHub → Settings → Developer settings → Personal access tokens → 生成令牌（命令行推送需 `repo` 权限）→ `git push` 提示密码时粘贴令牌，不要填账号密码；可装 Git Credential Manager 缓存 |
| **C. SSH** | 生成 SSH 密钥对、把公钥加到 GitHub 账号 → remote 用 `git@github.com:ALLEN20071028/word-master.git` |
| ✗ GitHub 连接器 | 已实测不够用：认证有效，但创建仓库被拒 `403 Resource not accessible by integration`（缺 `Repository creation` 权限，待核）。仍需下面的账号级认证 |

> 令牌等同密码，别写进仓库、别贴到聊天里。**待核**：令牌创建入口、可选项与权限名称随 GitHub 界面调整，以官方文档为准。

---

## 3. 本地初始化并推送

> 以下命令中 `git init` 到 `git remote -v` 已执行完毕，首次提交已生成。完成第 1、2 节后，直接从 `git push -u origin main` 开始。

```bash
cd C:/Users/27564/WorkBuddy/2026-09-30-22-41-08/word-master

git init -b main                 # Git >= 2.28
# 老版本 Git 用：git init && git symbolic-ref HEAD refs/heads/main

git add .
git status                       # 核对文件清单，确认无进度 JSON / 密钥
git commit -m "Initial commit: 单词斩 四六级词汇"

git remote add origin https://github.com/ALLEN20071028/word-master.git
git remote -v                    # 核对 URL
git push -u origin main
```

`ALLEN20071028` 换成你的 GitHub 用户名。若用 SSH，把 remote 换成 `git@github.com:ALLEN20071028/word-master.git`：

```bash
git remote set-url origin git@github.com:ALLEN20071028/word-master.git
```

### 已代跑完成、无需再改

`README.md` 的 clone 地址、本文的 remote 地址、`package.json` 的 `repository` / `homepage` / `bugs` 均已写入实际用户名 `ALLEN20071028`。该用户名来自 GitHub 公开 API 查询（`GET /users/ALLEN20071028` 返回 200，`login=ALLEN20071028`）。推送前核对：

```bash
git status
git remote -v
git log --oneline -1
```

---

## 4. 验收

- 刷新仓库页：README 正常渲染，LICENSE 被识别为 MIT，文件数齐全。
- 本地执行 `git status`，应显示工作区干净。
- 另找一台机器（或临时目录）验证克隆可运行：

```bash
git clone https://github.com/ALLEN20071028/word-master.git
cd word-master
npm start
```

浏览器打开 <http://localhost:8080>，应能看到首页。`npm run validate` 应输出「✅ 数据校验通过」。

---

## 5. 日常更新

```bash
git add .
git commit -m "说明本次改动"
git push
```

---

## 6. 可选：GitHub Pages 在线预览

纯静态项目可直接托管：仓库 **Settings → Pages → Build and deployment → Deploy from a branch → 选 `main` / `/ (root)` → Save**。等待部署完成后用生成的地址访问。

> **待核**：Pages 设置项名称与位置随 GitHub 界面调整，以当前页面为准。

---

## 参考资料（MLA）

- GitHub. "Adding locally hosted code to GitHub." *GitHub Docs*, docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github. Accessed 14 Nov. 2026.
- GitHub. "About Git." *GitHub Docs*, docs.github.com/cn/get-started/using-git/about-git. Accessed 14 Nov. 2026.
- GitHub. "About authentication to GitHub." *GitHub Docs*, docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github. Accessed 14 Nov. 2026.
- Open Source Initiative. "The MIT License." *Open Source Initiative*, opensource.org/license/mit. Accessed 14 Nov. 2026.
