<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="bg-white">
        <q-card flat class="q-py-sm q-px-xs row q-gutter-xs">
          <div class="col-12 col-md-2">
            <q-input outlined dense v-model="memberInfo" label="请输入会员卡号|手机号|姓名" />
          </div>
          <div class="col-12 col-md-2">
            <q-input outlined readonly dense v-model="startTime" label="开始时间">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="startTime" minimal mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-md-2 col-12">
            <q-input outlined readonly dense label="结束时间" v-model="endTime">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="endTime" minimal mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12  col-md-4" v-if="is_main_store">
            <q-select
              label="查询门店"
              clearable
              v-model="selectStoreData"
              use-chips
              option-value="id"
              option-label="name"
              multiple
              emit-value
              map-options
              dense
              outlined
              :options="libInStoreList"
            />
          </div>
          <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="recordData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :context="context"
          rowSelection="multiple"
          :localeText="localeText"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'hyjcRecord',
  components: { },
  data () {
    return {
      addRecordStatus: false,
      detailStatus: false,
      typeOptions: [],
      memberInfo: '',
      goodsName: '',
      goodsType: '',
      startTime: '',
      endTime: '',
      recordRemarks: '',
      selectedRecord: [],
      context: null,
      gridOptions: {},
      recordData: [],
      columnDefs: [
        {
          headerName: '单据号',
          field: 'hr_invoice_code',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'mem_memberName',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '会员手机号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '会员级别',
          field: 'hr_member_level_name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '应付金额',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.hr_handle_amount
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '实付金额',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.hr_real_amount
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '规则名称',
          field: 'hr_rule_name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '折扣系数(%)',
          field: 'hr_rule_name',
          valueGetter: (p) => {
            return p.data.hr_discount_proportion
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '折扣金额',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.hr_discount_amount
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit + '倍数',
          field: 'hr_integral_multiple',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'hr_give_integral',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          width: this.nowpx(0.15) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    this.context = this
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getList () {
      if (this.startTime) {
        var startTime = new Date(this.startTime).getTime() / 1000
      }
      if (this.endTime) {
        var endTime = new Date(this.endTime).getTime() / 1000
      }
      const obj = {
        memberInfo: this.memberInfo,
        startTime: startTime,
        endTime: endTime,
        recordRemarks: this.recordRemarks,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('hyryx/getRecordListData', obj)
        .then((res) => {
          this.recordData = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          if (this.recordData.length > 0) {
            setTimeout(() => {
              this.setTopTabel(res.data.list)
            }, 200)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          hr_invoice_code: '合计',
          hr_discount_proportion: ' ',
          show_status: true,
          hr_handle_amount: '',
          hr_real_amount: '',
          hr_discount_amount: '',
          hr_give_integral: ''
        }
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },
    countColumnData (data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}
          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
                oneRowData[j] = this.formatAmount(oneRowData[j])
              })
            } else {
              oneRowData[j] = i[j]
            }
          }
          rowData.push(oneRowData)
        })
        console.log('sdsad', rowData)
        return rowData
      }
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    clearButton () {
      this.memberInfo = ''
      this.startTime = ''
      this.endTime = ''
      this.selectStoreData = []
      this.getList()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 298
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    }
  }
}
</script>
