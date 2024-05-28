<template>
  <div>
    <q-btn color="primary" unelevated label="修改积分" size="sm" v-if="parseInt(params.data.psi_give_status) == 1" @click="editIntIntegral" />
  </div>
</template>
<script>
export default {
  name: 'AgIntegralOperating',
  data () {
    return {}
  },
  computed: {},
  components: {},
  created () {},
  mounted () {},
  methods: {
    editIntIntegral () {
      this.$q
        .dialog({
          title: '更改',
          message: '确认更改积分?',
          prompt: {
            model: this.params.data.psi_give_integral,
            type: 'text', // optional
            isValid: (val) => /^(\d+|\d+\.\d{1,2})$/.test(val)
          },
          cancel: true,
          persistent: true
        })
        .onOk((data) => {
          const obj = {
            record_id: this.params.data.id,
            psi_give_integral: data
          }
          this.$store
            .dispatch('shift/updateIntegral', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '更改成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.params.context.init(this.params.context.shift_id)
              } else {
                this.$q.notify({
                  message: '失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: res.message,
                  color: 'red'
                })
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
        })
        .onCancel(() => {})
    }
  }
}
</script>
