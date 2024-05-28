<template>
  <div>
    <div v-if="params.data.membertag && params.data.membertag.length > 0">
      <q-chip outline color="green" square text-color="white" class="q-ml-none" v-for="(item, key) in params.data.membertag" :key="key">
        {{ item.mtl_tag_name }}
      </q-chip>
    </div>

    <q-chip outline color="primary" square text-color="white" class="q-ml-none" v-else> 暂无标签 </q-chip>
  </div>
</template>
<script>
export default {
  name: 'AgMembertag',
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
