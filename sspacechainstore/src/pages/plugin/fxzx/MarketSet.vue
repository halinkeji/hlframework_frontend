<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  full-height bg-white q-mt-xs">
        <q-scroll-area class="fit full-height">
          <q-card flat>
          <q-card-section>
            <div class="text-subtitle1">分佣设置</div>
          </q-card-section>
          <q-separator />
        </q-card>
          <div class="row q-px-md q-py-sm">
            <div>参与分销：</div>
            <div>
              <q-radio dense class="q-mr-lg" v-model="fxzxSetData.fgs_is_fxzx" val="-1" label="不参与" />
              <q-radio dense v-model="fxzxSetData.fgs_is_fxzx" val="1" label="参与" />
              <div class="q-mt-sm text-caption text-grey" v-if="parseInt(fxzxSetData.fgs_is_fxzx) == -1">
                如果不参与分销，则不产生分销佣金
              </div>
            </div>
          </div>
          <div class="row q-pt-sm q-px-md q-py-sm" v-if="parseInt(fxzxSetData.fgs_is_fxzx) == 1">
            <div>佣金设置：</div>
            <div class="col-8">
              <q-radio dense class="q-mr-lg" v-model="fxzxSetData.fgs_amount_type" val="1" label="系统设置" />
              <q-radio dense v-model="fxzxSetData.fgs_amount_type" val="2" label="按商品设置佣金" />
              <div class="q-mt-sm text-caption text-grey" v-if="parseInt(fxzxSetData.fgs_amount_type) == 1">
                系统设置：读取【分销等级】分佣比进行分佣 。
              </div>
              <div class="q-mt-sm" v-if="parseInt(fxzxSetData.fgs_amount_type) == 2">
                <div class="text-caption text-grey">
                  佣金比例=（商品价格*商品件数）*佣金比例 佣金比例数值请填写 0.1-99.9之间； 当设置为0时,佣金为0。
                </div>
                <div class="text-caption text-grey">固定佣金=（商品件数*固定佣金）</div>
              </div>
              <q-card flat bordered v-if="parseInt(fxzxSetData.fgs_amount_type) == 2">
                <div class="row col-12 items-center q-pa-md">
                  <div class="col-3">批量设置：</div>
                  <div class="col row">
                    <div class="col-4 row">
                      <q-select dense outlined class="col-6 q-pr-sm" v-model="oneFxzxType" emit-value map-options :options="typeOptions"> </q-select>
                      <q-input
                        outlined
                        class="col-5"
                        v-model="oneFxzxProportion"
                        dense
                        v-if="parseInt(oneFxzxType) == 1"
                        :rules="[(val) => /^(\d+|\d+\.\d{1})$/.test(val) && parseFloat(val) <= 99.9 && parseFloat(val) > 0]"
                      >
                        <q-separator vertical />
                        <template v-slot:append>
                          <q-btn flat color="primary" size="12px" dense icon="check" @click="setFxzxAmount(1)" />
                        </template>
                      </q-input>
                      <q-input outlined class="col-5" v-model="oneFxzxAmount" dense v-else>
                        <q-separator vertical />
                        <template v-slot:append>
                          <q-btn flat color="primary" size="12px" dense icon="check" @click="setFxzxAmount(1)" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-4 row">
                      <q-select dense outlined class="col-6 q-pr-sm" v-model="twoFxzxType" emit-value map-options :options="typeOptions"> </q-select>
                      <q-input outlined class="col-5" v-model="twoFxzxProportion" dense v-if="parseInt(twoFxzxType) == 1">
                        <q-separator vertical />
                        <template v-slot:append>
                          <q-btn flat color="primary" size="12px" dense icon="check" @click="setFxzxAmount(2)" />
                        </template>
                      </q-input>
                      <q-input outlined class="col-5" v-model="twoFxzxAmount" dense v-else>
                        <q-separator vertical />
                        <template v-slot:append>
                          <q-btn flat color="primary" size="12px" dense icon="check" @click="setFxzxAmount(2)" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-4 row">
                      <q-select dense outlined class="col-6 q-pr-sm" v-model="threeFxzxType" emit-value map-options :options="typeOptions">
                      </q-select>
                      <q-input outlined class="col-5" v-model="threeFxzxProportion" dense v-if="parseInt(threeFxzxType) == 1">
                        <q-separator vertical />
                        <template v-slot:append>
                          <q-btn flat color="primary" size="12px" dense icon="check" @click="setFxzxAmount(3)" />
                        </template>
                      </q-input>
                      <q-input outlined class="col-5" v-model="threeFxzxAmount" dense v-else>
                        <q-separator vertical />
                        <template v-slot:append>
                          <q-btn flat color="primary" size="12px" dense icon="check" @click="setFxzxAmount(3)" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
                <q-separator />
                <div class="row col-12 q-mt-md q-pa-md">
                  <div class="col-3"></div>
                  <div class="col row">
                    <div class="col-4">一级分销商</div>
                    <div class="col-4">二级分销商</div>
                    <div class="col-4">三级分销商</div>
                  </div>
                </div>
                <q-separator />
                <div class="" separator v-if="fxzxAmountData.length > 0">
                  <div v-for="(item, key) in fxzxAmountData" class="" :key="key">
                    <div class="row col-12 items-center q-pa-md">
                      <div class="col-3 items-center row">{{ item.levelName }}</div>
                      <div class="col row">
                        <div class="col-4 row">
                          <q-select
                            dense
                            outlined
                            class="col-6 q-pr-sm"
                            v-model="item.fgm_one_fxzx_type"
                            emit-value
                            map-options
                            :options="typeOptions"
                          >
                          </q-select>
                          <q-input outlined class="col-5" v-model="item.fgm_one_proportion" dense v-if="parseInt(item.fgm_one_fxzx_type) == 1">
                            <q-separator vertical />
                            <template v-slot:append>
                              <span class="text-caption q-pr-xs q-pl-sm">%</span>
                            </template>
                          </q-input>
                          <q-input outlined class="col-5" v-model="item.fgm_one_amount" dense v-else>
                            <q-separator vertical />
                            <template v-slot:append>
                              <span class="text-caption q-px-xs">{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                            </template>
                          </q-input>
                        </div>
                        <div class="col-4 row">
                          <q-select
                            dense
                            outlined
                            class="col-6 q-pr-sm"
                            v-model="item.fgm_two_fxzx_type"
                            emit-value
                            map-options
                            :options="typeOptions"
                          >
                          </q-select>
                          <q-input outlined class="col-5" v-model="item.fgm_two_proportion" dense v-if="parseInt(item.fgm_two_fxzx_type) == 1">
                            <q-separator vertical />
                            <template v-slot:append>
                              <span class="text-caption q-pr-xs q-pl-sm">%</span>
                            </template>
                          </q-input>
                          <q-input outlined class="col-5" v-model="item.fgm_two_amount" dense v-else>
                            <q-separator vertical />
                            <template v-slot:append>
                              <span class="text-caption q-px-xs">{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                            </template>
                          </q-input>
                        </div>
                        <div class="col-4 row">
                          <q-select
                            dense
                            outlined
                            class="col-6 q-pr-sm"
                            v-model="item.fgm_three_fxzx_type"
                            emit-value
                            map-options
                            :options="typeOptions"
                          >
                          </q-select>
                          <q-input outlined class="col-5" v-model="item.fgm_three_proportion" dense v-if="parseInt(item.fgm_three_fxzx_type) == 1">
                            <q-separator vertical />
                            <template v-slot:append>
                              <span class="text-caption q-pr-xs q-pl-sm">%</span>
                            </template>
                          </q-input>
                          <q-input outlined class="col-5" v-model="item.fgm_three_amount" dense v-else>
                            <q-separator vertical />
                            <template v-slot:append>
                              <span class="text-caption q-px-xs">{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </div>
                    <q-separator />
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white text-center q-gutter-sm q-pb-md q-mt-xs">
        <q-btn unelevated color="primary" :disable="disabledStatus" class="q-px-xl" @click="setData">保存</q-btn>
        <q-btn unelevated color="grey" class="q-px-xl" label="返回" :to="{ name: 'manage' }" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FxzxSet',
  props: {
    goods: {
      type: String,
      default: null
    }
  },
  components: {},
  data () {
    return {
      disabledStatus: false,
      oneFxzxType: '1',
      twoFxzxType: '1',
      threeFxzxType: '1',
      oneFxzxProportion: '',
      twoFxzxProportion: '',
      threeFxzxProportion: '',
      oneFxzxAmount: '',
      twoFxzxAmount: '',
      threeFxzxAmount: '',
      fxzxSetData: {
        fgs_goods_id: '',
        fgs_is_fxzx: '-1',
        fgs_amount_type: '1'
      },
      levelData: {},
      fxzxLevelList: [],
      fxzxAmountData: [],
      typeOptions: [
        { label: '佣金比例', value: '1' },
        { label: '固定佣金', value: '2' }
      ]
    }
  },
  created () {
    this.init(this.goods)
    this.getFxzxGoodsAmountData()
    this.fxzxSetData.fgs_goods_id = this.goods
  },
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('fxzx/getFxzxItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              if (res.data.id > 0) {
                this.fxzxSetData = res.data
              }
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
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    getFxzxGoodsAmountData () {
      const data = {
        goods: this.goods
      }
      this.$store
        .dispatch('fxzx/getFxzxGoodsAmountData', data)
        .then((res) => {
          if (res.code == 200) {
            this.fxzxAmountData = res.data ? res.data : []
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
    setData () {
      this.disabledStatus = true
      const data = {
        ...this.fxzxSetData,
        fxzxAmountData: this.fxzxAmountData
      }
      this.$store
        .dispatch('fxzx/setFxzxData', data)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '保存成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.$router.push({ name: 'manage' })
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.disabledStatus = false
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

    setFxzxAmount (data) {
      if (this.fxzxAmountData.length > 0) {
        const that = this
        if (data == 1) {
          this.fxzxAmountData.forEach(function (value, index, array) {
            value.fgm_one_fxzx_type = that.oneFxzxType
            value.fgm_one_proportion = that.oneFxzxProportion
            value.fgm_one_amount = that.oneFxzxAmount
          })
        } else if (data == 2) {
          this.fxzxAmountData.forEach(function (value, index, array) {
            value.fgm_two_fxzx_type = that.twoFxzxType
            value.fgm_two_proportion = that.twoFxzxProportion
            value.fgm_two_amount = that.twoFxzxAmount
          })
        } else if (data == 3) {
          this.fxzxAmountData.forEach(function (value, index, array) {
            value.fgm_three_fxzx_type = that.threeFxzxType
            value.fgm_three_proportion = that.threeFxzxProportion
            value.fgm_three_amount = that.threeFxzxAmount
          })
        }
      }
    }
  }
}
</script>
