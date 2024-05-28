<template>
  <div>
    <q-btn
      color="red"
      label="关闭"
      :disable='addButtonDisabled'
      @click="setData(-1)"
      v-if="params.data.zzyxTiming && parseInt(params.data.zzyxTiming.pzc_status) == 1"
    />
    <q-btn
      color="primary"
      label="开启"
      @click="setData(1)"
      :disable='addButtonDisabled'
      v-else
    />
  </div>
</template>
<script>
export default {
  name: 'TimingAgOperae',
  components: {},
  data () {
    return {
      addButtonDisabled: false,
      timingData: {
        pzc_status: '',
        pzc_type: 'timing',
        pzc_bind_id: ''
      }
    }
  },
  created () {
    this.timingData.pzc_bind_id = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {
    setData (status) {
      this.timingData.pzc_status = status
      const data = {
        ...this.timingData
      }
      this.addButtonDisabled = true
      this.$store
        .dispatch('zzyx/setConfigData', data)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: `${status > 0 ? '开启' : '关闭'}` + '转赠成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.params.context.getList()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.addButtonDisabled = false
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>
