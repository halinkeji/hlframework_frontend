<template>
  <div>
    <q-btn unelevated color="primary" label="已选" v-if="selsectParentFxzxId == params.data.id"> </q-btn>
    <q-btn unelevated color="grey" label="选择" @click="setParentFxzxId(params.data)" v-if="selsectParentFxzxId != params.data.id"> </q-btn>
  </div>
</template>
<script>
export default {
  name: 'FxzxListsAgOperate',
  components: {},
  data () {
    return {
      selsectParentFxzxId: ''
    }
  },
  created () {
    this.selsectParentFxzxId = this.params.context.parentFxzxId
  },
  mounted () {},
  computed: {},
  methods: {
    setParentFxzxId (data) {
      this.selsectParentFxzxId = data.id
      this.params.context.selectedParentFxzxData = data
      this.params.context.saveButton()
    }
  }
}
</script>
