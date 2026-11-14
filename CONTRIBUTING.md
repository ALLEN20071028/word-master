# 参与开发

## 项目原则

- **零构建、零运行时依赖**：原生 HTML/CSS/JS，`<script src>` 直接加载，不要引入打包器或框架。
- **本地优先**：所有学习进度存浏览器 `localStorage`，不加后端、不加账号体系、不加统计上报。
- **词库即数据**：词库是纯 JS 数组字面量，便于直接编辑与审阅 diff。

## 新增或修改词条

1. 打开对应文件：

   | 内容 | 文件 |
   | --- | --- |
   | 四级词 | `words4.js` |
   | 六级词 | `words6.js` |
   | 追加词 | `words_extra.js` |
   | 高阶主题词 | `words_advanced.js` |
   | 易混词辨析 | `confused.js` |

2. 按现有格式追加一条。普通词条：

   ```js
   {w:"accommodate", p:"əˈkɒmədeɪt", m:"v. 容纳；适应", s:"The hall can accommodate 500 people.", t:"这个大厅能容纳500人。"},
   ```

   易混词：

   ```js
   {w:"affect / effect", m:"影响 / 效果·影响", note:"辨析说明", q:"The new policy had a positive ____ on the economy.", a:"effect", opts:["affect","effect"]},
   ```

3. 跑校验：

   ```bash
   npm run validate
   ```

   要求最后一行是「✅ 数据校验通过」，问题数为 0。

## 校验脚本会检查什么

- `w` / `m` 字段是否存在；易混词还需 `note` / `q` / `a` / `opts`
- 例句 `s` 是否包含该单词的某种词形（含常见屈折变化与部分不规则动词）
- 易混词的 `opts` 是否包含正确答案 `a`
- 键是否重复（普通词用 `w`，易混词用 `w#序号`）
- 各词库条数、缺音标数、合并去重总量

## 注意事项

- 不要改 `const WORDS4` / `WORDS6` / `WORDS_EXTRA` / `WORDS_ADVANCED` / `CONFUSED` 这些变量名，也不要随意调整 `index.html` 中 `<script src>` 的顺序：`buildLib()` 依赖它们已按顺序加载。
- 词条的唯一标识由 `w` 生成。修改已有词条的 `w` 会影响老用户的本地进度，尽量只追加、不重写。
- `words_reading.js` 当前未被 `index.html` 加载，也不在 `validate.js` 的校验范围内。启用它需同步修改加载与校验逻辑。
- 修改 `index.html` 里的状态结构时，同步提升 `defaultState()` 的 `version` 并补一条迁移；旧数据靠 `loadState()` 迁移，别直接丢弃。
- 进度备份 JSON 含个人数据，已由 `.gitignore` 忽略，不要提交。

## 提交前

```bash
npm run check
git status
```

确认没有多余文件、校验通过，再提 PR。PR 说明里写清改了哪个词库、新增多少条、为什么。
