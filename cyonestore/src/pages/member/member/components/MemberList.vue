<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-lg">
      <div class="q-gutter-x-xs row ">
        <q-btn color="primary" class=" q-mt-sm" unelevated label="会员登记" :to="{ name: 'addMember' }" v-if="authorityMeta('add')" />
        <q-btn-dropdown class=" q-mt-sm q-ml-xs" color="red" label="批量操作" v-if="authorityMeta('batch')" :menu-offset="[10, 6]" unelevated>
          <q-list class="text-center ">
            <q-item clickable v-if="authorityMeta('batch')" @click="delAll" :disable="dataListSelections.length > 0 ? false : true">
              <q-item-section>
                <q-item-label>批量删除 </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-if="authorityMeta('addAll')">
              <q-item-section @click="operateAddSomeMember">
                <q-item-label>
                  批量自定义生成会员
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="showPopup" v-if="authorityMeta('editAll')" :disable="dataListSelections.length > 0 ? false : true">
              <q-item-section>
                <q-item-label>批量操作会员{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit }}{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit }} </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown class=" q-mt-sm q-ml-xs" color="green" label="导入导出" :menu-offset="[10, 6]" v-if="authorityMeta('importOrExport')" unelevated>
          <q-list class="text-center ">
            <q-item clickable @click="batchImport" v-if="authorityMeta('import')">
              <q-item-section>
                <q-item-label>
                  Xlxs 文件批量导入
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="exportCsv" v-if="authorityMeta('export')">
              <q-item-section>
                <q-item-label> 导出Csv文件</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="q-gutter-x-xs row ">
        <q-input class="col-12 col-md-3 q-mt-sm " clearable label="可搜索:会员卡号/手机号/身份证号/真实姓名/昵称" outlined v-model="searchQuery" dense />
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
          clearable
        />
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
        <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" @click="getMemberListData" />
        <q-btn color="warning" class=" q-mt-sm" unelevated label="重置" @click="clean" />
        <q-space />
        <q-btn flat color="black" icon="dialpad">
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item tag="label" v-ripple v-for="(item, key) in columnDefs" :key="key" v-if="item.headerName">
                <q-item-section side top>
                  <q-checkbox v-model="sideBarColumn" @input="changeShowColumn" :val="item.headerName" />
                </q-item-section>

                <q-item-section v-if="item.headerName">
                  <q-item-label>{{ item.headerName }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :components="components"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
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
        :context="context"
        @rowSelected="rowSelectedAg"
        :localeText="localeText"
      ></ag-grid-vue>
       <!-- :rowClassRules="{
          'bg-negative': (params) => {
            return !params.data.consumeInvoice
          },
        }" -->
    </div>
    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
    <q-dialog v-model="isPopupShow" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
      >
        <q-form ref="memberDataRef" class="q-gutter-md q-mt-md">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">批量操作会员{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit }}与{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section class="q-pt-sm">
            <div class="col-12">
              <q-input
                :disable="parseInt(batchOperate) == 3"
                :label="`${$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit}`"
                outlined
                v-model="mem_memberPointsCount"
                dense
                lazy-rules
                :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || `${$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit}` + '为非负两位以内小数']"
              />
            </div>
            <div class="col-12">
              <q-input
                :disable="parseInt(batchOperate) == 3"
                :label="`${$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit}`"
                outlined
                v-model="mem_memberMoneyCount"
                dense
                lazy-rules
                :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit + '为非负两位以内小数']"
              />
            </div>
            <div class="row q-pl-xs">
              <p class="q-mt-xs q-ml-xs">操作：</p>
              <q-option-group size="xs" inline v-model="batchOperate" :options="operateOptions" color="primary" />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn unelevated label="确认" color="primary" @click="somePlay" />
            <q-btn label="关闭" unelevated color="grey" class="q-mr-sm" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <add-some-member v-if="addsomeMemberDialog" ref="addSomeMemberRef" @closeDialog="closeAddSomeMembeDialog" />
     <upload-table-member
      v-if="memberUploadStatus"
      ref="returnTypes"
      @closeUpload="uploadTable"
    ></upload-table-member>
  </div>
</template>
<script>
import AgMemberOperating from './AgMemberOperating'
import AddSomeMember from './AddSomeMember'
import AgMembertag from './AgMembertag'
export default {
  name: 'MemberList',
  components: { AgMemberOperating, AddSomeMember, AgMembertag },
  props: ['memberCardLevelDatas'],
  data () {
    return {
      components: { AgMemberOperating },
      memberListData: [],
      context: null,
      deleteAllIf: true,
      memberUploadStatus: false,
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        // 表格列数据
        {
          checkboxSelection: true, // 是否展示复选框
          pinned: this.pinnedComputed('left'),
          lockPinned: true,
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '卡号',
          field: 'mem_memberCardNum',
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberCardNum ? p.data.mem_memberCardNum.toString() : ''
          }
        },
        {
          headerName: '昵称', // 列标题
          field: 'mem_memberName', // 列与数据源对应的字段
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
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberMobile ? p.data.mem_memberMobile.toString() : ''
          }
        },
        {
          headerName: '成长值',
          field: 'mem_grow_rate',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '总' + this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'mem_memberMoneyCount',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberMoneyCount ? p.data.mem_memberMoneyCount : '0.00'
          }
        },

        {
          headerName: '总' + this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'mem_memberPointsCount',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.mem_memberPointsCount ? p.data.mem_memberPointsCount : '0.00'
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
          headerName: '到期时间',
          valueGetter: (p) => {
            return p.data.mem_specifiedEndTime >= 2147457847 ? '永久有效' : this.$q_date.formatDate(p.data.mem_specifiedEndTime * 1000, 'YYYY-MM-DD  HH:mm:ss')
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
            let sex = '未知'
            if (p.data.mem_memberSex == 1) {
              sex = '男'
            } else if (p.data.mem_memberSex == 2) {
              sex = '女'
            } else {
              sex = '未知'
            }
            return sex
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
          headerName: '加入时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '操作',
          pinned: this.pinnedComputed('right'),
          cellRendererFramework: 'AgMemberOperating',
          width: this.nowpx(0.15) + 'px'
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
      isInputDisabled: false,
      isPopupShow: false,
      mem_memberMoneyCount: 0,
      mem_memberPointsCount: 0,
      batchOperate: 1,
      dialogWidth: '1000px',
      levelId: '',
      searchQuery: '',
      localeText: this.$ag_grid_localeText,
      operateOptions: [
        {
          label: '增加',
          value: 1
        },
        {
          label: '减少',
          value: 2
        },
        {
          label: '清空',
          value: 3
        }
      ],
      sideBarColumn: [],
      addsomeMemberDialog: false,
      allMemberTagList: [],
      selectMemberTagData: []
    }
  },
  computed: {},
  created () {
    this.getAllTag()
    this.sideBarColumn = this.columnDefs.map((x) => {
      return x.headerName
    })
    this.context = this
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },
  mounted () {
    this.getMemberListData()
  },
  methods: {
    getAllTag () {
      this.$store.dispatch('membertag/getAllTag').then((res) => {
        if (res.code == 200) {
          this.allMemberTagList = res.data ? res.data : []
        }
      })
    },
    changeShowColumn () {
      this.gridOptions.api.setColumnDefs([])
      this.$nextTick(() => {
        const columnDefs = this.columnDefs
        const sideBarColumn = this.sideBarColumn
        const newAgColumnDefs = []
        columnDefs.forEach(function (value) {
          if (_.indexOf(sideBarColumn, value.headerName) >= 0) {
            newAgColumnDefs.push(value)
          }
        })
        this.gridOptions.api.setColumnDefs(newAgColumnDefs)
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
      this.selectMemberTagData = []
      this.getMemberListData()
    },
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({ fileName: date + '-会员记录' })
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getMemberListData () {
      this.dataListSelections = []
      const obj = {
        text: this.searchQuery,
        levelId: this.levelId,
        pSize: this.page.pSize,
        page: this.page.pageIndex,
        state: 1,
        overtime: 1,
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
    somePlay () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          const dataListSelections = this.gridOptions.api.getSelectedRows()
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return {
                id: item.id
              }
            })
            this.$store
              .dispatch('member/allchange', {
                someType: this.batchOperate,
                mem_memberMoneyCount: this.mem_memberMoneyCount,
                mem_memberPointsCount: this.mem_memberPointsCount,
                memberList: obj
              })
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    caption: '成功修改 ' + res.data + ' 条！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.mem_memberMoneyCount = 0
                  this.mem_memberPointsCount = 0
                  this.isPopupShow = false
                  this.dataListSelections = []
                  this.getMemberListData()
                }
              })
              .catch((error) => {})
          }
        }
      })
    },
    // 批量删除
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定将会员删除至回收站吗',
          cancel: true
        })
        .onOk(() => {
          const dataListSelections = this.gridOptions.api.getSelectedRows()
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return {
                id: item.id,
                mem_memberStatus: 2
              }
            })
            this.$store
              .dispatch('member/allupdate', obj)
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    caption: '成功删除 ' + res.data + ' 条！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.dataListSelections = []
                  this.getMemberListData()
                }
              })
              .catch((error) => {})
          }
        })
        .onCancel(() => {})
    },
    showPopup () {
      this.isPopupShow = true
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getMemberListData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getMemberListData()
    },
    // 批量导入
    batchImport () {
      this.memberUploadStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.returnTypes.receiveType('member')
        }, 500)
      })
    },
    uploadTable () {
      this.memberUploadStatus = false
      this.getMemberListData()
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
    },
    operateAddSomeMember () {
      this.addsomeMemberDialog = true
      this.$nextTick(() => {
        this.$refs.addSomeMemberRef.init()
      })
    },
    closeAddSomeMembeDialog () {
      this.addsomeMemberDialog = false
      this.getMemberListData()
    }
  }
}
</script>
