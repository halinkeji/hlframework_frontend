<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-xl">

      <div class="row q-mt-sm q-gutter-sm">
        <div class="col-4 ">
          <q-input outlined bottom-slots v-model="templateId" dense label="请输入模板编号" hint="输入模板编号添加新模板;推荐行业类型为【互联网|电子商务】" class="q-pb-none"> </q-input>
        </div>
        <!-- 目前所属行业为：{{ industry.first_class }}|{{ industry.second_class }} -->
        <q-btn unelevated color="blue-6" v-if="authorityMeta('add')" :disable="templateId ? false : true" @click="saveTemplate" label="添加公众号模板" />
        <q-btn unelevated color="grey-7" label="重置" @click="clean"  />
        <q-btn unelevated color="primary"  label="同步模板" @click="setBatchAll" />
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :stopEditingWhenGridLosesFocus="true"
        :suppressRowDeselection="true"
        :defaultColDef="defaultColDef"
        @first-data-rendered="onFirstDataRendered"
        @gridReady="onFirstDataRendered"
        :rowData="templateData"
        :context="context"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="40"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :suppressRowTransform="true"
        :localeText="localeText"
      ></ag-grid-vue>
    </div>
  </div>
</template>

<script>
import AgDelete from './AgDelete'
import AgMode from './AgMode'
import AgSelectModel from './AgSelectModel'

export default {
  name: 'FourthTab',
  components: { AgDelete, AgMode, AgSelectModel },
  data () {
    return {
      templateId: '',
      defaultColDef: {},
      columnDefs: [
        {
          headerName: '模版ID', // 列标题
          field: 'template_id', // 列与数据源对应的字段
          filter: false, // 是否过滤
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '标题',
          field: 'title',
          width: this.nowpx(0.15) + 'px',
          filter: false
        },
        {
          headerName: '一级行业',
          field: 'primary_industry',
          width: this.nowpx(0.15) + 'px',
          filter: false
        },
        {
          headerName: '二级行业',
          field: 'deputy_industry',
          width: this.nowpx(0.15) + 'px',
          filter: false
        },
        {
          headerName: '模板绑定',
          field: 'template_number',
          filter: false,
          cellRendererFramework: 'AgSelectModel',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '操作',
          field: 'use',
          filter: false,
          cellRendererFramework: 'AgDelete',
          width: this.nowpx(0.08) + 'px'
        }
      ],
      gridOptions: {},
      templateData: [],
      context: null,
      industry: {},
      roleOptions: [],
      localeText: this.$ag_grid_localeText
    }
  },
  mounted () {},
  created () {
    this.getList()
    this.context = this
  },
  computed: {},
  methods: {
    getList () {
      this.$store
        .dispatch('wechatTemplate/getTemplate')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.roleOptions = res.data.templateModel
              setTimeout(() => {
                this.templateData = res.data.template
                // this.industry = res.data.industry.primary_industry
              }, 200)
            } else {
              this.templateData = []
            }
          }
        })
        .catch((error) => {})
    },

    setBatchAll () {
      this.$store
        .dispatch('wechatTemplate/batchAll')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.$q.notify({
                message: '成功',
                caption: '模板消息同步成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            } else {
              this.templateData = []
            }
          } else {
            this.$q.notify({
              message: '失败',
              caption: '同步失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
          this.getList()
        })
        .catch((error) => {})
    },

    saveTemplate () {
      const obj = {
        templateId: this.templateId
      }
      this.$store
        .dispatch('wechatTemplate/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '模板消息添加成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getList()
            this.templateId = ''
          } else {
            this.$q.notify({
              message: '添加失败',
              caption: res.data.errmsg.errmsg,
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
            this.templateId = ''
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right'
          })
        })
    },

    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clean () {
      this.templateId = ''
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

<style></style>
