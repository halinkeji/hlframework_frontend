<template>
  <q-dialog v-model="dialogShow">
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ gooName }}选择标签</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @close="closeDialogShow" />
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md row">
          <div v-for="item in labelDataList">
            <q-checkbox v-model="labelGroup" :val="item.id" color="primary">{{ item.prl_label_name }}</q-checkbox>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md">
        <q-btn label="确定" @click="addUpdateLabel" color="primary" size="sm" unelevated />
        <q-btn label="取消" @click="closeDialogShow" size="sm" color="grey" unelevated />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'GoodsLabelDialog',
  data () {
    return {
      dialogWidth: '1000px',
      goodsId: '',
      gooName: '',
      dialogShow: false,
      labelDataList: [],
      labelGroup: []
    }
  },
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },
  mounted () {},
  computed: {},
  methods: {
    seletLable (id, name) {
      this.dialogShow = true
      this.goodsId = id
      this.gooName = name
      const obj = {
        id: id
      }
      this.$store
        .dispatch('rewardLabel/getGoodsLabel', obj)
        .then((res) => {
          if (res.code == 200) {
            this.labelDataList = res.data ? res.data.labelDataList : []
            this.labelGroup = res.data ? res.data.selectedLabel : []
          }
        })
        .catch((error) => {})
    },
    addUpdateLabel () {
      const obj = {
        goods_id: this.goodsId,
        labelGroup: this.labelGroup
      }
      this.$store
        .dispatch('rewardLabel/setGoodsLabel', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '设置标签成功',
              color: 'green'
            })
            this.dialogShow = false
          }
        })
        .catch((error) => {})
    },
    closeDialogShow () {
      this.dialogShow = false
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
