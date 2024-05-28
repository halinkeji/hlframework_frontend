<template>
  <q-dialog @hide="hideNowPage" v-model="dialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
          <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
          {{ dataId > 0 ? '修改' : '新增' }}运费模板
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-scroll-area class="fit full-height">
            <q-form ref="configDataRef">
              <div class="row">
                <div class="col-12 col-md-7">
                  <span>运费模板 <span class="text-red q-pl-xs">*</span></span>
                  <q-input
                    outlined
                    dense
                    v-model="dataFrom.wft_name"
                    placeholder="请输入运费模板名称"
                    lazy-rules
                    :rules="[(val) => !!val || '运费模板名称不能为空']"
                    maxlength="100"
                  />
                </div>
                <div class="col-12 col-md-7">
                  <span>发货地<span class="text-red q-pl-xs">*</span></span>
                  <hl-address
                    :province="dataFrom.wft_delivery_province"
                    :city="dataFrom.wft_delivery_city"
                    :area="dataFrom.wft_delivery_district"
                    @province="provinceupdate"
                    @city="cityupdate"
                    @area="areaupdate"
                  ></hl-address>
                </div>
                <div class="col-12 col-md-7">
                  <span>详细地址</span>
                  <q-input class="q-pa-xs" outlined maxlength="255" bottom-slots v-model="dataFrom.wft_delivery_address" dense> </q-input>
                </div>
              </div>
              <q-card-section class="q-pa-none">
                <div class="row items-center no-wrap">
                  <div>是否包邮</div>
                </div>
              </q-card-section>

              <div class="col-auto q-gutter-sm">
                <q-radio dense v-model="dataFrom.wft_is_pay_postage" val="1" label="包邮" />
                <q-radio dense v-model="dataFrom.wft_is_pay_postage" val="2" label="自定义运费" />
              </div>
              <div v-if="dataFrom.wft_is_pay_postage == '2'">
                <div class="col-12 q-px-sm row q-mt-xs">
                  <q-input
                    outlined
                    dense
                    v-model="dataFrom.wft_default_quantity"
                    lazy-rules
                    :rules="[(val) => /^[+]{0,1}(\d+)$/.test(val) || '请输入正确件数']"
                  >
                    <template v-slot:before>
                      <span class="text-subtitle2 text-dark">默认运费</span>
                    </template>
                    <template v-slot:after>
                      <span class="text-subtitle2 text-dark">件内</span>
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    dense
                    v-model="dataFrom.wft_default_freight"
                    lazy-rules
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确运费']"
                  >
                    <template v-slot:after>
                      <span class="text-subtitle2 text-dark">{{
                        $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span>
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    dense
                    v-model="dataFrom.wft_continue_quantity"
                    lazy-rules
                    :rules="[(val) => /^[+]{0,1}(\d+)$/.test(val) || '请输入正确件数']"
                  >
                    <template v-slot:before>
                      <span class="text-subtitle2 text-dark">每增加</span>
                    </template>
                    <template v-slot:after>
                      <span class="text-subtitle2 text-dark">件,</span>
                      <span class="text-subtitle2 text-dark">增加运费</span>
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    dense
                    v-model="dataFrom.wft_continue_freight"
                    lazy-rules
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确运费']"
                  >
                    <template v-slot:after>
                      <span class="text-subtitle2 text-dark">{{
                        $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span>
                    </template>
                  </q-input>
                </div>
                <div class="row q-mt-md full-width" v-if="detailFrom.length > 0">
                  <div class="row text-center full-width">
                    <div class="col-1 q-pa-xs">操作</div>
                    <div class="col-3 q-pa-xs">运送到</div>

                    <div class="col-2 q-pa-xs">首件数（件）</div>
                    <div class="col-2 q-pa-xs">
                      首费（{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}）
                    </div>
                    <div class="col-2 q-pa-xs">续件数（件）</div>
                    <div class="col-2 q-pa-xs">
                      续费（{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}）
                    </div>
                  </div>
                  <q-separator />
                  <div class="row full-width text-center" v-for="(item, key) in detailFrom" :key="key">
                    <div class="col-1 q-mt-sm text-center">
                      <q-btn class="text-right" flat color="primary" @click="selectAare(key, item.areaItem)" unelevated>选择地区</q-btn>
                      <q-btn color="red" flat @click="deleteDetail(key)" unelevated>删除</q-btn>
                    </div>
                    <div class="col-3 q-mt-sm">
                      <div class="text-center" v-if="item.areaItem.length < 1">未选择地区</div>
                      {{ item.areaText }}
                    </div>
                    <div class="col-2 q-mt-sm">
                      <q-input
                        class="q-px-sm"
                        outlined
                        dense
                        v-model="item.ftd_first_quantity"
                        lazy-rules
                        :rules="[(val) => /^[+]{0,1}(\d+)$/.test(val) || '请输入正确件数']"
                      />
                    </div>
                    <div class="col-2 q-mt-sm">
                      <q-input
                        class="q-px-sm"
                        outlined
                        dense
                        v-model="item.ftd_first_freight"
                        lazy-rules
                        :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确运费']"
                      >
                      </q-input>
                    </div>
                    <div class="col-2 q-mt-sm">
                      <q-input
                        class="q-px-sm"
                        outlined
                        dense
                        v-model="item.ftd_continue_quantity"
                        lazy-rules
                        :rules="[(val) => /^[+]{0,1}(\d+)$/.test(val) || '请输入正确件数']"
                      >
                      </q-input>
                    </div>
                    <div class="col-2 q-mt-sm">
                      <q-input
                        class="q-px-sm"
                        outlined
                        dense
                        v-model="item.ftd_continue_freight"
                        lazy-rules
                        :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确运费']"
                      >
                      </q-input>
                    </div>
                  </div>
                </div>
                <q-btn color="primary" flat @click="addDetail" unelevated>为指定地区城市设置运费</q-btn>
              </div>
            </q-form>
          </q-scroll-area>
        </div>
        <select-area ref="selectAreaRef" v-if="chooseVisible" @refreshDataList="closeChoose"></select-area>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
          <q-btn unelevated :disable="btnDisable" label="保存" @click="saveData()" color="primary" class="q-px-xl" />
          <q-btn unelevated label="关闭" type="reset" color="grey" class="q-px-xl" @click="hideNowPage" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import SelectArea from './SelectArea'
export default {
  name: 'AddFreight',
  components: { SelectArea },
  data () {
    return {
      chooseVisible: false,
      dataId: 0,
      dataFrom: {
        wft_name: '',
        wft_default_quantity: '',
        wft_default_freight: '',
        wft_continue_quantity: '',
        wft_continue_freight: '',
        wft_delivery_province: '',
        wft_delivery_province_code: '',
        wft_delivery_city: '',
        wft_delivery_city_code: '',
        wft_delivery_district: '',
        wft_delivery_district_code: '',
        wft_delivery_address: '',
        wft_is_pay_postage: '1'
      },
      detailFrom: [],
      mainkey: '',
      btnDisable: false,
      dialogStatus: false
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.dialogStatus = true
      if (id > 0) {
        this.dataId = id
        this.getItem(id)
      }
    },
    getItem (id) {
      if (id > 0) {
        this.$store.dispatch('wxMallFreight/getItem', id).then((res) => {
          if (res.code == 200) {
            this.dataFrom = res.data ? res.data : {}
            this.detailFrom = res.data ? res.data.detailFrom : []
            if (this.detailFrom.length > 0) {
              this.detailFrom.forEach((value, key) => {
                let areaText = ''
                for (let i = 0; i < value.areaItem.length; i++) {
                  areaText += value.areaItem[i].fta_city + ','
                }
                if (areaText.length > 0) {
                  areaText = areaText.substr(0, areaText.length - 1)
                }
                this.detailFrom[key].areaText = areaText
              })
            }
          }
        })
      }
    },
    saveData () {
      this.$refs.configDataRef.validate().then((success) => {
        if (success) {
          this.btnDisable = true
          const obj = {
            ...this.dataFrom,
            id: this.dataId,
            detailFrom: this.detailFrom
          }
          this.$store
            .dispatch('wxMallFreight/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}运费成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.btnDisable = false
                this.hideNowPage()
              } else {
                this.$q.notify({
                  message: '失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: res.message,
                  color: 'red'
                })
                this.btnDisable = false
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
              this.btnDisable = false
            })
        }
      })
    },
    // 关闭
    closeChoose (val) {
      this.chooseVisible = false
      this.detailFrom[this.mainkey].areaItem = val
      this.showAreaItem(val)
    },

    showAreaItem (val) {
      let areaText = ''
      for (let i = 0; i < val.length; i++) {
        areaText += val[i].fta_city + ','
      }
      if (areaText.length > 0) {
        areaText = areaText.substr(0, areaText.length - 1)
      }
      this.detailFrom[this.mainkey].areaText = areaText
    },
    selectAare (key, areaItem) {
      this.mainkey = key
      this.chooseVisible = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.selectAreaRef.selectAreaPage(areaItem)
        }, 500)
      })
    },
    provinceupdate (a) {
      this.dataFrom.wft_delivery_province = a.value
      this.dataFrom.wft_delivery_province_code = a.code
    },

    cityupdate (a) {
      this.dataFrom.wft_delivery_city = a.value
      this.dataFrom.wft_delivery_city_code = a.code
    },

    areaupdate (a) {
      this.dataFrom.wft_delivery_district = a.value
      this.dataFrom.wft_delivery_district_code = a.code
    },
    addDetail () {
      const layoutArray = this.detailFrom
      const newlayout = {
        ftd_first_quantity: '',
        ftd_first_freight: '',
        ftd_continue_quantity: '',
        ftd_continue_freight: '',
        ftd_template_id: '',
        areaItem: []
      }
      layoutArray.push(newlayout)
    },
    deleteDetail (mainKey) {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定删除运费规则吗',
          cancel: true
        })
        .onOk(() => {
          setTimeout(() => {
            this.detailFrom.splice(mainKey, 1)
          }, 100)
        })
    },
    hideNowPage () {
      this.dialogStatus = false
      this.$nextTick(() => {
        this.$emit('closeDialog')
      })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
