# 单词斩 · 四六级词汇（Word Master）

一个零依赖、本地优先的四六级背单词网页。打开就能用：不用注册、不用后端、不用构建，也不上传任何学习数据。

- **词库**：1234 条，含四级、六级、追加词、高阶主题词和 45 组易混词辨析
- **复习**：艾宾浩斯 6 轮调度，40 词一组，答错自动回第一轮
- **数据**：全部存在浏览器 `localStorage`，不联网、不追踪
- **技术**：原生 HTML + CSS + JavaScript，无第三方运行时依赖

> 词库条数与调度参数均来自本仓库源码；运行 `npm run validate` 可复核词库统计。

---

## 功能

| 模块 | 入口 | 说明 |
| --- | --- | --- |
| 首页 | 默认页 | 今日新词 / 今日复习 / 学习中 / 已掌握四项统计、掌握率环、连续打卡天数、今日安排 |
| 学新词 | 首页「📖 学新词」 | 词卡展示单词、音标、释义、例句与翻译；可发音；三个操作：认识 / 不认识 / 我会·跳过 |
| 今日复习 | 首页「🔁 今日复习」 | 按到期日派发，40 词一组；「我会·跳过」直接标记掌握，不再复习 |
| 综合测验 | 首页「✏️ 综合测验」 | 随机 10 题，混合英译中、中译英、拼写、选词填空、辨析填空，结束显示正确率 |
| 学习计划 | 首页「📅 学习计划」 | 未来 7 天安排表、每日新词目标输入框、「不加新的复习」与「暂停新词」开关 |
| 设置与数据 | 右上角 ⚙️ | 导出 / 导入进度 JSON、切换词库范围、清空学习进度 |

### 复习调度规则

- 间隔序列：1 / 2 / 4 / 7 / 15 / 30 天，整体再 ×1.5（约 2 / 3 / 6 / 11 / 23 / 45 天）
- 第一次复习就认识的词标记为「简单词」，后续间隔再 ×4/3
- 答「不认识」回第 1 轮；累计 6 次通过后标记掌握，不再出现
- 「不加新的复习」把当前到期清单固定下来，只减不增；关闭后恢复按曲线派发

> 以上均为 `index.html` 源码常量的行为描述，不是配置项；要改请直接改源码。

---

## 安装与运行

### 环境要求

| 项目 | 要求 |
| --- | --- |
| Node.js | ≥ 18（仅用于启动本地静态服务器；应用本身不需要 Node） |
| 浏览器 | 支持 `localStorage` 与 `speechSynthesis` 的现代浏览器（Chrome / Edge / Safari / Firefox） |
| 依赖安装 | **无**。`dependencies` 与 `devDependencies` 均为空，不需要 `npm install` |

### 方式 A：npm 启动（推荐）

```bash
git clone https://github.com/ALLEN20071028/word-master.git
cd word-master
npm start
```

浏览器打开 <http://localhost:8080>。改端口：

```bash
PORT=3000 npm start
```

Windows（cmd）：`set PORT=3000 && npm start`。

### 方式 B：Python

```bash
cd word-master
python -m http.server 8080
```

同样打开 <http://localhost:8080>。

### 方式 C：直接双击 `index.html`

多数浏览器可以直接跑，但 `file://` 协议下部分浏览器会限制 `localStorage`，进度可能无法保存。**建议用方式 A 或 B。**

### 验证词库数据

```bash
npm run validate
```

输出各词库条数、缺音标数、例句校验结果与问题总数。当前输出：四级 402、六级 427、追加 285、高阶 253、易混词 45 组，合并去重 1234 条，问题数 0。

---

## 使用示例：第一次打开怎么做

1. 打开 <http://localhost:8080>，首页显示「今日新词 0 / 27」。
2. 点「📖 学新词」→ 看词卡 → 点「🔊」听发音 → 选「不认识」进入学习，或「我会·跳过」直接标记掌握。
3. 学过的词按曲线排期；第二天起首页「🔁 今日复习」会出现到期词，点进去按组做完。
4. 点「📅 学习计划」看未来 7 天安排；在「目标设置」里把「每日新词目标」改成自己的量，点「保存目标」。复习太多时勾「不加新的复习（已有复习照做，清单只减不增）」。
5. 换设备前点右上角 ⚙️ →「⬇️ 导出进度」保存 JSON；新设备用「⬆️ 导入进度」恢复。

---

## 目录结构

项目刻意保持扁平：`index.html` 用 `<script src>` 按顺序加载词库的全局 `const` 数组，零构建。若拆分子目录，需同步修改 `index.html` 的 script 路径和 `validate.js` 的 `__dirname` 读取路径。

```
word-master/
├── index.html           应用主体：HTML + CSS + 全部业务逻辑
├── words4.js            四级核心词库        const WORDS4
├── words6.js            六级词库            const WORDS6
├── words_extra.js       追加词库            const WORDS_EXTRA
├── words_advanced.js    高阶主题词          const WORDS_ADVANCED
├── confused.js          易混词辨析 45 组    const CONFUSED
├── words_reading.js     阅读语料（当前版本未加载，预留扩展）
├── validate.js          词库数据校验脚本（Node，零依赖）
├── server.js            零依赖本地静态服务器
├── package.json         脚本、元信息、Node 版本要求
├── README.md            本文件
├── CONTRIBUTING.md      参与开发与新增词条说明
├── PUBLISH.md           维护者上传 GitHub 的完整流程
├── LICENSE              MIT 许可证
├── .gitignore           忽略规则
└── .gitattributes       统一换行符
```

### 词库数据格式

普通词条：

```js
{w:"accommodate", p:"əˈkɒmədeɪt", m:"v. 容纳；适应", s:"The hall can accommodate 500 people.", t:"这个大厅能容纳500人。"}
```

| 字段 | 含义 | 必需 |
| --- | --- | --- |
| `w` | 单词 | 是 |
| `p` | 音标 | 是（校验脚本统计缺音标数） |
| `m` | 词性 + 释义 | 是 |
| `s` | 例句 | 否 |
| `t` | 例句翻译 | 否 |

易混词（`confused.js`）：

```js
{w:"affect / effect", m:"影响 / 效果·影响", note:"辨析说明", q:"The new policy had a positive ____ on the economy.", a:"effect", opts:["affect","effect"]}
```

`note` 为辨析说明，`q` 为挖空例句，`a` 为正确答案，`opts` 为选项（必须包含答案）。

### 词库统计

来自 `npm run validate` 的实际输出：

| 词库 | 变量 | 条数 | 缺音标 |
| --- | --- | --- | --- |
| 四级 | `WORDS4` | 402 | 0 |
| 六级 | `WORDS6` | 427 | 0 |
| 追加 | `WORDS_EXTRA` | 285 | 0 |
| 高阶主题词 | `WORDS_ADVANCED` | 253 | 0 |
| 易混词 | `CONFUSED` | 45 组 | — |
| 合并去重后 | — | 1234 | 问题数 0 |

界面里的「四级专攻（447 词）」= 402 个四级词 + 45 组易混词。

---

## 主要参数（来自 `index.html` 源码）

| 常量 | 当前值 | 作用 |
| --- | --- | --- |
| `LS_KEY` | `wordmaster_state_v2` | 进度在 `localStorage` 中的键名 |
| `dailyTarget` | 27 | 每日新词默认目标 |
| `INTERVALS` | `[1,2,4,7,15,30]` | 艾宾浩斯基础间隔（天） |
| `gapDays()` | 基础间隔 ×1.5 | 实际排期 |
| `REVIEW_GROUP_SIZE` | 40 | 复习每组词数 |
| `r.s >= 6` | 6 次 | 判定掌握所需复习次数 |
| `STATE.version` | 9 | 本地状态结构版本，用于旧数据迁移 |

> 表格是源码常量的说明，不是可配置项。行号会随提交变动，定位请搜索常量名。

---

## 隐私与数据

- 学习进度只存在你自己浏览器的 `localStorage`（键名 `wordmaster_state_v2`），没有账号、没有后端、没有上传。
- 应用本身不发起网络请求。单词发音调用浏览器内置 Web Speech API，是否联网取决于浏览器与系统实现。
- 清除浏览器数据、换浏览器、换设备都会丢进度。用 ⚙️ 里的导出 / 导入备份。
- 导出的进度 JSON 含个人数据，`.gitignore` 已忽略 `*-progress.json` 与 `progress-backup*.json`，不要提交进仓库。

---

## 常见问题

| 现象 | 处理 |
| --- | --- |
| 点发音没声音 | 当前浏览器不支持 `speechSynthesis`，换 Chrome / Edge 再试 |
| 换电脑进度没了 | 原设备导出 JSON，新设备导入 |
| 复习积压太多 | 「📅 学习计划」勾「不加新的复习」，先把已有清单做完；或调低「每日新词目标」 |
| 打开是空白页 | 用方式 A / B 通过 `http://` 打开，别用 `file://` |
| 想改每日新词量 | 「📅 学习计划」→「目标设置」输入框 →「保存目标」 |

---

## 许可证与声明

- 代码采用 **MIT License**，见 [LICENSE](LICENSE)。
- 词库条目、释义与例句由本项目维护者整理，仅供个人学习使用；若涉及第三方权利，请联系维护者移除。
- 本项目为非官方学习工具，与任何考试主办机构无关。

---

## 参考资料

- GitHub. "Adding locally hosted code to GitHub." *GitHub Docs*, docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github. Accessed 14 Nov. 2026.
- Open Source Initiative. "The MIT License." *Open Source Initiative*, opensource.org/license/mit. Accessed 14 Nov. 2026.
