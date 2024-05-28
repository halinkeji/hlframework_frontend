<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        关联借出
      </div>
      <div class="col-shrink bg-white q-px-xs q-py-sm">
        <q-form ref="lendDataRef" class="row">
          <div class="col-12 col-md-1 q-mx-sm">
            <q-select
              outlined
              dense
              @input="typeChange"
              v-model="debtType"
              :options="[
                { label: '油站', value: 'store' },
                { label: '公司', value: 'company' },
              ]"
              label="选择类型"
              map-options
              emit-value
              bottom-slots
            />
          </div>

          <div class="col-12 col-md-3 q-mx-sm" v-if="debtType == 'company'">
            <q-select
              outlined
              dense
              v-model="turnData.poi_link_company_id"
              :options="oilSupplierList"
              label="借出关联公司"
              class="col-12 col-md-3"
              option-value="id"
              option-label="es_name"
              emit-value
              map-options
              :rules="[(val) => !!val || '请选择借出关联公司']"
            >
              <template v-slot:after>
                <q-btn color="orange" @click="openPoppupStatus = true" unelevated label="选择开油单据" size="md" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3 q-mx-sm" v-if="debtType == 'store'">
            <q-select
              outlined
              dense
              v-model="turnData.poi_in_store_id"
              :options="libInStoreList"
              label="请选择借出油站"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              :rules="[(val) => !!val || '请选择借出油站']"
            >
              <template v-slot:after>
                <q-btn color="orange" @click="openPoppupStatus = true" unelevated label="选择开油单据" size="md" />
              </template>
            </q-select>
          </div>
        </q-form>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2 q-pb-sm">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center goods-count-table hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="takeOilData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :context="context"
          rowSelection="multiple"
          :localeText="localeText"
          :stopEditingWhenGridLosesFocus="true"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
        <q-btn unelevated label="确认" @click="submitData()" :disable="addButtonDisabled" color="primary" class="q-px-xl" />
        <q-btn unelevated label="返回" type="reset" :to="{ name: 'oilDebt' }" color="grey" class="q-px-xl" />
      </div>
      <oil-record ref="oilopenRef" v-if="openPoppupStatus" @getRecord="getSelectedOilData" />
    </div>
  </q-page>
</template>

<script>
import OilRecord from '../../erp-open/OilRecord.vue'
import AgLendAgDel from './AgLendAgDel'
import AgLendAgUnit from '../components/AgLendAgUnit.vue'
export default {
  name: 'Lend',
  components: { OilRecord, AgLendAgDel, AgLendAgUnit },
  data () {
    return {
      components: { AgLendAgDel, AgLendAgUnit },
      takeOilData: [],
      turnData: {
        poi_link_company_id: '',
        poi_in_store_id: ''
      },
      openPoppupStatus: true,
      takeData: {
        oid_shipOilPay: '',
        oid_shipOilMoney: ''
      },
      addButtonDisabled: false,
      selected: [],
      context: null,
      gridOptions: {},
      totalTakeCount: 0,
      columnDefs: [
        {
          headerName: '油品',
          field: 'oid_oil_name',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '剩余升数',
          field: 'oid_last_liter_count',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '剩余吨数',
          field: 'oid_last_ton_count',
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '单位(升/吨)',
          field: 'oid_unit',
          width: this.nowpx(0.09) + 'px',
          valueGetter: (p) => {
            return parseInt(p.data.oid_unit) == 1 ? '吨' : '升'
          },
          cellRendererFramework: 'AgLendAgUnit'
        },
        {
          headerName: '吨数',
          field: 'oid_ton_count',
          width: this.nowpx(0.09) + 'px',
          editable: (p) => {
            if (parseInt(p.data.oid_unit) == 1) {
              return true
            }

            return false
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '升数',
          field: 'oid_liter_count',
          width: this.nowpx(0.11) + 'px',
          singleClickEdit: true,
          editable: (p) => {
            if (parseInt(p.data.oid_unit) == 2) {
              return true
            }

            return false
          },
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '密度',
          field: 'oid_density',
          width: this.nowpx(0.09) + 'px',
          editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '单位单价',
          field: 'oid_price',
          width: this.nowpx(0.09) + 'px'
          // editable: true,
          // singleClickEdit: true,
          // onCellValueChanged: this.changeNumber
        },
        {
          headerName: '小计金额',
          field: 'oid_total_price',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '备注',
          field: 'oid_note',
          width: this.nowpx(0.09) + 'px',
          editable: true,
          singleClickEdit: true
          // onCellValueChanged: this.changeNumber
        },
        {
          headerName: '操作',
          width: this.nowpx(0.09) + 'px',
          cellRendererFramework: 'AgLendAgDel'
        }
      ],
      oilListData: [],
      oilSupplierList: [],
      localeText: this.$ag_grid_localeText,
      libInStoreList: [],
      debtType: 'store'
    }
  },
  created () {
    this.typeChange()
    this.context = this
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },

    typeChange () {
      if (this.debtType == 'company') {
        this.getOilSupplierList()
      }

      if (this.debtType == 'store') {
        this.getLibInStoreData()
      }
    },

    getOilSupplierList () {
      this.$store
        .dispatch('osupplier/getSupplierList', { type: 2 })
        .then((res) => {
          if (res.code == 200) {
            this.oilSupplierList = res.data ? res.data : []
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

    submitData () {
      this.$refs.lendDataRef.validate().then((success) => {
        if (success) {
          this.$q
            .dialog({
              type: 'confirm',
              color: 'primary',
              title: '是否确认',
              message: '确认借出？',
              cancel: true
            })
            .onOk(() => {
              this.addButtonDisabled = true

              const obj = {
                ...this.turnData,
                debtType: this.debtType,
                takeOilData: this.takeOilData
              }
              this.$store.dispatch('turnoil/setData', obj).then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    caption: '借出成功！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })

                  this.$router.push({ name: 'oilDebt' })
                } else {
                  this.$q.notify({
                    message: '注意',
                    caption: '借出失败',
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    color: 'red'
                  })

                  this.addButtonDisabled = false
                }
              })
            })
            .onCancel(() => {})
        }
      })
    },

    // 修改的逻辑部分
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data

      if (parseInt(data.oid_unit) == 1) {
        const nowtonCount = this.formatAmountThree(data.oid_ton_count)
        data.oid_ton_count = nowtonCount
        if (nowtonCount > data.oid_last_ton_count) {
          this.$q.notify({
            message: '失败',
            caption: '操作取回吨数大于剩余吨数',
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          data.oid_ton_count = '0'
          data.oid_liter_count = '0'
          data.oid_total_price = '0'
        } else {
          data.oid_total_price = this.formatAmount(nowtonCount * data.oid_price)
          data.oid_liter_count = this.calculateLiter(this.formatAmountThree(data.oid_density), this.formatAmountThree(nowtonCount))
        }
      }
      if (parseInt(data.oid_unit) == 2) {
        const nowLiterCount = this.formatAmountThree(data.oid_liter_count)
        data.oid_liter_count = nowLiterCount
        if (nowLiterCount > data.oid_last_liter_count) {
          this.$q.notify({
            message: '失败',
            caption: '操作取回吨数大于剩余升数',
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          data.oid_ton_count = '0'
          data.oid_liter_count = '0'
          data.oid_total_price = '0'
        } else {
          data.oid_total_price = this.formatAmount(nowLiterCount * data.oid_price)
          data.oid_ton_count = this.calculateTon(this.formatAmountThree(data.oid_density), this.formatAmountThree(nowLiterCount))
        }
      }

      itemsToUpdate.push(data)
      p.api.applyTransaction({ update: itemsToUpdate })
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

    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 295
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    formatAmountThree (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 1000) / 1000
      }
    },

    // 获取选中开油数据
    getSelectedOilData (data) {
      this.openPoppupStatus = false
      const that = this
      if (data) {
        if (data.length > 0) {
          const takeOilData = []

          data.forEach(function (value, index, array) {
            const findInvoiceIndex = _.findIndex(that.takeOilData, function (o) {
              return o.id == value.id
            })
            value.oid_ton_count = 0
            value.oid_liter_count = 0
            // value.oid_price = 0
            value.oid_total_price = 0
            value.oid_note = ''

            value.oid_density = 0

            if (findInvoiceIndex < 0) {
              if (parseInt(value.oid_unit) == 1 && value.oid_last_ton_count > 0) {
                takeOilData.push(value)
              }

              if (parseInt(value.oid_unit) == 2 && value.oid_last_liter_count > 0) {
                takeOilData.push(value)
              }
            }
          })

          this.takeOilData = this.takeOilData.concat(takeOilData)
        }
      }
    },
    // 隐藏滚动条
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },

    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }
  }
}
</script>
