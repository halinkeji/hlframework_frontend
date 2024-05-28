<template>
  <div>
    <q-btn
      :to="{
        name: 'addClothingType',
        query: { id: dataId },
      }"
      color="primary"
      v-if="authorityMeta('edit')"
      class="q-mr-sm"
      unelevated
      label="修改"
    >
    </q-btn>
    <q-btn label="删除" unelevated color="red" @click="confirmDeleteRecord" v-if="authorityMeta('del')"> </q-btn>
  </div>
</template>

<script>
export default {
  name: 'Operator',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    editRecord () {},
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.gt_name}"的商品类目吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    },
    deleteRecord () {
      const obj = [this.dataId]
      this.$store
        .dispatch('clothingType/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.code == 400) {
              this.$q.notify({
                message: '删除失败',
                caption: res.data.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 1000,
                position: 'top-right'
              })
            } else {
              this.$q.notify({
                message: '成功',
                caption: '删除类目成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'green'
              })
            }
          } else {
            this.$q.notify({
              message: '删除失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 1000,
              position: 'top-right'
            })
          }
          this.params.context.getList()
        })
        .catch((error) => {
          this.$q.notify({
            message: 'Error',
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
