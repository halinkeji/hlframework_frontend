<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-md">
        <div class="row q-gutter-sm q-pl-sm">
          <q-input outlined v-model="birthTime" label="选择时间" dense square class=" col-12 col-md-2 q-mt-sm" readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                  <q-date v-model="birthTime" mask="YYYY-MM-DD" today-btn>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="关闭" color="primary" flat />
                    </div>
                  </q-date>
                </q-menu>
              </q-icon>
            </template>
          </q-input>
          <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" @click="getListData" />
          <q-btn color="warning" class=" q-mt-sm" unelevated label="重置" @click="clean" />
          <q-btn
            color="primary"
            @click="birthdayCareAll"
            class=" q-mt-sm"
            unelevated
            label="一键关怀"
            :disable="dataListSelections.length > 0 ? false : true"
          />
        </div>
        <q-chip square color="orange" text-color="white" icon-right="star" class="q-ma-sm">
          <span>短信群发列表显示的今天过生日的会员，点击“一键关怀”会给下列列表统一发送生日祝福短信，默认计算状态为公历状态</span>
        </q-chip>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="birthdayCareData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
           @gridReady="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
          @rowSelected="rowSelectedAg"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
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
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>
<script>
import AgOperator from './AgOperator.vue'
export default {
  name: 'SmsBirthdayCare',
  components: {
    AgOperator
  },
  data () {
    return {
      activeName: 0,
      birthTime: '',
      birthdayCareData: [],
      localeText: this.$ag_grid_localeText,
      gridOptions: {},
      context: null,
      components: {
        AgOperator
      },
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      columnDefs: [
        {
          filter: false,
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.02) + 'px'
        },
        {
          headerName: '卡号',
          field: 'mem_memberCardNum',
          filter: false
        },
        {
          headerName: '手机号',
          field: 'mem_memberMobile',
          filter: false,
          editable: true,
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '姓名',
          field: 'mem_memberName',
          filter: false
        },
        {
          headerName: '性别',
          field: 'mem_memberName',
          filter: false,
          valueGetter: (p) => {
            const sex = '未知'
            if (p.data.mem_memberSex == 1) {
              this.sex = '男'
            } else if (p.data.mem_memberSex == 2) {
              this.sex = '女'
            } else {
              this.sex = '未知'
            }
            return this.sex
          }
        },
        {
          headerName: '生日',
          field: 'mem_memberBirthdayYear',
          filter: false,
          valueGetter: (p) => {
            if (p.data.mem_memberBirthdayMonth > 0) {
              return p.data.mem_memberBirthdayYear + '年' + p.data.mem_memberBirthdayMonth + '月' + p.data.mem_memberBirthdayDay + '日'
            }
          }
        },
        {
          headerName: '操作',
          field: 'st_templateStatus',
          cellRendererFramework: 'AgOperator',
          filter: false
        }
      ],
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      }
    }
  },
  computed: {},
  created () {
    this.context = this
  },
  mounted () {
    this.getListData()
  },
  methods: {
    getListData () {
      this.dataListSelections = []
      const birthTime = this.$q_date.formatDate(this.birthTime, 'X')
      const obj = {
        birthTime: birthTime,
        pSize: this.page.pageSize,
        page: this.page.pageIndex
      }
      this.$store
        .dispatch('alSms/getMemberData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.birthdayCareData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 自适应
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clean () {
      this.birthTime = ''
      this.getListData()
    },
    birthdayCareAll () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定一键关怀 ${this.dataListSelections.length} 条会员吗`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.birthdayCareBatch()
        })
    },
    birthdayCareBatch () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return {
            mem_memberName: item.mem_memberName,
            mem_memberBirthdayMonth: item.mem_memberBirthdayMonth,
            mem_memberBirthdayDay: item.mem_memberBirthdayDay,
            mem_memberMobile: item.mem_memberMobile
          }
        })
        console.log('obj', obj)
        this.$store.dispatch('alSms/setCareData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green',
              message: '成功',
              caption: '成功关怀 ' + res.data + ' 条会员'
            })
            this.getListData()
            this.dataListSelections = []
          }
        })
      }
    }
  }
}
</script>
