<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <div flat class="q-pa-sm row q-gutter-xs ">
          <q-input outlined dense v-model="memberInfo" label="请输入主卡会员卡号|手机号|姓名" class="col-12 col-md-2" />
          <q-input outlined dense v-model="sonMemberInfo" label="请输入副卡会员卡号|手机号|姓名" class="col-12 col-md-2" />
          <div class="col-2" v-if="is_main_store">
            <q-select label="查询门店" use-chips clearable v-model="selectStoreData" option-value="id" option-label="name" multiple emit-value map-options dense outlined :options="libInStoreList" />
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
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
        </div>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="recordList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :context="context"
          :localeText="localeText"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :suppressRowTransform="true"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
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
  </q-page>
</template>
<script>
export default {
  name: 'zfkRecord',
  components: {},
  data () {
    return {
      memberInfo: '',
      sonMemberInfo: '',
      startTime: '',
      endTime: '',
      context: '',
      recordList: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '单据号',
          field: 'zcl_invoice_code',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '会员卡号（主卡）',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '会员姓名（主卡）',
          field: 'mem_memberName',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '会员卡号（副卡）',
          field: 'sonCardNum',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '会员姓名（副卡）',
          field: 'sonName',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '使用' + this.$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'zcl_balance_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '使用' + this.$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'zcl_integral_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作行为',
          field: 'zcl_operating_behavior',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.12) + 'px',
          pinned: 'right'
        },
        {
          headerName: '消费时间',
          width: this.nowpx(0.13) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
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
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  mounted () {
    this.getList()
  },
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
    getList () {
      if (this.startTime) {
        var startTime = new Date(this.startTime).getTime() / 1000
      }
      if (this.endTime) {
        var endTime = new Date(this.endTime).getTime() / 1000
      }
      const params = {
        memberInfo: this.memberInfo,
        sonMemberInfo: this.sonMemberInfo,
        startTime: startTime,
        endTime: endTime,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('zfk/getRecordListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.recordList = res.data ? res.data.list : []
            if (this.recordList.length > 0) {
              setTimeout(() => {
                this.setTopTabel(res.data.list)
              }, 200)
            }
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          zcl_invoice_code: '合计',
          show_status: true,
          zcl_balance_amount: '',
          zcl_integral_amount: ''
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
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearButton () {
      this.memberInfo = ''
      this.sonMemberInfo = ''
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
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }
  }
}
</script>
