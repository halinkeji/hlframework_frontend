<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
       <div class="col-shrink bg-white q-px-sm q-pb-lg">
      <q-btn color="green" class=" q-mt-sm " unelevated label="批量恢复" :disable="dataListSelections.length > 0 ? false : true" @click="batchRecovery" />
      <q-btn color="red" class=" q-mt-sm q-ml-xs " unelevated label="批量删除" v-if="authorityMeta('delAll')" :disable="dataListSelections.length > 0 ? false : true" @click="delAll" />
      <q-btn color="primary" class=" q-mt-sm q-ml-xs " unelevated @click="outCsvData" label="导出Csv文件" />

      <div class="q-gutter-x-xs row ">
        <q-input class="col-12 col-md-2 q-mt-sm " label="可搜索:会员卡号/手机号/身份证号/真实姓名/昵称" outlined v-model="searchQuery" dense />
        <q-select
          class="col-12 col-md-2 q-mt-sm"
          outlined
          v-model="levelId"
          option-value="id"
          option-label="mcl_level_name"
          :options="memberCardLevelDatas"
          dense
          label="会员等级"
          emit-value
          map-options
        />
        <div class="col-12 col-md-3" v-if="is_main_store">
          <q-select
            label="查询门店"
            v-model="selectStoreData"
            class="col-12 col-md-2 q-mt-sm"
            option-value="id"
            option-label="name"
            multiple
            emit-value
            map-options
            dense
            outlined
            use-chips
            :options="libInStoreList"
          />
        </div>
        <div class="col-12 col-md-3" >
          <q-select
            label="查询标签"
            v-model="selectMemberTagData"
            class="col-12 col-md-2 q-mt-sm"
            option-value="id"
            option-label="mti_name"
            multiple
            emit-value
            map-options
            dense
            outlined
            use-chips
            :options="allMemberTagList"
            clearable
          />
        </div>
        <q-btn color="primary" class=" q-mt-sm" unelevated  label="搜索" @click="getReclMemberListData" />
        <q-btn color="warning" class=" q-mt-sm" unelevated  label="重置" @click="clean" />
      </div>
    </div>

   <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :components="components"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="memberListData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          rowHeight="50"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :localeText="localeText"
          :context="context"
          @rowSelected="rowSelectedAg"
        ></ag-grid-vue>
     </div>
    <div class="col-shrink bg-white q-pb-md text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
  </div>
</template>
<script>
import AgRecycleMemberOperating from './AgRecycleMemberOperating'
import AgMembertag from './AgMembertag'
export default {
  name: 'RecycleMember',
  components: { AgRecycleMemberOperating, AgMembertag },
  props: ['memberCardLevelDatas'],
  data () {
    return {
      components: { AgRecycleMemberOperating },
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      memberListData: [],
      dataListSelections: [],
      columnDefs: [
        {
          headerName: '',
          checkboxSelection: true, // 是否展示复选框
          pinned: this.pinnedComputed('left'),
          lockPinned: true,
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '#',
          width: 60,
          pinned: this.pinnedComputed('left'),
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null;
          },
        },
        {
          headerName: ' 卡号',
          field: 'mem_memberCardNum',
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '昵称',
          field: 'mem_memberName',
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '级别',
          field: 'memberLevel.mcl_level_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '标签',
          field: 'mcl_default',
          cellRendererFramework: 'AgMembertag',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '真实姓名',
          field: 'mem_memberRealName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '手机号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '总' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'mem_memberMoneyCount',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberMoneyCount ? p.data.mem_memberMoneyCount : '0.00'
          }
        },
        {
          headerName: '总次数',
          field: 'mem_memberNumberCount',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberNumberCount ? p.data.mem_memberNumberCount : '0'
          }
        },
        {
          headerName: '总' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'mem_memberPointsCount',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberPointsCount ? p.data.mem_memberPointsCount : '0.00'
          }
        },
        {
          headerName: '到期时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.mem_specifiedEndTime * 1000, 'YYYY-MM-DD  HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '实体卡',
          field: 'mem_isRfidCard',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '性别',
          field: 'mem_memberSex',
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
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '出生日期',
          field: 'mem_memberBirthdayYear',
          valueGetter: (p) => {
            if (p.data.mem_memberBirthdayYear > 0) {
              return p.data.mem_memberBirthdayYear + '年' + p.data.mem_memberBirthdayMonth + '月' + p.data.mem_memberBirthdayDay + '日'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '年龄',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            if (p.data.mem_memberBirthdayYear > 0) {
              const date = new Date()
              let time = p.data.mem_memberBirthdayYear + '-' + p.data.mem_memberBirthdayMonth + '-' + p.data.mem_memberBirthdayDay
              time = new Date(time)
              const newDate = date.getTime() - time.getTime()
              return Math.ceil(newDate / 1000 / 60 / 60 / 24 / 365) + '周岁'
            }
          }
        },

        {
          headerName: ' 加入时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('right')
        },
        {
          headerName: ' 操作',
          pinned: this.pinnedComputed('right'),
          cellRendererFramework: 'AgRecycleMemberOperating',
          width: this.nowpx(0.1) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},
      searchQuery: '',
      levelId: '',
      localeText: this.$ag_grid_localeText,
      context: null,
      libInStoreList: [],
      selectStoreData: [],
      allMemberTagList: [],
      selectMemberTagData: []
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.getAllTag()
  },
  mounted () {
    this.context = this
    this.getReclMemberListData()
  },
  methods: {
    getAllTag () {
      this.$store.dispatch('membertag/getAllTag').then((res) => {
        if (res.code == 200) {
          this.allMemberTagList = res.data ? res.data : []
        }
      })
    },
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },

    clean () {
      this.searchQuery = ''
      this.levelId = ''
      this.selectStoreData = []
      this.selectMemberTagData = []
      this.getReclMemberListData()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getReclMemberListData () {
      this.dataListSelections = []
      const obj = {
        text: this.searchQuery,
        selectStoreData: this.selectStoreData,
        levelId: this.levelId,
        pSize: this.page.pSize,
        page: this.page.pageIndex,
        state: 2,
        selectMemberTagData: this.selectMemberTagData
      }
      this.$store
        .dispatch('member/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.memberListData = res.data.list
              this.page.totalCount = parseInt(res.data.page.totalCount)
            } else {
              this.memberListData = []
              this.page.totalCount = 0
            }
          }
        })
        .catch((error) => {})
    },
    outCsvData () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-会员回收站记录'
      })
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定将会员彻底删除吗',
          cancel: true
        })
        .onOk(() => {
          const dataListSelections = this.gridOptions.api.getSelectedRows()
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return item.id
            })
            this.$store
              .dispatch('member/delData', obj)
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    caption: '成功删除' + res.data + ' 条！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.getReclMemberListData()
                }
              })
              .catch((error) => {})
          }
        })
        .onCancel(() => {})
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getReclMemberListData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getReclMemberListData()
    },

    batchRecovery () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定将会员恢复吗',
          cancel: true
        })
        .onOk(() => {
          const dataListSelections = this.gridOptions.api.getSelectedRows()
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return { id: item.id, mem_memberStatus: 1 }
            })
            this.$store
              .dispatch('member/allupdate', obj)
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    caption: '成功恢复' + res.data + ' 条！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.getReclMemberListData()
                }
              })
              .catch((error) => {})
          }
        })
        .onCancel(() => {})
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
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
