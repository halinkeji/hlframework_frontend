<template>
  <q-toggle color="green" true-value="1" false-value="0" @input="updated" v-model="params.data.st_templateStatus" />
</template>

<script>
export default {
  name: 'AgMode',
  data () {
    return {}
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    updated () {
      const obj = {
        st_templateStatus: this.params.data.st_templateStatus,
        st_templateCodeType: this.params.data.st_templateCodeType,
        st_name: this.params.data.st_name,
        st_templateContent: this.params.data.st_templateContent
      }
      this.$store
        .dispatch('alSms/addTel', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改状态成功',
              color: 'green'
            })
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改状态失败',
              color: 'red'
            })
          }
          this.params.context.getInfo()
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
    }
  }
}
</script>

<style scoped></style>
