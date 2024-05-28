<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll bg-white  q-pa-sm">
    <q-item class="q-mb-sm"  :v-ripple="false">
      <q-item-section>
        <q-item-label>启用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}支付</q-item-label>
      </q-item-section>
      <q-item-section side >
        <q-toggle v-model="jfmallGoodsData.jg_is_save_price" :disable="parseInt(goods) > 0 ? false : true" class="q-ma-none" color="green" true-value="1" false-value="2" @input="setGoodsData" />
      </q-item-section>
    </q-item>
    <div class="fit" v-if="jfmallGoodsData.jg_is_save_price == 1">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll" v-if="!formatStatus">
        <div class="row q-gutter-x-sm col-shrink bg-white  q-pb-md">
          <q-select
            outlined
            class="col-12 col-md-2 q-mt-sm"
            option-label="mcl_level_name"
            emit-value
            map-options
            v-model="levelData"
            :options="levelList"
            option-disable="inactive"
            dense
            label="会员级别"
          />
          <q-input class="col-12 col-md-2 q-mt-sm" label="请输入会员所需金额" outlined v-model="memberLevelPrice" dense />
          <q-btn unelevated color="primary" class="col-12 col-md-1 q-mt-sm" @click="changeStatus()">确认 </q-btn>
          <q-btn unelevated color="warning" class="col-12 col-md-1 q-mt-sm" @click="clearBut()">重置</q-btn>
        </div>

        <div class="col-shrink  full-height ">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableMenu="true"
            :rowData="levelList"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            @first-data-rendered="onFirstDataRendered"
            rowHeight="50"
            rowSelection="multiple"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            :context="context"
            :localeText="localeText"
            :singleClickEdit="true"
            :stopEditingWhenGridLosesFocus="true"
            :suppressRowDeselection="true"
          ></ag-grid-vue>
        </div>
      </div>
      <div class="fit" v-else>
        <specification-saving-price :goods="goods" />
      </div>
    </div>
  </div>
</template>
<script>
import SpecificationMemberPrice from './SpecificationMemberPrice.vue'
import SpecificationSavingPrice from './SpecificationSavingPrice.vue'
export default {
  name: 'JfmallMemberPrice',
  props: ['goods', 'formatStatus', 'jfmallGoodsData'],
  components: { SpecificationMemberPrice, SpecificationSavingPrice },
  data () {
    return {
      levelData: '',
      context: null,
      components: {},
      gridOptions: {},
      levelList: [],
      columnDefs: [
        {
          headerName: '会员级别',
          field: 'mcl_level_name',
          width: this.nowpx(0.35) + 'px'
        },
        {
          headerName: this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.changePrice,
          field: 'saving.jsp_price',
          width: this.nowpx(0.3) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      memberLevelPrice: ''
    }
  },
  mounted () {},
  computed: {},
  created () {
    if (!this.formatStatus) {
      this.getMemberLevelList()
    }
  },
  methods: {

    // 是否开启会员价
    setGoodsData () {
      const obj = {
        jg_is_save_price: this.jfmallGoodsData.jg_is_save_price,
        id: this.jfmallGoodsData.id
      }
      this.$store
        .dispatch('jfgoods/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '状态修改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
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
    },
    // 获取会员级别列表
    getMemberLevelList () {
      const obj = {
        goods_id: this.goods
      }
      this.$store
        .dispatch('savingPrice/getLevelList', obj)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.levelList = res.data ? res.data : []
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
    },
    changePrice (p) {
      const data = p.data

      const regu = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
      if (!regu.test(data.saving.jsp_price)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正确的金额',
          color: 'red'
        })
        this.getMemberLevelList()
      } else {
        const obj = {
          goods_id: this.goods,
          level_id: data.id,
          spe_id: 0,
          jsp_price: data.saving.jsp_price,
          id: data.saving.id
        }
        this.saveData(obj)
      }
    },
    changeStatus () {
      if (!this.levelData) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请选择会员等级',
          color: 'red'
        })
        return ''
      }
      const regu = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
      if (!regu.test(this.memberLevelPrice)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正确的金额',
          color: 'red'
        })
        return ''
      }
      const data = this.levelData
      const obj = {
        goods_id: this.goods,
        level_id: data.id,
        jsp_price: this.memberLevelPrice,
        id: data.saving.id
      }
      this.saveData(obj)
    },
    saveData (val) {
      this.$store
        .dispatch('savingPrice/setData', val)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '所需' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '修改成功',
              color: 'green'
            })
            this.clearBut()
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
    },
    clearBut () {
      this.memberLevelPrice = ''
      this.levelData = ''
      this.getMemberLevelList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }
  }
}
</script>
