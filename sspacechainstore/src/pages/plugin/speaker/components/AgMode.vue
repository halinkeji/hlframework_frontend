<template>
  <div>
    <q-chip color="negative" text-color="white" v-if="parseInt(params.data.psc_status) == 0"> 关闭 </q-chip>
    <q-chip color="positive" text-color="white" v-if="parseInt(params.data.psc_status) == 1"> 开启 </q-chip>
    <q-chip color="warning" text-color="white" v-if="parseInt(params.data.psc_status) == 2"> 需绑定使用 </q-chip>
    <!-- <q-toggle
      color="green"
      true-value="1"
      false-value="0"
      @input="updated"
      v-model="params.data.psc_status"
    /> -->
  </div>
</template>

<script>
export default {
  name: 'AgMode',
  data () {
    return {
      switch1: 1
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    updated () {
      const obj = {
        psc_status: this.params.data.psc_status,
        id: this.params.data.id
      }
      this.$store
        .dispatch('speaker/setData', obj)
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
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: 'Error',
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
