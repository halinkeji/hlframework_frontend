<template>
  <q-page class="fit">
    <div class="fit row no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-1">
        <q-tabs v-model="jfmallTab" class="text-grey" vertical active-color="primary" indicator-color="primary">
          <q-tab name="set" icon="las la-cog" label="基础设置" />
          <q-tab name="order" icon="las la-file-alt" label="订单设置" />
          <q-tab name="delivery" icon="las la-dolly-flatbed" label="配送设置" />
          <q-tab name="freight" icon="las la-truck" label="运费模板" />
          <q-tab name="pay" icon="las la-shopping-bag" label="消费设置" />
          <q-tab name="message" icon="las la-comment-alt" label="通知设置" />
          <q-tab name="afterSale" icon="las la-user-astronaut" label="客服设置" />
          <q-tab name="ad" icon="las la-images" label="广告设置" />
           <q-tab name="messageManage" icon="lar la-newspaper" label="信息管理" />
        </q-tabs>
      </div>
      <div class="col-11 full-height bg-grey-2 q-mt-xs">
        <div class="fit" v-if="jfmallTab == 'set'">
          <set />
        </div>
        <div class="fit" v-if="jfmallTab == 'order'">
          <order />
        </div>
        <div class="fit" v-if="jfmallTab == 'delivery'">
          <delivery />
        </div>
         <div class="fit" v-if="jfmallTab == 'freight'">
          <freight-template />
        </div>
        <div class="fit" v-if="jfmallTab == 'pay'">
          <pay />
        </div>
        <div class="fit" v-if="jfmallTab == 'message'">
          <message />
        </div>

        <div class="fit" v-if="jfmallTab == 'afterSale'">
          <after-sale />
        </div>
        <div class="fit" v-if="jfmallTab == 'ad'">
          <ad-index />
        </div>
        <div class="fit" v-if="jfmallTab == 'messageManage'">
          <message-manage />
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import Set from './Set.vue'
import Message from './Message.vue'
import Delivery from './Delivery.vue'
import Pay from './Pay.vue'
import AfterSale from './AfterSale.vue'
import Order from './Order.vue'
import AdIndex from '../jfad/index.vue'
import MessageManage from '../message/index.vue'
import freightTemplate from '../freight/index.vue'
export default {
  name: 'jfmallSetting',
  components: {
    Set,
    Order,
    Message,
    Delivery,
    Pay,
    AfterSale,
    AdIndex,
    MessageManage,
    freightTemplate
  },
  data () {
    return {
      jfmallTab: 'set'
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
