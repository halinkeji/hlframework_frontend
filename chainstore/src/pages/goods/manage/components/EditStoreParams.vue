<template>
  <q-dialog v-model="dialogShow" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * (parseInt(goodsSize) == 1 ? 0.8 : 0.3)) + 'px',
        'max-width': parseInt($q.screen.width * (parseInt(goodsSize) == 1 ? 0.8 : 0.3)) + 'px',
      }"
      :class="{ 'fit':parseInt(goodsSize) == 1 }"
    >
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-lg">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ goodsStoreForm.id ? '修改' : '新增' }}商品设置</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @close="clearFields" />
        </q-card-section>
      </div>
       <div class="col-shrink q-px-xs full-height">
        <q-form ref="goodsStoreParamsRef" class="q-gutter-md">
          <q-card flat square class="q-pa-xs">
            <div class="row q-col-gutter-sm">
              <div  :class="parseInt(goodsSize) == 1 ? 'col-4' : 'col-12' ">
                <q-select outlined v-model="goodsStoreForm.gs_status" class="q-pb-md" map-options emit-value dense option-label="label" option-value="value" :options="statusOptions" label="选择状态" />
              </div>
              <!-- <div class="col-12 col-md-4">
                <q-input
                    v-model="goodsStoreForm.gs_in_depot_price"
                    standout
                    dense
                    outlined
                    label="入库价"
                    class="q-mt-md"
                    :rules="[(val) => !!val || '请输入入库价', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '入库价为非负两位以内小数']"
                  >
                  </q-input>
              </div> -->
              <div class="col-12" v-if="parseInt(goodsSize) != 1">
                <q-input
                  v-model="goodsStoreForm.gs_list_price"
                  standout
                  dense
                  outlined
                  label="标价"
                  :rules="[(val) => !!val || '请输入标价', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '标价为非负两位以内小数']"
                >
                </q-input>
              </div>
              <div class="col-12" v-if="parseInt(goodsSize) != 1">
                <q-input
                  v-model="goodsStoreForm.gs_price"
                  standout
                  dense
                  outlined
                  label="售价"
                  :rules="[(val) => !!val || '请输入售价', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '售价为非负两位以内小数']"
                >
                </q-input>
              </div>
            </div>
          </q-card>
        </q-form>
        <div class="full-height" v-if="parseInt(goodsSize) == 1">
          <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="specPriceData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
        ></ag-grid-vue>

        </div>

       </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
        <q-btn label="确定" @click="addUpdateReward()" color="primary" class="q-px-xl" unelevated />
        <q-btn label="关闭" @click="clearFields()" class="q-px-xl" color="grey" unelevated />
      </div>
    </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'EditStoreParams',
  data () {
    return {
      dataId: 0,
      dialogShow: false,
      localeText: this.$ag_grid_localeText,
      goodsStoreForm: {
        gs_status: '0',
        gs_main_goods_id: '',
        gs_in_depot_price: '',
        gs_list_price: '',
        gs_price: '',
        id: ''
      },
      statusOptions: [
        { label: '上架', value: '1' },
        { label: '下架', value: '0' }
      ],
      gridOptions: {},
      columnDefs: [

        {
          headerName: '规格',
          field: 'sl_title'
        },
        {
          headerName: '标价',
          field: 'gss_list_price',
          editable: true,
          onCellValueChanged: this.changePrice
        },
        {
          headerName: '售价',
          field: 'gss_price',
          editable: true,
          onCellValueChanged: this.changePrice
        }

      ],
      context: '',
      specPriceData: [],
      goodsSize: 0
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (mainGoodsId, parasmId, goodsSize) {
      this.goodsSize = goodsSize
      if (mainGoodsId > 0) {
        this.dialogShow = true
        this.goodsStoreForm.gs_main_goods_id = mainGoodsId
        this.getGoodsStoreParams(mainGoodsId, parasmId)
      }
    },
    getGoodsStoreParams (mainGoodsId, parasmId) {
      const obj = {
        id: parasmId,
        mainGoodsId
      }
      this.$store
        .dispatch('goods/getStoreParams', obj)
        .then((res) => {
          if (res.code == 200) {
            if (parasmId > 0) {
              this.goodsStoreForm = res.data && res.data.mainInfo ? res.data.mainInfo : {}
            }

            this.specPriceData = res.data && res.data.specInfo ? res.data.specInfo : []
          }
        })
        .catch((error) => {})
    },
    addUpdateReward () {
      this.$refs.goodsStoreParamsRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.goodsStoreForm,
            specPriceData: this.specPriceData
          }
          this.$store
            .dispatch('goods/setStoreParams', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '保存成功',
                  color: 'green'
                })
                this.dialogShow = false
                this.$emit('setSuccess')
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
    },

    clearFields () {
      this.dialogShow = false
      this.$emit('closePage')
    },
    changePrice (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^(0|[1-9]\d*)(.\d{1,2})?$/
      if (!regu.test(data.gss_list_price)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正确的标价',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        data.gss_list_price = '0'
      }

      if (!regu.test(data.gss_price)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正确的售价',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        data.gss_price = '0'
      }
      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }

  }
}
</script>
