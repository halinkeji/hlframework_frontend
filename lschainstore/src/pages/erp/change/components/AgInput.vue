<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <q-input style="width:75%" v-model="params.data.gic_name" dense v-if="authorityMeta('select')" :disable="params.data.goods_id > 0">
      <template v-slot:prepend>
        <q-btn round dense flat icon="add" @click="params.context.selectBut()">
          <q-tooltip>
            添加
          </q-tooltip>
        </q-btn>
      </template>
      <template v-slot:append>
        <q-btn round dense flat icon="search" @click="params.context.addItemData(params.data.gic_name)" :disable="params.data.goods_id > 0">
          <q-tooltip>
            选择
          </q-tooltip>
        </q-btn>
      </template>
    </q-input>
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
  methods: {
    authorityMeta (key) {
      return true
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
