<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
        class="q-pa-sm "
      >
        <q-card-section class="row q-pa-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <div class="row text-h6 q-px-md">
          单据详情
        </div>
        <div class="row q-my-sm q-px-md">
          <div class="col-md-3 col-12" v-if="invoiceData.invoice">消费单据号：{{ invoiceData.invoice.sc_invoiceCode }}</div>
          <div class="col-md-3 col-12">会员姓名：{{ invoiceData.pbo_real_name }}</div>
          <div class="col-md-3 col-12">会员手机号：{{ invoiceData.pbo_mobile }}</div>
          <div class="col-md-3 col-12">备注：{{ invoiceData.pbo_remark }}</div>
        </div>
        <q-separator class="q-mt-md" />
        <div class="q-mt-sm" v-if="invoiceData.memberRechargeCountDetail.length > 0">
          <q-table
            title="次卡详情"
            :data="invoiceData.memberRechargeCountDetail"
            :columns="consumeCountData"
            row-key="name"
            hide-bottom
            flat
            bordered
            :pagination="{
              rowsPerPage: 0,
            }"
            separator="vertical"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="mrc_goodsName" :props="props">
                  <div>
                    {{ props.row.mrc_goodsName }}
                  </div>
                </q-td>
                <q-td key="mrc_count" :props="props">
                  <div>
                    {{ props.row.mrc_count }}
                  </div>
                </q-td>
                <q-td key="mrc_counts" :props="props">
                  {{ props.row.countDetail.mrc_count }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="q-mt-sm" v-if="invoiceData.rechargeTimeDetail.length > 0">
          <q-table
            title="时卡详情"
            :data="invoiceData.rechargeTimeDetail"
            :columns="rechargeTimeData"
            row-key="name"
            hide-bottom
            flat
            bordered
            :pagination="{
              rowsPerPage: 0,
            }"
            separator="vertical"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="rtd_goods_name" :props="props">
                  <div>{{ props.row.rtd_goods_name }}-{{ props.row.rtd_spe_name ? props.row.rtd_spe_name : '' }}</div>
                </q-td>
                <q-td key="rtd_duration_total" :props="props">
                  <div>
                    {{ props.row.rtd_duration_total }}
                  </div>
                </q-td>
                <q-td key="rtd_duration_totals" :props="props">
                  {{ props.row.timeDetail.mtr_duration }}
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
  data () {
    return {
      pagination: {
        rowsPerPage: 0
      },
      dialogWidth: '1000px',
      couponsListData: [],
      viewDetails: false,
      invoiceData: {
        memberRechargeCountDetail: [],
        rechargeTimeDetail: []
      },
      // 货款详情
      payMentData: [
        {
          name: 'title',
          label: '项目名称',
          align: 'left',
          field: (row) => row.title,
          required: true,
          format: (val) => `${val}`
        },
        {
          name: 'cmd_type_name',
          label: '项目类型',
          align: 'left',
          field: 'cmd_type_name'
        },
        {
          name: 'cmd_memberreceivetime',
          label: '生效时间',
          align: 'left',
          field: 'cmd_memberreceivetime'
        },
        {
          name: 'cmd_activityendtime',
          label: '到期时间',
          align: 'left',
          field: 'cmd_activityendtime'
        }
      ],
      rechargeTimeData: [
        {
          label: '时卡项目',
          align: 'center',
          field: 'rtd_goods_name',
          style: 'max-width: 150px',
          classes: 'ellipsis',
          name: 'rtd_goods_name',
          format: (val, row) => {
            return row.rtd_goods_name + (row.rtd_spe_name ? row.rtd_spe_name : '')
          }
        },
        {
          label: '时长',
          align: 'center',
          field: 'rtd_duration_total',
          name: 'rtd_duration_total'
        },
        {
          label: '剩余时长',
          align: 'center',
          field: 'timeDetail.mtr_duration',
          name: 'rtd_duration_totals'
        }
      ],
      // 计次详情
      consumeCountData: [
        {
          label: '消费项目',
          align: 'center',
          field: 'mrc_goodsName',
          style: 'max-width: 150px',
          classes: 'ellipsis',
          name: 'mrc_goodsName',
          format: (val, row) => {
            return row.mrc_goodsName + (row.mrc_speName ? row.mrc_speName : '')
          }
        },
        {
          label: '次数',
          align: 'center',
          field: 'mrc_count',
          name: 'mrc_count'
        },
        {
          label: '剩余次数',
          align: 'center',
          field: 'countDetail.mrc_count',
          name: 'mrc_counts'
        }
      ]
    }
  },
  components: {},
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.6) + 'px'
    }
  },

  computed: {},
  methods: {
    getViewData (val) {
      this.viewDetails = true
      if (val > 0) {
        const obj = {
          id: val
        }
        this.$store
          .dispatch('bmtk/getInvoiceView', obj)
          .then((res) => {
            if (res.code == 200) {
              this.invoiceData = res.data ? res.data : []
            }
          })
          .catch((error) => {})
      }
    },

    hideNowPage () {
      this.couponsListData = []
      this.viewDetails = false
    }
  }
}
</script>
