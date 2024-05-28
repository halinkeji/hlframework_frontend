<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll ">
      <div class="row fit">
        <div class="col-3">
          <q-card  flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-avatar size="75px">
                  <q-icon name="person" size="80px" color="light-blue-2 "></q-icon>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <span class="text-h6"> {{ partnerData.ppi_partner_name }}</span>

                  <q-chip outline color="primary" text-color="white">
                    <span v-if="partnerData.ppi_type == 'member'">
                      会员合伙人
                    </span>
                    <span v-if="partnerData.ppi_type == 'staff'">
                      员工合伙人
                    </span>
                    <span v-if="partnerData.ppi_type == 'partner'">
                      股东合伙人
                    </span>
                  </q-chip>
                </q-item-label>
                <q-item-label caption>
                  <q-icon name="phone" size="25px" color="light-blue-2 "></q-icon>
                  {{ partnerData.ppi_member_mobile }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
            <q-card-actions vertical class="text-h6 text-center">
              <div class="row ">
                <div class="col-6">
                  <span class="">
                    客户
                  </span>
                </div>
                <div class="col-6 ">
                  <span class="text-h6"> {{ partnerTotalData.memberNumberTotal }}人 </span>
                </div>
              </div>
              <div class="row ">
                <div class="col-6 ">
                  可提现金额
                </div>
                <div class="col-6 ">
                  {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneySymbol }}0.00
                </div>
              </div>
              <div class="row ">
                <div class="col-6 ">
                  佣金收益
                </div>
                <div class="col-6 ">{{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ partnerTotalData.incomeTotal }}</div>
              </div>
            </q-card-actions>
            <q-card-section horizontal> <q-btn color="grey" class="q-ma-sm" :to="{ name: 'partner' }"  unelevated label="返回"/></q-card-section>
          </q-card>
        </div>
        <div class="col-9">
          <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
            <div class="col-shrink bg-white q-px-xs q-pb-md">
              <q-tabs v-model="activeName" class="bg-white q-ml-sm" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense>
                <q-tab name="income" label="收益明细"> </q-tab>
                <q-tab name="member" label="客户"> </q-tab>
                <!-- <q-tab name="money" label="提现记录"> </q-tab> -->
              </q-tabs>
            </div>

            <div class="col-shrink q-pa-sm full-height bg-grey-2" v-if="activeName == 'income'">
              <income-list :partnerid="partnerid"></income-list>
            </div>
            <div class="col-shrink q-pa-sm full-height bg-grey-2" v-if="activeName == 'member'">
              <member-list-link :partnerid="partnerid"></member-list-link>
            </div>
            <div class="col-shrink q-pa-sm full-height bg-grey-2" v-if="activeName == 'money'">
              <money-list :partnerid="partnerid"></money-list>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import IncomeList from './IncomeList.vue'
import MemberListLink from './MemberListLink.vue'
import MoneyList from './MoneyList.vue'
export default {
  name: 'PartnerInfo',
  components: { IncomeList, MoneyList, MemberListLink },
  data () {
    return {
      activeName: 'income',
      partnerid: 0,
      partnerData: {},
      partnerTotalData: {}
    }
  },
  computed: {},
  created () {
    this.partnerid = this.$route.query.id
    this.getPartnerInfo()
    this.getPartnerTotal()
  },
  mounted () {},
  methods: {
    getPartnerInfo () {
      const id = this.$route.query.id
      this.$store.dispatch('partner/getMemberItem', id).then((res) => {
        if (res.data) {
          this.partnerData = res.data
        }
      })
    },
    getPartnerTotal () {
      const id = this.$route.query.id
      this.$store.dispatch('partner/getMemberTotal', id).then((res) => {
        if (res.data) {
          this.partnerTotalData = res.data
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

<style></style>
