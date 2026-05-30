# 部署到 GitHub Pages（静态站点）

本仓库的静态站点目录为：`portfolio/`  
GitHub Pages 将发布 `portfolio/` 目录的内容为站点根目录。

## 1) 新建 GitHub 仓库

在 GitHub 新建一个仓库（建议 Public）。仓库名可以随意，例如：`portfolio`。

## 2) 本地初始化并推送

在本项目根目录执行（把 `<REPO_URL>` 替换为你的仓库地址）：

```bash
git init
git add .
git commit -m "chore: initial portfolio site"
git branch -M main
git remote add origin <REPO_URL>
git push -u origin main
```

> 如果你机器上尚未配置 git 凭据，请按 GitHub 提示配置 HTTPS token 或 SSH key。

## 3) 启用 GitHub Pages（Actions）

进入仓库：

`Settings` → `Pages` → `Build and deployment` → 选择 **GitHub Actions**。

随后每次 push 到 `main`，都会自动部署。首次部署可能需要 1–3 分钟。

## 4) 访问地址

- 项目页：`https://<username>.github.io/<repo>/`
- 如果仓库名是 `<username>.github.io`（用户主页仓库），则为：`https://<username>.github.io/`

