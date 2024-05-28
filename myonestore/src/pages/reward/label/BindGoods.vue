<template>
  <div >
    <q-card flat bordered>
      <q-card-section class="row items-center">
        <div class="text-subtitle2">绑定绩效</div>
        <q-radio v-model="rewardStatus" val="close" label="否" />
        <q-radio v-model="rewardStatus" val="open" label="是" />
      </q-card-section>
      <q-separator />
      <q-card-section class="row" v-if="rewardStatus == 'open'">
        <div v-for="item in labelDataList">
          <q-checkbox v-model="labelGroup" :val="item.id" color="primary">{{ item.prl_label_name }}</q-checkbox>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mt-sm">
      <q-card-section class="row items-center">
        <div class="text-subtitle2">擅长员工</div>
        <q-radio v-model="staffStatus" val="close" label="否" />
        <q-radio v-model="staffStatus" val="open" label="是" />
      </q-card-section>
      <q-separator />
      <q-card-section class="row" v-if="staffStatus == 'open'">
        <div v-for="item in allPersonnelData">
          <q-checkbox v-model="bindPersonnelData" :val="item.id" color="primary">{{ item.pru_name }}</q-checkbox>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'RewardGoodsBind',
  data () {
    return {
      dialogShow: false,
      labelDataList: [],
      labelGroup: [],
      allPersonnelData: [],
      bindPersonnelData: [],
      rewardStatus: 'close',
      staffStatus: 'close'
    }
  },
  props: ['goodsId'],
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init () {
      this.dialogShow = true

      const obj = {
        id: this.goodsId
      }
      this.$store
        .dispatch('rewardLabel/getGoodsLabel', obj)
        .then((res) => {
          if (res.code == 200) {
            this.labelDataList = res.data ? res.data.labelDataList : []

            this.labelGroup = res.data ? res.data.selectedLabel : []
            this.allPersonnelData = res.data ? res.data.allPersonnelData : []

            this.bindPersonnelData = res.data ? res.data.bindPersonnelData : []

            if (this.labelGroup && this.labelGroup.length > 0) {
              this.rewardStatus = 'open'
            }

            if (this.bindPersonnelData && this.bindPersonnelData.length > 0) {
              this.staffStatus = 'open'
            }
          }
        })
        .catch((error) => {})
    },
    addUpdateLabel () {
      return {
        // goods_id: this.goodsId,
        labelGroup: this.labelGroup,
        bindPersonnelData: this.bindPersonnelData
      }

      const obj = {
        goods_id: this.goodsId,
        labelGroup: this.labelGroup,
        bindPersonnelData: this.bindPersonnelData
      }
      this.$store
        .dispatch('rewardLabel/setGoodsLabel', obj)
        .then((res) => {
          if (res.code == 200) {

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
