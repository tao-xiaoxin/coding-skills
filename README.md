# Coding Skills

[English](README.en.md)

一组可复用、以安全为先的 Coding Agent Skills，覆盖 Git 工作流、测试、代码审查、发布与部署。

`coding-skills` 是便于安装和审查的 Agent Skill 源仓库。首个版本将 Git 工作流刻意拆分为独立能力：检查变更、本地提交、推送分支和创建 Pull Request。请求“提交”不会隐式发布代码。

## 已包含的 Skills

| Skill | 用途 | 副作用 |
| --- | --- | --- |
| [`git-status`](skills/git-status/SKILL.md) | 检查仓库状态，并汇总已暂存和未暂存的变更。 | 无 |
| [`git-commit`](skills/git-commit/SKILL.md) | 仅暂存明确指定的文件，并创建 Conventional Commit。 | 本地提交 |
| [`git-push`](skills/git-push/SKILL.md) | 仅将明确目标的当前分支推送到远端。 | 更新远端分支 |
| [`git-pull-request`](skills/git-pull-request/SKILL.md) | 为已经推送的分支创建 GitHub Pull Request。 | 创建 GitHub Pull Request |

## 安全约定

- 提交、推送和创建 Pull Request 是彼此独立的 Skills，必须由用户分别明确授权。
- 写入类 Skills 不会默认使用 `git add .`、`git add -A`、`git commit -a`、强制推送、删除远端引用、自动合并或改写历史。
- `main`、`master` 和 `release/*` 默认视为受保护目标；除非用户明确指定并确认目标，否则不会对其执行写入操作。
- 常规提交流程不得暂存疑似凭据或私钥的文件。
- Skill 文本是工作指引，不是权限系统。敏感操作仍应依赖宿主审批、Git hooks、分支保护和结构化工具等强制措施。详见[安全模型](docs/security-model.md)。

## 使用 GitHub CLI 安装

请使用包含 `gh skill` 命令的 GitHub CLI 版本。安装第三方 Skill 前，始终先预览内容。

```bash
# 预览一个 Skill，不安装
gh skill preview tao-xiaoxin/coding-skills git-commit

# 为当前项目中的 Codex 安装一个 Skill
gh skill install tao-xiaoxin/coding-skills git-commit \
  --agent codex --scope project

# 为当前项目中的 Claude Code 安装一个 Skill
gh skill install tao-xiaoxin/coding-skills git-commit \
  --agent claude-code --scope project

# 为用户级 Codex 环境安装全部 Skills
gh skill install tao-xiaoxin/coding-skills --all \
  --agent codex --scope user

# 查看已安装的 Skills 并检查更新
gh skill list
gh skill update
```

本地开发、手动安装兜底方案，以及 Codex / Claude Code 的行为差异，请阅读[宿主兼容性说明](docs/host-compatibility.md)。

## 开发

环境要求：Node.js 22+ 与 pnpm 11+。

```bash
pnpm install

# 交互式创建 Conventional Commit
pnpm commit

# 校验最新一条提交信息
pnpm lint:commit

# 校验 Skill 结构和仓库测试
pnpm validate:skills
pnpm test

# 发布前使用 GitHub CLI 校验包
gh skill publish --dry-run
```

`prepare` 脚本会配置本地 `commit-msg` hook。已有克隆仓库在安装依赖后，可以执行 `pnpm prepare` 刷新该 hook。

## 仓库结构

```text
skills/<skill-name>/SKILL.md      可安装的 Skill 入口文件
skills/<skill-name>/references/   详细流程、标准和模板
docs/                             宿主兼容性与安全说明
scripts/                          仓库校验脚本
.github/workflows/                CI 与手动发布工作流
```

## 发布

发布前校验：

```bash
gh skill publish --dry-run
gh skill publish --tag v0.1.0
```

发布工作流会在审核后手动触发，并会在创建请求的 release tag 前校验 Skill 包。

## 贡献

提交规范、校验命令和 Skill 编写要求请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。[AGENTS.md](AGENTS.md) 是供 Coding Agent 使用的仓库指令文件。

## 许可证

[Apache License 2.0](LICENSE)
