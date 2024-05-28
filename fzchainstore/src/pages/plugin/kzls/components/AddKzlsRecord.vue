<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="showDialog">
      <q-card
        :style="{
          width: $q.screen.width * 0.6 + 'px',
          'min-width': $q.screen.width * 0.6 + 'px',
        }"
        class="q-pa-md"
      >
        <q-form ref="kzjlRecordRef">
          <q-card-section class="row q-pa-none">
            <span style="font-size: 18px"> 新增开支记录</span>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <div class="q-mt-lg q-mb-md">
            <div class="row ">
              <q-btn-toggle
                v-model="recordData.pkr_status"
                spread
                class="my-custom-toggle col-3"
                no-caps
                unelevated
                toggle-color="primary"
                color="white"
                @input="getTypeList"
                text-color="primary"
                :options="[
                  { label: '开支', value: '1' },
                  { label: '收入', value: '2' },
                ]"
              />
            </div>
            <div class="row q-mt-lg" v-if="recordData.pkr_status == '1'">
              <div class="col-auto" v-for="(item, key) in typeData">
                <q-btn
                  unelevated
                  class="q-mr-sm q-px-sm"
                  @click="getItemNameList(item)"
                  :label="item.pki_name"
                  :color="groupData.id == item.id ? 'positive' : 'primary'"
                >
                </q-btn>
              </div>
            </div>
            <div class="row q-mt-lg" v-else-if="recordData.pkr_status == '2'">
              <div class="col-auto" v-for="(item, key) in typeData">
                <q-btn
                  unelevated
                  class="q-mr-sm q-px-sm"
                  @click="getItemNameList(item)"
                  :label="item.pki_name"
                  :color="groupData.id == item.id ? 'positive' : 'primary'"
                >
                </q-btn>
              </div>
            </div>
            <div class="q-mt-md row" c v-if="payDetailData.length > 0">
              <div class="col-auto" v-for="(item, key) in payDetailData">
                <q-btn
                  unelevated
                  class="q-mr-sm q-px-xs"
                  @click="pushTableRow(item)"
                  :label="item.pki_name"
                  :color="itemData.id == item.id ? 'positive' : 'primary'"
                >
                </q-btn>
              </div>
            </div>
          </div>
          <div
            :style="{
              height: gridOptions.rowHeight * 10 + 'px',
            }"
          >
            <ag-grid-vue
              ref="agGridTable"
              :gridOptions="gridOptions"
              class="ag-theme-balham  ag-grid-table hl_header_center goods-count-table hl_content_center full-height"
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
            ></ag-grid-vue>
          </div>
          <div align="right" class="q-mt-lg">
            <q-btn unelevated label="确认" :disable="addButtonDisabled" color="primary" @click="setData" />
            <q-btn unelevated label="关闭" class="q-ml-sm" color="grey" v-close-popup />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import RecordAgDel from './RecordAgDel'
export default {
  name: 'AddKzlsRecord',
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
          headerName: '操作',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'RecordAgDel'
        }
      ],
      localeText: this.$ag_grid_localeText

    }
  },
  created () {
    this.getTypeList()
    this.context = this
  },
  methods: {
    // 查询开支类型
    getTypeList () {
      this.payDetailData = []
      const obj = {
        status: this.recordData.pkr_status,
        type: 1
      }
      this.$store
        .dispatch('kzls/getListAllData', obj)
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
      const obj = {
        group: item.id,
        status: item.pkr_status
      }
      this.$store
        .dispatch('kzls/getListAllData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.groupData = item
            this.payDetailData = res.data ? res.data : []
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
    // 新增开支记录
    setData () {
      this.$refs.kzjlRecordRef.validate().then((success) => {
        if (success) {
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
            record: this.recordListData
          }
          this.$store
            .dispatch('kzls/setRecordData', data)
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
        }
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
<style>
.my-custom-toggle {
  border: 1px solid #027be3;
}
</style>
