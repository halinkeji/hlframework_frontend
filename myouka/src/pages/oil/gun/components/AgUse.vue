<template>
  <div>
    <div class="row q-gutter-sm">
      <q-btn
        unelevated
        color="primary"
        label="修改"
        v-if="authorityMeta('edit')"
        @click="getGoodsNormalList()"
      />
      <q-btn
        unelevated
        color="red"
        class="q-mt-sm"
        label="删除"
        v-if="authorityMeta('del')"
        @click="deleteAd()"
      />
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
      this.params.context.addOilGun(this.dataId)
    },
    deleteAd () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.og_name}" 的油枪吗`,
          cancel: true
        })
        .onOk(() => {
          this.realDelete()
        })
    },
    realDelete () {
      this.$store
        .dispatch('gun/delData', [this.dataId])
        .then(res => {
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
        .catch(error => {
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
        const new_arr = this.$route.meta.map(obj => {
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
