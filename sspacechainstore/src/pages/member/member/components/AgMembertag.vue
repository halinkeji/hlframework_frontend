<template>
  <div>
    <div v-if="params.data.membertag && params.data.membertag.length > 0">
      <q-chip outline color="green" square text-color="white" class="q-ml-none" v-for="(item, key) in params.data.membertag" :key="key">
        {{ item.mtl_tag_name }}
      </q-chip>
    </div>
     <q-tooltip content-class="bg-white" :offset="[10, 10]">
       <div v-if="params.data.membertag && params.data.membertag.length > 0">
      <q-chip outline color="green" square text-color="white" class="q-ml-none" v-for="(item, key) in params.data.membertag" :key="key">
        {{ item.mtl_tag_name }}
      </q-chip>
    </div>
     </q-tooltip>

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
