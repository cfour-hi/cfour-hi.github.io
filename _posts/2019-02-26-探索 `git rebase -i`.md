先从一个需求说起，我的某个 Git 项目的 commit history 有很多重复的 commit message，这些有着重复 commit message 的 commit 也确实是针对同一个特性的修改，我想合并这些 commit 该怎么办？

## 如何合并多个 commit？

假如我有几条 commit 记录是这样的：

![git-log-oneline](/assets/img/20190222174655.png)

我想把所有 commit message 为 20190222 的 commit 合并成一条 commit。

Google 搜索 “如何合并多个 commit” 排名第一的结果：

![Google 搜索 “如何合并多个 commit” 排名第一的结果](/assets/img/20190222173111.png)

通过查看文章内容，大概知道了改如何操作。

通过如下命令合并指定 commit-hash 之前的 commit

```
git rebase -i 1522725
```

我在公司使用的是 Windows 系统，输入命令之后会报错：

```
emacs: command not found
Could not execute editor
```

然后我就按照提示安装了 Emacs，Google 了解相关使用方式、基本操作，设置好环境变量，重启终端。  
说实话，用的挺不习惯的。  
不过用过几次后我就发现，这不就是编辑 git-rebase-todo 文件吗？

![emacs-git-rebase-todo](/assets/img/20190222154550.png)

git-rebase-todo 文件在 .git/rebase-merge 目录下，rebase-merge 目录仅当 git 处于 rebase merge 状态时才存在。

![.git-rebase-merge-git-rebase-todo](/assets/img/20190222160019.png)

我为什么一定要用 emacs 去编辑文件了？用 vscode 行不行？  
Google 之后发现时可行的，只要设置 git 配置的 core editor 即可。

```
git config --global core.editor <editor>
```

那如何将 editor 配置成 vscode 呢？继续使用 Google，然后在 [stack overflow - How to use Visual Studio Code as Default Editor for Git](https://stackoverflow.com/questions/30024353/how-to-use-visual-studio-code-as-default-editor-for-git) 我找到了答案。

```
git config --global core.editor "code --wait"
```

再次执行 `git rebase -i 1522725` 命令，成功使用 vscode 打开 git-rebase-todo 文件。

![vscode-git-rebase-todo](/assets/img/20190222175955.png)

根据文章说明，只要将后面两条 commit 的 pick 改为 s 即可。

![vscode-git-rebase-todo-squash](/assets/img/20190222180303.png)

保存并关闭文件，会自动新打开 .git/COMMIT_EDITMSG 文件，意思是修改合并后的 commit message。

![.git-COMMIT_EDITMSG](/assets/img/20190222180436.png)

我希望 commit message 还是 20190222，所以只需删除掉两个 20190222 即可。

![.git-COMMIT_EDITMSG-complete](/assets/img/20190222181245.png)

保存并关闭文件，终端会自动完成 rebase 操作。

![rebase-complete-terminal](/assets/img/20190222181434.png)

使用 `git log --oneline` 查看 commit history 会发现，只有一条 commit message 为 20190222。

![git-log-oneline](/assets/img/20190222181718.png)

问题是解决了，但本着探索之心，我想知道 rebase 加上 `-i` 参数之后，到底是什么意思。

## `git rebase -i` 使用指南

### 参考阅读

- [Git 分支 - 分支的变基](https://git-scm.com/book/zh/v1/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%9A%84%E5%8F%98%E5%9F%BA)
- [git-rebase INTERACTIVE MODE](https://git-scm.com/docs/git-rebase#_interactive_mode)

`-i` 是 `--interactive` 的简写，中文翻译叫 “互动”，与 rebase 结合可以称之为 “交互式变基”。

这种方法通常用于在向别处推送提交之前对它们（commits）进行重写，我们可以对历史 commit 进行重新排序、修改、删除。

也就是说，我们之前的需求 “如何合并多个 commit？” 其实只是交互式变基的功能之一，我们继续探索一下它的其它特性。

再来看看之前我们在执行 `git rebase -i 1522725` 命令之后，vscode 打开 git-rebase-todo 文件：

![vscode-git-rebase-todo](/assets/img/20190222175955.png)

可以看到注释说明 `Commands:` 下面的内容，就是我们在交互式变基中能够使用的所有命令项。我们来一一解读：

- `p, pick = use commit`  
  解读：pick，简写 p，意思是使用 commit。  
  通过上图可以看到，git-rebase-todo 内的 commits 默认都是 pick 命令，意思就是选择（需要）这个 commit，并且不做任何改动。

- `r, reword = use commit, but edit the commit message`  
  解读：reword，简写 r，意思是使用 commit，但是需要编辑（修改） commit message。  
  也就是说，如果我们想改写某个 commit message，就在 commit-hash 之前把默认的 pick 改写为 reword 或简写 r。

  示例：

  现在我们的 commit history 是这样的：  
  ![commit-history](/assets/img/20190226171615.png)

  执行交互式变基命令 `git rebase -i HEAD~3`，在自动打开的 git-rebase-todo 文件内将第 2 行 pick 改写为 r。  
  ![git-rebase-todo-reword](/assets/img/20190226171739.png)

  保存关闭后，会继续自动打开 COMMIT_EDITMSG 文件，这里就是我们修改 `ff7caa8` 这条 commit message 的地方。  
  ![COMMIT_EDITMSG](/assets/img/20190226171810.png)

  我们将 commit message 修改成 `20190222（reword）`，保存关闭后，再查看 commit history。  
  ![commit-history](/assets/img/20190226171927.png)

  之前为 `20190222` 的 commit message 已经修改成功，同时 commit-hash 也发生了改变，并且在这个 commit 之后的 commit，它们的 commit-hash 也都会发生了改变。（可对比查看交互式变基前后两张 commit history 图片）

- `e, edit = use commit, but stop for amending`  
  解读：edit，简写 e，意思是可以暂时停止 rebase，此时允许修改 文件内容 和/或者 修改 commit message，然后继续 rebase。  
  也就是说，如果我们想要修改某次 commit 的提交内容，就可以使用 edit 命令。

  示例：

  执行交互式变基命令 `git rebase -i HEAD~3`，在自动打开的 git-rebase-todo 文件内将第 2 行 pick 改写为 e。  
  ![git-rebase-todo-edit](/assets/img/20190226172741.png)

  保存关闭后，终端 Git 会提示我们可执行的操作。  
  ![vscode-terminal](/assets/img/20190226173132.png)

  Git 会切换到一个新的变基分支  
  ![vscode-branch](/assets/img/20190226173426.png)

  默认 commit message 是此次编辑 commit 的 message，并且不能被修改。  
  ![commit-message-default](/assets/img/20190226173918.png)

  在根目录新增一个文件 test.js 并 commit  
  ![commit-test.js](/assets/img/20190226175943.png)

  提交 commit 之后会自动打开 COMMIT_EDITMSG 文件  
  ![COMMIT_EDITMSG](/assets/img/20190226180343.png)

  我们删除掉之前 reword 操作时添加的 message 内容 `（reword）`，保存并关闭。  
  此时查看 commit history 会发现 commit message `20190222` 后面已经没有 `（reword）` 了。  
  并且 commit 内容包含了我们刚才在根目录添加的 test.js 文件。  
  ![commit-content](/assets/img/20190226194249.png)

  也就是说，我们修改了历史 commit 的 content 和 message。

* `s, squash = use commit, but meld into previous commit`  
  解读：squash，简写 s，意思是使用 commit，但是把修改内容融入到上一个 commit。  
  也就是我们之前的需求 “如何合并多个 commit？”

* `f, fixup = like "squash", but discard this commit's log message`  
  解读：fixup，简写 f，与 squash 意思一样，但是直接丢弃 commit message。  
  也就是说在编辑 commit message 时，不显示这个 commit 的 commit message。

* `x, exec = run command (the reset of the line) using shell`
  解读：exec，简写 x，意思是在 rebase 过程执行脚本命令。  
  因为在 rebase 交互过程中的改动是未经测试的，所以为了避免在 rebase 交互过程中的修改产生破坏性内容，所以提供执行脚本命令的功能。

  示例：

  我们在之前创建的 test.js 内添加一行代码，并且保存提交。  
  ![test.js](/assets/img/20190226165317.png)

  执行交互式变基命令 `git rebase -i HEAD~3`，在自动打开的 git-rebase-todo 文件内，在每一行 commit 下面添加 `exec echo $(date)`。  
  意思是每 rebase 一个 commit，都执行一次 `echo $(date)` 命令吗，在终端打印出当前时间。  
  ![git-rebase-todo-exec](/assets/img/20190226211325.png)

  保存关闭后，会执行 rebase，过程中终端会打印出当前时间。  
  ![running-git-rebase-todo-exec](/assets/img/20190226211412.png)

* `d, drop = remove commit`  
  解读：drop，简写 d，意思是移除 commit。  
  很显然，就是删除这个 commit，并且会将这次 commit 的内容也删除掉。

## 结语

交互式变基的使用场景在标准、规范的大型开源项目会经常使用到。但对于平时项目开发或是个人项目，可能并不是很在意（也没有精力顾及）commit history。只有当我们有这个意识以及对 Git 了解到一定程度，才能发挥交互式变基强大的能力。
