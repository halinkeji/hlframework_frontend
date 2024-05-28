<template>
  <q-dialog v-model="activePrompt" full-height full-width>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.8 + 'px',
        'min-width': this.$q.screen.width * 0.8 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="q-ml-md q-mt-md">
          <div class="row items-center q-pr-md">
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            打印单据
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="closeDialog" />
          </div>
          <div class="row">
            <q-select
              class="col-12 col-md-2 q-mt-sm"
              outlined
              v-model="templateFormData"
              option-label="cct_name"
              :options="printTemplateDatas"
              dense
              label="选择打印模板"
              emit-value
              map-options
            />
            <q-btn color="primary" class="q-mt-sm q-mx-md" unelevated @click="selectTem()">选择</q-btn>
            <!-- <q-btn color="grey-6" unelevated @click="handleFormReset" class="q-mt-sm q-mr-md">预览</q-btn> -->
            <q-select
              class="col-12 col-md-2 q-mt-sm"
              outlined
              dense
              v-model="templateForm.cct_printer_modl"
              :options="['A3', 'A4', 'A5']"
              label="纸张大小"
            />
          </div>
        </div>
        <div class="col-shrink full-height q-my-xs q-mx-md row">
          <div class="col-1"></div>
          <div class="col-10">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-center text-h6">{{ showType(orderType) }}单</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row">
                  <div class="col-4" v-if="orderType == 'purchase' || orderType == 'in'">
                    供货商：{{ infoData.cep_supplier_name }}
                    <br />
                    仓库：{{ infoData.cep_depot_name }}
                  </div>
                  <div class="col-4" v-if="orderType == 'order'">
                    补货门店：{{ infoData.store.name }}
                    <br />
                    仓库：{{ infoData.cep_depot_name }}
                  </div>
                  <div class="col-4" v-if="orderType == 'orderGoods' || orderType == 'allocation' || orderType == 'out' || orderType == 'orderIn'">
                    订货门店：{{ infoData.inStore.name }}
                    <br />
                    仓库：{{ infoData.cep_depot_name }}
                  </div>
                  <div class="col-4" v-if="orderType == 'store' || orderType == 'storeOut' || orderType == 'storeIn'">
                    退货门店：{{ infoData.inStore.name }}
                    <br />
                    退货返仓：{{ infoData.cep_depot_name }}
                  </div>
                  <div class="col-4" v-if="orderType == 'transfer' || orderType == 'transferOut' || orderType == 'transferIn'">
                    调入仓库：<span v-if="infoData.inDepot">{{ infoData.inDepot.cd_name }}</span>
                    <br />
                    退出仓库：<span v-if="infoData.outDepot">{{ infoData.outDepot.cd_name }}</span>
                  </div>
                  <div class="col-4" v-if="orderType == 'change'">
                    调整仓库：{{ infoData.cep_depot_name }}
                    <br />
                    调整状态： <span v-if="infoData.changeType">{{ infoData.changeType.ect_name }} </span>
                  </div>
                  <div class="col-4" v-if="orderType == 'direct' || orderType == 'directOut' || orderType == 'directIn'">
                    直采门店：{{ infoData.store.name }}
                    <br />
                    直采仓库：{{ infoData.cep_depot_name }}
                  </div>
                  <div class="col-4" v-if="orderType == 'check'">
                    盘点仓库：{{ infoData.cec_depot_name }}
                    <br />
                    盘点类型： <span v-if="infoData.cep_check_order_range == 1">全盘</span>
                    <span v-if="infoData.cep_check_order_range == 2">抽盘</span>
                    <span v-if="infoData.cep_check_order_range == 2">分类盘点</span>
                  </div>

                  <div class="col-5 text-center">
                    单据号：
                    <span v-if="orderType == 'order'">
                      {{ infoData.cep_contract_number }}
                    </span>
                    <span v-if="orderType == 'transfer' || orderType == 'transferOut' || orderType == 'transferIn'">
                      {{ infoData.cep_contract_number }}
                    </span>
                    <span v-if="orderType == 'check'">
                      {{ infoData.cep_contract_number }}
                    </span>
                    <span v-else>
                      {{ infoData.cep_contract_number }}
                    </span>
                  </div>

                  <div class="col-3">时间：{{ calendarDate }}</div>
                </div>
              </q-card-section>
              <q-separator inset />

              <q-card-section>
                <q-markup-table separator="cell" flat bordered>
                  <thead>
                    <tr>
                      <th class="text-center" v-for="(datai, key) in templateForm.cct_content" :key="key">{{ datai.value }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center" v-for="(datai, key) in templateForm.cct_content" :key="key">参数 {{ formatAmount(key + 1) }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-card-section>
              <q-card-section class="q-pt-lg">
                <div class="row" v-if="orderType == 'change'">
                  <div class="col-3">{{ showType(orderType) }}数量：{{ infoData.cep_total_purchase_num }}</div>
                  <div class="col-6 text-center">{{ showType(orderType) }}品类：{{ infoData.cep_total_shipments_quantity }}</div>
                  <div class="col-3">
                    店铺信息：{{ $q.localStorage.getItem('fzchainstore_store_local').storeInfo.name }}
                    <br />
                    操作员：<span v-if="infoData.auditor">{{ infoData.auditor.username }}</span>
                  </div>
                </div>
                <div class="row" v-else>
                  <div class="col-3">{{ showType(orderType) }}付款：19563元</div>
                  <div class="col-6 text-center">{{ showType(orderType) }}数量：63025</div>
                  <div class="col-3" v-if="orderType == 'purchase'">
                    采购员：{{ infoData.cep_buyer_name }}
                    <br />
                    审核员：<span v-if="infoData.auditor"> {{ infoData.auditor.username }} </span>
                    <br />
                    店铺信息：{{ $q.localStorage.getItem('fzchainstore_store_local').storeInfo.name }}
                    <br />
                    操作员：<span v-if="infoData.auditor">{{ infoData.auditor.username }}</span>
                  </div>
                  <div class="col-3" v-else>
                    店铺信息：{{ $q.localStorage.getItem('fzchainstore_store_local').storeInfo.name }}
                    <br />
                    操作员：<span v-if="infoData.auditor">{{ infoData.auditor.username }}</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-1"></div>
        </div>
        <hl-local-printer ref="localPrinterRef" :margin="'15px'" />
        <div class="col-shrink bg-white q-pb-lg q-gutter-md items-center q-px-md">
          <div class="row">
            <q-space />
            <q-input outlined dense class="q-mr-xl" v-model="templateForm.cct_name" label="模板名称" v-if="saveStatus == '1'" />
            <q-checkbox v-model="saveStatus" label="是否此次打印保存模板" true-value="1" false-value="0" />
          </div>
          <div class="row q-pb-lg">
            <q-space />
            <q-btn class="q-px-xl q-mr-sm" unelevated color="primary" @click="setPrint()" label="打印" />
            <q-btn class="q-px-xl" unelevated color="grey" @click="closeDialog" label="取消" />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  components: {},
  data () {
    return {
      printTemplateId: '',
      templateFormData: '',
      templateForm: {
        cct_model: '',
        cct_name: '',
        cct_content: '',
        cct_page_width: '',
        cct_page_height: '',
        cct_printer_modl: ''
      },
      printTemplateDatas: [], // 默认数据源
      activePrompt: false,
      invoiceId: '',
      orderType: '',
      saveStatus: '0',
      calendarDate: '',
      infoData: {}
    }
  },

  mounted () {},
  created () {
    this.calendarDate = this.$q_date.formatDate(Date.now(), 'YYYY-MM-DD HH:MM:SS')
  },
  computed: {},
  methods: {
    closeDialog () {
      this.activePrompt = false
      this.$emit('closeDialog')
    },
    setPrint () {
      // 提交
      const obj = {
        ...this.templateForm,
        saveStatus: this.saveStatus,
        invoiceId: this.invoiceId
      }
      this.$store
        .dispatch('cloudprinter/saveErpTemplate', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$refs.localPrinterRef.startPrinter(res.data)
          } else {
            this.$q.notify({
              message: '未配置打印机',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
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
    showType (data) {
      let typeText = ''
      switch (data) {
        case 'purchase':
          typeText = '采购'
          break
        case 'in':
          typeText = '采购入库'
          break
        case 'order':
          typeText = '补货'
          break
        case 'orderGoods':
          typeText = '订货'
          break
        case 'allocation':
          typeText = '配货'
          break
        case 'out':
          typeText = '订货出库'
          break
        case 'orderIn':
          typeText = '订货入库'
          break
        case 'direct':
          typeText = '直采'
          break
        case 'directAllocation':
          typeText = '直采配货'
          break
        case 'directOut':
          typeText = '直采出库'
          break
        case 'directIn':
          typeText = '直采入库'
          break
        case 'store':
          typeText = '门店退货'
          break
        case 'storeOut':
          typeText = '退货出库'
          break
        case 'storeIn':
          typeText = '退货入库'
          break
        case 'transfer':
          typeText = '调拨'
          break
        case 'transferOut':
          typeText = '调拨出库'
          break
        case 'transferIn':
          typeText = '调拨入库'
          break
        case 'change':
          typeText = '库存调整'
          break
        case 'check':
          typeText = '盘点'
          break
      }

      return typeText
    },
    selectTem () {
      if (this.templateFormData) {
        const sideBarColumns = JSON.parse(this.templateFormData.cct_content)
        this.templateForm = this.templateFormData
        this.templateForm.cct_content = sideBarColumns
        this.orderType = this.templateFormData.cct_model
      }
    },

    // 开启弹窗
    getInquireType (sideBarColumns, id, type, data) {
      this.infoData = data

      this.activePrompt = true
      this.orderType = type
      this.invoiceId = id
      this.templateForm.cct_content = sideBarColumns
      this.templateForm.cct_model = type
      const obj = {
        type: type
      }
      this.$store
        .dispatch('cloudprinter/getErpTemplate', obj)
        .then((res) => {
          if (res.code == 200) {
            this.printTemplateDatas = res.data
          }
        })
        .catch((error) => {})
    },
    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    handleFormReset () {}
  }
}
</script>
<style>
.my-green-class {
  text-align: center;
}

.goods-select-table .cell-span-goods-select {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
