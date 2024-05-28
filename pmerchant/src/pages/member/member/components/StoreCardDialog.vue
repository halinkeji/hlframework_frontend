<template>
  <q-dialog v-model="dialogStatus">
    <q-card
      :style="{
        width: $q.screen.width * 0.5 + 'px',
        'min-width': $q.screen.width * 0.5 + 'px',
        height: $q.screen.height * 0.8 + 'px',
        'min-height': $q.screen.height * 0.8 + 'px',
      }"
      flat
      class="fit bg-grey-2"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-pa-xs q-py-sm row items-center">
          <div class="text-subtitle2">会员卡包</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeDialog" />
        </div>

        <div ref="goodsDataRef" class="col-shrink bg-white full-height q-mt-xs">
          <q-scroll-area class="fit full-height">
            <q-card-section class="row q-col-gutter-sm">
              <div class="col-4" v-for="(item, key) in cardPackDataList">
                <q-card class="my-card" flat bordered>
                  <q-card-section horizontal>
                    <q-card-section class="q-pt-xs">
                      <div class="text-overline">{{ item.store && item.store.name ? item.store.name : '' }}</div>
                      <div class="text-subtitle2 q-mt-sm q-mb-xs">{{ item.mem_memberName }}</div>

                      <div class="text-caption q-mt-sm q-mb-xs">
                        卡号: <span class="text-blue-9">{{ item.mem_memberCardNum }}</span>
                      </div>
                    </q-card-section>
                  </q-card-section>

                  <q-separator />
                  <q-item>
                    <q-item-section>
                      <q-item-label>{{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss') }}</q-item-label>
                      <q-item-label caption lines="2">开卡时间</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-right">
                        <q-badge color="blue">
                          {{ item.memberLevel && item.memberLevel.id ? item.memberLevel.mcl_level_name : '' }}
                        </q-badge>
                      </q-item-label>
                      <q-item-label caption lines="2"  class="text-right">级别</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator />

                  <q-card-actions>
                    <div class="row q-col-gutter-sm items-center text-caption text-blue-9 full-width">
                      <div class="col text-center">
                        <div class="q-py-sm">
                          <div class="text-h6 text-bold">
                            {{ formatAmount(item.mem_memberMoneyCount) }}
                          </div>
                          {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit }}
                        </div>
                      </div>
                      <div class="col text-center">
                        <div class="q-py-sm">
                          <div class="text-h6 text-bold">
                            {{ formatAmount(item.mem_memberPointsCount) }}
                          </div>
                          {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}
                        </div>
                      </div>
                      <div class="col text-center">
                        <div class="q-py-sm">
                          <div class="text-h6 text-bold">
                            {{ formatAmount(item.couponCount) }}
                          </div>
                          卡券
                        </div>
                      </div>
                    </div>
                  </q-card-actions>
                </q-card>
              </div>
            </q-card-section>
          </q-scroll-area>
        </div>

        <div class="col-shrink bg-white q-pb-md q-mt-xs">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pSize"
            :total="page.totalCount"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'StoreCardDialog',
  data () {
    return {
      dialogStatus: false,
      pmerchant_member_id: '',
      cardPackDataList: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      }
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    init (m_pmerchant_id) {
      this.dialogStatus = true
      this.m_pmerchant_id = m_pmerchant_id

      this.$nextTick(() => {
        this.getListCardData()
      })
    },
    getListCardData () {
      this.$store
        .dispatch('member/getMemberCardPackData', {
          pmerchant_member_id: this.m_pmerchant_id,
          pSize: this.page.pSize,
          page: this.page.pageIndex
        })
        .then((res) => {
          if (res.code == 200) {
            this.cardPackDataList = res.data && res.data.list ? res.data.list : []
            this.page.totalCount = res.data && res.data.page ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },

    closeDialog () {
      this.dialogStatus = false
      this.$nextTick(() => {
        this.$emit('closeDialog')
      })
    },

    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getListCardData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getListCardData()
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
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
<style scoped></style>
