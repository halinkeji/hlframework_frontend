<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <span @click="showDetail" class="text-info text-center">
      {{ params.data.ca_article_code }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'AgShow',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.bid
  },
  methods: {
    showDetail () {
      this.params.context.showData(this.dataId)
    }
  }
}
</script>
