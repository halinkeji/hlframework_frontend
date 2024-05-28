<template>
  <div>
    <div class="row q-gutter-sm">
      <q-btn
        unelevated
        color="primary"
        class="q-mt-sm"
        label="修改"
         v-if="authorityMeta('tpeEdit')"
        @click="changData()"
      />
      <q-btn
        unelevated
        color="red"
        class="q-mt-sm"
        label="删除"
         v-if="authorityMeta('typeDel')"
        @click="deleteType()"
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
    changData () {
      this.params.context.addSupplierTypeData(this.dataId)
    },
    deleteType () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.est_name}" 的供应商分类吗`,
          cancel: true
        })
        .onOk(() => {
          this.realDelete()
        })
    },
    realDelete () {
      this.$store
        .dispatch('osupplierType/delData', [this.dataId])
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
