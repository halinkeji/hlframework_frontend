<template>
  <div>
    <q-btn unelevated color="primary" @click="buttonShow" class="q-mr-sm" v-if="parseInt(params.data.mrc_endTime) < 2147457847">延期 </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgButton',
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    buttonShow () {
      this.params.context.editCount(this.params.data)
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
