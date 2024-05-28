<template>
  <div>
    <q-btn
      color="primary"
      class="q-mx-sm"
      unelevated
      label="修改"
      v-if="authorityMeta('edit')"
      :to="{ name: 'addPerformance', query: { id: dataId } }"
    />
    <q-btn color="red" unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data() {
    return {
      dataId: 0,
      dialogShow: false,
      itemData: {},
      startTime: '',
      endTime: '',
    }
  },
  created() {
    this.dataId = this.params.data.id
    this.itemData = this.params.data
  },
  mounted() {},
  computed: {},
  methods: {
    confirmDeleteRecord() {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.prp_name}" 的提成方案吗`,
          cancel: true,
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord() {
      this.$store
        .dispatch('rewardPerformance/delData', [this.dataId])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除方案成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green',
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
            color: 'red',
          })
        })
    },
    authorityMeta(key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
  },
}
</script>
