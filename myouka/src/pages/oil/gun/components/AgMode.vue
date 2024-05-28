<template>
  <div>
    <q-toggle
      color="green"
      true-value="1"
      false-value="2"
      @input="updated"
      v-model="params.data.og_status"
    />
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
        og_status: this.params.data.og_status,
        id: this.params.data.id
      }
      this.$store
        .dispatch('gun/setData', obj)
        .then(res => {
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
    }
  }
}
</script>
