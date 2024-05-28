<template>
  <div>
      <span v-for="(item, key) in params.data.goodsTypeStore">
          <q-chip outline color="green" size="xs" square text-color="white" class="q-ml-none" v-if="item.store" >
        {{ item.store.name }}
        </q-chip>
        </span>
     <q-tooltip content-class="bg-white" :offset="[10, 10]">
      <div v-if="params.data.goodsTypeStore && params.data.goodsTypeStore.length > 0">
        <span v-for="(item, key) in params.data.goodsTypeStore">
          <q-chip outline color="green" size="xs" square text-color="white" class="q-ml-none" v-if="item.store" >
        {{ item.store.name }}
        </q-chip>
        </span>

      </div>
    </q-tooltip>
  </div>
</template>
<script>
export default {
  name: 'AgLinkStore',
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
