<template>
  <q-dialog v-model="editDialogStatus" persistent >
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.6) + 'px',
        'max-width': parseInt($q.screen.width * 0.6) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
          <div class="row q-px-sm">
            设置价格
            <q-space />

            <q-btn @click="colseDialog" icon="close" flat round dense v-close-popup />
          </div>

          <q-item>
            <q-item-section>
              <q-item-label>是否开启油品专车价</q-item-label>
              <q-item-label caption lines="2">注：关闭此开关，此油品专车价将会失效。</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-toggle @input="setPriceModel" v-model="oilZcrzFrom.zsc_is_zcrz_price" color="green" true-value="1" false-value="2" />
            </q-item-section>
          </q-item>

          <div class="q-px-md q-py-sm row" v-if="parseInt(oilZcrzFrom.zsc_is_zcrz_price) == 1">
            <div class="col-md-7 col-12">
              <div>油品专车价切换比例方式</div>
              <div class="text-red">
                <q-icon name="las la-info-circle" color="red" />
                积分比率说明:专车会额外根据交易的实付金额赠送会员积分。输入0不赠送积分！例如输入数值5：10元 × 5 = 50 积分，则额外赠送会员50积分
              </div>
            </div>
            <div class="col text-right">
              <q-radio @input="setPriceModel" v-model="oilZcrzFrom.zsc_zcrz_price_type" val="1" label="等级折扣/积分比例" />
              <q-radio @input="setPriceModel" v-model="oilZcrzFrom.zsc_zcrz_price_type" val="2" label="会员价/积分换算" />
            </div>
          </div>
        </div>

        <div class="col-shrink q-pa-sm full-height bg-white" v-if="parseInt(oilZcrzFrom.zsc_is_zcrz_price) == 1">
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
            rowHeight="60"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            :suppressRowTransform="true"
            :localeText="localeText"
            :context="context"
          ></ag-grid-vue>
        </div>

        <div class="col-shrink bg-white q-my-sm q-py-sm text-center">
          <q-btn class="q-px-xl" label="提交" @click="saveData()" :disable="addStoreSidebar" color="primary" unelevated />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  components: {},
  name: 'ZcrzPrice',
  data () {
    return {
      editDialogStatus: false,
      defaultColDef: {},
      context: null,
      addStoreSidebar: false,

      oilZcrzFrom: {
        zsc_is_zcrz_price: '2',
        zsc_zcrz_price_type: '2'
      },

      columnDefs: [],
      gridOptions: {},
      memberPriceData: [],
      localeText: this.$ag_grid_localeText,
      zcrzTypeId: 0
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (typeId) {
      this.editDialogStatus = true
      this.zcrzTypeId = typeId
      this.$store.dispatch('zcrz/getZcrzPrice', { typeId }).then((res) => {
        if (res.code == 200) {
          if (res.data && res.data.oilZcrzFrom && res.data.oilZcrzFrom.id) {
            this.oilZcrzFrom = res.data.oilZcrzFrom
          }

          this.memberPriceData = res.data && res.data.oilZcrzMemberPrice ? res.data.oilZcrzMemberPrice : []

          if (this.oilZcrzFrom && parseInt(this.oilZcrzFrom.zsc_is_zcrz_price) == 1) {
            this.setPriceModel()
          }
        }
      })
    },
    setPriceModel () {
      if (parseInt(this.oilZcrzFrom.zsc_is_zcrz_price) == 1) {
        this.$nextTick(() => {
          const columnData = [
            // 表格列数据
            {
              headerName: '油品名称', // 列标题
              field: 'oil_name', // 列与数据源对应的字段
              filter: false,
              width: this.nowpx(0.2) + 'px'
            }
          ]
          if (this.oilZcrzFrom && parseInt(this.oilZcrzFrom.zsc_zcrz_price_type) == 1) {
            columnData.push({
              headerName: '专车折扣',
              field: 'ozp_rebate',
              filter: false,
              width: this.nowpx(0.2) + 'px',
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeRebate
            })
            columnData.push({
              headerName: '积分比例',
              field: 'ozp_point',
              filter: false,
              width: this.nowpx(0.2) + 'px',
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changeRebate
            })
          }

          if (this.oilZcrzFrom && parseInt(this.oilZcrzFrom.zsc_zcrz_price_type) == 2) {
            columnData.push({
              headerName: '专车价格',
              field: 'ozp_price',
              filter: false,
              width: this.nowpx(0.2) + 'px',
              editable: true,
              singleClickEdit: true,
              onCellValueChanged: this.changePrice
            })
            columnData.push({
              headerName: '积分换算',
              field: 'ozp_ratio',
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
    // 提交数据
    saveData () {
      const obj = {
        memberPriceData: this.memberPriceData,
        ...this.oilZcrzFrom,
        zsc_type_id: this.zcrzTypeId
      }
      this.$store
        .dispatch('zcrz/setZcrzPrice', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '保存成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.colseDialog()
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
    colseDialog () {
      this.editDialogStatus = false

      this.$emit('closeDialog')
    }
  }
}
</script>
