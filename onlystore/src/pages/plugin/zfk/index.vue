<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="memberInfo" label="请输入主卡会员卡号|手机号|姓名" class="col-12 col-md-2" />
          <q-input outlined dense v-model="sonMemberInfo" label="请输入副卡会员卡号|手机号|姓名" class="col-12 col-md-2" />
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
          <q-btn
            unelevated
            color="red"
            dense
            label="批量删除"
            :disable="selectedLink.length > 0 ? false : true"
            @click="delAll"
            class="q-px-md"
            v-if="authorityMeta('delLink')"
          />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
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
          :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
    <zfk-edit-link ref="editLinkRef" v-if="editPoppupStatus" @dataList="hideLinkPoppup" />
  </q-page>
</template>
<script>
import AgOperate from './components/AgOperate'
import ZfkEditLink from './EditLink'
export default {
  name: 'zfk',
  components: {
    AgOperate,
    ZfkEditLink
  },
  data () {
    return {
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
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员手机号（主卡）',
          field: 'mem_memberMobile',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员姓名（主卡）',
          field: 'mem_memberName',
          width: this.nowpx(0.12) + 'px'
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
            if (parseInt(p.data.zml_status) == -1) {
              return '已拒绝'
            } else if (parseInt(p.data.zml_status) == 0) {
              return '待同意'
            } else if (parseInt(p.data.zml_status) == 1) {
              return '已同意'
            } else {
              return ''
            }
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '共享' + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit,
          valueGetter: (p) => {
            if (parseInt(p.data.zml_is_share_balance) == -1) {
              return '不共享' + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit
            } else if (parseInt(p.data.zml_is_share_balance) == 1) {
              return '共享' + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit + '（不限制）'
            } else if (parseInt(p.data.zml_is_share_balance) == 2) {
              return '共享' + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit + '（限制）'
            } else {
              return ''
            }
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '共享' + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit,
          valueGetter: (p) => {
            if (parseInt(p.data.zml_is_share_integral) == -1) {
              return '不共享' + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit
            } else if (parseInt(p.data.zml_is_share_integral) == 1) {
              return '共享' + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit + '（不限制）'
            } else if (parseInt(p.data.zml_is_share_integral) == 2) {
              return '共享' + this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit + '（限制）'
            } else {
              return ''
            }
          },
          width: this.nowpx(0.12) + 'px'
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
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      const params = {
        memberInfo: this.memberInfo,
        sonMemberInfo: this.sonMemberInfo,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
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
    delAll () {
      this.$q
        .dialog({
          title: '是否确定',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个关联吗`,
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
                  caption: '成功删除 ' + res.data + ' 个关联',
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
