export default function () {
  return {
    sortTypeData: [
      {
        label: '置顶',
        value: 'top'
      },
      {
        label: '热门',
        value: 'hot'
      }
    ],
    sortTypeItem: {
      top: '置顶',
      hot: '热门'
    },
    tagTypeData: [
      {
        label: '分类',
        value: 'type'
      },
      {
        label: '标签',
        value: 'tag'
      }
    ],
    tagTypeItem: {
      type: '分类',
      tag: '标签'
    }
  }
}
