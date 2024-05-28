<template>
  <div class="fit bg-grey-3">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll ">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-card flat class="row q-gutter-xs">
          <div class="col-12 col-md-2" v-if="is_main_store">
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
          <q-input outlined dense v-model="memberInfo" label="可搜索：合伙人姓名/合伙人手机号/会员卡号" class="col-12 col-md-2" />
          <q-select
            outlined
            dense
            v-model="level"
            :options="memberLevelList"
            label="请选择合伙人等级"
            class="col-12 col-md-2"
            option-value="id"
            option-label="ppl_name"
            emit-value
            map-options
          />
          <q-input outlined readonly dense v-model="applyTime" label="申请时间">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="applyTime" minimal mask="YYYY-MM-DD HH:mm:ss">
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
                  <q-time v-model="applyTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="col-12 col-md-2">
            <q-btn unelevated  color="primary" label="搜索" @click="getList" />
            <q-btn unelevated  color="grey-6" label="重置" @click="clearButton" class="q-ml-sm" />
          </div>
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="memberList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
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
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import AgOperate from './components/AgOperate'
export default {
  name: 'partnerWaitMember',
  components: {
    AgOperate
  },
  data () {
    return {
      memberInfo: '',
      level: '',
      applyTime: '',
      context: '',
      configData: {},
      memberList: [],
      memberLevelList: [],
      gridOptions: {},
      columnDefs: [
        // 表格列数据
      ],
      columnDefsForm: [],
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
    this.getConfigList()
    this.getLevelList()
    this.context = this
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
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getLevelList () {
      this.$store
        .dispatch('partner/getLevelList')
        .then((res) => {
          if (res.code == 200) {
            this.memberLevelList = res.data ? res.data : []
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
    getConfigList () {
      this.$store
        .dispatch('partner/getData')
        .then((res) => {
          if (res.code == 200) {
            this.configData = res.data ? res.data : {}
            if (parseInt(this.configData.ppc_form_id) > 0) {
              this.getColumn(this.configData.ppc_form_id)
            } else {
              this.restColumnData()
            }
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
    getColumn (id) {
      if (id > 0) {
        this.$store
          .dispatch('formfield/getColumnDefs', id)
          .then((res) => {
            if (res.code == 200) {
              this.columnDefsForm = res.data
              this.restColumnData()
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
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
      }
    },
    restColumnData () {
      this.gridOptions.api.setColumnDefs([])
      const columnData = [
        {
          headerName: '合伙人姓名',
          field: 'ppi_partner_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '合伙人手机号',
          field: 'ppi_member_mobile',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '绑定会员卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '合伙人级别',
          field: 'level.ppl_name',
          width: this.nowpx(0.1) + 'px'
        }
      ]
      if (this.columnDefsForm) {
        this.columnDefsForm.forEach(function (item) {
          columnData.push(item)
        })
      }
      const checkStatus = {
        headerName: '审核状态',
        width: this.nowpx(0.1) + 'px',
        valueGetter: (p) => {
          if (parseInt(p.data.ppi_status) == -1) {
            return '待审核'
          } else if (parseInt(p.data.ppi_status) == -2) {
            return '审核未通过'
          } else if (parseInt(p.data.ppi_status) == -3) {
            return '已取消'
          } else if (parseInt(p.data.ppi_status) >= 0) {
            return '审核通过'
          } else {
            return false
          }
        }
      }
      columnData.push(checkStatus)
      const addTime = {
        headerName: '申请时间',
        valueGetter: (p) => {
          return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
        },
        width: this.nowpx(0.15) + 'px'
      }
      columnData.push(addTime)

      const store = {
        headerName: '门店',
        field: 'store.name',
        filter: false,
        width: this.nowpx(0.1) + 'px'
      }
      columnData.push(store)

      const operateAg = {
        headerName: '操作',
        width: this.nowpx(0.16) + 'px',
        cellRendererFramework: 'AgOperate'
      }
      columnData.push(operateAg)
      this.gridOptions.api.setColumnDefs(columnData)
      this.gridOptions.api.sizeColumnsToFit()
      this.getList()
    },
    getList () {
      let applyTime = null
      if (this.applyTime) {
        console.log('asasas', this.applyTime)
        applyTime = new Date(this.applyTime).getTime() / 1000
      }
      const params = {
        formId: this.configData.ppc_form_id,
        name: this.memberInfo,
        level: this.level,
        applyTime: applyTime,
        status: ['-1', '-2'],
        type: 'member',
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('partner/getMember', params)
        .then((res) => {
          if (res.code == 200) {
            this.memberList = res.data ? res.data.list : []
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
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearButton () {
      this.memberInfo = ''
      this.selectStoreData = []
      this.level = ''
      this.applyTime = ''
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
