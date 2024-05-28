<template>
  <q-dialog v-model="checkDialogStatus">
    <q-card
      :style="{
        width: $q.screen.width * 0.3 + 'px',
        'min-width': $q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section> 审核卡券 </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form ref="dialogForm">
          <q-list separator bordered>
            <q-item>
              <q-item-section>
                <q-item-label> 卡券名称 </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label class="text-h6 text-primary">
                  {{ marketItem.cou_title }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="marketItem.pc_service_money && marketItem.pc_market_quantity">
              <q-item-section>
                <q-item-label> 商家推广数量 </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label class="text-h6 text-primary"> {{ formatAmount(marketItem.pc_market_quantity) }} 张 </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="marketItem.pc_service_money && marketItem.pc_market_quantity">
              <q-item-section>
                <q-item-label> 商家推广费 </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label class="text-h6 text-primary"> {{ formatAmount(marketItem.pc_service_money) }} 元 </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="marketItem.pc_service_money && marketItem.pc_market_quantity">
              <q-item-section>
                <q-item-label> 商家推广单价（参考） </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label class="text-h6 text-primary">
                  {{ formatAmount(marketItem.pc_service_money / marketItem.pc_market_quantity) }} 元
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="marketItem.pc_service_money && marketItem.pc_market_quantity">
              <q-input
                outlined
                dense
                class="full-width"
                v-model="marketOneMoney"
                :rules="[(val) => /^[0-9]+\.?[0-9]{0,2}$/.test(val) || '请输入正确的金额']"
                label="平台推广单价"
              >
                <template v-slot:append>
                  <div class="text-subtitle2 text-black">元 / 张</div>
                </template>
              </q-input>
            </q-item>
          </q-list>
        </q-form>
      </q-card-section>
      <q-separator />
      <!-- 确定将标题为${this.params.data.cou_title}的卡券通过审核并生成服务费记录吗 -->
      <q-card-section class="text-center q-gutter-sm">
        <q-btn label="保存" unelevated @click="changeCouponStatus" class="q-px-xl" color="primary" />
        <q-btn label="关闭" unelevated color="grey" @click="closeDialog" class="q-px-xl" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AgOperating',
  data () {
    return {
      checkDialogStatus: false,
      marketOneMoney: 0,
      marketId: 0,
      marketItem: {}
    }
  },

  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (marketItem) {
      if (marketItem && marketItem.marketId) {
        this.marketId = marketItem.marketId
        this.marketItem = marketItem
        this.checkDialogStatus = true
      } else {
        this.$q.notify({
          message: '失败',
          caption: '系统错误，请联系管理',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
      }
    },

    changeCouponStatus () {
      this.$refs.dialogForm.validate().then((success) => {
        if (success) {
          this.$store
            .dispatch('hlCoupon/setMarketPass', {
              marketId: this.marketId,
              pc_market_money: this.marketOneMoney
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  color: 'green',
                  message: '成功',
                  caption: '保存成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.closeDialog()
              } else {
                this.$q.notify({
                  message: '失败',
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
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    },
    closeDialog () {
      this.checkDialogStatus = false

      this.$emit('closeDialog')
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
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
