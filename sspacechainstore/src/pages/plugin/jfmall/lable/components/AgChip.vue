<template>
  <div class="flex flex-center">
    <q-chip size="12px" class="text-white" color="orange" v-if="parseInt(params.data.jl_type) == 1">
      标签
    </q-chip>
    <q-chip size="12px" class="text-white" color="deep-orange" v-if="parseInt(params.data.jl_type) == 2">
      服务
    </q-chip>
  </div>
</template>
<script>
export default {
  name: 'AgChip',
  components: {},
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
