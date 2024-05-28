<template>
  <div class="fit bg-grey-3">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="memberInfo" label="请输入会员卡号|昵称|手机号|姓名" class="col-12 col-md-2" />

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
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
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
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
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
  name: 'fxzxWaitMember',
  components: {
    AgOperate
  },
  data () {
    return {
      memberInfo: '',
      memberLevel: '',
      applyTime: '',
      context: '',
      configData: {},
      memberList: [],
      memberLevelList: [],
      gridOptions: {},
      columnDefs: [],
      columnDefsForm: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getLevelList()
    this.getConfigList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getLevelList () {
      this.$store
        .dispatch('fxzx/getLevelAll')
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
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getConfigList () {
      this.$store
        .dispatch('fxzx/getConfigData')
        .then((res) => {
          if (res.code == 200) {
            this.configData = res.data ? res.data : {}
            if (parseInt(this.configData.pfc_form_id) > 0) {
              this.getColumn(this.configData.pfc_form_id)
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
            icon: 'ion-close-circle-outline',
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
              icon: 'ion-close-circle-outline',
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
          headerName: '卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '昵称',
          field: 'mem_memberName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '姓名',
          field: 'mem_memberRealName',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '会员手机号',
          field: 'mem_memberMobile',
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
          if (parseInt(p.data.pfm_weights) == -1) {
            return '待审核'
          } else if (parseInt(p.data.pfm_weights) == -2) {
            return '审核未通过'
          } else if (parseInt(p.data.pfm_weights) == -3) {
            return '已取消'
          } else if (parseInt(p.data.pfm_weights) >= 0) {
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
          return this.$q_date.formatDate(p.data.pfm_apply_time * 1000, 'YYYY-MM-DD HH:mm:ss')
        },
        width: this.nowpx(0.15) + 'px'
      }
      columnData.push(addTime)

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
        applyTime = new Date(this.applyTime).getTime() / 1000
      }
      const params = {
        formId: this.configData.pfc_form_id,
        memberInfo: this.memberInfo,
        memberLevel: this.memberLevel,
        applyTime: applyTime,
        fxzxMemberStatus: -1,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('fxzx/getMemberData', params)
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
      this.memberLevel = ''
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
