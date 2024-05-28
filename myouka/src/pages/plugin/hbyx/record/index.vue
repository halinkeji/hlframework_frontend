<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="bg-white">
        <q-card flat class="q-py-sm q-px-xs row q-gutter-xs">
          <div class="col-12 col-md-2">
            <q-input outlined dense v-model="memberInfo" label="请输入会员卡号|昵称" />
          </div>

           <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            :options="[
              {
                label:'未使用',
                value:'1'
              },
              {
                label:'已使用',
                value:'2'
              },

            ]"
            v-model="useStatus"
            dense
            label="状态"
          />
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

          <div class="col-12 col-md-2">
            <q-input outlined dense label="开始时间" v-model="startTime" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="startTime" @click="startTime = ''" name="cancel"></q-icon>
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
          <div class="col-12 col-md-2">
            <q-input outlined dense label="结束时间" v-model="endTime" readonly>

              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="endTime" @click="endTime = ''" name="cancel"></q-icon>
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
          <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />

          <q-btn unelevated color="warning" dense label="导出" @click="exportCsv" class="q-px-md" />
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
          headerName: '红包类型',
          field: 'phr_hb_type',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.phr_hb_type) == 1) {
              return '支付红包'
            } else if (parseInt(p.data.phr_hb_type) == 2) {
              return '推广红包'
            }
          }
        },
        {
          headerName: '单据号',
          field: 'invoice.sc_invoiceCode',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '会员昵称',
          field: 'phr_member_nickname',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'phr_member_card_number',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '红包金额',
          field: 'phr_hb_amount',

          valueGetter: (p) => {
            if (p.data.phr_hb_amount > 0) {
              return this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.phr_hb_amount
            }
          },
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '应付金额',
          field: 'phr_handle_money_count',
          valueGetter: (p) => {
            if (p.data.phr_handle_money_count > 0) {
              return this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.phr_handle_money_count
            }
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '实付金额',
          field: 'phr_real_money_count',
          valueGetter: (p) => {
            if (p.data.phr_real_money_count > 0) {
              return this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.phr_real_money_count
            }
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '状态',
          field: 'phr_status',
          width: this.nowpx(0.15) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.phr_status) == 1) {
              return '未使用'
            } else if (parseInt(p.data.phr_status) == 2) {
              return '已使用'
            }
          }
        },
        {
          headerName: '到期时间',
          field: 'phr_end_time',
          width: this.nowpx(0.15) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.phr_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
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
          headerName: '使用时间',
          field: 'updated_at',
          width: this.nowpx(0.15) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss')
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
      libInStoreList: [],
      useStatus: ''

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
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      const obj = {
        memberInfo: this.memberInfo,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData,
        use_status: this.useStatus,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$store
        .dispatch('hbyx/getRecordListData', obj)
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
      const that = this

      const oneColumn = {
        phr_hb_type: '数据合计',
        show_status: true,
        phr_hb_amount: '',
        phr_handle_money_count: '',
        phr_real_money_count: ''

      }
      if (that.paymentChannel && that.paymentChannel.length > 0) {
        that.paymentChannel.forEach(function (item, key) {
          oneColumn[item.key] = ''
        })
      }

      const newRows = this.countColumnData(list, [oneColumn])

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

    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-红包记录'
      })
    },
    clearButton () {
      this.memberInfo = ''
      this.startTime = ''
      this.endTime = ''
      this.useStatus = ''
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
