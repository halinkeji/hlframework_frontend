<template>
  <div class="fit bg-white q-pa-sm row q-col-gutter-sm">
     <div class="col-4" v-for="(item, key) in specMain" :key="key">
        <q-card flat bordered>
          <q-item class="q-mt-sm">
            <q-item-section>
              <q-input :disable="mainStoreDisable" outlined dense bottom-slots label="规格名称" v-model="item.fsm_name"> </q-input>
            </q-item-section>
            <q-item-section side class="q-mb-md">
               <q-btn color="primary" label="选择原料" unelevated />
            </q-item-section>

          </q-item>
          <q-separator />

          <q-card-section class="q-pa-none">
            <div v-for="(i, k) in item.sonItem" :key="k">
              <q-separator v-if="k > 0" />

              <q-item class="bg-grey-3">
                <q-item-section>
                  <q-input outlined bottom-slots disable label="子规格名称" dense v-model="i.fss_name"> </q-input>
                </q-item-section>
                <q-item-section>
                  <q-input
                    outlined
                    bottom-slots
                    label="规格单价"
                    dense
                    :disable="mainStoreDisable"
                    v-model="i.fss_price"
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入规格单价']"
                  >
                    <template v-slot:append>
                      <span class="text-dark text-caption">{{
                        $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span>
                    </template>
                  </q-input>
                </q-item-section>

                <q-item-section>
                  <q-input
                    outlined
                    bottom-slots
                    label="入库单价"
                    dense
                    :disable="mainStoreDisable"
                    v-model="i.fss_purchase_price"
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入入库单价']"
                  >
                    <template v-slot:append>
                      <span class="text-dark text-caption">{{
                        $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span>
                    </template>
                  </q-input>
                </q-item-section>

              </q-item>

            </div>
          </q-card-section>
        </q-card>
      </div>
  </div>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'AttributesSet',
  components: {},
  props: ['specMain'],
  data () {
    return {

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

  }
}
</script>
