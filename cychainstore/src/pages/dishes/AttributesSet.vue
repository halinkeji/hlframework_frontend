<template>
  <div class="fit bg-white q-pa-sm">
    <q-card flat bordered>
      <q-list>
        <q-item>
          <q-item-section>
            是否启用属性
          </q-item-section>
          <q-item-section side> <q-btn unelevated color="primary" @click="addSpecification()" :disable="mainStoreDisable" label="新增属性" /></q-item-section>
        </q-item>
      </q-list>
      <q-separator />
      <div class="row full-width q-col-gutter-sm q-mt-sm">
        <div class="col-3" v-for="(item, key) in specMain" :key="key">
          <q-card flat bordered>
            <q-item class="q-mt-sm">
              <q-item-section>
                <q-input outlined dense :disable="mainStoreDisable" bottom-slots label="属性名称" v-model="item.fsm_name"> </q-input>
              </q-item-section>

              <q-item-section side class="q-mb-md">
                <q-btn unelevated :disable="mainStoreDisable" color="primary" @click="addSubSpecification(key)" label="添加子属性" />
              </q-item-section>
              <q-item-section side class="q-mb-md">
                <q-btn unelevated :disable="mainStoreDisable" color="red" dense @click="deleteSpecification(item, key)" icon="las la-trash-alt" round />
              </q-item-section>
            </q-item>
            <q-separator />

            <q-card-section class="q-pa-xs">
              <q-item v-for="(i, k) in item.sonItem" :key="k">
                <q-item-section>
                  <q-input outlined bottom-slots :disable="mainStoreDisable" label="子属性名称" dense v-model="i.fss_name"> </q-input>
                </q-item-section>
                <q-item-section side class="q-mb-md">
                  <q-btn unelevated color="red" :disable="mainStoreDisable" dense icon="las la-trash-alt" round @click="deleteSpecificationSum(i, key, k)" />
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card>

    <q-card flat bordered class="q-mt-sm">
      <q-list>
        <q-item>
          <q-item-section>
            是否启用限时限购
          </q-item-section>
          <q-item-section side>
            <q-checkbox true-value="1" :disable="mainStoreDisable" false-value="0" v-model="dishesData.fl_is_limit_time" />
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator />
      <q-card-section>
        <q-item v-for="(item, key) in limitTimeDiscount" :key="key">
          <q-item-section avatar>
            <q-input outlined readonly dense v-model="item.tld_time_start" bottom-slots label="开始时间">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time :disable="mainStoreDisable" v-model="item.tld_time_start" mask="HH:mm" format24h>
                      <div class="row i-center justify-end">
                        <q-btn v-close-popup label="关闭" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>
          <q-item-section avatar class="items-center q-mb-md">
            <q-item-label class="text-center">至</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-input outlined readonly dense v-model="item.tld_time_end" label="结束时间" bottom-slots>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy :disable="mainStoreDisable" transition-show="scale" transition-hide="scale">
                    <q-time v-model="item.tld_time_end" mask="HH:mm" format24h>
                      <div class="row i-center justify-end">
                        <q-btn v-close-popup label="关闭" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item-section>

          <q-item-section>
            <q-input
              outlined
              dense
              :disable="mainStoreDisable"
              v-model="item.tld_limit_quantity"
              :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入时间段内限制数量']"
            >
              <template v-slot:prepend>
                <span class="text-subtitle2 q-mr-xs">时间段内限制数量</span>
                <q-separator dark color="grey" class="q-ml-sm" vertical />
              </template>
            </q-input>
          </q-item-section>

          <q-item-section>
            <q-input outlined dense :disable="mainStoreDisable" v-model="item.tld_discount_price" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入时间段内价格']">
              <template v-slot:prepend>
                <span class="text-subtitle2 q-mr-xs">时间段内价格</span>
                <q-separator dark color="grey" class="q-ml-sm" vertical />
              </template>
            </q-input>
          </q-item-section>

          <q-item-section side top>
            <q-btn unelevated :disable="mainStoreDisable" color="red" @click="delRule(item, key)" label="删除" />
          </q-item-section>
        </q-item>

        <div class="q-mt-sm">
          <q-btn unelevated v-if="!mainStoreDisable" color="primary" @click="addRule" label="新增规则" :disable="dishesData.fl_is_limit_time == 1 ? false : true" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'AttributesSet',
  components: {},
  props: {},
  data () {
    return {
      specMain: [],
      dishesData: {
        fl_is_limit_time: '0'
      },
      limitTimeDiscount: []
    }
  },
  created () {},
  mounted () {},
  computed: {
    mainStoreDisable () {
      // 默认可以正常编辑
      // 总部权限可以编辑
      // 自己添加的可以编辑
      const acccountInfo = LocalStorage.getItem('cychainstore_account_info')
      if (parseInt(acccountInfo.lib_id) == parseInt(acccountInfo.store_id)) {
        return false
      } else if (parseInt(acccountInfo.store_id) == parseInt(this.dishesData.store_id)) {
        return false
      } else {
        if (this.dishesData && this.dishesData.id) {
          return true
        } else {
          return false
        }
      }
    }
  },
  methods: {
    setCurrentDishes (value) {
      this.dishesData = value
      if (value && value.fl_limit_set && value.fl_limit_set.length > 0) {
        this.limitTimeDiscount = value.fl_limit_set
      }
    },
    setCurrentSpecification (value) {
      if (value && value.length > 0) {
        this.specMain = value
        this.$emit('setAttributesData', this.specMain)
      }
    },

    // 新增属性方法
    addSpecification () {
      this.specMain.push({
        fsm_name: '',
        fsm_multiple: '1',
        fsm_required: '1',
        sonItem: []
      })
      this.$emit('setAttributesData', this.specMain)
    },
    // 新增子属性方法
    addSubSpecification (key) {
      this.specMain[key].sonItem.push({
        fss_name: '',
        fss_code: '',
        fss_price: ''
      })
      this.$emit('setAttributesData', this.specMain)
    },
    // 删除属性方法
    deleteSpecification (item, key) {
      this.specMain.splice(key, 1)
      this.$emit('setAttributesData', this.specMain)
    },
    // 删除子属性方法
    deleteSpecificationSum (i, key, k) {
      this.specMain[key].sonItem.splice(k, 1)
      this.$emit('setAttributesData', this.specMain)
    },
    addRule () {
      this.limitTimeDiscount.push({
        tld_time_start: '',
        tld_time_end: '',
        tld_limit_quantity: '',
        tld_discount_price: ''
      })
    },
    delRule (item, key) {
      this.limitTimeDiscount.splice(key, 1)
    }
  }
}
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
