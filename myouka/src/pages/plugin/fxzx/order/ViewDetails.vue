<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent>
      <q-card
        :style="{
          width:$q.screen.width * 0.7 + 'px',
          'max-width': $q.screen.width * 0.7 + 'px',
        }"
        class="q-pa-sm "
      >
        <q-card-section class="row q-pa-none">
          <span class="row text-h6 q-px-md">
            分销订单详情
          </span>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <q-card-section>
          <q-item-label class="row q-mt-md">
            <div class="col col-md-3 col-sm-6 col-xs-12">
              单据号:<span class="text-body1">{{ orderData.pfo_invoice_code }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              会员卡号:<span class="text-body1">{{ orderData.pfo_member_card }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              会员姓名:<span class="text-body1">{{ orderData.pfo_member_name }}</span>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              时间:<span class="text-body1">{{ this.$q_date.formatDate(orderData.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
          </q-item-label>
        </q-card-section>
        <div class="q-mt-sm" v-if="orderData.goodsRecord && orderData.goodsRecord.length > 0">
          <q-table
            title="商品详情"
            :data="orderData.goodsRecord"
            :columns="goodsRecordData"
            flat
            hide-bottom
            bordered
            :pagination="{
              rowsPerPage: 0,
            }"
            separator="cell"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="fgr_name" :props="props">
                  <div>{{ props.row.fgr_name }}</div>
                </q-td>
                <q-td key="fgr_selling_price" :props="props">
                  <div>{{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ props.row.fgr_selling_price }}</div>
                </q-td>
                <q-td key="fgr_quantity" :props="props">
                  <div>{{ props.row.fgr_quantity }}</div>
                </q-td>
                <q-td key="fgr_total_amount" :props="props">
                  <div>{{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ props.row.fgr_total_amount }}</div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="q-mt-sm" v-if="orderData.fxzxMemberData && orderData.fxzxMemberData.length > 0">
          <q-table
            title="佣金详情"
            :data="orderData.fxzxMemberData"
            :columns="fxzxRecordData"
            hide-bottom
            flat
            bordered
            :pagination="{
              rowsPerPage: 0,
            }"
            separator="cell"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="fxzxMemberName" :props="props">
                  <div>{{ props.row.fxzxMemberName }}</div>
                </q-td>
                <q-td key="fxzxMemberLevel" :props="props">
                  <div>{{ props.row.fxzxMemberLevel }}</div>
                </q-td>
                <q-td key="fxzxAmount" :props="props">
                  <div>{{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ props.row.fxzxAmount }}</div>
                </q-td>
                <q-td key="fxzxAmountStatus" :props="props">
                  <div>
                    {{ props.row.fxzxAmountStatus }}
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'ViewDetails',
  components: {},
  data () {
    return {
      orderData: {},
      viewDetails: false,
      // 商品详情
      goodsRecordData: [
        {
          label: '商品名称',
          align: 'center',
          field: 'fgr_name',
          name: 'fgr_name'
        },
        {
          align: 'center',
          label: '售价',
          field: 'fgr_selling_price',
          name: 'fgr_selling_price'
        },
        {
          label: '数量',
          align: 'center',
          field: 'fgr_quantity',
          name: 'fgr_quantity'
        },
        {
          label: '小计金额',
          align: 'center',
          field: 'fgr_total_amount',
          name: 'fgr_total_amount'
        }
      ],
      // 分销详情
      fxzxRecordData: [
        {
          label: '分销商姓名',
          align: 'center',
          field: 'fxzxMemberName',
          name: 'fxzxMemberName'
        },
        {
          align: 'center',
          label: '分销商级别',
          field: 'fxzxMemberLevel',
          name: 'fxzxMemberLevel'
        },
        {
          label: '分销佣金',
          align: 'center',
          field: 'fxzxAmount',
          name: 'fxzxAmount'
        },
        {
          label: '佣金状态',
          align: 'center',
          field: 'fxzxAmountStatus',
          name: 'fxzxAmountStatus'
        }
      ],
      // 点单详情
      deskOrderRecord: [
        {
          label: '套餐名称',
          align: 'center',
          field: 'fgr_invoice_id',
          style: 'max-width: 150px',
          classes: 'ellipsis',
          name: 'fgr_invoice_id'
        },
        {
          label: '套餐数量',
          align: 'center',
          field: 'dor_packages_quantity',
          name: 'dor_packages_quantity'
        },
        {
          label: '菜品',
          align: 'center',
          field: 'fl_name',
          style: 'max-width: 150px',
          classes: 'ellipsis',
          name: 'fl_name'
        },
        {
          label: '菜品数量',
          align: 'center',
          field: 'dor_quantity',
          name: 'dor_quantity'
        },
        {
          label: '会员价',
          align: 'center',
          field: 'dor_member_level_price',
          name: 'dor_member_level_price'
        },
        {
          label: '折扣价',
          align: 'center',
          field: 'dor_time_limit_discount_price',
          name: 'dor_time_limit_discount_price'
        },
        {
          label: '售价',
          align: 'center',
          field: 'dor_selling_price',
          name: 'dor_selling_price'
        },
        {
          label: '小计',
          align: 'center',
          field: 'dor_subtotal_amount',
          name: 'dor_subtotal_amount'
        },
        {
          label: '退单总数',
          align: 'center',
          field: 'dor_return_quantity',
          name: 'dor_return_quantity'
        },
        {
          label: '退单总金额',
          align: 'center',
          field: 'dor_return_amount',
          name: 'dor_return_amount'
        }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    amountFrom () {
      return '分销'
    },
    amountStatus () {
      return '增加'
    },

    operate () {
      return '分销所得佣金'
    },
    couponName (val) {
      return val.cou_title
    },

    formatTime (val) {
      if (!val) {
        return ''
      } else {
        return this.$q_date.formatDate(val * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    getViewData (id) {
      this.viewDetails = true
      if (id > 0) {
        const obj = {
          id: id
        }
        this.$store
          .dispatch('fxzx/getFxzxOrderView', obj)
          .then((res) => {
            if (res.code == 200) {
              if (res.data) {
                this.orderData = res.data
              } else {
                this.orderData = []
              }
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
    rowSpan (rows, rowIndexe, field) {
      const fields = [field]
      if (this.orderData && this.orderData.fxzxMemberData && this.orderData.fxzxMemberData.length > 0) {
        const data = this.orderData.fxzxMemberData
        const row = rows
        const rowIndex = rowIndexe
        const property = field
        const cellValue = row[property]
        if (cellValue && fields.includes(property)) {
          const prevRow = data[rowIndex - 1]
          let nextRow = data[rowIndex + 1]
          let countRowspan = 0
          if (prevRow && prevRow[property] === cellValue) {
            return countRowspan
          } else {
            countRowspan = 1
            while (nextRow && nextRow[property] === cellValue) {
              nextRow = data[++countRowspan + rowIndex]
            }

            if (countRowspan > 1) {
              return countRowspan
            }
          }
        }
      }
      return 1
    },
    hideNowPage () {
      this.viewDetails = false
    },
    // 格式化保留小数点后两位数据
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
