<template>
  <q-dialog v-model="dialogStatus">
    <q-card :style="{
      width:$q.screen.width * 0.6 + 'px',
       'min-width':$q.screen.width * 0.6 + 'px',
       height:$q.screen.height * 0.9 + 'px',
       'min-height':$q.screen.height * 0.9 + 'px',
    }">
     <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
       <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        物流配送
       </div>

        <div class="col-shrink full-height bg-white">
            <q-scroll-area class="fit full-height">
              <q-form ref="wuliuSetForm">
                <q-card-section class="q-pt-none row q-col-gutter-sm">
                  <div class="col-12">
                    <q-item >
                      <q-item-section>
                        <q-item-label top>{{ out_trade_no }}</q-item-label>
                        <q-item-label caption>订单号</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-select
                        outlined
                        dense
                        :rules="[(val) => !!val || '请选择配送渠道']"
                        v-model="channelValue"
                        option-label="label"
                        option-value="value"
                        :options="wuliuChannel"
                        map-options
                        emit-value
                        label="选择配送渠道"
                        @input="changeChannel"
                      >
                        </q-select>
                      </q-item-section>
                      <q-item-section v-if="expressTypeData && expressTypeData.length > 0">
                        <q-select
                        outlined
                        dense
                        :rules="[(val) => !!val || '请选择快件产品类别']"
                        v-model="expressTypeValue"
                        option-label="label"
                        option-value="value"
                        :options="expressTypeData"
                        map-options
                        emit-value
                        label="选择快件产品类别"
                      >
                        </q-select>
                      </q-item-section>
                    </q-item>

                  </div>
                  <div class="col-6 q-pa-sm">
                    <q-card bordered flat class="bg-grey-3">
                      <q-item-label header>寄送方</q-item-label>
                      <q-item >
                        <q-item-section>
                          <q-item-label>{{ sendUserInfo.contact }}</q-item-label>
                          <q-item-label caption>联系人</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item >
                        <q-item-section>
                          <q-item-label>{{ sendUserInfo.tel }}</q-item-label>
                          <q-item-label caption>联系电话</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item >
                        <q-item-section>
                          <q-item-label>{{ sendUserInfo.province }}{{ sendUserInfo.city }}{{ sendUserInfo.county }}</q-item-label>
                          <q-item-label caption>配送地址</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item >
                        <q-item-section>
                          <q-item-label>{{ sendUserInfo.address }}</q-item-label>
                          <q-item-label caption>详细地址</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-card>

                  </div>
                  <div class="col-6 q-pa-sm">
                    <q-card bordered flat class="bg-grey-3">
                      <q-item-label header>接收方</q-item-label>
                      <q-item >
                        <q-item-section>
                          <q-item-label>{{ incomeUserInfo.contact }}</q-item-label>
                          <q-item-label caption>联系人</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item >
                        <q-item-section>
                          <q-item-label>{{ incomeUserInfo.tel }}</q-item-label>
                          <q-item-label caption>联系电话</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item >
                        <q-item-section>
                          <q-item-label>{{ incomeUserInfo.province }}{{ incomeUserInfo.city }}{{ incomeUserInfo.county }}</q-item-label>
                          <q-item-label caption>配送地址</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item >
                        <q-item-section>
                          <q-item-label>{{ incomeUserInfo.address }}</q-item-label>
                          <q-item-label caption>详细地址</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-card>
                  </div>
                  <div class="col-9 q-pa-sm">
                    <q-card bordered flat class="bg-grey-3">
                      <q-item-label header>商品信息</q-item-label>
                      <q-item :key="key + 'goods'" v-for="(item,key) in goodsList">
                        <q-item-section>
                          <q-item-label>{{ item.name }}/{{ item.unit }}</q-item-label>
                          <q-item-label caption>名称</q-item-label>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-subtitle1 text-weight-bold text-orange">{{ item.count }}</q-item-label>
                          <q-item-label caption>数量 </q-item-label>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-subtitle1 text-weight-bold text-orange"> {{ item.amount }}</q-item-label>
                          <q-item-label caption>金额</q-item-label>
                        </q-item-section>

                        <q-item-section>
                          <q-input outlined label="重量" v-model="item.weight" :rules="[(val) => !!val || '请输入重量']" dense />
                        </q-item-section>
                      </q-item>

                    </q-card>
                  </div>

                </q-card-section>
              </q-form>
            </q-scroll-area>
        </div>

        <div class="col-shrink bg-white q-mt-xs q-py-sm text-center q-gutter-sm">
          <q-btn class="q-px-xl" unelevated label="提交发货订单" @click="saveData" color="primary" />
          <q-btn class="q-px-xl" unelevated label="关闭" @click="closeDialog" color="grey" />
        </div>
       </div>
    </q-card>
  </q-dialog>
</template>
<script>

export default {
  props: {

  },
  watch: {

  },
  data () {
    return {
      dialogStatus: false,

      sendUserInfo: {},
      incomeUserInfo: {},
      goodsList: [],
      wuliuChannel: [],
      out_trade_no: '',
      channelValue: '',
      expressTypeData: [],
      expressTypeValue: '',
      orderId: '',
      type: ''
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {

    init (orderId, type) {
      this.dialogStatus = true
      this.$nextTick(() => {
        this.orderId = orderId
        this.type = type
        this.getWuliuChannel(orderId, type)
      })
    },

    getWuliuChannel (orderId, type) {
      this.apiDialogStatus = false
      const obj = {
        orderId,
        type
      }
      this.$store
        .dispatch('wuliuapi/getCommonData', obj)
        .then((res) => {
          if (res.code == 200) {
            const data = res.data
            this.sendUserInfo = data && data.sendUserInfo ? data.sendUserInfo : {}
            this.incomeUserInfo = data && data.incomeUserInfo ? data.incomeUserInfo : {}
            this.goodsList = data && data.goodsList ? data.goodsList : []
            this.wuliuChannel = data && data.wuliuChannel ? data.wuliuChannel : []
            this.out_trade_no = data && data.out_trade_no ? data.out_trade_no : ''
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
        })
    },

    changeChannel () {
      const that = this
      const wuliuIndex = _.findIndex(that.wuliuChannel, function (o) { return o.value == that.channelValue })
      if (wuliuIndex > -1) {
        const currentWuliu = that.wuliuChannel[wuliuIndex]
        that.expressTypeData = currentWuliu.expressTypeData
      }
    },

    saveData () {
      this.$refs.wuliuSetForm.validate().then(success => {
        if (success) {
          this.$store.dispatch('wuliuapi/creatOrder', {
            channelValue: this.channelValue,
            expressTypeValue: this.expressTypeValue,
            sendUserInfo: this.sendUserInfo,
            incomeUserInfo: this.incomeUserInfo,
            goodsList: this.goodsList,
            out_trade_no: this.out_trade_no,
            order_id: this.orderId,
            type: this.type
          })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '订单出库成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$emit('createOrderSucceed')
              } else {
                this.$q.notify({
                  message: '失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: res.msg,
                  color: 'red'
                })
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
            })
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    },
    closeDialog () {
      this.dialogStatus = false
      this.$emit('closeDialog')
    }

  }
}
</script>
