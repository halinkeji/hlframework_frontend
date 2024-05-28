<template>
  <q-dialog v-model="editDialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.6) + 'px',
        'max-width': parseInt($q.screen.width * 0.6) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs row q-py-sm text-subtitle2 q-mb-xs">
          <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
          {{ oilId ? '修改' : '新增' }}油品
          <q-space />

          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>

        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-scroll-area class="fit full-height">
            <q-form ref="oilProductRef" class="row q-col-gutter-sm">
              <div class="col-md-3 col-12">
                <q-input
                  outlined
                  bottom-slots
                  v-model="oilProductFrom.op_name"
                  label="油品名称"
                  dense
                  lazy-rules
                  :rules="[(val) => !!val || '油品名称是必填项']"
                >
                </q-input>
              </div>

              <div class="col-md-3 col-12">
                <q-select
                  outlined
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  v-model="oilProductFrom.op_source_group"
                  :options="balanceGroupData"
                  :rules="[(val) => !!val || '请选择组别']"
                  dense
                  label="选择组别"
                />
              </div>

              <div class="col-md-3 col-12">
                <q-input
                  outlined
                  bottom-slots
                  v-model="oilProductFrom.osc_stock"
                  dense
                  lazy-rules
                  label="剩余库存"
                  :rules="[(val) =>  /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,3})?$/.test(val) || '请输入正确的库存数量']"
                >
                  <template v-slot:append>
                    <span class="text-subtitle1">升</span>
                  </template>
                </q-input>
              </div>

              <div class="col-md-3 col-12">
                <q-select
                  outlined
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  v-model="oilProductFrom.osc_status"
                  :options="[
                    { label: '开启', value: '1' },
                    { label: '关闭', value: '0' },
                  ]"
                  dense
                  label="状态"
                />
              </div>

              <div class="col-md-12 full-width">
                <q-card flat bordered>
                  <q-card-section class="q-pa-xs">
                    <q-item>
                      <q-item-section>售价</q-item-section>
                      <q-item-section side
                        ><q-input @input="unifySetPrice" outlined dense v-model="unifyPrice" label="统一设置售价"
                      /></q-item-section>
                    </q-item>
                  </q-card-section>
                  <q-separator />
                  <q-card-section>
                    <div class="row q-col-gutter-sm">
                      <div class="col" :key="key" v-for="(item, key) in weekPriceData">
                        <q-input
                          outlined
                          dense
                          v-model="item.value"
                          :rules="[(val) => !!val || '请输入售价', (val) => (val && /^(\d+|\d+\.\d{1,2})$/.test(val)) || '售价为非负两位以内小数']"
                          :label="item.label + '售价'"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-md-12">
                <q-item>
                  <q-item-section>
                    <q-item-label>是否开启油品会员价</q-item-label>
                    <q-item-label caption lines="1">注：关闭此开关，此油品会员价将会失效。</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-toggle v-model="oilProductFrom.osc_is_member_price" @input="setPriceModel" color="green" true-value="1" false-value="2" />
                  </q-item-section>
                </q-item>
              </div>

              <q-card flat class="q-mt-sm q-pb-md" v-if="parseInt(oilProductFrom.osc_is_member_price) == 1">
                <div class="q-px-md q-py-sm row">
                  <div class="col-md-7 col-12">
                    <div>油品会员价切换比例方式</div>
                    <div class="text-red">
                      <q-icon name="las la-info-circle" color="red" />
                      积分比率说明:会员等级会额外根据交易的实付金额赠送会员积分。输入0不赠送积分！例如输入数值5：10元 × 5 =
                      50积分，则额外赠送会员50积分
                    </div>
                  </div>
                  <div class="col text-right">
                    <q-radio @input="setPriceModel" v-model="oilProductFrom.osc_member_price_type" val="1" label="等级折扣/积分比例" />
                    <q-radio @input="setPriceModel" v-model="oilProductFrom.osc_member_price_type" val="2" label="会员价/积分换算" />
                  </div>
                </div>

                <ag-grid-vue
                  ref="agGridTable"
                  :gridOptions="gridOptions"
                  class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
                  :columnDefs="columnDefs"
                  :suppressMovableColumns="true"
                  :stopEditingWhenGridLosesFocus="true"
                  @first-data-rendered="onFirstDataRendered"
                  :suppressRowDeselection="true"
                  :defaultColDef="defaultColDef"
                  :rowData="memberPriceData"
                  rowSelection="multiple"
                  :rowDragManaged="true"
                  colResizeDefault="shift"
                  :animateRows="false"
                  rowHeight="40"
                  :floatingFilter="false"
                  :enableCellTextSelection="true"
                  :suppressCellSelection="true"
                  :suppressRowClickSelection="true"
                  :suppressRowTransform="true"
                  :localeText="localeText"
                  :context="context"
                  domLayout="autoHeight"
                ></ag-grid-vue>
              </q-card>
            </q-form>
          </q-scroll-area>
        </div>

        <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
          <q-btn class="q-px-xl" unelevated label="提交" @click="saveData()" color="primary" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  components: {},
  name: 'AddOilProduct',
  data () {
    return {
      oilProductFrom: {
        op_name: '',
        op_price: '',
        op_unit: 1,
        osc_is_member_price: '2',
        osc_member_price_type: '2',
        osc_stock: '',
        osc_status: '1',
        op_source_group: ''
      },

      oilId: 0,
      defaultColDef: {},

      editDialogStatus: false,
      columnDefs: [],
      localeText: this.$ag_grid_localeText,
      gridOptions: {},
      memberPriceData: [],
      context: '',
      weekPriceData: [],
      unifyPrice: '',
      balanceGroupData: []
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (oilId) {
      this.oilId = oilId
      this.editDialogStatus = true

      this.$store.dispatch('product/getOilItem', { oilId }).then((res) => {
        if (res.code == 200) {
          if (res.data && res.data.oilProductFrom) {
            this.oilProductFrom = res.data.oilProductFrom
          }

          this.memberPriceData = res.data && res.data.oilMemberLevelPrice ? res.data.oilMemberLevelPrice : []
          this.balanceGroupData = res.data && res.data.balanceGroupData ? res.data.balanceGroupData : []
          this.weekPriceData = res.data && res.data.oilWeekPrice ? res.data.oilWeekPrice : []
          if (this.oilProductFrom && parseInt(this.oilProductFrom.osc_is_member_price) == 1) {
            this.setPriceModel()
          }
        }
      })
    },

    unifySetPrice () {
      const that = this
      if (this.weekPriceData && this.weekPriceData.length > 0) {
        this.weekPriceData.forEach((item, key) => {
          that.weekPriceData[key].value = that.unifyPrice
        })
      }
    },

    setPriceModel () {
      if (this.oilProductFrom.osc_is_member_price == 1) {
        this.$nextTick(() => {
          const columnData = [
          // 表格列数据
            {
              headerName: '会员等级', // 列标题
              field: 'level_name', // 列与数据源对应的字段
              filter: false,
              width: this.nowpx(0.2) + 'px'
            }
          ]
          if (this.oilProductFrom && parseInt(this.oilProductFrom.osc_member_price_type) == 1) {
            columnData.push({
              headerName: '等级折扣',
              field: 'omp_rebate',
              filter: false,
              width: this.nowpx(0.2) + 'px',
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeRebate
            })
            columnData.push({
              headerName: '积分比例',
              field: 'omp_ratio',
              filter: false,
              width: this.nowpx(0.2) + 'px',
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeRebate
            })
          }

          if (this.oilProductFrom && parseInt(this.oilProductFrom.osc_member_price_type) == 2) {
            columnData.push({
              headerName: '价格',
              field: 'omp_price',
              filter: false,
              width: this.nowpx(0.2) + 'px',
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changePrice
            })
            columnData.push({
              headerName: '积分换算',
              field: 'omp_point',
              filter: false,
              width: this.nowpx(0.2) + 'px',
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changePrice
            })
          }

          this.gridOptions.api.setColumnDefs(columnData)

          this.$nextTick(() => {
            this.gridOptions.api.sizeColumnsToFit()
            this.gridOptions.api.refreshCells()
          })
        })
      } else {
        this.memberPriceData = []
      }
    },

    saveData () {
      this.$refs.oilProductRef.validate().then((success) => {
        if (success) {
          this.stop = true
          const obj = {
            weekPriceData: this.weekPriceData,
            memberPriceData: this.memberPriceData,
            ...this.oilProductFrom,
            id: this.oilId
          }
          this.$store
            .dispatch('product/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.oilId > 0 ? '修改' : '新增'}油品成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.hideNowPage()
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
        }
      })
    },

    changeRebate (p) {
      const regu = /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100.00$)/
      if (!regu.test(p.newValue)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正确的比例',
          color: 'red'
        })

        const itemsToUpdate = []
        const data = p.data
        p.data[p.colDef.field] = '0'
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
      }
    },
    changePrice (p) {
      const regu = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
      if (!regu.test(p.newValue)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正确的价格',
          color: 'red'
        })
        const itemsToUpdate = []
        const data = p.data
        p.data[p.colDef.field] = '0'
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
      }
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
    hideNowPage () {
      this.editDialogStatus = false
      this.$nextTick(() => {
        this.$emit('colseDialog')
      })
    }
  }
}
</script>
