<template>
  <div>
    <q-icon name="star" size="15px" color="deep-orange" :key="params.rowIndex + key + 'star'" v-for="(item,key) in formatStar(params.data.mrc_score)"></q-icon>
  </div>
</template>

<script>
export default {
  name: 'AgMode',
  data () {
    return {
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    formatStar (val) {
      if (val) {
        return parseInt(val)
      }
      return 0
    }

  }
}
</script>

<style scoped></style>
