<template>
  <div
    :style="{
      'max-width': params.column.actualWidth + 'px',
      width: params.column.actualWidth + 'px',
    }"
  >
    <q-input
      v-model="params.data.eb_goodsName"
      dense
      v-if="!params.data.goods_id"
    >
      <template v-slot:prepend>
        <q-btn
          round
          dense
          flat
          icon="add"
          @click="params.context.selectBut()"
        />
      </template>
      <template v-slot:append>
        <q-btn
          round
          dense
          flat
          icon="search"
          @click="params.context.addItemData(params.data.eb_goodsName)"
          :disable="params.data.goods_id > 0"
        />
      </template>
    </q-input>
    <div v-else>
      {{ params.data.eb_goodsName }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgInput',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {}
}
</script>
