<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        推商设置
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white">
        <q-scroll-area class="fit full-height">
          <q-form ref="marketingConfigRef" class="row">
            <div class="col-6 q-px-xs">
              <q-list bordered separator>
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label>是否开启推商功能</q-item-label>
                    <q-item-label caption>关闭后该功能不可使用</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-toggle v-model="configData.pmc_status" true-value="1" false-value="0" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label>开户成功</q-item-label>
                    <q-item-label caption>被邀请商家开户通过审核即为达标</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-checkbox v-model="configData.pmc_meet_one" disable true-value="1" false-value="0" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label>发生一笔交易</q-item-label>
                    <q-item-label caption>被邀请商家发生第一笔交易后即为达标</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-checkbox v-model="configData.pmc_meet_two" true-value="1" false-value="0" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label>交易金额满</q-item-label>
                    <q-item-label caption>被邀请商家交易金额满足条件后即为达标</q-item-label>
                  </q-item-section>

                  <q-item-section v-if="configData.pmc_meet_three == 1">
                    <q-input outlined v-model="configData.pmc_meet_sell_amount" dense>
                      <template v-slot:prepend>
                        <div class="text-subtitle2 text-dark">满</div>
                      </template>

                      <template v-slot:append>
                        <div class="text-subtitle2 text-dark">元</div>
                      </template>
                    </q-input>
                  </q-item-section>

                  <q-item-section side>
                    <q-checkbox v-model="configData.pmc_meet_three" true-value="1" false-value="0" />
                  </q-item-section>
                </q-item>
              </q-list>

              <hl-editor
                @change="
                  (v) => {
                    configData.pmc_caption = v;
                  }
                "
                :content="configData.pmc_caption"
                :minHeight="$q.screen.height * 0.4"
                titleText="推商说明"
              ></hl-editor>
            </div>
            <div class="col-6 q-px-xs">
              <q-list bordered separator>
                <q-item>
                  <q-item-section>
                    <q-item-label>代理商最低提现金额</q-item-label>
                    <q-item-label caption>符合代理商类型的用户进行提现操作时必须大于最低金额</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-input
                      v-model="configData.pmc_daili_min_withdraw"
                      standout
                      dense
                      outlined
                      label="金额"
                      :rules="[(val) => (val ? /^\+?[0-9][0-9]*$/.test(val) : true || '请输入正整数')]"
                    >
                    </q-input>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>商户最低提现金额</q-item-label>
                    <q-item-label caption>符合商户类型的用户进行提现操作时必须大于最低金额</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-input
                      v-model="configData.pmc_store_min_withdraw"
                      standout
                      dense
                      outlined
                      label="金额"
                      :rules="[(val) => (val ? /^\+?[0-9][0-9]*$/.test(val) : true || '请输入正整数')]"
                    >
                    </q-input>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>员工最低提现金额</q-item-label>
                    <q-item-label caption>符合员工类型的用户进行提现操作时必须大于最低金额</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-input
                      v-model="configData.pmc_user_min_withdraw"
                      standout
                      dense
                      outlined
                      label="金额"
                      :rules="[(val) => (val ? /^\+?[0-9][0-9]*$/.test(val) : true || '请输入正整数')]"
                    >
                    </q-input>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>提现费率</q-item-label>
                    <q-item-label caption>提现时所扣除的费率.设置区间：0.01 - 100%</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-input
                      v-model="configData.pmc_service_fee"
                      standout
                      dense
                      outlined
                      label="费率"
                      :rules="[
                        (val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0 && val <= 100 : true) || '请输入正确的数值',
                      ]"
                    >
                    </q-input>
                  </q-item-section>
                </q-item>
              </q-list>

              <hl-upload
                :multiple="false"
                :currentAttach="configData.coverImage"
                @input="
                  (val) => {
                    $nextTick(() => {
                      configData.pmc_share_cover = val;
                    });
                  }
                "
                currentDescription="建议尺寸比例1:1"
                currentTitle="分享封面图"
              />
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
        <q-btn class="q-px-xl" unelevated label="保存" @click="saveData" color="primary" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'marketingConfig',
  components: {},
  data () {
    return {
      configData: {
        pmc_meet_one: '1',
        pmc_meet_two: '0',
        pmc_meet_three: '0',
        pmc_meet_sell_amount: '',
        pmc_caption: '',
        pmc_status: '0',

        pmc_share_cover: '0',
        pmc_daili_min_withdraw: '0',
        pmc_user_min_withdraw: '0',
        pmc_store_min_withdraw: '0',
        pmc_service_fee: '0'
      }
    }
  },
  mounted () {},
  created () {
    this.getItem()
  },
  computed: {},
  methods: {
    // 获取单条
    getItem () {
      this.$store.dispatch('marketingManage/getMarketingConfig').then((res) => {
        if (res.code == 200 && res.data) {
          this.configData = res.data
        }
      })
    },
    // 提交
    saveData () {
      this.$refs.marketingConfigRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.configData
          }
          this.$store
            .dispatch('marketingManage/setMarketingConfig', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '修改信息成功',
                  color: 'green'
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
        }
      })
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
