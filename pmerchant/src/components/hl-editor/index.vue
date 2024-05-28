<template>
  <div class="fit">
    <upload-img v-if="imageData" @imageData="getImageData" :multiple="multiple" @closeUpload="closeUpload"></upload-img>
    <div>
      {{ titleText }}
    </div>
    <vue-ueditor-wrap
      class="full-width"
      v-model="nowContent"
      @ready="readyEditeor"
      @beforeInit="addCustomButtom"
      :config="editorConfig"
      :editor-id="currentId"
    ></vue-ueditor-wrap>
  </div>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module

export default {
  name: 'hl-editor',
  props: ['content', 'minHeight', 'titleText'],
  components: {
    VueUeditorWrap
  },
  data () {
    return {
      nowContent: '',
      multiple: true,
      editorConfig: {},
      editorInstance: null,
      imageData: false,
      currentFullScreen: false,
      currentId: ''
    }
  },
  watch: {
    content (v) {
      if (v !== this.nowContent) {
        this.nowContent = v
      }
    },
    nowContent (v) {
      this.$emit('change', v)
    }
  },
  computed: {},
  created () {
    this.creatEdit()
  },
  mounted () {},
  beforeDestroy () {},

  methods: {
    creatEdit () {
      this.currentId = this.getRanNum()
      this.editorConfig = {
        UEDITOR_HOME_URL: 'UEditor/',
        initialFrameHeight: this.minHeight,
        toolbars: [
          [
            'anchor', // 锚点
            'undo', // 撤销
            'redo', // 重做
            'bold', // 加粗
            'indent', // 首行缩进
            'snapscreen', // 截图
            'italic', // 斜体
            'underline', // 下划线
            'strikethrough', // 删除线
            'subscript', // 下标
            'fontborder', // 字符边框
            'superscript', // 上标
            'formatmatch', // 格式刷
            'source', // 源代码
            'blockquote', // 引用
            'pasteplain', // 纯文本粘贴模式
            'selectall', // 全选
            'print', // 打印
            'preview', // 预览
            'horizontal', // 分隔线
            'removeformat', // 清除格式
            'time', // 时间
            'date', // 日期
            'unlink', // 取消链接
            'insertrow', // 前插入行
            'insertcol', // 前插入列
            'mergeright', // 右合并单元格
            'mergedown', // 下合并单元格
            'deleterow', // 删除行
            'deletecol', // 删除列
            'splittorows', // 拆分成行
            'splittocols', // 拆分成列
            'splittocells', // 完全拆分单元格
            'deletecaption', // 删除表格标题
            'inserttitle', // 插入标题
            'mergecells', // 合并多个单元格
            'deletetable', // 删除表格
            'cleardoc', // 清空文档
            'insertparagraphbeforetable', // "表格前插入行"
            'insertcode', // 代码语言
            'fontfamily', // 字体
            'fontsize', // 字号
            'paragraph', // 段落格式
            // 'simpleupload', // 单图上传
            // 'insertimage', // 多图上传
            'edittable', // 表格属性
            'edittd', // 单元格属性
            'link', // 超链接
            'emotion', // 表情
            'spechars', // 特殊字符
            'searchreplace', // 查询替换
            // 'map', // Baidu地图
            // 'gmap', // Google地图
            // 'insertvideo', // 视频
            'help', // 帮助
            'justifyleft', // 居左对齐
            'justifyright', // 居右对齐
            'justifycenter', // 居中对齐
            'justifyjustify', // 两端对齐
            'forecolor', // 字体颜色
            'backcolor', // 背景色
            'insertorderedlist', // 有序列表
            'insertunorderedlist', // 无序列表
            'fullscreen', // 全屏
            'directionalityltr', // 从左向右输入
            'directionalityrtl', // 从右向左输入
            'rowspacingtop', // 段前距
            'rowspacingbottom', // 段后距
            'pagebreak', // 分页
            'insertframe', // 插入Iframe
            'imagenone', // 默认
            'imageleft', // 左浮动
            'imageright', // 右浮动
            'attachment', // 附件
            'imagecenter', // 居中
            'wordimage', // 图片转存
            'lineheight', // 行间距
            'edittip ', // 编辑提示
            'customstyle', // 自定义标题
            'autotypeset', // 自动排版
            // 'webapp', // 百度应用
            'touppercase', // 字母大写
            'tolowercase', // 字母小写
            'background', // 背景
            'template', // 模板
            'scrawl', // 涂鸦
            'music', // 音乐
            'inserttable', // 插入表格
            'drafts', // 从草稿箱加载
            'charts' // 图表
          ]
        ],
        zIndex: 1999,
        autoFloatEnabled: false

        // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        // serverUrl: '//ueditor.szcloudplus.com/cos'
      }
      this.currentFullScreen = true
    },
    saveContent () {
      this.currentFullScreen = false
    },
    getRanNum () {
      const result = []
      for (let i = 0; i < 4; i++) {
        const ranNum = Math.ceil(Math.random() * 25) // 生成一个0到25的数字
        // 大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
        result.push(String.fromCharCode(65 + ranNum))
      }
      return result.join('')
    },
    addCustomButtom (editorId) {
      const that = this

      window.UE.registerUI(
        'image',
        (editor, uiName) => {
          // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
          // editor.registerCommand(uiName, {
          //   execCommand: function () {
          //     editor.execCommand('inserthtml', '<span>这是一段由自定义按钮添加的文字</span>')
          //   }
          // })
          // 创建一个 button
          const btn = new window.UE.ui.Button({
            // 按钮的名字
            name: 'image',
            // 提示
            title: '上传图片',
            // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
            cssRules: 'background-position: -381px 0;',
            // 点击时执行的命令
            onclick: function () {
              that.imageData = true
            }
          })

          // 粘贴后的事件
          editor.addListener('afterpaste', function (cmd, html) {})
          // 粘贴前的事件
          editor.addListener('beforepaste', (cmd, html) => {})

          // 因为你是添加 button，所以需要返回这个 button
          return btn
        },
        15
      )
    },
    readyEditeor (editorInstance) {
      this.editorInstance = editorInstance
    },

    getImageData (v) {
      const that = this
      that.imageData = false

      v.forEach((item) => {
        const img = `<img src="${this.$q.localStorage.getItem('pmerchant_system_local').attach_url + item.path}"   />`
        that.editorInstance.focus()
        that.editorInstance.execCommand('inserthtml', img)
      })
    },
    closeUpload (v) {
      this.imageData = false
    },
    uplodImgSubmit () {
      this.imageData = false
    }
  }
}
</script>
