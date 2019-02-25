## 如何合并多个 commit？

假如我有几条 commit 记录是这样的：

![git-log-oneline](/assets/img/20190222174655.png)

我想把所有 commit message 为 20190222 的 commit 记录合并成一条 commit 记录。

Google 搜索 “如何合并多个 commit” 排名第一的结果：

![Google 搜索 “如何合并多个 commit” 排名第一的结果](/assets/img/20190222173111.png)

通过查看文章内容，大概知道了改如何操作。

通过如下命令合并 commit-hash 之前的 commit

`git rebase -i 1522725`

我在公司使用的是 Windows 系统，输入命令之后会报错：

```
emacs: command not found
Could not execute editor
```

然后我就安装了 Emacs，Google 了解相关使用方式、基本操作，设置好环境变量，重启终端。  
说实话，用的挺不习惯的。  
不过用过几次后我就发现，这不就是编辑 git-rebase-todo 文件吗？  

![emacs-git-rebase-todo](/assets/img/20190222154550.png)

git-rebase-todo 文件在 .git/rebase-merge 目录下，rebase-merge 目录仅当 git 处于 rebase merge 时才存在。

![.git-rebase-merge-git-rebase-todo](/assets/img/20190222160019.png)

我为什么一定要用 emacs 去编辑文件了？用 vscode 行不行？  
Google 之后发现时可行的，只要设置 git 配置的 core editor 即可。

`git config --global core.editor <editor>`

那如何将 editor 配置成 vscode 呢？继续使用 Google，然后在 [stack overflow 的这个 提问/回答](https://stackoverflow.com/questions/30024353/how-to-use-visual-studio-code-as-default-editor-for-git) 我找到了答案。

`git config --global core.editor "code --wait"`

再次执行 `git rebase -i 1522725` 命令，成功使用 vscode 打开 git-rebase-todo 文件。

![vscode-git-rebase-todo](/assets/img/20190222175955.png)

根据文章说明，只要将后面两条 commit 记录的 pick 改为 s 即可。

![vscode-git-rebase-todo-squash](/assets/img/20190222180303.png)

保存并关闭文件，会新打开 .git/COMMIT_EDITMSG 文件，意思是修改合并后的 commit message。

![.git-COMMIT_EDITMSG](/assets/img/20190222180436.png)

我希望 commit message 还是 20190222，所以只需删除掉两个 20190222 即可。

![.git-COMMIT_EDITMSG-complete](/assets/img/20190222181245.png)

保存并关闭文件，终端会自动完成 rebase 操作。

![rebase-complete-terminal](/assets/img/20190222181434.png)

使用 `git log --oneline` 查看 commit history 会发现，只有一条 commit message 为 20190222。

![git-log-oneline](/assets/img/20190222181718.png)

问题是解决了，但本着探索之心，我想知道 rebase 加上 `-i` 参数之后，到底是什么意思。

## `git rebase -i` 原理

首先了解 [`rebase` 原理](https://git-scm.com/book/zh/v1/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%9A%84%E5%8F%98%E5%9F%BA)

`-i` 是 `--interactive` 的简写，中文翻译叫 “互动”，与 rebase 结合可以称之为 “交互式变基”。

这种方法通常用于在向别处推送提交之前对它们进行重写，比如我们向某个开源项目 master 分支提交新增特性的 PR，这个 PR 包含多个 commit 都是对这一个特性的修改。如果作者接受了 PR，那 master 分支 commit history 就会包含针对这一个新特性的多个 commit。这在大型开源项目时不被接受的，每一次的 commit 应该都是完整的有意义的。

交互式变基提供了一个简单易用的途径对你的 commit 进行分割、合并或者重排序。

也就是说，我们之前的需求 “如何合并多个 commit？” 其实只是交互式变基的一丢丢功能，我们继续探索一下其它特性。

再来看看之前我们在执行 `git rebase -i 1522725` 命令之后，vscode 打开 git-rebase-todo 文件：

![vscode-git-rebase-todo](/assets/img/20190222175955.png)

可以看到注释说明 `Commands: ` 下面的内容，就是我们在交互式变基中能够使用的所有命令项。我们来一一解读：

- `p, pick = use commit`  
解读：pick，简写 p，意思是使用 commit。  
通过上图可以看到，git-rebase-todo 内的 commits 默认都是 pick 命令，意思就是选择（需要）这个 commit。

- `r, reword = use commit, but edit the commit message`  
解读：reword，简写 r，意思是使用 commit，但是需要编辑（修改） commit message。  
也就是说，如果我们想改写某个 commit 的 message 信息，就在 commit-hash 之前把默认的 pick 改写为 reword 或简写 r。

- `e, edit = use commit, but stop for amending`

r 1522725 20190221
e b26c194 20190222
