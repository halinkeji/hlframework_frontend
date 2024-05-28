<template>
  <div>
    <q-chip size="12px" class="text-white" color="red" v-if="params.data.cr_type == 1">
      首次签到
    </q-chip>
    <q-chip size="12px" class="text-white" color="info" v-if="params.data.cr_type == 2">
      每日签到
    </q-chip>
    <q-chip size="12px" class="text-white" color="primary" v-if="params.data.cr_type == 3">
      连续签到
    </q-chip>
    <q-chip size="12px" class="text-white" color="secondary" v-if="params.data.cr_type == 4">
      累计签到
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
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
