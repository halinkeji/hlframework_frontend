<template>
  <div>
    <q-btn color="primary" class="q-mx-sm" unelevated label="查看" v-if="authorityMeta('view')" :to="{ name: 'partnerInfo', query: { id: dataId } }" @click="editPotion()" />
    <q-btn color="primary" class="q-mx-sm" unelevated label="修改" v-if="authorityMeta('edit')" @click="editPotion()" />
    <q-btn color="red" unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord()" />
    <q-btn color="red" class="q-ml-sm" unelevated label="退股" v-if="params.data.ppi_type == 'partner' && params.data.ppi_status == 1 && authorityMeta('out')" @click="updated()" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
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
    updated () {
      const obj = {
        ppi_status: 0,
        id: this.params.data.id
      }
      this.$store
        .dispatch('partner/setMemberData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '退股成功',
              color: 'green'
            })
            this.params.context.getList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    editPotion () {
      this.dataId = this.params.data.id
      this.params.context.addData(this.dataId)
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.ppi_partner_name}" 的合伙人吗`,
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch('partner/delMemberrData', [this.dataId])
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除合伙人成功',
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
        })
        .onCancel(() => {})
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
