<template>
  <div class="fit bg-grey-3">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="bg-white">
        <q-card flat class="q-py-sm q-px-xs row q-gutter-xs">
          <div class="col">
            <q-input outlined dense v-model="memberInfo" label="请输入会员卡号|手机号|姓名" />
          </div>
          <div class="col">
            <q-input outlined dense v-model="goodsName" label="物品名称" />
          </div>
          <div class="col">
            <q-select
              outlined
              dense
              v-model="goodsType"
              option-value="id"
              option-label="pht_name"
              :options="typeOptions"
              label="请选择分类"
              emit-value
              map-options
            />
          </div>
          <div class="col">
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
          <div class="col">
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
          <div class="col">
            <q-input outlined dense v-model="recordRemarks" label="请输入备注" />
          </div>
          <q-btn unelevated color="primary"  label="查询"  @click="getList" />
          <q-btn unelevated color="warning"  label="重置" @click="clearButton"  />
          <q-btn unelevated color="primary"  label="新增" @click="showAddRecord"  v-if="authorityMeta('addRecord')" />
          <q-btn
            unelevated
            color="red"
            :disable="selectedRecord.length > 0 ? false : true"
            label="批量删除"
            @click="delAllRecord"
            v-if="authorityMeta('delRecord')"
          />
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
          @rowSelected="rowSelectedAg"
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
      <hyjc-add-record ref="addRecordRef" v-if="addRecordStatus" @dataList="getDataList" />
      <hyjc-detail ref="detailRef" v-if="detailStatus" @dataList="getDataList" />
    </div>
  </div>
</template>
<script>
import AgOperate from './components/AgOperate'
import hyjcAddRecord from './AddRecord'
import hyjcDetail from './Detail'
export default {
  name: 'hyjcRecord',
  components: { AgOperate, hyjcAddRecord, hyjcDetail },
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
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.04) + 'px',
          pinned: 'left'
        },
        {
          headerName: '会员名称',
          field: 'mem_memberName',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员手机号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '物品名称',
          field: 'phr_name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '数量',
          field: 'phr_quantity',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '分类',
          field: 'type.pht_name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '备注',
          field: 'phr_remarks',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作员',
          valueGetter: (p) => {
            if (p.data.user && p.data.user.username) {
              return p.data.user.username
            } else {
              return '未知'
            }
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          width: this.nowpx(0.12) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '操作',
          width: this.nowpx(0.18) + 'px',
          cellRendererFramework: 'AgOperate',
          pinned: 'right'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getTypeList()
    this.context = this
  },
  mounted () {
    this.getList()
  },
  methods: {
    getTypeList () {
      this.$store
        .dispatch('hyjc/getTypeLists')
        .then((res) => {
          if (res.code == 200) {
            this.typeOptions = res.data ? res.data : []
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
    getList () {
      if (this.startTime) {
        var startTime = new Date(this.startTime).getTime() / 1000
      }
      if (this.endTime) {
        var endTime = new Date(this.endTime).getTime() / 1000
      }
      const obj = {
        memberInfo: this.memberInfo,
        goodsName: this.goodsName,
        goodsType: this.goodsType,
        startTime: startTime,
        endTime: endTime,
        recordRemarks: this.recordRemarks,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('hyjc/getRecordListData', obj)
        .then((res) => {
          this.recordData = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    rowSelectedAg (p) {
      this.selectedRecord = p.api.getSelectedRows()
    },
    delAllRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条寄存记录吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedRecord = this.gridOptions.api.getSelectedRows()
          if (selectedRecord.length > 0) {
            const obj = selectedRecord.map((item) => {
              return item.id
            })
            this.$store.dispatch('hyjc/delRecordAll', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条寄存记录！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedRecord = []
                this.getList()
              }
            })
          }
        })
        .onCancel(() => {})
    },
    clearButton () {
      this.memberInfo = ''
      this.goodsName = ''
      this.goodsType = ''
      this.startTime = ''
      this.endTime = ''
      this.recordRemarks = ''
      this.getList()
    },
    showAddRecord (id) {
      this.addRecordStatus = true
      this.$nextTick(() => {
        this.$refs.addRecordRef.init(id)
      })
    },
    showDetail (id) {
      this.detailStatus = true
      this.$nextTick(() => {
        this.$refs.detailRef.init(id)
      })
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
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    getDataList () {
      this.addRecordStatus = false
      this.detailStatus = false
      this.getList()
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
