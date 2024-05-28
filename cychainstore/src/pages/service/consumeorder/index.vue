<template>
  <q-page class="fit row ">
    <div class="col-shrink col-xs-9 col-sm-10 col-md-10 col-lg-10 col-xl-10">
      <q-card flat>
        <q-tabs v-model="tab" dense class="text-grey" active-color="positive" indicator-color="positive" align="left" narrow-indicator>
          <q-tab name="all" label="全部" @click="getList()" />
          <div v-if="deskTypeList.length > 0" class="row">
            <div v-for="(item, key) in deskTypeList" :key="key">
              <q-tab :name="key" :label="item.dt_name" @click="getList(item.id)" />
            </div>
          </div>
        </q-tabs>
      </q-card>
      <q-separator />
      <div v-if="deskData.length > 0" class=" fit">
        <q-scroll-area class="full-height row">
          <div class="row q-pb-xl">
            <div v-for="(item, key) in deskData" :key="key" class="col-4 col-sm-3 col-md-2  q-pa-sm">
              <q-card
                @click="selectDesk(item)"
                @dblclick="dblclickDesk(item)"
                flat
                bordered
                :class="{ 'bg-positive ': currentDeskId == item.id }"
                class="text-subtitle1 text-left text-grey-8 full-height cursor-pointer"
              >
                <q-card-section class="text-center q-mb-md">
                  <div class="text-h6">{{ item.dp_name }}</div>
                </q-card-section>
                <div class="absolute-bottom text-subtitle2 text-center bg-grey-1">
                  <div class="text-subtitle2" v-if="item.orderLink">{{ item.orderLink.dol_people_number }}人</div>
                  <div v-else>
                    <q-badge color="orange" v-if="item.dp_status == 1">未开台</q-badge>
                    <q-badge color="green" v-if="item.dp_status == 2">已开台</q-badge>
                    <q-badge color="blue" v-if="item.dp_status == 3">已下单</q-badge>
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </q-scroll-area>
      </div>
    </div>
    <div class="col-shrink col-xs-3 col-sm-2 col-md-2 col-lg-2 col-xl-2">
      <div class=" fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md bg-grey-2 row">
          <div class="col-6 text-center q-pa-xs">
            <q-btn color="white" unelevated text-color="positive" icon="las la-undo-alt" class="full-width" @click="getDeskTypeList()" label="刷新" />
          </div>
          <div class="col-6 text-center q-pa-xs">
            <q-btn
              color="cyan-9"
              unelevated
              icon="las la-share-square"
              @click="showPeopleNumber(currentDeskId)"
              class="full-width"
              label="开台"
              :disable="currentDeskId && parseInt(currentDeskData.dp_status) == 1 ? false : true"
            />
          </div>
          <div class="col-6 text-center q-pa-xs">
            <q-btn
              color="teal"
              unelevated
              icon="las la-book-open"
              class="full-width"
              label="加单"
              :to="{
                name: 'addOrder',
                query: {
                  id: currentDeskId,
                },
              }"
              :disable="currentDeskId && parseInt(currentDeskData.dp_status) > 1 ? false : true"
            />
          </div>
          <div class="col-6 text-center q-pa-xs">
            <q-btn
              color="negative"
              :disable="currentDeskId && parseInt(currentDeskData.dp_status) > 1 ? false : true"
              unelevated
              icon="las la-cash-register"
              class="full-width"
              label="结账"
              @click="settlementOrder"
            />
          </div>
        </div>
        <div class="col-shrink bg-white full-height">
          <div class=" fit column no-wrap justify-between items-stretch content-stretch no-scroll">
            <div class="col-shrink bg-white q-px-xs q-pb-xs ">
              <q-item class="full-width q-px-sm">
                <q-item-section>{{ currentDeskData.dp_name }}</q-item-section>
                <q-item-section class="text-caption" v-if="currentDeskData.orderLink">
                  {{ $q_date.formatDate(currentDeskData.orderLink.created_at * 1000, 'YYYY-MM-DD HH:mm') }}
                </q-item-section>
              </q-item>
            </div>
            <div class="col-shrink bg-white full-height bg-grey-1">
              <q-scroll-area class="fit" v-if="carListData && carListData.length > 0">
                <q-item dense separator>
                  <q-item-section>
                    <q-item-label overline>菜品</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>数量</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>金额</q-item-label>
                  </q-item-section>
                </q-item>
                <q-list dense separator>
                  <q-item :key="key" v-for="(item, key) in carListData">
                    <q-item-section>
                      <q-item-label lines="2" class="text-dark" overline> {{ item.doc_food_name }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label lines="1" class="text-dark" caption>{{ item.doc_quantity }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label lines="2" class="text-dark" caption>{{ item.doc_subtotal_amount }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </div>

            <div class="col-shrink bg-white q-px-xs q-py-xs  row justify-evenly text-center text-h6 items-center" v-if="currentDeskData.orderLink">
              <div class="col-6">
                菜品金额
              </div>
              <div class="col-6 text-negative">
                <span class="text-caption">¥</span> {{ formatAmount(currentDeskData.orderLink.dol_total_amount) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <people-number ref="peopleNumberRef" v-if="peopleNumberPoppupStatus" @dataList="hideNowPage" />
    <order-settle ref="orderSettleRef" v-if="orderSettleRefStatus" @closeDialog="closeSettleDialog" @paySuccessCallBack="paySuccessCallBack" />
  </q-page>
</template>
<script>
import PeopleNumber from './PeopleNumber'
import OrderSettle from './OrderSettle'
export default {
  name: 'consumeOrder',
  components: { PeopleNumber, OrderSettle },
  data () {
    return {
      peopleNumberPoppupStatus: false,
      tab: 'all',
      totalAmount: 0,
      deskTypeList: [],
      deskData: [],
      currentDeskId: 0,
      currentDeskData: {},
      carListData: [],
      orderCheckout: false,
      orderSettleRefStatus: false
    }
  },
  mounted () {},
  created () {
    this.getDeskTypeList()
  },
  computed: {},
  methods: {
    getDeskTypeList () {
      this.$store
        .dispatch('desk/getTypeList')
        .then((res) => {
          if (res.code == 200) {
            this.deskTypeList = res.data ? res.data : []
            if (this.deskTypeList.length > 0) {
              this.getList()
            }
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
    getList (val) {
      const params = {
        deskType: val
      }
      this.$store
        .dispatch('consumeorder/getDeskList', params)
        .then((res) => {
          if (res.code == 200) {
            this.deskData = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    showPeopleNumber (id) {
      this.peopleNumberPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.peopleNumberRef.init(id)
      })
    },
    hideNowPage () {
      this.peopleNumberPoppupStatus = false
    },
    selectDesk (item) {
      if (item.id > 0) {
        const params = {
          deskId: item.id
        }
        this.$store
          .dispatch('consumeorder/getDeskCarList', params)
          .then((res) => {
            if (res.code == 200) {
              this.currentDeskId = item.id
              this.currentDeskData = item
              if (this.currentDeskData.orderLink) {
                this.totalAmount = this.currentDeskData.orderLink.dol_total_amount
              }
              this.carListData = res.data ? res.data : []
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    settlementOrder () {
      if (this.carListData.length <= 0) {
        this.$q.notify({
          message: '该桌位无下单菜品',
          icon: 'ion-close-circle-outline',
          color: 'red',
          position: 'top-right'
        })
        return false
      }
      this.orderSettleRefStatus = true
      this.$nextTick(() => {
        this.$refs.orderSettleRef.init(this.currentDeskId, this.deskData.dp_name)
      })
    },
    paySuccessCallBack () {
      this.orderSettleRefStatus = false
      this.getList()
    },
    dblclickDesk (item) {
      if (parseInt(item.dp_status) == 1) {
        this.showPeopleNumber(item.id)
      } else if (parseInt(item.dp_status) == 2 || parseInt(item.dp_status) == 3) {
        this.$router.push({
          name: 'addOrder',
          query: {
            id: item.id
          }
        })
      }
    },
    closeSettleDialog () {
      this.orderSettleRefStatus = false
    }
  }
}
</script>
