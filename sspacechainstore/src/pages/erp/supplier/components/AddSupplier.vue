<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="isSidebarActiveLocal" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2">{{ supplierFrom.id > 0 ? '修改' : '新增' }}供货商信息</div>

          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <q-form ref="supplierDataRef" class="row q-col-gutter-sm">
            <div class="col-md-6 col-12">
              <q-input label="名称" outlined v-model="supplierFrom.gs_supplierName" dense lazy-rules :rules="[(val) => !!val || '名称是必填的']" />
            </div>
            <div class="col-md-6 col-12">
              <q-select
                outlined
                emit-value
                map-options
                option-value="id"
                option-label="gst_name"
                v-model="supplierFrom.gs_supplierTypeId"
                :options="supplierTypeData"
                dense
                label="供货商分类"
              />
            </div>

            <div class="col-md-6 col-12">
              <q-input
                label="编号"
                outlined
                v-model="supplierFrom.gs_supplierNumber"
                dense
                lazy-rules
                :rules="[(val) => /^\d+$/.test(val) || '编号为非负整数']"
              >
                <template v-slot:after>
                  <q-btn color="warning" class="full-width" unelevated label="一键生成编号" @click="math" />
                </template>
              </q-input>
            </div>
            <div class="col-md-6 col-12">
              <q-input
                label="期初应付款"
                outlined
                v-model="supplierFrom.gs_supplierPayable"
                dense
                lazy-rules
                :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '期初应付款为非负两位以内小数']"
              />
            </div>

            <div class="col-md-6 col-12">
              <q-input
                label="期初预付款"
                outlined
                v-model="supplierFrom.gs_supplierPrepayments"
                dense
                lazy-rules
                :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '期初预付款为非负两位以内小数']"
              />
            </div>
            <div class="col-md-6 col-12">
              <q-input
                label="增值税率"
                outlined
                v-model="supplierFrom.gs_supplierAppreciationTax"
                dense
                lazy-rules
                :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '增值税率为非负两位以内小数']"
              />
            </div>

            <div class="col-md-6 col-12">
              <hl-address
                :province="dataFrom.province"
                :city="dataFrom.city"
                :area="dataFrom.district"
                @province="provinceupdate"
                @city="cityupdate"
                @area="areaupdate"
              ></hl-address>
            </div>
            <div class="col-md-6 col-12">
              <q-input label="联系地址" outlined v-model="supplierFrom.gs_supplierAddress" dense :error="false" />
            </div>
            <div class="col-12">
              <q-input label="备注" :rows="1" outlined v-model="supplierFrom.gs_supplierNote" dense type="textarea" />
            </div>

            <div class="col-12">
              <q-space />
              <q-btn unelevated label="新增联系人" color="primary" @click="addContacts"> </q-btn>
            </div>

            <div class="col-12">
              <ag-grid-vue
                ref="agGridTable"
                class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
                :columnDefs="columnDefs"
                :gridOptions="gridOptions"
                :suppressMovableColumns="true"
                :rowData="contacts"
                :rowDragManaged="true"
                rowSelection="multiple"
                colResizeDefault="shift"
                :animateRows="false"
                :floatingFilter="false"
                :enableCellTextSelection="true"
                rowHeight="50"
                :suppressCellSelection="true"
                :suppressRowClickSelection="true"
                :rowMultiSelectWithClick="true"
                domLayout="autoHeight"
                @first-data-rendered="onFirstDataRendered"
                :stopEditingWhenGridLosesFocus="true"
                :suppressRowDeselection="true"
                :suppressRowTransform="true"
                :localeText="localeText"
              ></ag-grid-vue>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="center" class="row q-gutter-sm">
          <q-btn unelevated label="确认" color="primary" @click="submitData" :disable="stop" class="q-px-xl" />
          <q-btn label="关闭" unelevated @click="hideNowPage" color="grey" class="q-px-xl" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddSupplier',
  data () {
    return {
      dialogWidth: '1000px',
      dataId: '',
      isSidebarActiveLocal: false,
      disabledStatus: false,
      localeText: this.$ag_grid_localeText,
      success: false,
      stop: false,
      supplierFrom: {
        gs_supplierName: '',
        gs_supplierNumber: '',
        gs_supplierPayable: 0,
        gs_supplierPrepayments: 0,
        gs_supplierAppreciationTax: 0,
        gs_supplierAddress: '',
        gs_supplierNote: '',
        gs_supplierTypeId: ''
      },

      supplierTypeData: [],
      dataFrom: {
        province: '',
        city: '',
        district: ''
      },
      gridOptions: {},
      columnDefs: [
        {
          headerName: '联系人姓名',
          field: 'name',
          width: this.nowpx(0.1) + 'px',
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.updatedContacts
        },
        {
          headerName: '联系人手机号',
          field: 'phone',
          width: this.nowpx(0.1) + 'px',
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.updatedContacts
        },
        {
          headerName: '联系人固话号',
          field: 'telephone',
          width: this.nowpx(0.1) + 'px',
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.updatedContacts
        },
        {
          headerName: '是否主要联系人',
          field: 'primary',
          width: this.nowpx(0.1) + 'px',
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.updatedContacts,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ['否', '是']
          },
          valueGetter: (p) => {
            if (p.data.primary == 1 || p.data.primary == '是') {
              return '是'
            } else if (p.data.primary == 0 || p.data.primary == '否') {
              return '否'
            }
          }
        }
      ],
      contacts: []
    }
  },
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.6) + 'px'
    }
  },
  mounted () {},
  computed: {},
  methods: {
    addContacts () {
      const data = {
        id: 0,
        name: '',
        phone: '',
        telephone: '',
        primary: 0
      }
      this.contacts.push(data)
    },
    init (id) {
      this.getTypeData()
      this.dataId = id
      this.isSidebarActiveLocal = true
      if (id > 0) {
        this.$store.dispatch('supplier/getItemData', this.dataId).then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.contacts = res.data.contacts
              this.supplierFrom = res.data
              this.supplierFrom.gs_supplierTypeId = parseInt(this.supplierFrom.gs_supplierTypeId)
              // this.supplierFrom.gs_supplierTypeId = this.supplierFrom.gs_supplierTypeId.toString();

              const address = this.supplierFrom.gs_supplierAddress.split('-')
              this.dataFrom.province = address[0]
              this.dataFrom.city = address[1]
              this.dataFrom.district = address[2]
              this.supplierFrom.gs_supplierAddress = address[3]
            }
          }
        })
      }
    },
    getTypeData () {
      this.$store.dispatch('supplier/getTypeData').then((res) => {
        if (res.code == 200) {
          this.supplierTypeData = res.data
        }
      })
    },
    math () {
      this.supplierFrom.gs_supplierNumber = new Date().getTime().toString()
    },
    submitData () {
      this.$refs.supplierDataRef.validate().then((success) => {
        if (success) {
          if (this.supplierFrom.gs_supplierTypeId == 0) {
            this.$q.notify({
              message: '注意',
              caption: '请选择供货商分类！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          this.stop = true
          this.disabledStatus = true
          const address =
            this.dataFrom.province + '-' + this.dataFrom.city + '-' + this.dataFrom.district + '-' + this.supplierFrom.gs_supplierAddress
          if (!this.success) {
            this.supplierFrom.gs_supplierAddress = address
            this.success = true
          }

          const obj = {
            ...this.supplierFrom,
            id: this.dataId,
            contacts: this.contacts
          }
          this.$store.dispatch('supplier/addData', obj).then((res) => {
            if (res.code == 200) {
              this.success = false
              this.isSidebarActiveLocal = false
              this.$q.notify({
                message: '成功',
                caption: '操作成功！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.$nextTick(() => {
                this.disabledStatus = false
                this.hideNowPage()
              })
            } else {
              this.disabledStatus = false
            }
          })
        }
      })
    },

    provinceupdate (a) {
      this.dataFrom.province = a.value
    },
    cityupdate (a) {
      this.dataFrom.city = a.value
    },
    areaupdate (a) {
      this.dataFrom.district = a.value
    },
    hideNowPage () {
      this.$emit('refreshDataList')
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
    updatedContacts (p) {
      const itemsToUpdate = []
      const data = p.data
      if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(data.phone) && data.phone != '') {
        this.$q.notify({
          message: '注意',
          caption: '输入手机号有误！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        data.phone = ''
      }
      if (data.telephone != '' && !/^0\d{2,3}-?\d{7,8}$/.test(data.telephone)) {
        this.$q.notify({
          message: '注意',
          caption: '输入固话号有误！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        data.telephone = ''
      }
      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
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
