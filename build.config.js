import path from 'node:path';
import url from 'node:url';
import {defineBuildConfig} from 'unbuild';
import {configDotenv} from "dotenv";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
configDotenv({path: path.resolve(__dirname, '.env')});

let entries = ['src/index'];
let sourcemap = false;

if (process.env.ENV_MODE === 'development') {
  entries = [
    'src/index',
    /**
     * mkdist builder 传输文件到文件，保持原始源结构
     */
    {
      builder: 'mkdist',
      input: 'src/clis',
      outDir: 'dist/clis'
    },
    {
      builder: 'mkdist',
      input: 'src/constants',
      outDir: 'dist/constants'
    },
    {
      builder: 'mkdist',
      input: 'src/types',
      outDir: 'dist/types'
    },
    {
      builder: 'mkdist',
      input: 'src/utils',
      outDir: 'dist/utils'
    },
  ];
  sourcemap = true;
}

export default defineBuildConfig({
  /** 如果没有提供entries，将从package.json中自动推断出 */
  entries,
  clean: true, // 输出前是否清空输出目录
  outDir: 'dist', // 指定输出目录，默认为 'dist'
  name: 'bundle',
  sourcemap,
  // declaration: true, // 指定是否生成 .d.ts 声明文件
  /**
   *
   */
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@clis': path.resolve(__dirname, 'src/clis'),
    '@constants': path.resolve(__dirname, 'src/constants'),
    '@src/types': path.resolve(__dirname, 'src/types'),
    '@utils': path.resolve(__dirname, 'src/utils'),
  },
  /**
   * 配置用于指定构建过程中的文本替换规则
   */
  replace: {
    __ENV__: process.env.NODE_ENV || 'development'
  },
  /**
   * rollup 配置
   */
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'node18',
      minify: true,
    },
    output: [
      {
        name: "index",
        format: "esm"
      }
    ]
  },
  /**
   * rollup 勾子
   */
  hooks: {
    'rollup:options'(ctx, options) {
      options.plugins = [
        options.plugins,
      ]
    },

    // "build:prepare": (ctx: BuildContext) => void | Promise<void>,
    // "build:before": (ctx: BuildContext) => void | Promise<void>,
    // "build:done": (ctx: BuildContext) => void | Promise<void>,
    // "rollup:options": (ctx: BuildContext, options: RollupOptions) => void | Promise<void>,
    // "rollup:build": (ctx: BuildContext, build: RollupBuild) => void | Promise<void>,
    // "rollup:dts:options": (ctx: BuildContext, options: RollupOptions) => void | Promise<void>,
    // "rollup:dts:build": (ctx: BuildContext, build: RollupBuild) => void | Promise<void>,
    // "rollup:done": (ctx: BuildContext) => void | Promise<void>,
    // "mkdist:entries": (ctx: BuildContext, entries: MkdistBuildEntry[]) => void | Promise<void>,
    // "mkdist:entry:options": (ctx: BuildContext, entry: MkdistBuildEntry, options: MkdistOptions) => void | Promise<void>,
    // "mkdist:entry:build": (ctx: BuildContext, entry: MkdistBuildEntry, output: {writtenFiles: string[];}) => void | Promise<void>,
    // "mkdist:done": (ctx: BuildContext) => void | Promise<void>,
    // "untyped:entries": (ctx: BuildContext, entries: UntypedBuildEntry[]) => void | Promise<void>,
    // "untyped:entry:options": (ctx: BuildContext, entry: UntypedBuildEntry, options: any) => void | Promise<void>,
    // "untyped:entry:schema": (ctx: BuildContext, entry: UntypedBuildEntry, schema: Schema) => void | Promise<void>,
    // "untyped:entry:outputs": (ctx: BuildContext, entry: UntypedBuildEntry, outputs: UntypedOutputs) => void | Promise<void>,
    // "untyped:done": (ctx: BuildContext) => void | Promise<void>,
  },
});
