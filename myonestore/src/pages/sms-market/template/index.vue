<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        模板设置
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white">
        <q-scroll-area class="fit full-height">
          <div class="row q-col-gutter-sm q-px-sm q-mt-sm">
            <div class="col-3" :key="`k-${key}`" v-for="(item, key) in smsTemplateData">
              <q-card style="height: 280px">
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-primary text-weight-bold"> {{ item.st_name }} </q-item-label>
                    <q-item-label class="text-caption"> {{ item.st_template_text }} </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-card-section>
                  <q-item-label> 使用位置 </q-item-label>
                  <div class="row q-gutter-sm">
                    <div v-for="(i, k) in item.st_use_arr" :key="`k-${key + k}`">
                      <q-checkbox v-model="i.status" :label="i.lable" :value="i.value" :true-value="1" :false-value="0" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
        <q-btn class="q-px-xl" unelevated label="提交" @click="setSmsTemplateDataList" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'smsMarketTemplate',
  components: {},
  data () {
    return {
      smsTemplateData: [],
      currentLibId: 0
    }
  },
  created () {
    if (LocalStorage.getItem('myonestore_account_info')) {
      const headerLocalInfo = LocalStorage.getItem('myonestore_account_info')
      if (headerLocalInfo && headerLocalInfo.lib_id) {
        this.currentLibId = headerLocalInfo.lib_id
        this.$nextTick(() => {
          this.getSmsTemplateDataList()
        })
      }
    }
  },
  computed: {},
  beforeMount () {},
  mounted () {},
  methods: {
    getSmsTemplateDataList () {
      const obj = {
        current_lib_id: this.currentLibId
      }
      this.$store
        .dispatch('smsMarket/getSmsTemplateDataList', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.smsTemplateData = res.data
          }
        })
        .catch((error) => {})
    },
    setSmsTemplateDataList () {
      const obj = {
        current_lib_id: this.currentLibId,
        smsTemplateData: this.smsTemplateData
      }
      this.$store
        .dispatch('smsMarket/setSmsTemplateDataList', obj)
        .then((res) => {
          if (res.code == 200) {
            // 订单购买成功
            this.$q.notify({
              message: '成功',
              caption: '保存成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
          } else {
            // 订单失效
            this.$q.notify({
              message: '错误',
              caption: '保存错误',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          // 订单失效
          this.$q.notify({
            message: '保存错误',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'center'
          })
        })
    }
  }
}
</script>
