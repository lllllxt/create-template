# create-template

通过命令快速生成模板

## 安装
```
npm i @lllllxt/create-template -g
```

## 配置
配置目前在包里的 config.js 中设置
```
{
    root: __dirname, // 模板根路径
    tplDir: './template', // 存放模板的文件夹
    tplUrlMap: {
        // 模板名 : 模板链接
        "base.vue": "https://gitee.com/lllllxt/template/raw/master/vue/base.vue"
    }
}
```
配置本地模板: 

在 tplDir 下新建 [ 模板名.tpl ] 文件即可

## 使用
``` ct <模板名> <目标路径> [是否更新模板] ```

模板名: 上述[配置](#配置)中的模板名

目标路径: 相对当前执行命令目录的路径

㊙️ 关于生成文件后缀，目标路径后缀 > 模板名后缀，都没有则无后缀

## 模板关键字

key | description
---|---
#FILENAME_BASE# | 不带后缀的文件名
#FILENAME#| 带后缀的文件名

目前支持两个关键字, 有需要请提 [issues](https://github.com/lllllxt/create-template/issues) 或 [PR](https://github.com/lllllxt/create-template/pulls)
