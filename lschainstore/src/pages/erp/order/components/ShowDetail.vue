<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md ">
        <q-form ref="erpInRef">
          <div class="q-gutter-x-xs row">
            <div class="col-12 col-md-2" v-if="is_main_store">
              <q-select
                class="q-pa-sm"
                outlined
                option-value="id"
                option-label="name"
                emit-value
                map-options
                v-model="erpInFormData.StoreId"
                :options="libInStoreList"
                dense
                @input="getStoreCredit"
                label="补货店铺"
                lazy-rules
                :disable="erpInFormData.StoreId ? true : false"
                :rules="[(val) => !!val || '请选择补货店铺']"
              />
            </div>
            <div class="col-12 col-md-2">
              <q-select
                class="q-pa-sm"
                outlined
                option-value="id"
                option-label="cd_name"
                emit-value
                map-options
                v-model="erpInFormData.ceo_depot_id"
                :disable="erpInFormData.ceo_depot_id ? true : false"
                :options="depotData"
                @input="selectDepot"
                dense
                label="请选择仓库"
                lazy-rules
                :rules="[(val) => !!val || '请选择仓库']"
              />
            </div>
          </div>
        </q-form>
      </div>
      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham erp-add-table ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="goodsInData"
          :rowDragManaged="true"
          :gridOptions="gridOptions"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :context="context"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :localeText="localeText"
        >
        </ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pa-md q-pb-xl">
        <div class="row ">
          <div class="col-12 q-px-xs">
            <q-input type="textarea" outlined v-model="erpInFormData.ceo_note" label="备注" dense :rows="2" />
          </div>
        </div>
        <div class="row q-gutter-sm q-mt-xs q-pb-lg">
          <div class="col-auto">
            账单小计:<span class="text-primary  text-h6"> {{ erpInFormData.ceo_total_amount }}</span>
          </div>
          <div class="col-auto">
            总数量:<span class="text-primary text-h6">{{ erpInFormData.ceo_total_replenishment_quantity }}</span>
          </div>
          <q-space />
          <div class="col-auto">
            <q-btn
              color="grey"
              class="q-px-xl"
              unelevated
              :to="{
                name: 'erpOrder',
                params: {
                  tab: '1',
                },
              }"
              label="返回"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'ShowDetail',
  components: {},
  data () {
    return {
      gridOptions: {},
      erpInFormData: {
        ceo_total_replenishment_quantity: 0,
        ceo_total_amount: 0,
        ceo_depot_id: 0,
        ceo_note: '',
        ceo_depot_code: '',
        ceo_depot_name: '',
        ceo_status: 0,
        ceo_type: 2
      },
      context: null,
      components: {},
      goodsInData: [],
      columnDefs: [
        {
          headerName: '条码',
          field: 'epd_skc_code',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '商品名称',
          field: 'epd_archives_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.12) + 'px'
        },
        {
         headerName: '规格 ',
          field: 'epd_spe_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '补货数量',
          field: 'epd_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '补货单价',
          field: 'epd_price',
          filter: false,

          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '折扣率',
          field: 'epd_discount_rate',
          filter: false,

          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '折扣额',
          valueGetter: (p) => {
            return p.data.epd_archives_id > 0 ? (p.data.epd_fold_amount > 0 ? p.data.epd_fold_amount : 0) : ''
          },
          filter: false,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '折后单价',
          field: 'epd_discount_after_amount',
          filter: false,
          valueGetter: (p) => {
            return p.data.epd_archives_id > 0 ? (p.data.epd_discount_after_amount > 0 ? p.data.epd_discount_after_amount : p.data.epd_price) : ''
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '补货金额',
          field: 'epd_cash_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '备注',
          field: 'epd_note',
          filter: false,
          width: this.nowpx(0.08) + 'px',
          pinned: this.pinnedComputed('right')
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      depotData: [],
      showGoodsList: false,
      localeText: this.$ag_grid_localeText,
      purchase_id: '',
      libInStoreList: []
    }
  },
  created () {
    this.context = this
    if (this.$route.query.id) {
      this.purchase_id = this.$route.query.id
      this.getItem()
    }
    this.getDepotList()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getItem () {
      const obj = {
        id: this.purchase_id
      }
      this.$store
        .dispatch('erpOrder/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.erpInFormData = res.data
            this.erpInFormData.StoreId = res.data.store_id
            this.goodsInData = res.data.buffer.length > 0 ? res.data.buffer : res.data.detail
            this.showEdit = this.erpInFormData.ceo_status == 2
            // this.showEdit = res.data.detail == 2
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    getDepotList () {
      this.$store
        .dispatch('erpdepot/getAllData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.depotData = res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    selectDepot () {
      const that = this
      if (that.erpInFormData.ceo_depot_id > 0) {
        const data = that.depotData.find(function (x) {
          return x.id == that.erpInFormData.ceo_depot_id
        })
        that.erpInFormData.ceo_depot_code = data.cd_code
        that.erpInFormData.ceo_depot_name = data.cd_name
      }
    },
    // 限制输入框必须是正整数
    changeRelativelyNumber (val) {
      let integer = 0
      if (val.replace(/[^\d]/g, '')) {
        integer = val.replace(/[^\d]/g, '')
      }
      return integer
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
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
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

<style>
.erp-add-table .cell-span-erp-add {
  background: white !important;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
