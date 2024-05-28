<template>
  <div>
    <q-btn unelevated color="red-6" label="删除" @click="endButton" />
  </div>
</template>
<script>
export default {
  name: 'AgOperating',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    startButton () {
      this.params.data.mrt_start_counting = this.$q_date.formatDate(new Date(), 'X')
      const params = {
        mrt_start_counting: this.$q_date.formatDate(new Date(), 'X'),
        id: this.params.data.id,
        info: this.params.data
      }
      this.$store
        .dispatch('deductDuration/putnumber', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '开始计时成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            setTimeout(() => {
              this.params.context.getListData()
            }, 200)
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
    endButton () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除会员 “${this.params.data.mem_memberName}” 的“${this.params.data.mtr_goods_name}”消费项目吗`,
          cancel: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store
            .dispatch('jskm/deleteData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '结束计时成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.params.context.getListData()
                }, 200)
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
    }
  }
}
</script>
