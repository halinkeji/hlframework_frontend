<template>
  <div class="q-gutter-xs">
    <q-btn color="primary" @click="activateStore" unelevated label="激活" />
    <q-btn color="warning" unelevated label="提醒">
      <q-tooltip> 给用户发送短信提醒他完成商家开户 </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgUserOperator',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    activateStore () {
      this.params.context.activateStore(this.params.data)
    }
  }
}
</script>
