export default function () {
  return {
    attributeObject: {
      shrz: '商家入驻',
      ggxw: '公告新闻',
      yhxy: '用户协议',
      yszc: '隐私政策',
      // hlframework: '关于HLFramework',
      gywm: '关于我们'
    },
    attributeData: [
      // { label: '关于HLFramework', value: 'hlframework', type: 'page' },
      { label: '关于我们', value: 'gywm', type: 'page' },
      { label: '商家入驻', value: 'shrz', type: 'page' },
      { label: '公告新闻', value: 'ggxw', type: 'list' },
      { label: '用户协议', value: 'yhxy', type: 'page' },
      { label: '隐私政策', value: 'yszc', type: 'page' }

    ]
  }
}
