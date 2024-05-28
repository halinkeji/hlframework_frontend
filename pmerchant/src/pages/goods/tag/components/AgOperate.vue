<template>
  <div>
    <q-btn :to="{ name: 'goodsTagBind', query: { id: params.data.id } }" color="warning" class="q-mr-sm" unelevated label="绑定" v-if="authorityMeta('bind')">
      <q-tooltip>
        绑定
      </q-tooltip>
    </q-btn>
    <q-btn @click="showPopup()" color="primary" class="q-mr-sm" unelevated label="修改" v-if="authorityMeta('edit')">
      <q-tooltip>
        修改
      </q-tooltip>
    </q-btn>
    <q-btn color="red" label="删除" unelevated ref="buttonRefss" @click="confirmDeleteRecord()" v-if="authorityMeta('del')">
      <q-tooltip>
        删除
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgMeasureOperate',
  data () {
    return {
      params: [],
      dataId: '',
      delectPrompt: false
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.gt_name}"的标签吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },

    deleteRecord () {
      const obj = {
        id: this.params.data.id
      }
      this.$store.dispatch('goodsTag/delData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功删除标签!',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          this.params.context.getGoodsTagList()
        }
      })
    },

    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.addPopup(this.dataId)
    },
    authorityMeta (key) {
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
