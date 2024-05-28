<template>
  <div>
    <q-btn unelevated color="primary" @click="setSelsectGoods" label="添加"> </q-btn>
  </div>
</template>
<script>
export default {
  name: 'GoodsListsAgOperate',
  components: {},
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {

  },
  computed: {},
  methods: {
    setSelsectGoods () {
      this.$q.notify({
        message: '添加商品成功',
        color: 'green',
        icon: 'ion-checkmark-circle-outline',
        timeout: 500,
        position: 'top-right'
      })
      const goodsData = {
        id: '',
        goodsName: '',
        goodsCoverImage: ''
      }
      goodsData.goodsName = this.params.data.goo_name
      goodsData.id = this.params.data.id
      goodsData.goodsCoverImage = this.params.data.goo_cover_image
      this.params.context.goodsData = goodsData
      this.params.context.showDialog = false
    }
  }
}
</script>
