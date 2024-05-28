<template>
  <div>
    <q-toggle
      v-model="params.data.status"
      :true-value="'1'"
      :false-value="'0'"
      @input="statusBut()"
      color="green"
    />
  </div>
</template>

<script>
export default {
  name: 'AgOperating',
  data () {
    return {}
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {
    // 修改状态
    statusBut () {
      const obj = {
        id: this.params.data.id,
        status: this.params.data.status
      }
      this.$store
        .dispatch('merchant/setData', obj)
        .then(res => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '状态修改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.params.context.getList()
            }, 100)
          }
        })
        .catch(error => {})
    }
  }
}
</script>
