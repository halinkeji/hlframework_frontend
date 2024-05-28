<template>
  <q-page class="fit bg-white">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll ">
      <div class="row fit">
        <div class="col-2">
          <q-card flat bordered>
            <q-card-section horizontal>
              <q-btn color="grey" class="q-ma-sm" :to="{ name: 'partnerManageIndex' }" unelevated label="返回"
            /></q-card-section>
            <q-item>
              <q-item-section avatar>
                <q-avatar size="75px">
                  <q-icon name="person" size="80px" color="light-blue-2 "></q-icon>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <span class="text-text-subtitle1"> {{ partnerData.ppi_partner_name }}</span>

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
            <q-card-actions vertical class="text-text-subtitle1 text-center">
              <div class="row" v-if="partnerData.level">
                <div class="col-6">
                  <span class=""> 合伙人级别： </span>
                </div>
                <div class="col-6">
                  <span class="text-text-subtitle1"> {{ partnerData.level.ppl_name }} </span>
                </div>
              </div>
              <div class="row" v-if="partnerData.ppi_type != 'partner'">
                <div class="col-6">
                  <span class=""> 会员： </span>
                </div>
                <div class="col-6">
                  <span class="text-text-subtitle1"> {{ partnerTotalData.memberNumberTotal }}人 </span>
                </div>
              </div>
              <div class="row">
                <div class="col-6">可提现金额： </div>
                <div class="col-6">
                  {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                  }}{{ formatAmount(partnerData.ppi_total_partner_amount - partnerData.ppi_take_partner_amount) }}
                </div>
              </div>
              <div class="row">
                <div class="col-6">分红收益： </div>
                <div class="col-6">
                  {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                  }}{{ partnerTotalData.incomeTotal ? partnerTotalData.incomeTotal : 0.0 }}
                </div>
              </div>
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-10">
          <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll ">
            <div class="col-shrink bg-white q-px-xs q-pb-sm">
              <q-tabs
                v-model="activeName"
                class="bg-white q-ml-sm"
                active-color="primary"
                indicator-color="primary"
                align="left"
                content-class="text-grey-9"
                narrow-indicator
                dense
              >
                <q-tab name="income" label="收益明细"> </q-tab>
                <q-tab name="member" label="会员" v-if="partnerData.ppi_type != 'partner'"> </q-tab>
                <!-- <q-tab name="money" label="提现记录"> </q-tab> -->
              </q-tabs>
            </div>

            <div class="col-shrink  full-height bg-grey-2" v-if="activeName == 'income'">
              <income-list :partnerid="partnerid"></income-list>
            </div>
            <div class="col-shrink  full-height bg-grey-2" v-if="activeName == 'member'">
              <member-list-link :partnerid="partnerid" @getInfo="getPartnerInfo"></member-list-link>
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
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    authorityMeta (key) {
      return true
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
