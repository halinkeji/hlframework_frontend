<template>
  <div>
    <q-btn
      unelevated
      color="primary"
      label="开始"
      :disable="params.data.mrt_start_counting > 0 || params.data.mrt_end_counting > 0"
      v-if="!(params.data.mrt_start_counting > 0)"
      @click="startButton"
    />
    <!-- !(p.data.mrt_start_counting > 0)    class="q-mr-sm" -->
    <q-btn
      unelevated
      color="red-6"
      label="结束"
      :disable="params.data.mrt_end_counting > 0"
      v-if="params.data.mrt_start_counting > 0"
      @click="endButton"
    />
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
      const startTime = this.params.data.mrt_start_counting
      const endTime = this.$q_date.formatDate(new Date(), 'X')
      if (parseInt(endTime) - parseInt(startTime) >= 10) {
        const params = {
          mrt_end_counting: this.$q_date.formatDate(new Date(), 'X'),
          id: this.params.data.id,
          info: this.params.data
        }
        this.$store
          .dispatch('deductDuration/putnumber', params)
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
      } else {
        this.$q.notify({
          message: '失败',
          caption: '您操作的太快了！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
      }
    }
  }
}
</script>
