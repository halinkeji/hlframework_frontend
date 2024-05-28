<template>
  <q-dialog @hide="hideNowPage" persistent v-model="showDialog">
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 1) + 'px',
        'max-width': parseInt(this.$q.screen.width * 1) + 'px',
      }"
      class="q-pa-md fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm ">
          <span style="font-size: 18px">{{ checkData.id > 0 ? '修改盘点表' : '新增盘点表' }}</span>
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-scroll-area class="fit full-height">
            <q-form ref="checkDataRef">
              <div class="row q-col-gutter-xs">
                <div class="col-6">
                  <q-select
                    outlined
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    v-model="checkData.cep_depot_type"
                    v-if="is_main_store"
                    @input="getDepotList"
                    :options="[
                      { label: '总仓', value: '1' },
                      { label: '店仓', value: '2' },
                    ]"
                    dense
                    label="盘点类型"
                  />
                </div>
                <div class="col-6">
                  <q-select
                    outlined
                    dense
                    v-model="checkData.cep_depot_id"
                    :options="depotData"
                    label="请选择盘点仓库"
                    @input="selectDepot"
                    option-value="id"
                    option-label="cd_name"
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-6">
                  <q-select
                    outlined
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    v-model="checkData.cep_check_order_range"
                    @input="checkType"
                    :options="[
                      { label: '全部盘点', value: '1' },
                      { label: '抽盘', value: '2' },
                      { label: '品类盘点', value: '3' },
                    ]"
                    dense
                    label="盘点范围"
                  />
                </div>
                <div class="col-6">
                  <q-input disable outlined dense v-model="checkData.cep_should_total_quantity" label="应有库存" />
                </div>
                <div class="col-12">
                  <q-input outlined type="textarea" dense :rows="1" v-model="checkData.cep_note" label="盘点备注" />
                </div>
              </div>
              <div v-if="checkData.cep_check_order_range == 2">
                <div class="row q-mt-sm">
                  <q-input class="col-12 col-md-6 q-pr-sm q-mt-xs" outlined dense v-model="code" label="商品条码" />
                  <div class="col-12 col-md-6 q-mt-xs ">
                    <q-btn label="添加" unelevated color="positive" @click="addCode" />
                  </div>
                </div>
                <div class="row q-mt-lg">
                  <div class="col-12">
                    <q-table
                      title="抽盘详情"
                      :data="changeData"
                      :columns="changeColumnsData"
                      row-key="name"
                      flat
                      hide-bottom
                      bordered
                      :pagination="{
                        rowsPerPage: 0,
                      }"
                      separator="vertical"
                    />
                  </div>
                </div>
              </div>
              <div v-if="checkData.cep_check_order_range == 3">
                <div class="row q-mt-sm">
                  <div class="col-md-6 col-12 q-mt-xs q-pr-sm">
                    <hl-select-tree
                      :list_width="400"
                      @getItem="changeGoodsType"
                      @resetValue="type = ''"
                      :dataList="typeData"
                      textName="请选择分类"
                      :inputLabel="'gt_name'"
                      :inputValue="'id'"
                      :showValue="type"
                    />
                  </div>
                  <div class="col-md-1 col-12 q-mt-xs">
                    <q-btn-group unelevated>
                      <q-btn color="primary" label="添加品类" @click="addSpecification" unelevated icon="las la-plus-square" />
                    </q-btn-group>
                  </div>
                  <div class="col-md-4 col-12 q-mt-xs">
                    <q-chip square color="red" text-color="white" icon="report_problem" label="品类盘点在保存以后生成盘点清单。" />
                  </div>
                </div>
                <div class="row q-mt-lg">
                  <div class="col-md-11 col-12 q-pt-none">
                    <div class="row">
                      <div class="col-md-2 col-12" v-for="(normItem, normIndex) in configData" :key="normIndex">
                        <q-input
                          v-model="normItem.cel_type_name"
                          outlined
                          bottom-slots
                          dense
                          label="订购品类"
                          readonly
                          lazy-rules
                          disable
                        >
                          <template v-slot:after>
                            <q-icon @click="deleteSpecification(normIndex)" color="red" class="text-h5" name="delete "> </q-icon>
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
          <q-btn label="确认盘点表" unelevated @click="setData" :disable="addButtonDisabled" color="primary" class="q-px-xl" />
          <q-btn label="关闭" unelevated color="grey" class="q-px-xl" v-close-popup />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddCheckOrder',
  data () {
    return {
      checkData: {
        cep_depot_id: '',
        cep_depot_type: '2',
        cep_check_order_range: '2',
        cep_should_total_quantity: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_note: '',
        cep_status: '1',
        id: '',
        cep_type: 8
      },
      dialogWidth: '1020px',
      showDialog: false,
      addButtonDisabled: false,
      depotData: [],
      code: '',
      changeColumnsData: [
        {
          label: '商品名称',
          align: 'center',
          field: 'epd_archives_name'
        },
        {
          align: 'center',
          label: '商品条码',
          field: 'epd_skc_code'
        },
        {
          label: '规格',
          align: 'center',
          field: 'epd_spe_name'
        },
        {
          label: '仓库现有库存',
          align: 'center',
          field: 'epd_check_before_number'
        }
      ],
      typeData: [],
      changeData: [],
      type: '',
      configData: []
    }
  },
  created () {
    if (!this.is_main_store) {
      const headerLocal = this.$q.localStorage.getItem('lschainstore_header_local')
      if (headerLocal && headerLocal.store_id) {
        this.store_id = headerLocal.store_id
      }
    }
  },
  mounted () {

  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {

    init (id) {
      this.showDialog = true
      this.getDepotList()
    },
    getDepotList () {
      this.checkData.cep_depot_id = ''
      const obj = {
        type: this.checkData.cep_depot_type
      }
      this.$store
        .dispatch('erpTransfer/getAllData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.depotData = res.data ? res.data : []
          } else {
            this.depotData = []
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
    selectDepot (val) {
      const that = this
      if (that.checkData.cep_depot_id > 0) {
        const data = that.depotData.find(function (x) {
          return x.id == that.checkData.cep_depot_id
        })
        that.checkData.cep_depot_code = data.cd_code
        that.checkData.cep_depot_name = data.cd_name

        if (this.checkData.cep_depot_id > 0 && this.checkData.cep_check_order_range == 1) {
          this.getDepotNumber()
        }
      }
    },

    addCode () {
      if (this.checkData.cep_depot_id > 0) {
        const obj = {
          depot_id: this.checkData.cep_depot_id,
          goodsCode: this.code
        }
        this.$store
          .dispatch('erpCheck/editCheckButtfer', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                color: 'green',
                message: '成功',
                caption: '添加成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.code = ''
              this.changeData.push(res.data)
              this.$nextTick(() => {
                this.getDataColumnSum()
              })
            } else {
              this.$q.notify({
                message: '添加失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
          .catch((error) => {})
      } else {
        this.$q.notify({
          message: '失败',
          caption: '请选择要盘点的仓库',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        return false
      }
    },

    // 新增或修改盘点表方法
    setData () {
      this.$refs.checkDataRef.validate().then((success) => {
        // 验证表单提交是否正确
        if (success) {
          // 成功执行
          if (this.checkData.cep_depot_id < 1) {
            this.$q.notify({
              message: '失败',
              caption: '请选择要盘点的仓库',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            return false
          }

          this.$q
            .dialog({
              type: 'confirm',
              color: 'primary',
              title: '是否确认',
              cancel: true,
              message: '确认保存盘点表数据, 是否继续?'
            })
            .onOk(() => {
              const data = {
                ...this.checkData,
                changeData: this.changeData,
                configData: this.configData
              }
              this.$store
                .dispatch('erpCheck/setData', data)
                .then((res) => {
                  if (res.code == 200 && res.data) {
                    this.$q.notify({
                      message: '成功',
                      caption: `${this.checkData.id > 0 ? '修改' : '新增'}` + '盘点表成功',
                      icon: 'ion-checkmark-circle-outline',
                      timeout: 500,
                      position: 'top-right',
                      color: 'green'
                    })
                    this.$nextTick(() => {
                      this.$router.push({ name: 'addErpcheck', query: { id: res.data.id } })
                    })
                  } else {
                    this.$q.notify({
                      message: '失败',
                      caption: res.data.message,
                      color: 'red',
                      icon: 'ion-close-circle-outline',
                      timeout: 500,
                      position: 'top-right'
                    })
                    this.addButtonDisabled = false
                  }
                })
                .catch((error) => {})
            })
        }
      })
    },
    // 隐藏盘点表弹窗
    hideNowPage () {
      this.checkData.cep_depot_id = ''
      this.checkData.cep_depot_type = ''
      this.checkData.cep_check_order_range = ''
      this.checkData.cep_should_total_quantity = ''
      this.checkData.cep_depot_code = ''
      this.checkData.cep_depot_name = ''
      this.checkData.cep_note = ''
      this.checkData.cep_status = ''
      this.showDialog = false

      this.$emit('dataList')
      this.addButtonDisabled = false
    },
    checkType () {
      this.cep_should_total_quantity = 0
      this.changeData = []
      this.configData = []
      if (this.checkData.cep_check_order_range == 3) {
        this.getType()
      }
      if (this.checkData.cep_check_order_range == 1) {
        this.selectDepot()
      }
    },
    getDepotNumber () {
      const obj = {
        type: this.checkData.cep_depot_type,
        depot_id: this.checkData.cep_depot_id
      }
      this.$store
        .dispatch('erpTransfer/getDepotData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.checkData.cep_should_total_quantity = res.data ? res.data : 0
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

    getDataColumnSum () {
      this.checkData.cep_should_total_quantity = 0
      const tableData = this.changeData
      let inTotalNum = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.epd_check_before_number)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.epd_check_before_number)
        }
      })
      this.checkData.cep_should_total_quantity = this.formatAmount(inTotalNum)
    },
    getType () {
      this.$store
        .dispatch('goodstype/getTreeList')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.typeData = res.data
            }
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
    changeGoodsType (item) {
      const that = this
      that.type = item
    },
    addSpecification () {
      const that = this
      const type = that.type
      if (type) {
        const data = that.configData.find(function (x) {
          return x.cel_type_id == that.type.id
        })
        if (!data) {
          const layoutArray = that.configData
          const newlayout = {
            cel_type_id: type.id,
            cel_type_name: type.gt_name
          }
          layoutArray.push(newlayout)
          that.type = null
        } else {
          this.$q.notify({
            message: '失败',
            caption: '已存在此类目',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
          that.type = null
        }
      }
    },
    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
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
