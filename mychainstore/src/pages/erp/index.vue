<template>
  <q-page class="fit bg-white">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  q-ma-md" v-if="is_main_store">
        <q-select
          label="查询门店"
          @input="getErpTotal"
          clearable
          v-model="selectStoreData"
          use-chips
          option-value="id"
          option-label="name"
          multiple
          emit-value
          map-options
          dense
          outlined
          :options="libInStoreList"
        />
      </div>
      <div class="col-shrink q-px-xs q-pb-md">
        <div class="row q-col-gutter-md q-pa-sm">
          <div class="col-6 col-md-3">
            <q-card flat bordered class=" text-white q-mt-sm">
              <q-card-section class="bg-blue-4">
                <div class="row  items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle1 text-weight-medium">实物商品种类/实物商品库存</div>
                  </div>
                  <div class="col-auto ">
                    <q-icon name="help" size="20px">
                      <q-tooltip>
                        实物商品的种类个数/所有实物商品库存
                      </q-tooltip>
                    </q-icon>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <div class="text-h4 text-grey-8 text-center q-my-lg">
                {{ formatAmount(erpTotal.goodsCount) }}/{{ formatAmount(erpTotal.goodsNumber) }}
              </div>
            </q-card>
          </div>
          <div class="col-6 col-md-3">
            <q-card flat bordered class="text-white  q-mt-sm">
              <q-card-section class="bg-teal-4">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle1 text-weight-medium">库存数量预警个数/时间预警个数</div>
                  </div>
                  <div class="col-auto ">
                    <q-icon name="ion-more" size="20px">
                      <q-menu>
                        <q-list style="min-width: 100px">
                          <q-item clickable v-close-popup @click="getWarningTotal(0)">
                            <q-item-section>
                              无预警规则
                            </q-item-section>
                          </q-item>
                          <q-item v-for="(i, k) in warningRules" clickable :key="k" v-close-popup @click="getWarningTotal(i.id)">
                            <q-item-section>{{ i.wr_title }}</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-icon>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <div class="text-h4 text-grey-8 text-center q-my-lg">
                {{ formatAmount(erpTotal.warningNumberCount) }}
                /{{ formatAmount(erpTotal.warningTimeCount) }}
              </div>
            </q-card>
          </div>
          <div class="col-6 col-md-3">
            <q-card flat bordered class="text-white  q-mt-sm">
              <q-card-section class="bg-red-5">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle1 text-weight-medium">客户欠款总额/欠客户总款额</div>
                  </div>
                  <div class="col-auto ">
                    <q-icon name="help" size="20px">
                      <q-tooltip>
                        客户欠商家总款额/商家欠客户总款额
                      </q-tooltip>
                    </q-icon>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <div class="text-h4 text-grey-8 text-center q-my-lg">
                {{ $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                }}{{ formatAmount(erpTotal.clientMoney) }}/{{
                  $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                }}{{ formatAmount(erpTotal.clientArrears) }}
              </div>
            </q-card>
          </div>
          <div class="col-6 col-md-3">
            <q-card flat bordered class="text-white  q-mt-sm">
              <q-card-section class="bg-red-5">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle1 text-weight-medium">欠供货商总款额/供货商欠款总额</div>
                  </div>
                  <div class="col-auto ">
                    <q-icon name="help" size="20px">
                      <q-tooltip>
                        商家欠供货商总款额/供货商欠商家总款额
                      </q-tooltip>
                    </q-icon>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <div class="text-h4 text-grey-8 text-center q-my-lg">
                {{ $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                }}{{ formatAmount(erpTotal.supplierMoney) }}/{{
                  $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                }}{{ formatAmount(erpTotal.supplierArrears) }}
              </div>
            </q-card>
          </div>

          <div class="col-6 col-md-3">
            <q-card flat bordered class="text-white  q-mt-sm">
              <q-card-section class="bg-green-5">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle1 text-weight-medium">本月购货数量/本月购货金额</div>
                  </div>
                  <div class="col-auto ">
                    <q-icon name="help" size="20px">
                      <q-tooltip>
                        本月ERP入库数量/本月ERP入库付款金额
                      </q-tooltip>
                    </q-icon>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <div class="text-h4 text-grey-8 text-center q-my-lg">
                {{ formatAmount(erpTotal.inNumber) }}/{{ $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                }}{{ formatAmount(erpTotal.inMoney) }}
              </div>
            </q-card>
          </div>
          <div class="col-6 col-md-3">
            <q-card flat bordered class="text-white  q-mt-sm">
              <q-card-section class="bg-cyan-5">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle1 text-weight-medium">本月销货数量/本月销货金额</div>
                  </div>
                  <div class="col-auto ">
                    <q-icon name="help" size="20px">
                      <q-tooltip>
                        本月ERP销货数量/本月ERP销货收款金额
                      </q-tooltip>
                    </q-icon>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <div class="text-h4 text-grey-8 text-center q-my-lg">
                {{ formatAmount(erpTotal.saleNumber) }}/{{
                  $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                }}{{ formatAmount(erpTotal.saleMoney) }}
              </div>
            </q-card>
          </div>
          <div class="col-6 col-md-3">
            <q-card flat bordered class="text-white  q-mt-sm">
              <q-card-section class="bg-purple-5">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle1 text-weight-medium">本月零售数量/本月零售金额</div>
                  </div>
                  <div class="col-auto ">
                    <q-icon name="help" size="20px">
                      <q-tooltip>
                        本月零售商品数量/本月零售收款金额
                      </q-tooltip>
                    </q-icon>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <div class="text-h4 text-grey-8 text-center q-my-lg">
                {{ formatAmount(erpTotal.comsumeNumber) }}/{{
                  $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                }}{{ formatAmount(erpTotal.consumeMoney) }}
              </div>
            </q-card>
          </div>
          <div class="col-6 col-md-3">
            <q-card flat bordered class="text-white  q-mt-sm">
              <q-card-section class="bg-orange-5">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle1 text-weight-medium">本月零售退款数量/本月零售退款金额</div>
                  </div>
                  <div class="col-auto ">
                    <q-icon name="help" size="20px">
                      <q-tooltip>
                        本月零售退款商品数量/本月零售退款金额
                      </q-tooltip>
                    </q-icon>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <div class="text-h4 text-grey-8 text-center q-my-lg">
                {{ formatAmount(erpTotal.comsumeReturnNumber) }}/{{
                  $q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                }}{{ formatAmount(erpTotal.returnMoney) }}
              </div>
            </q-card>
          </div>
        </div>
        <div class="row q-mt-md q-mx-sm text-blue-8 text-subtitle1">
          <div
            class="col-md-3 col-12 q-py-xl text-center cursor-pointer box"
            style="border:1px dashed #b2b2b2"
            @click="$router.push({ name: 'erpIn' })"
          >
            <q-icon name="las la-dolly-flatbed" size="65px" />
            <div class="q-mt-sm">
              采购入库
            </div>
          </div>
          <div
            class="col-md-3 col-12 q-py-xl text-center cursor-pointer box"
            style="border:1px dashed #b2b2b2"
            @click="$router.push({ name: 'sale' })"
          >
            <q-icon name="las la-shipping-fast" size="65px" />
            <div class="q-mt-sm">
              销货出库
            </div>
          </div>
          <div
            class="col-md-3 col-12 q-py-xl text-center cursor-pointer box"
            style="border:1px dashed #b2b2b2"
            @click="$router.push({ name: 'erpNumber' })"
          >
            <q-icon name="las la-boxes" size="65px" />
            <div class="q-mt-sm">
              商品库存
            </div>
          </div>
          <div
            class="col-md-3 col-12 q-py-xl text-center cursor-pointer box"
            style="border:1px dashed #b2b2b2"
            @click="$router.push({ name: 'erpChange' })"
          >
            <q-icon name="las la-clipboard-check" size="65px" />
            <div class="q-mt-sm">
              库存盘点
            </div>
          </div>
          <div
            class="col-md-3 col-12 q-py-xl text-center cursor-pointer box"
            style="border:1px dashed #b2b2b2"
            @click="$router.push({ name: 'erpRepayment' })"
          >
            <q-icon name="las la-money-check" size="65px" />
            <div class="q-mt-sm">
              收款单
            </div>
          </div>
          <div
            class="col-md-3 col-12 q-py-xl text-center cursor-pointer box"
            style="border:1px dashed #b2b2b2"
            @click="$router.push({ name: 'erpPayment' })"
          >
            <q-icon name="las la-money-check-alt" size="65px" />
            <div class="q-mt-sm">
              付款单
            </div>
          </div>
          <div
            class="col-md-3 col-12 q-py-xl text-center cursor-pointer box"
            style="border:1px dashed #b2b2b2"
            @click="$router.push({ name: 'supplier' })"
          >
            <q-icon name="las la-cubes" size="65px" />
            <div class="q-mt-sm">
              供货商管理
            </div>
          </div>
          <div
            class="col-md-3 col-12 q-py-xl text-center cursor-pointer box"
            style="border:1px dashed #b2b2b2"
            @click="$router.push({ name: 'client' })"
          >
            <q-icon name="las la-user-astronaut" size="65px" />
            <div class="q-mt-sm">
              客户管理
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'erp',
  data () {
    return {
      search: '',
      list: [
        { text: '商品管理', pathName: 'manage' },
        { text: '客户管理', pathName: 'client' },
        { text: '供货商管理', pathName: 'supplier' },
        { text: '购货（退货）', pathName: 'erpIn' },
        { text: '销货（退货）', pathName: 'sale' },
        { text: '商品库存', pathName: 'erpNumber' },
        { text: '库存盘点', pathName: 'erpChange' },
        { text: '收款单', pathName: 'erpRepayment' },
        { text: '付款单', pathName: 'erpPayment' }
      ],
      erpTotal: {},
      warningRules: [],
      selectStoreData: [],
      libInStoreList: []
    }
  },
  mounted () {
    this.getErpTotal()
    this.getWarningRules()
  },
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    jump (name) {
      this.$router.push({ name: name })
    },
    getErpTotal () {
      this.$store
        .dispatch('erpnumber/getTotal', {
          selectStoreData: this.selectStoreData
        })
        .then((res) => {
          if (res.code == 200) {
            this.erpTotal = res.data ? res.data : {}
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
    getWarningRules () {
      this.$store
        .dispatch('warningRules/getData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.warningRules = res.data
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
    getWarningTotal (id) {
      const obj = {
        id: id
      }
      this.$store
        .dispatch('erpnumber/getWarningRules', obj)
        .then((res) => {
          if (res.code == 200) {
            this.erpTotal.warningNumberCount = res.data ? res.data.warningNumberCount : 0
            this.erpTotal.warningTimeCount = res.data ? res.data.warningTimeCount : 0
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
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>

<style>
.change:hover {
  color: darkcyan;
}
.box:hover {
  background: #f2f2f2;
}
</style>
