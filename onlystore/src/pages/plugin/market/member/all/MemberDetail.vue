<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.7 + 'px',
        'min-width': this.$q.screen.width * 0.7 + 'px',
      }"
      class="q-pa-md q-px-lg"
    >
      <q-card-section class="row items-center q-pa-none q-mb-lg">
        <div class="text-h6">分佣商信息</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div class="text-subtitle1 text-weight-bold">分佣信息</div>
      <q-card-section class="q-pa-sm q-mt-md">
        <div class="row justify-between">
          <div class="q-gutter-y-sm col-3" v-if="memberData.member">
            <div class="text-weight-bold row">
              <div class="col-5 text-right">用户信息</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">昵称</div>
              <div class="col-7">：{{ memberData.member.mem_memberName }}</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">卡号</div>
              <div class="col-7">：{{ memberData.member.mem_memberCardNum }}</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">联系电话</div>
              <div class="col-7">：{{ memberData.member.mem_memberMobile }}</div>
            </div>
            <div class="row" v-if="memberData.member.memberLevel">
              <div class="col-5 text-right">会员等级</div>
              <div class="col-7">：{{ memberData.member.memberLevel.mcl_level_name }}</div>
            </div>
          </div>
          <div class="q-gutter-y-sm col-3">
            <div class="text-weight-bold row">
              <div class="col-5 text-right">分佣商信息</div>
            </div>
            <div class="row" v-if="memberData.level">
              <div class="col-5 text-right">分佣等级</div>
              <div class="col-7 row">
                ：{{ memberData.level.pml_name }}
                <q-btn
                  flat
                  color="primary"
                  dense
                  label="修改"
                  class="q-ml-xs"
                  size="sm"
                  @click="showMarketLevel(memberData.id, memberData.pmm_level_id)"
                />
                <q-btn flat color="primary" dense label="等级变更记录" class="q-ml-xs" size="sm" @click="showMarketLevelRecord(memberData.id)" />
              </div>
            </div>
            <div class="row">
              <div class="col-5 text-right">上级分佣商</div>
              <div class="col-7">
                ：{{ memberData.parentName }}
                <q-btn flat color="primary" dense label="修改" size="sm" @click="showMarketLists(memberData.id, memberData.parentMarketId)" />
              </div>
            </div>
            <div class="row">
              <div class="col-5 text-right">成为分佣商时间</div>
              <div class="col-7">：{{ $q_date.formatDate(memberData.pmm_become_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
          </div>
          <div class="q-gutter-y-sm col-3">
            <div class="text-weight-bold row">
              <div class="col-5 text-right">用户信息</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">
                <q-btn flat color="primary" dense label="全部下级" size="sm" @click="showMarketSonLists(memberData.pmm_member_id)" />
              </div>
              <div class="col-7">：会员总数{{ memberData.sonAllCount }}人 (其中分佣商：{{ memberData.sonMarketAllCount }}人）</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">一级</div>
              <div class="col-7">：会员总数{{ memberData.sonOneCount }}人 (其中分佣商：{{ memberData.sonMarketOneCount }}人）</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">二级</div>
              <div class="col-7">：会员总数{{ memberData.sonTwoCount }}人 (其中分佣商：{{ memberData.sonMarketTwoCount }}人）</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">三级</div>
              <div class="col-7">：会员总数{{ memberData.sonThreeCount }}人 (其中分佣商：{{ memberData.sonMarketThreeCount }}人）</div>
            </div>
          </div>
          <div class="q-gutter-y-sm col-3" v-if="memberData.formFieldName">
            <div class="text-weight-bold row">
              <div class="col-5 text-right">关联表单信息</div>
            </div>

            <div class="row" v-for="(item, key) in memberData.formFieldName" :key="key">
              <div class="col-5 text-right">{{ item.headerName }}</div>
              <div class="col-7">：{{ fieldData[item.field] }}</div>
            </div>
          </div>
        </div>
      </q-card-section>
      <div class="q-mt-lg">
        <div class="text-subtitle1 text-weight-bold">佣金信息</div>
      </div>
      <div class="row justify-between q-mt-lg">
        <div class="col-3 q-pr-sm">
          <q-card flat bordered class="q-pa-lg row">
            <div class="col-4"><q-avatar size="70px" font-size="32px" color="blue-1" text-color="primary" icon="las la-yen-sign" /></div>
            <div>
              <div class="text-weight-bold">累计佣金</div>
              <div class="text-h5 text-weight-bold q-mt-sm">
                {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol
                }}{{ memberData.pmm_total_market_amount }}
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-3 q-px-sm">
          <q-card flat bordered class="q-pa-lg row">
            <div class="col-4"><q-avatar size="70px" font-size="40px" color="green-1" text-color="green" icon="las la-hand-holding-usd" /></div>
            <div>
              <div class="text-weight-bold">已提现佣金</div>
              <div class="text-h5 text-weight-bold q-mt-sm">
                {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol
                }}{{ memberData.pmm_take_market_amount }}
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-3 q-px-sm">
          <q-card flat bordered class="q-pa-lg row">
            <div class="col-4"><q-avatar size="70px" font-size="36px" color="amber-1" text-color="amber" icon="las la-file-invoice-dollar" /></div>
            <div>
              <div class="text-weight-bold">待入账佣金</div>
              <div class="text-h5 text-weight-bold q-mt-sm">
                {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ memberData.waitMarketAmount }}
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-3 q-pl-sm">
          <q-card flat bordered class="q-pa-lg row">
            <div class="col-4"><q-avatar size="70px" font-size="36px" color="blue-1" text-color="primary" icon="las la-file-invoice" /></div>
            <div>
              <div class="text-weight-bold">收益订单</div>
              <div class="text-h5 text-weight-bold q-mt-sm">{{ memberData.recordCount }}</div>
            </div>
          </q-card>
        </div>
      </div>
    </q-card>
    <market-level ref="marketLevelRef" v-if="marketLevelPoppupStatus" @dataList="hideMarketLevelPoppup" />
    <market-level-record ref="marketLevelRecordRef" v-if="marketLevelRecordPoppupStatus" @dataList="hideMarketLevelRecordPoppup" />
    <market-lists ref="marketListsRef" v-if="marketListsPoppupStatus" @dataList="hideMarketListsPoppup" />
    <market-son-lists ref="marketSonListsRef" v-if="marketSonListsPoppupStatus" @dataList="hideMarketSonListsPoppup" />
  </q-dialog>
</template>
<script>
import MarketLevel from './components/MarketLevel'
import MarketLevelRecord from './components/MarketLevelRecord'
import MarketLists from './components/MarketLists'
import MarketSonLists from './components/MarketSonLists'
export default {
  name: 'MarketMemberDetail',
  components: {
    MarketLevel,
    MarketLevelRecord,
    MarketLists,
    MarketSonLists
  },
  data () {
    return {
      marketLevelPoppupStatus: false,
      marketLevelRecordPoppupStatus: false,
      marketListsPoppupStatus: false,
      marketSonListsPoppupStatus: false,
      showDialog: true,
      marketId: '',
      memberData: {},
      fieldData: {}
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true

      if (id > 0) {
        this.marketId = id
        this.$store
          .dispatch('market/getMemberItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.memberData = res.data ? res.data : {}
              this.fieldData = res.data.formFieldData ? res.data.formFieldData : {}
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
    hideNowPage () {
      this.$emit('dataList')
    },
    showMarketLevel (id, levelId) {
      this.marketLevelPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.marketLevelRef.getList(id, levelId)
      })
    },
    showMarketLevelRecord (id) {
      this.marketLevelRecordPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.marketLevelRecordRef.getList(id)
      })
    },
    showMarketLists (id, parentMarketId) {
      this.marketListsPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.marketListsRef.getList(id, parentMarketId)
      })
    },
    showMarketSonLists (id) {
      this.marketSonListsPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.marketSonListsRef.getList(id)
      })
    },
    hideMarketLevelPoppup () {
      this.marketLevelPoppupStatus = false
      this.init(this.marketId)
    },
    hideMarketLevelRecordPoppup () {
      this.marketLevelRecordPoppupStatus = false
      this.init(this.marketId)
    },
    hideMarketListsPoppup () {
      this.marketListsPoppupStatus = false
      this.init(this.marketId)
    },
    hideMarketSonListsPoppup () {
      this.marketSonListsPoppupStatus = false
      this.init(this.marketId)
    }
  }
}
</script>
