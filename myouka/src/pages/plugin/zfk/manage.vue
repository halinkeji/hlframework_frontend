<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="memberInfo" label="请输入主卡会员卡号|手机号|姓名" class="col-12 col-md-2" />
          <q-input outlined dense v-model="sonMemberInfo" label="请输入副卡会员卡号|手机号|姓名" class="col-12 col-md-2" />

          <div class="col-4" v-if="is_main_store">
            <q-select label="查询门店" use-chips clearable v-model="selectStoreData" option-value="id" option-label="name" multiple emit-value map-options dense outlined :options="libInStoreList" />
          </div>
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
          <q-btn unelevated color="primary" dense label="新增"  class="q-px-md" @click="showAddMemberLink" v-if="authorityMeta('addLink')" />
          <q-btn
            unelevated
            color="red"
            dense
            label="批量解绑"
            :disable="selectedLink.length > 0 ? false : true"
            @click="delLinkAll"
            class="q-px-md"
            v-if="authorityMeta('delLink')"
          />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center zfk-member-table"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="linkList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @rowSelected="rowSelectedAg"
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
    <zfk-add-member-link ref="addMemberLinkRef" v-if="addPoppupStatus" @dataList="hideMemberLinkPoppup" />
    <zfk-edit-link ref="editLinkRef" v-if="editPoppupStatus" @dataList="hideLinkPoppup" />
  </q-page>
</template>
<script>
import AgOperate from './components/AgOperate'
import ZfkEditLink from './EditLink'
import ZfkAddMemberLink from './AddMemberLink'
export default {
  name: 'zfkManage',
  components: {
    AgOperate,
    ZfkEditLink,
    ZfkAddMemberLink
  },
  data () {
    return {
      addPoppupStatus: false,
      editPoppupStatus: false,
      memberInfo: '',
      sonMemberInfo: '',
      context: '',
      selectedLink: [],
      linkList: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '会员卡号（主卡）',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.12) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '会员手机号（主卡）',
          field: 'mem_memberMobile',
          width: this.nowpx(0.12) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '会员姓名（主卡）',
          field: 'mem_memberName',
          width: this.nowpx(0.12) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-in': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '会员卡号（副卡）',
          field: 'sonCardNum',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员手机号（副卡）',
          field: 'sonMobile',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员姓名（副卡）',
          field: 'sonName',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '关联状态',
          valueGetter: (p) => {
            if (parseInt(p.data.zml_status) == 1) {
              return '待同意'
            } else if (parseInt(p.data.zml_status) == 2) {
              return '已同意'
            } else if (parseInt(p.data.zml_status) == 3) {
              return '已拒绝'
            } else if (parseInt(p.data.zml_status) == 4) {
              return '已解绑'
            } else {
              return ''
            }
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '共享' + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit,
          valueGetter: this.ruleBalanceValue,
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '共享' + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit,
          valueGetter: this.ruleIntegralValue,
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.12) + 'px',
          pinned: 'right'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.15) + 'px',
          cellRendererFramework: 'AgOperate',
          pinned: 'right'
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
    rowSpan (params) {
      const fields = ['mem_memberCardNum', 'mem_memberMobile', 'mem_memberName']
      const data = this.linkList
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }

          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    },
    ruleIntegralValue (p) {
      if (parseInt(p.data.zml_is_share_integral) == -1) {
        return '不共享' + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit
      } else if (parseInt(p.data.zml_is_share_integral) == 1) {
        return '共享' + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit + '（不限制）'
      } else if (parseInt(p.data.zml_is_share_integral) == 2) {
        return '每' + this.dateText(p.data.zml_limit_integral_time) + '共享' + p.data.zml_integral_amount + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit
      } else {
        return ''
      }
    },
    ruleBalanceValue (p) {
      if (parseInt(p.data.zml_is_share_balance) == -1) {
        return '不共享' + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit
      } else if (parseInt(p.data.zml_is_share_balance) == 1) {
        return '共享' + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit + '（不限制）'
      } else if (parseInt(p.data.zml_is_share_balance) == 2) {
        return '每' + this.dateText(p.data.zml_limit_balance_time) + '共享' + p.data.zml_balance_amount + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit
      } else {
        return ''
      }
    },
    dateText (val) {
      let dateText = ''
      switch (parseInt(val)) {
        case 1:
          dateText = '年'
          break
        case 2:
          dateText = '季'
          break
        case 3:
          dateText = '月'
          break
        case 4:
          dateText = '周'
          break
        case 5:
          dateText = '天'
          break
      }
      return dateText
    },
    getList () {
      const params = {
        memberInfo: this.memberInfo,
        sonMemberInfo: this.sonMemberInfo,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('zfk/getListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.linkList = res.data ? res.data.list : []
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
    delLinkAll () {
      this.$q
        .dialog({
          title: '是否确定',
          message: `确定解绑 ${this.gridOptions.api.getSelectedRows().length} 个关联吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedLink = this.gridOptions.api.getSelectedRows()
          if (selectedLink.length > 0) {
            const params = selectedLink.map((item) => {
              return item.id
            })
            this.$store.dispatch('zfk/delAll', params).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功解绑 ' + res.data + ' 个关联',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedLink = []
                this.getList()
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
          }
        })
        .onCancel(() => {})
    },
    showAddMemberLink () {
      this.addPoppupStatus = true
    },
    hideMemberLinkPoppup () {
      this.addPoppupStatus = false
      this.getList()
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
      this.selectStoreData = []
      this.getList()
    },
    showEditLink (id) {
      this.editPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.editLinkRef.init(id)
      })
    },
    hideLinkPoppup () {
      this.editPoppupStatus = false
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
    rowSelectedAg (p) {
      this.selectedLink = p.api.getSelectedRows()
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

<style>
.zfk-member-table .cell-span-erp-in {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
