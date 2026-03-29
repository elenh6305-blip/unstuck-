# Git 快速上手教程

这份教程是给“会一点 Web 开发，但没有计算机科班背景”的你准备的。

目标只有一个：用最快的速度学会 Git，并覆盖 95% 以上日常会用到的功能，让你以后能比较稳地管理代码、维护版本、协作分支、做提交前测试。

---

## 先说结论

如果你现在时间很少，先只学下面这 8 个命令：

```bash
git clone
git status
git add
git commit
git pull
git push
git switch
git log --oneline --graph --decorate --all
```

如果你把这 8 个命令真正用熟，再补上下面这些“救命命令”：

```bash
git diff
git restore
git restore --staged
git stash
git merge
git rebase
git reflog
```

你基本就已经覆盖大多数真实工作场景了。

---

## 第 1 部分：先建立正确脑图

很多人学 Git 学不明白，不是命令难，而是脑图没搭起来。

你只要记住 Git 里有 4 个地方：

1. 工作区
你正在直接修改的文件。

2. 暂存区
你准备放进下一次提交的内容。

3. 本地仓库
保存在你电脑里的提交历史。

4. 远程仓库
GitHub、GitLab 之类在线仓库。

可以把它想成这条流水线：

```text
工作区 -> 暂存区 -> 本地仓库 -> 远程仓库
修改文件   git add   git commit   git push
```

只要理解这个流程，很多命令就不再乱。

---

## 第 2 部分：第一次配置 Git

先检查 Git 是否安装：

```bash
git --version
```

你这台机器上已经装好了，版本是：

```bash
git version 2.52.0.windows.1
```

首次配置用户名和邮箱：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

查看配置：

```bash
git config --global --list
```

建议再加两个比较舒服的设置：

```bash
git config --global init.defaultBranch main
git config --global pull.rebase false
```

解释：

- `init.defaultBranch main`：以后新仓库默认主分支叫 `main`
- `pull.rebase false`：先用更容易理解的合并方式，不急着一开始就上 rebase 工作流

---

## 第 3 部分：最常用的日常工作流

这是你以后会重复无数次的流程。

### 场景 A：你在一个已有项目里开发

```bash
git status
git switch -c feat/login-page
# 开始写代码
git status
git add .
git commit -m "feat: add login page layout"
git push -u origin feat/login-page
```

### 场景 B：第二天继续开发前

```bash
git switch main
git pull
git switch feat/login-page
```

### 场景 C：功能做完，合并回主分支

如果是 GitHub 协作，一般会走 Pull Request。

如果是本地自己练习，也可以直接：

```bash
git switch main
git pull
git merge feat/login-page
git push
```

---

## 第 4 部分：你一定要会的核心命令

## `git clone`

把远程仓库复制到本地。

```bash
git clone https://github.com/用户名/仓库名.git
```

克隆后进入目录：

```bash
cd 仓库名
```

什么时候用：

- 第一次把别人的项目拉到自己电脑上
- 第一次开始参与一个项目

---

## `git status`

这是最重要的命令，没有之一。

```bash
git status
```

它会告诉你：

- 你当前在哪个分支
- 哪些文件被修改了
- 哪些文件已经进入暂存区
- 哪些文件还没被跟踪

建议：只要你不确定现在发生了什么，先敲 `git status`。

---

## `git add`

把文件从工作区放进暂存区。

```bash
git add 文件名
git add src/App.jsx
git add .
```

常见理解：

- `git add 文件名`：只暂存某个文件
- `git add .`：把当前目录下改动都暂存

新手建议：

- 小心使用 `git add .`
- 提交前先看 `git status`
- 最好明确知道自己这次要提交什么

---

## `git commit`

把暂存区内容正式记录到本地历史里。

```bash
git commit -m "feat: add login page"
```

提交信息建议遵循这个模板：

```text
feat: 新功能
fix: 修 bug
docs: 文档修改
refactor: 重构
style: 格式调整
test: 测试相关
chore: 杂项维护
```

例子：

```bash
git commit -m "fix: correct task history sorting"
git commit -m "docs: add setup instructions"
```

好提交信息的标准：

- 一眼看出这次改了什么
- 不写“update”这种没信息量的话
- 一次提交尽量只做一件事

---

## `git push`

把本地提交上传到远程仓库。

```bash
git push
```

第一次推一个新分支时通常要这样：

```bash
git push -u origin feat/login-page
```

解释：

- `origin`：远程仓库默认名字
- `-u`：把本地分支和远程分支关联起来，以后直接 `git push` 就行

---

## `git pull`

把远程最新内容拉到本地并合并。

```bash
git pull
```

建议习惯：

- 开始写代码前先 `git pull`
- 切回 `main` 后先 `git pull`
- 合并功能分支前也先 `git pull`

---

## `git switch`

切换分支，比老命令 `git checkout` 更直观。

```bash
git switch main
git switch feat/login-page
git switch -c feat/register-page
```

解释：

- `git switch 分支名`：切换到已有分支
- `git switch -c 分支名`：创建并切换到新分支

---

## `git log`

看提交历史。

推荐直接用这条：

```bash
git log --oneline --graph --decorate --all
```

你会看到：

- 每次提交的简短记录
- 分支是怎么分叉、合并的
- 当前 HEAD 在哪

这是理解版本历史最有帮助的一条命令。

---

## 第 5 部分：你每天最可能用到的完整流程

下面是最推荐的个人/小团队流程。

### 1. 先切回主分支并更新

```bash
git switch main
git pull
```

### 2. 新开功能分支

```bash
git switch -c feat/search-improvement
```

分支命名建议：

- `feat/xxx`：功能开发
- `fix/xxx`：修 bug
- `docs/xxx`：文档
- `refactor/xxx`：重构

### 3. 编码过程中反复查看状态

```bash
git status
```

### 4. 查看改动内容

```bash
git diff
```

如果已经 `add` 了，想看暂存区内容：

```bash
git diff --staged
```

### 5. 暂存并提交

```bash
git add .
git commit -m "feat: improve search interaction"
```

### 6. 推送分支

```bash
git push -u origin feat/search-improvement
```

### 7. 到 GitHub 发起 Pull Request

团队协作时一般不直接把功能分支硬合并到 `main`，而是提 PR，让别人 review。

---

## 第 6 部分：分支到底怎么管理

这是你特别提到想学的重点。

## 最适合初学者的分支规则

先用最简单、最稳的策略：

1. `main`
永远保持“尽量可运行、可发布”。

2. 每个新功能一个新分支
不要在 `main` 上直接开发。

3. 做完以后通过 PR 合并回 `main`
这样历史清晰，也更适合协作。

### 推荐结构

```text
main
  ├─ feat/login-page
  ├─ fix/history-bug
  └─ docs/git-guide
```

### 为什么不要一直在 `main` 上写

因为这样会带来几个问题：

- 半成品代码直接污染主分支
- 很难回头找某次功能改动
- 团队协作时容易互相覆盖
- 出问题时不容易定位是谁改坏了

---

## 第 7 部分：多人协作时最常见的工作方式

### 方式一：最常见的 PR 工作流

1. 从 `main` 拉最新代码
2. 新建自己的功能分支
3. 写代码
4. 本地测试
5. 提交 commit
6. 推到远程
7. 发 Pull Request
8. 代码评审通过后合并

这是目前最主流、也最推荐的方式。

---

## 第 8 部分：提交前怎么测试

你提到“学习大家维护和管理分支版本、测试的方法”，这里给你一个很实用的标准流程。

### 每次提交前至少做这 3 件事

1. 看改了什么

```bash
git diff
```

2. 跑项目检查

对 Web 项目，常见是：

```bash
npm run lint
npm test
npm run build
```

不是每个项目都有这三个命令，但思想一样：

- `lint`：代码风格和明显错误检查
- `test`：自动化测试
- `build`：确认项目还能正常构建

3. 再提交

```bash
git add .
git commit -m "fix: prevent empty search submission"
```

### 一个很好的团队习惯

不要只在“做完全部功能之后”才测试。

更好的方式是：

- 改一点，测一点
- 提交前再测一次
- 提 PR 前再完整测一次

---

## 第 9 部分：你需要会的“查看类命令”

## `git diff`

看工作区和暂存区的差异。

```bash
git diff
git diff --staged
```

什么时候用：

- 提交前确认自己到底改了什么
- 调试“为什么这个文件变红了”
- review 自己的改动

## `git show`

查看某次提交详情。

```bash
git show 提交ID
```

例子：

```bash
git show a1b2c3d
```

## `git blame`

看某一行代码最后是谁改的。

```bash
git blame src/App.jsx
```

什么时候有用：

- 查 bug 来源
- 找到“这段逻辑是谁改的”

---

## 第 10 部分：最常用的撤销与补救

新手最怕“改错了怎么办”。这一部分很重要。

## 情况 1：文件改乱了，但还没 `add`

```bash
git restore 文件名
```

例子：

```bash
git restore src/App.jsx
```

作用：
把工作区这个文件恢复到最近一次提交的状态。

注意：
这会丢掉你没提交的修改。

---

## 情况 2：你已经 `git add` 了，但还不想提交

```bash
git restore --staged 文件名
```

例子：

```bash
git restore --staged src/App.jsx
```

作用：
把文件从暂存区拿出来，但保留你本地改动。

---

## 情况 3：刚刚提交了，但提交信息想改

```bash
git commit --amend -m "feat: improve focus mode interaction"
```

作用：
修改最近一次提交的信息。

如果你还没 push，这很好用。

如果你已经 push 了，再 amend 就要更小心。

---

## 情况 4：想临时把改动收起来，先处理别的事

```bash
git stash
git stash pop
```

解释：

- `git stash`：暂时存起来
- `git stash pop`：再取出来

很适合这类场景：

- 你写到一半，突然要切去修线上 bug
- 你现在改动还没准备提交

---

## 情况 5：提交搞丢了，想找回来

```bash
git reflog
```

这是 Git 的“后悔药记录本”。

它会记录你最近 HEAD 去过哪里。很多“误操作”都可以靠它救回来。

比如你看到：

```text
abc1234 HEAD@{0}: reset: moving to HEAD~1
def5678 HEAD@{1}: commit: feat: add login flow
```

你就可以回到那个提交：

```bash
git reset --hard def5678
```

注意：

- `reset --hard` 很强，会直接覆盖工作区
- 不确定时先别用
- 实战里先学会 `reflog`，再谨慎用 `reset`

---

## 第 11 部分：合并分支到底怎么做

## 最简单的合并方式：`merge`

```bash
git switch main
git pull
git merge feat/login-page
```

意思是：
把 `feat/login-page` 的改动合并进 `main`。

### 合并后可以删掉功能分支

```bash
git branch -d feat/login-page
```

如果远程分支也想删：

```bash
git push origin --delete feat/login-page
```

---

## 第 12 部分：冲突怎么处理

冲突不是出错，是协作中的正常现象。

### 冲突通常发生在什么时候

- 你和别人同时改了同一段代码
- 你本地分支太久没同步 `main`
- 合并或 pull 的时候 Git 不知道该保留哪一版

### 遇到冲突后的标准步骤

1. 先 `git status`
2. 打开冲突文件
3. 找到这些标记：

```text
<<<<<<< HEAD
你的内容
=======
别人的内容
>>>>>>> 分支名
```

4. 手动修改成你真正想保留的最终结果
5. 删除这些冲突标记
6. 保存文件
7. `git add 文件名`
8. 完成合并提交

如果是 merge 产生的冲突，通常这样继续：

```bash
git add .
git commit
```

---

## 第 13 部分：`merge` 和 `rebase` 到底选哪个

新手版本结论：

- 先把 `merge` 用熟
- 团队没有明确要求前，不要急着大量用 `rebase`

### `merge` 的特点

- 更直观
- 历史更真实
- 更适合初学者

### `rebase` 的特点

- 提交历史更直
- 看起来更整洁
- 但改写历史，理解成本更高

### 什么时候你会开始接触 `rebase`

比如团队要求你在提 PR 前，把功能分支基于最新 `main` 整理一遍：

```bash
git switch feat/login-page
git fetch origin
git rebase origin/main
```

你现阶段只要知道：

- `rebase` 很常见
- 但不是你入门第一天必须精通的内容

---

## 第 14 部分：初始化自己的新项目

如果你不是克隆别人的仓库，而是自己新建项目：

```bash
git init
git add .
git commit -m "chore: initial commit"
```

然后关联远程仓库：

```bash
git remote add origin https://github.com/用户名/仓库名.git
git push -u origin main
```

查看远程仓库：

```bash
git remote -v
```

---

## 第 15 部分：95% 日常够用的命令速查表

### 基础操作

```bash
git clone 仓库地址
git init
git status
git add 文件名
git add .
git commit -m "说明"
git push
git pull
```

### 分支操作

```bash
git branch
git switch main
git switch -c feat/xxx
git merge feat/xxx
git branch -d feat/xxx
```

### 查看历史和改动

```bash
git log --oneline --graph --decorate --all
git diff
git diff --staged
git show 提交ID
git blame 文件名
```

### 撤销与补救

```bash
git restore 文件名
git restore --staged 文件名
git commit --amend -m "新信息"
git stash
git stash pop
git reflog
```

---

## 第 16 部分：真实工作中的推荐习惯

### 好习惯 1：不要直接在 `main` 上开发

永远新建分支：

```bash
git switch -c feat/xxx
```

### 好习惯 2：一次提交只做一件事

坏例子：

- 改 UI
- 顺手修 bug
- 顺手改文案
- 顺手重构

这会让提交历史非常难读。

### 好习惯 3：提交前一定看 `git diff`

这能帮你发现：

- 多改了不该改的文件
- console.log 忘删
- 配置文件不该提交却进来了

### 好习惯 4：提交前做最小测试

对前端项目，最少做到：

```bash
npm run build
```

更理想的是：

```bash
npm run lint
npm test
npm run build
```

### 好习惯 5：多拉小分支，少堆超级大提交

功能越小，分支越短命，越不容易冲突。

### 好习惯 6：写人类能看懂的 commit message

比如：

```text
feat: add history page filters
fix: prevent duplicate task creation
docs: add git learning guide
```

---

## 第 17 部分：新手最容易犯的错误

### 错误 1：不看状态就乱提交

解决：

```bash
git status
git diff
```

### 错误 2：一直在 `main` 上改

解决：

```bash
git switch -c feat/xxx
```

### 错误 3：一次提交塞太多内容

解决：

- 按功能拆 commit
- 按目的拆 commit

### 错误 4：不 pull 就直接 push

结果：
可能远程已经更新，导致冲突或推不上去。

解决：

```bash
git pull
```

### 错误 5：看见 `reset --hard` 就乱用

解决：

- 先别把它当日常命令
- 真出问题时先看 `git reflog`

---

## 第 18 部分：最推荐你的学习顺序

不要试图一天把 Git 全背下来。

最有效的顺序是：

### 第 1 阶段：先会提交代码

只练这几个：

```bash
git status
git add
git commit
git push
git pull
```

### 第 2 阶段：再学分支

只练这几个：

```bash
git switch -c
git switch
git merge
```

### 第 3 阶段：再学排错和补救

只练这几个：

```bash
git diff
git restore
git stash
git reflog
```

### 第 4 阶段：最后再碰 rebase

```bash
git rebase
```

---

## 第 19 部分：一个你可以直接照抄的团队开发流程

下面这套流程很适合 Web 开发。

### 开始一个新需求

```bash
git switch main
git pull
git switch -c feat/user-settings
```

### 开发过程中

```bash
git status
git diff
```

### 本地验证

```bash
npm run lint
npm test
npm run build
```

### 提交代码

```bash
git add .
git commit -m "feat: add user settings page"
```

### 推送并发 PR

```bash
git push -u origin feat/user-settings
```

### 合并完成后收尾

```bash
git switch main
git pull
git branch -d feat/user-settings
```

---

## 第 20 部分：一句话记住每个命令

- `git status`：我现在是什么状态
- `git add`：我要把这些改动装进下一次提交
- `git commit`：把这些改动记进历史
- `git push`：把本地历史发到远程
- `git pull`：把远程最新历史拉下来
- `git switch`：切换到另一个版本线
- `git diff`：看看我到底改了什么
- `git restore`：把某些改动撤回去
- `git stash`：先寄存一下，等会再回来
- `git merge`：把一条分支的成果并进另一条
- `git reflog`：后悔药记录本

---

## 第 21 部分：你现在最值得做的练习

如果你想最快学会，不要只看，要练。

建议你在一个测试仓库里自己走一遍：

1. 新建一个仓库
2. 新建一个文件并提交
3. 修改文件再提交一次
4. 新建功能分支
5. 在功能分支里改代码并提交
6. 切回 `main`
7. 把功能分支 merge 回来
8. 故意制造一次冲突并手动解决
9. 用 `git stash` 暂存改动
10. 用 `git reflog` 看历史移动记录

你只要亲手做过这一轮，理解会快很多。

---

## 最后的建议

Git 不需要“背完”才开始用。

真正有效的方法是：

- 先掌握日常工作流
- 遇到问题时知道该查哪个命令
- 每次提交前都保持小心和清晰

如果你现在只能记住一句话，那就记住这句：

**不确定时，先看 `git status`；提交前，先看 `git diff`。**

---

## 如果你想继续，我最推荐的下一步

我可以继续帮你做下面任意一种进阶材料：

1. 一份“只保留最常用命令”的 Git 速查卡
2. 一份“专门面向 GitHub / Pull Request 协作”的教程
3. 一份“在你的这个 Web 项目里怎么实际使用 Git”的演练版教程
4. 一套带答案的 Git 练习题，帮你 1 小时内快速实操入门

---

## 第 22 部分：基于官方文档的增补

下面这几条，是我额外参考 Git 官方文档和 GitHub 官方文档后，认为值得补进来的内容。它们不是入门第一天必须背下来的命令，但已经非常接近日常真实协作。

### 增补 1：学会区分 `fetch` 和 `pull`

很多初学者只知道 `git pull`，但团队里经常会先用：

```bash
git fetch origin
```

区别可以这样理解：

- `git fetch`：只下载远程最新历史，不改你当前工作区
- `git pull`：下载并尝试合并到你当前分支

为什么这很重要：

- 当你只是想“先看看远程有没有新东西”时，`fetch` 更安全
- 当你担心一拉就冲突时，先 `fetch` 再决定怎么处理，更稳

常见组合：

```bash
git fetch origin
git log --oneline --graph --decorate --all
```

### 增补 2：团队协作里要知道 `revert`，不要只知道 `reset`

前面我讲了 `reset` 和 `reflog`，但如果是已经 push 到远程、而且别人也可能基于这段历史继续工作了，通常更推荐用：

```bash
git revert 提交ID
```

作用：

- 不是“删掉历史”
- 而是“新建一个反向提交，把那次改动抵消掉”

这在团队协作里通常比改写历史更安全。

你可以把它们简单理解成：

- `git reset`：更像回到过去并改写历史
- `git revert`：保留历史，但用一个新提交撤销旧提交

初学者实践建议：

- 本地还没 push，优先考虑 `restore`、`amend`、谨慎 `reset`
- 已经 push 到共享分支，优先考虑 `revert`

### 增补 3：Pull Request 不只是“提交代码”，还是“跑检查”

GitHub 官方协作文档里，一个很核心的真实工作流是：

1. 开分支
2. 提交代码
3. 发 Pull Request
4. 看 review
5. 看 Checks / CI 是否通过
6. 再合并

也就是说，PR 不只是“请人看代码”，还是“确认自动化检查通过”的入口。

所以你以后做 Web 项目时，最好逐渐形成这个习惯：

- 本地先跑 `lint`
- 本地先跑 `test`
- 本地先跑 `build`
- 提 PR 后再看线上 CI 结果

### 增补 4：很多团队会保护 `main` 分支

GitHub 现在比较常见的做法，是给仓库加 branch protection 或 rulesets。

实际效果通常是：

- 不允许直接 push 到 `main`
- 必须通过 Pull Request 合并
- 必须通过状态检查
- 可能还要求至少 1 人 review

这不是“麻烦”，而是为了减少主分支被误操作污染。

所以如果你以后发现自己不能直接推 `main`，这通常不是你做错了，而是仓库规则在保护团队流程。

### 增补 5：PR 可以先开 Draft

现在很多团队会先开 Draft Pull Request，也就是“草稿 PR”。

这很适合这些场景：

- 功能还没做完，但想先让别人看到方向
- 想尽早触发 CI
- 想先讨论方案，而不是等全部写完再提

这条很实用，因为它能把“代码评审”从最后一步，变成开发过程中的持续协作。

### 增补 6：远程协作不一定都是“同仓库直推”

GitHub 官方文档里还会区分两种常见模式：

1. Shared repository model
大家都在同一个仓库里协作

2. Fork and pull model
你先 fork 别人的仓库，在自己的副本里开发，再提 PR 回原仓库

你现在先重点掌握 shared repository model 就够了。

如果以后你参与开源项目，才会更高频碰到 fork 工作流。

### 增补 7：`switch` 和 `restore` 已经是现代 Git 的推荐入门命令

较新的 Git 文档里，`git switch` 和 `git restore` 已经是更清晰的学习入口。

原因很简单：

- `checkout` 功能太多，容易混淆
- `switch` 专门处理分支切换
- `restore` 专门处理文件恢复

所以你这份教程用 `switch` / `restore` 作为主线，是符合现在 Git 学习方向的，不需要退回去优先学 `checkout`。

### 一个更贴近团队真实流程的升级版模板

```bash
git switch main
git pull
git switch -c feat/your-feature

# 开发中
git status
git diff

# 本地检查
npm run lint
npm test
npm run build

# 提交
git add .
git commit -m "feat: describe your change"
git push -u origin feat/your-feature

# 到 GitHub 开 Draft PR 或正常 PR
# 等 review 和 CI checks
```

---

## 官方资料来源

- Git 官方文档总入口：[git-scm.com/doc](https://git-scm.com/doc)
- `git switch` 官方文档：[git-scm.com/docs/git-switch](https://git-scm.com/docs/git-switch)
- `git restore` 官方文档：[git-scm.com/docs/git-restore](https://git-scm.com/docs/git-restore)
- `git pull` 官方文档：[git-scm.com/docs/git-pull](https://git-scm.com/docs/git-pull)
- `git revert` 官方文档：[git-scm.com/docs/git-revert](https://git-scm.com/docs/git-revert)
- GitHub 协作文档入口：[docs.github.com/github/collaborating-with-pull-requests/getting-started](https://docs.github.com/github/collaborating-with-pull-requests/getting-started)
- GitHub Rulesets 文档：[docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets)
