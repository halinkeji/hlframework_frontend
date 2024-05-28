<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <q-input style="width:60%" v-model="params.data.eb_goodsName" dense :disable="params.data.goods_id > 0">
      <template v-slot:prepend>
        <q-btn round dense flat icon="add" @click="params.context.selectBut()">
          <q-tooltip>
            添加
          </q-tooltip>
        </q-btn>
      </template>
      <template v-slot:append>
        <q-btn round dense flat icon="search" @click="params.context.addItemData(params.data.eb_goodsName)" :disable="params.data.goods_id > 0">
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
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除商品名称为  "${this.params.data.eb_goodsName}的商品吗"`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const obj = [this.dataId]
      this.$store
        .dispatch('erpin/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除商品成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.params.context.getList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    }
  }
}
</script>
