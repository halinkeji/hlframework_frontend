<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.6) + 'px',
        'max-width': parseInt($q.screen.width * 0.6) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs">
          <div class="row items-center q-px-sm">
            <span class="text-subtitle2">新增开支记录</span>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </div>
        <q-separator />

        <div class="col-shrink q-pa-sm full-height row">
          <div class="col-3 q-px-xs">
 <q-scroll-area class="fit full-height row">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-subtitle2">选择开支/收入项</div>
              </q-card-section>
              <q-separator />

              <q-card-section class="row q-gutter-sm full-width">
                <q-btn
                  unelevated
                  v-for="(item, key) in typeData"
                  @click="getItemNameList(item)"
                  :label="item.pki_name"
                  :key="`group-${key}`"
                  :color="groupData.id == item.id ? 'positive' : 'primary'"
                >
                </q-btn>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mt-sm">
              <q-card-section>
                <div class="text-subtitle2">选择详情</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="row q-gutter-sm full-width" v-if="payDetailData.length > 0">
                <div v-for="(item, key) in payDetailData">
                  <q-btn unelevated color="primary" @click="pushTableRow(item)" :label="item.pki_name"> </q-btn>
                </div>
              </q-card-section>
              <q-card-section class="row q-gutter-sm full-width" v-else> 无开支/收入项 </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mt-sm" v-if="dateArr && dateArr.length > 0">
              <q-card-section>
                <div class="text-subtitle2">收支时间</div>
              </q-card-section>
              <q-separator />

              <q-card-section class="row q-gutter-sm full-width">
                <div v-for="(item, key) in dateArr">
                  <q-badge color="primary" text-color="white" :label="item" />
                </div>
              </q-card-section>
            </q-card>
 </q-scroll-area>

          </div>
          <div class="col-9 q-px-xs">
            <ag-grid-vue
              ref="agGridTable"
              :gridOptions="gridOptions"
              class="ag-theme-balham ag-grid-table hl_header_center goods-count-table hl_content_center full-height"
              :columnDefs="columnDefs"
              :suppressMovableColumns="true"
              :rowData="recordListData"
              :rowDragManaged="true"
              colResizeDefault="shift"
              :animateRows="false"
              @first-data-rendered="onFirstDataRendered"
              :floatingFilter="false"
              :enableCellTextSelection="true"
              rowHeight="40"
              :context="context"
              rowSelection="multiple"
              :localeText="localeText"
              :stopEditingWhenGridLosesFocus="true"
              :suppressCellSelection="true"
              :suppressRowClickSelection="true"
              @gridReady="onFirstDataRendered"
            ></ag-grid-vue>
          </div>
        </div>

        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-btn unelevated label="确认" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import RecordAgDel from './RecordAgDel'
export default {
  name: 'AddKzlsRecord',
  props: ['type'],
  components: {
    RecordAgDel
  },
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      recordData: {
        pkr_invoice: '',
        pkr_group_id: '',
        pkr_group_name: '',
        pkr_item_id: '',
        pkr_item_name: '',
        pkr_status: '1',
        pkr_price: '',
        pkr_note: ''
      },
      itemData: {},
      groupData: {},
      context: null,
      gridOptions: {},
      typeData: [],
      payDetailData: [],
      dateArr: [],
      recordListData: [],
      columnDefs: [
        {
          headerName: '开支项',
          field: 'pkr_group_name',
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '开支明细',
          field: 'pkr_item_name',
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '金额',
          field: 'pkr_price',
          width: this.nowpx(0.1) + 'px',
          editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '备注',
          field: 'pkr_note',
          width: this.nowpx(0.1) + 'px',
          editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '操作',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'RecordAgDel'
        }
      ],
      localeText: this.$ag_grid_localeText
    }
  },
  created () {},
  methods: {
    init (type, dateArr) {
      this.recordData.pkr_status = type
      this.dateArr = dateArr
      this.$nextTick(() => {
        this.getTypeList()
      })
    },
    // 查询开支类型
    getTypeList () {
      this.payDetailData = []
      const obj = {
        status: this.recordData.pkr_status,
        type: 1
      }
      this.$store
        .dispatch('commonKzls/getListItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.typeData = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    // 查询开支项名称
    getItemNameList (item) {
      this.groupData = item
      this.payDetailData = item.detail ? item.detail : []

      return false
    },
    // 新增开支记录
    setData () {
      if (this.recordListData.length <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请选择开支项！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        return false
      }
      const data = {
        ...this.recordData,
        dateArr: this.dateArr,
        record: this.recordListData
      }
      this.$store
        .dispatch('commonKzls/setRecordData', data)
        .then((res) => {
          if (res.code == 200) {
            this.showDialog = false
            this.addButtonDisabled = true
            this.$q.notify({
              message: '成功',
              caption: '新增开支记录成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
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
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    // 修改的逻辑部分
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regp = /^(\d+|\d+\.\d{1,2})$/
      const pkr_price = this.formatAmount(data.pkr_price)

      if (!regp.test(data.pkr_price)) {
        this.$q.notify({
          message: '注意',
          caption: '金额最多两位小数！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        data.pkr_price = ''
      }
      itemsToUpdate.push(data)
      p.api.applyTransaction({ update: itemsToUpdate })
    },
    // 关闭弹窗执行方法
    hideNowPage () {
      this.$emit('dataList')
      this.showDialog = false
      this.addButtonDisabled = false
    },
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 322
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 往ag添加单条开支记录
    pushTableRow (item) {
      this.itemData = item
      this.recordListData.unshift({
        pkr_group_id: this.groupData.id,
        pkr_group_name: this.groupData.pki_name,
        pkr_item_id: item.id,
        pkr_item_name: item.pki_name,
        pkr_price: '',
        pkr_status: item.pki_status
      })
    }
  }
}
</script>
