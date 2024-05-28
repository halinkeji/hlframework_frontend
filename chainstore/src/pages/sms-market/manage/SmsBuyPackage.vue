<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-xs text-subtitle2 q-pb-md">
      <div class="row q-gutter-sm">
        <div class="col-12 col-md-2">
          <q-input outlined dense label="指定日期" v-model="ctime" readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="ctime" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-2">
          <q-select
            outlined
            v-model="orderStatus"
            :options="[
              { label: '有效', value: 1 },
              { label: '失效', value: 2 },
            ]"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            dense
            clearable
            label="请选择订单状态"
          />
        </div>

        <q-btn color="primary" unelevated label="搜索" @click="getBuySmsInvoiceList" />
        <q-btn color="warning" unelevated label="重置" @click="resetSearch" />
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height">
      <q-scroll-area class="fit">
        <q-markup-table class="q-mt-sm" separator="cell" flat bordered>
          <thead>
            <tr>
              <th class="text-center">套餐包名称</th>
              <th class="text-center">实付金额</th>
              <th class="text-center">购买时间</th>
              <th class="text-center">总条数</th>
              <th class="text-center">剩余量（条）</th>
              <th class="text-center">状态</th>
              <th class="text-center">失效时间</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="key" v-for="(item, key) in smsLibBuyRecord">
              <td class="text-center">{{ item.lbr_package_name }}</td>

              <td class="text-center">{{ item.lbr_real_amount }}</td>
              <td class="text-center">{{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD HH:mm') }}</td>

              <td class="text-center">{{ item.lbr_buy_quantity }}</td>
              <td class="text-center">{{ item.lbr_last_quantity }}</td>
              <td class="text-center">
                <q-badge color="negative" v-if="currentTimestamp > item.lbr_end_time"> 失效 </q-badge>
                <q-badge color="positive" v-else> 有效 </q-badge>
              </td>
              <td class="text-center">
                {{ $q_date.formatDate(item.lbr_end_time * 1000, 'YYYY-MM-DD HH:mm') }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-scroll-area>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.page"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.pageTotal"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmsBuyRecord',
  components: {},
  data () {
    return {
      page: {
        page: 1,
        pSize: 20,
        pageTotal: 0
      },
      orderStatus: '',
      ctime: '',
      smsLibBuyRecord: [],
      currentTimestamp: 0
    }
  },
  created () {
    this.currentTimestamp = parseInt(new Date().getTime() / 1000)
  },
  computed: {},
  beforeMount () {},
  mounted () {
    this.context = this
    this.getBuySmsInvoiceList()
  },
  methods: {
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getBuySmsInvoiceList()
    },

    currentChangeHandle (val) {
      this.page.page = val
      this.getBuySmsInvoiceList()
    },
    resetSearch () {
      this.orderStatus = ''
      this.ctime = ''
      this.$nextTick(() => {
        this.getBuySmsInvoiceList()
      })
    },
    getBuySmsInvoiceList () {
      const obj = {
        page: this.page.page,
        pSize: this.page.pSize,
        ctime: this.ctime,
        order_no: this.order_no
      }
      this.$store
        .dispatch('smsMarket/getSmsLibBuyRecordDataList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.smsLibBuyRecord = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
