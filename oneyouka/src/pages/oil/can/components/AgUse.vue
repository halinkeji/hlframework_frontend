<template>
  <div>
    <div class="row q-gutter-sm">

      <q-btn unelevated color="green" label="回罐" v-if="authorityMeta('hui')" @click="getCome()" />
      <q-btn unelevated color="primary" label="修改" v-if="authorityMeta('edit')" @click="getGoodsNormalList()" />
      <q-btn unelevated color="red" class="q-mt-sm" label="删除" v-if="authorityMeta('del')" @click="deleteAd()" />
      <q-btn unelevated color="primary" class="q-mt-sm" label="详情" v-if="authorityMeta('ag')" @click="getData()" />
       <q-btn unelevated color="warning" label="记录" v-if="authorityMeta('record')" @click="openOilRecord()" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgUse',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  created () {
    this.dataId = this.params.data.id
  },
  computed: {},
  methods: {
    getGoodsNormalList () {
      this.params.context.addOilCan(this.dataId)
    },
    getData () {
      this.params.context.agData(this.dataId)
    },
    getCome () {
      const oilProduct = this.params.data.oilProduct
      const oilName = oilProduct && oilProduct.id ? oilProduct.op_name : ''
      this.params.context.addCome(this.dataId, this.params.data.oc_name, this.params.data.oil_id, oilName)
    },

    openOilRecord () {
      this.params.context.openOilRecord(this.dataId)
    },
    deleteAd () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.oc_name}" 的油罐吗`,
          cancel: true
        })
        .onOk(() => {
          this.realDelete()
        })
    },
    realDelete () {
      this.$store
        .dispatch('can/delData', [this.dataId])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.params.context.getList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style></style>
