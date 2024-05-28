<template>
  <div>
    <q-btn unelevated color="primary" label="已选" v-if="selsectLevelId == params.data.id"> </q-btn>
    <q-btn unelevated color="grey" label="选择" @click="setParentFxzxId(params.data)" v-if="selsectLevelId != params.data.id"> </q-btn>
  </div>
</template>
<script>
export default {
  name: 'FxzxLevelAgOperate',
  components: {},
  data () {
    return {
      selsectLevelId: ''
    }
  },
  created () {
    this.selsectLevelId = this.params.context.levelId
  },
  mounted () {},
  computed: {},
  methods: {
    setParentFxzxId (data) {
      this.selsectLevelId = data.id
      this.params.context.selectedLevelData = data
      this.params.context.getList(this.params.context.fxzxId, this.selsectLevelId)
    }
  }
}
</script>
