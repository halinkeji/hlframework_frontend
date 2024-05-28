<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pt-sm">
        <q-form ref="unitDataRef">
          <q-item >
            <q-item-section>
              <q-select
                outlined
                dense
                v-model="invoiceData.poi_supplier_id"
                :options="supplierList"
                label="请选择供油商"
                option-value="id"
                option-label="es_name"
                map-options
                emit-value
                lazy-rules
                :rules="[(val) => (val && val > 0) || '请选择供油商']"
              >
                <template v-slot:after>
                  <q-btn color="orange" @click="showPopup" unelevated label="选择油品" size="md" />
                </template>
              </q-select>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-pb-md q-ml-md"> 小计金额：<span class="text-orange q-px-sm">¥</span> <span class="text-h6 text-orange">{{ invoiceData.poi_real_money }}</span></q-item-label>
            </q-item-section>
          </q-item>
        </q-form>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center goods-count-table full-height"
          ref="agGridTable"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="probuctData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :localeText="localeText"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="40"
          :gridOptions="gridOptions"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :context="context"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
        >
        </ag-grid-vue>
      </div>
      <add-ag ref="addRef" @getRecord="getSelectedOilData" v-if="addPoppupStatus" @dataList="getDataList" />
      <div class="col-shrink bg-white q-mt-xs q-py-sm text-center q-gutter-sm q-pb-md">
        <q-btn unelevated color="primary" class="q-px-xl" :disable="addButtonDisabled" @click="setData" label="保存" />

        <q-btn unelevated label="返回" class="q-px-xl" color="grey" :to="{ name: 'openOil' }" />
      </div>
    </div>
  </q-page>
</template>
<script>
import AddButton from './AddButton.vue'
import AgSelect from './AgSelect.vue'
import AddAg from './AddAg.vue'
export default {
  name: 'AddOpenoil',
  components: {
    AgSelect,
    AddButton,
    AddAg
  },
  data () {
    return {
      invoiceData: {
        id: '',
        poi_realMoney: 0,
        poi_supplierId: '',
        poi_invoiceCode: '',
        poi_invoiceType: '1',
        poi_real_money: 0
      },
      localeText: this.$ag_grid_localeText,
      addButtonDisabled: false,
      probuctData: [],
      supplierList: [],
      searchQuery: '',
      addPoppupStatus: false,
      text: '',
      context: '',
      tab: 'manage',
      gridOptions: {},
      columnDefs: [
        {
          headerName: '油品',
          field: 'oid_oil_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '单位（升/吨）',
          field: 'oid_unit',
          cellRendererFramework: 'AgSelect',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '吨数',
          field: 'oid_ton_count',
          editable: (p) => {
            if (parseInt(p.data.oid_unit) == 1) {
              return true
            }

            return false
          },
          singleClickEdit: true,
          onCellValueChanged: this.editActivedEvent,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '升数',
          field: 'oid_liter_count',
          editable: (p) => {
            if (parseInt(p.data.oid_unit) == 2) {
              return true
            }

            return false
          },
          singleClickEdit: true,
          onCellValueChanged: this.editActivedEvent,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '密度',
          field: 'oid_density',
          editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.editActivedEvent,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '单位单价',
          field: 'oid_price',
          editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.editActivedEvent,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '小计金额',
          field: 'oid_total_price',
          onCellValueChanged: this.editActivedEvent,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '备注',
          field: 'oid_note',
          editable: true,
          singleClickEdit: true,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          field: '',
          cellRendererFramework: 'AddButton',
          width: this.nowpx(0.1) + 'px'
        }
      ]
    }
  },
  created () {
    this.getSupplierList()
    this.context = this
  },
  methods: {
    // 查询无分页供应商
    getSupplierList () {
      this.$store
        .dispatch('osupplier/getSupplierList')
        .then((res) => {
          if (res.code == 200) {
            this.supplierList = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
        .catch((err) => {})
    },

    setData () {
      this.$refs.unitDataRef.validate().then((success) => {
        if (success) {
          if (this.probuctData.length <= 0) {
            this.$q.notify({
              message: '注意',
              caption: '请选择油品！',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            return false
          }

          this.addButtonDisabled = true

          const obj = {
            openOilDetail: this.probuctData,
            ...this.invoiceData
          }
          this.$store
            .dispatch('openoil/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '开油成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$router.push({ name: 'openOil' })
              } else {
                this.$q.notify({
                  message: '注意',
                  caption: '失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
                this.addButtonDisabled = false
              }
            })
            .catch((error) => {})
        }
      })
    },
    // 获取选中数据
    getSelectedOilData (data) {
      this.addPoppupStatus = false
      if (data) {
        if (data.length > 0) {
          this.probuctDataBak = []
          for (let i = 0; i < data.length; i++) {
            const person = {
              id: '',
              oid_oil_name: '',
              oid_ton_count: '',
              oid_liter_count: '',
              oid_density: '',
              oid_price: '',
              oid_total_price: '',
              oid_note: '',
              oid_unit: ''
            }
            person.oid_oil_name = data[i].op_name
            person.oid_unit = data[i].op_unit
            person.oid_ton_count = 0
            person.oid_liter_count = 0
            person.oid_density = ''
            person.oid_price = 0.0
            person.oid_total_price = ''
            person.oid_note = ''
            person.oid_oil_id = data[i].id

            this.probuctDataBak.push(person)
          }

          this.probuctData = this.probuctData.concat(this.probuctDataBak)
        }
      }
    },
    // 账单小计
    getDataColumnSum () {
      this.invoiceData.poi_realMoney = 0
      const tableData = this.probuctData
      let inTotalNum = 0
      let inTotalAmount = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.oid_liter_count)) {
          inTotalNum = parseInt(inTotalNum) + parseInt(item.oid_liter_count)
        }
        if (this.formatAmount(item.oid_total_price)) {
          inTotalAmount = this.formatAmount(inTotalAmount) + this.formatAmount(item.oid_total_price)
        }
      })
      this.invoiceData.poi_real_money = this.formatAmount(inTotalAmount)
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    // 入库计算
    editActivedEvent (p) {
      const itemsToUpdate = []
      const row = p.data

      const oid_unit = this.formatAmount(row.oid_unit)
      const oid_tonCount = this.formatAmount(row.oid_ton_count)
      const oid_literCount = this.formatAmount(row.oid_liter_count)
      const oid_density = row.oid_density
      const oid_price = this.formatAmount(row.oid_price)

      if (parseInt(oid_unit) == 1) {
        row.oid_liter_count = this.calculateLiter(oid_density, oid_tonCount)
        row.oid_total_price = this.formatAmount(oid_tonCount * oid_price)
      } else {
        row.oid_ton_count = this.calculateLiter(oid_density, oid_literCount)
        row.oid_total_price = this.formatAmount(oid_literCount * oid_price)
      }

      itemsToUpdate.push(row)
      p.api.applyTransaction({ update: itemsToUpdate })
      this.getDataColumnSum()
    },

    // 吨换算升
    calculateLiter (density, ton) {
      if (density > 0 && ton > 0) {
        return this.formatAmountThree((this.formatAmountThree(ton) / this.formatAmountThree(density)) * 1000)
      }
      return 0
    },

    // 升换算吨
    calculateTon (density, liter) {
      if (density > 0 && liter > 0) {
        return this.formatAmountThree((this.formatAmountThree(liter) * this.formatAmountThree(density)) / 1000)
      }
      return 0
    },

    onFirstDataRendered (params) {
      params.api.sizeColumnsToFit()
    },
    showPopup () {
      this.addPoppupStatus = true
    }, // 显示弹窗方法
    getDataList () {
      this.addPoppupStatus = false
    }, // 隐藏弹窗方法
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    formatAmountThree (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 1000) / 1000
      }
    }
  }
}
</script>
