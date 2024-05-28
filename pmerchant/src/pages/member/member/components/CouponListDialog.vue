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
        <div class="col-shrink bg-white q-pa-xs q-pb-md row items-center">
          <div class="text-subtitle2">卡券列表</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeDialog" />
        </div>

        <div ref="goodsDataRef" class="col-shrink bg-white full-height q-mt-xs">
          <q-scroll-area class="fit full-height">
            <q-card-section class="row q-col-gutter-sm">
              <div class="col-4" v-for="(item, key) in couponDataList">
                <q-card class="my-card" flat bordered>
                  <q-badge color="blue" floating>
                    {{ couponStatusText[parseInt(item.cmd_status)] }}
                  </q-badge>

                  <q-card-section class="q-pa-sm">
                    <div class="text-overline">{{ item.store && item.store.name ? item.store.name : '' }}</div>

                    <div class="text-subtitle2 q-mt-sm q-mb-xs">{{ item.coupon ? item.coupon.cou_title : '' }}（{{ item.cmd_type_name }}）</div>

                    <div class="text-caption q-mt-sm q-mb-xs">
                      领取时间: <span class="text-blue-9">{{ $q_date.formatDate(item.cmd_memberreceivetime * 1000, 'YYYY-MM-DD  HH:mm:ss') }}</span>
                    </div>

                    <div class="text-caption q-mt-sm q-mb-xs">
                      到期时间: <span class="text-blue-9">{{ $q_date.formatDate(item.cmd_activityendtime * 1000, 'YYYY-MM-DD  HH:mm:ss') }}</span>
                    </div>

                    <div class="text-caption q-mt-sm q-mb-xs">
                      使用时间:
                      <span class="text-blue-9">{{
                        item.cmd_memberusetime ? $q_date.formatDate(item.cmd_memberusetime * 1000, 'YYYY-MM-DD  HH:mm:ss') : '未使用'
                      }}</span>
                    </div>
                  </q-card-section>
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
      m_pmerchant_id: '',
      couponDataList: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      currentMemberId: 0,
      couponStatusText: {
        2: '未使用',
        3: '已使用'
      }
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    init (m_pmerchant_id, currentMemberId) {
      this.dialogStatus = true
      this.m_pmerchant_id = m_pmerchant_id
      this.currentMemberId = currentMemberId

      this.$nextTick(() => {
        this.getListCardData()
      })
    },
    getListCardData () {
      this.$store
        .dispatch('hlCoupon/getUsedCouponList', {
          m_pmerchant_id: this.m_pmerchant_id,
          pSize: this.page.pSize,
          page: this.page.pageIndex
        })
        .then((res) => {
          if (res.code == 200) {
            this.couponDataList = res.data && res.data.list ? res.data.list : []
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
