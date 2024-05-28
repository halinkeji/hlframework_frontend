<template>
  <div>
    <div v-if="params.data.tag && params.data.tag.length > 0">
      <q-chip outline color="green" square text-color="white" class="q-ml-none" v-for="(item, key) in params.data.tag" :key="key">
        {{ item.tag ? item.tag.ppt_name : '' }}
      </q-chip>
    </div>
     <q-tooltip content-class="bg-white" :offset="[10, 10]">
       <div v-if="params.data.tag && params.data.tag.length > 0">
      <q-chip outline color="green" square text-color="white" class="q-ml-none" v-for="(item, key) in params.data.tag" :key="key">
        {{ item.tag ? item.tag.ppt_name : '' }}
      </q-chip>
    </div>
     </q-tooltip>

  </div>
</template>
<script>
export default {
  name: 'AgBindTag',
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
