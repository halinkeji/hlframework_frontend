<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="showDialog">
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
        class="q-pa-sm "
      >
        <q-card-section class="row  q-pa-nane">
          <span style="font-size: 18px">借还明细</span>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
       <div class="q-mt-sm" v-if="invoiceData.oilTurnOut.length > 0">
          <q-table
            title="借出记录"
            :data="invoiceData.oilTurnOut"
            :columns="oilTurnOutData"
            row-key="name"
            flat
            hide-bottom
            bordered
            :pagination="{
              rowsPerPage: 0,
            }"
            separator="vertical"
          />
        </div>
        <div class="q-mt-sm" v-if="invoiceData.oilTurnInOut.length > 0">
          <q-table
            title="取回记录"
            :data="invoiceData.oilTurnInOut"
            :columns="oilTurnInOutData"
            row-key="name"
            flat
            hide-bottom
            bordered
            :pagination="{
              rowsPerPage: 0,
            }"
            separator="vertical"
          />
        </div>

      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'OutDetail',
  data () {
    return {
      invoiceData: {
        oilTurnOut: [],
        oilTurnInOut: []
      },
      dialogWidth: '1000px',
      gridOptions: {},
      oilTurnOutData: [
        {
          label: '油品',
          align: 'center',
          field: 'oid_oilName'
        },
        {
          align: 'center',
          label: '吨数',
          field: 'oid_tonCount'
        },
        {
          label: '升数',
          align: 'center',
          field: 'oid_literCount'
          // format: this.formatStatus
        },
        {
          label: '密度',
          align: 'center',
          field: 'oid_density'
          // format: this.formatTime
        },
        {
          label: '单价',
          align: 'center',
          field: 'oid_price'
        },
        {
          align: 'center',
          label: '小计金额',
          field: 'oid_totalPrice'
        },
        {
          align: 'center',
          label: '备注',
          field: 'oid_note'
        }
      ],
      oilTurnInData: [
        {
          label: '油品',
          align: 'center',
          field: 'oid_oilName'
        },
        {
          align: 'center',
          label: '吨数',
          field: 'oid_tonCount'
        },
        {
          label: '升数',
          align: 'center',
          field: 'oid_literCount'
          // format: this.formatStatus
        },
        {
          label: '密度',
          align: 'center',
          field: 'oid_density'
          // format: this.formatTime
        },
        {
          label: '单价',
          align: 'center',
          field: 'oid_price'
        },
        {
          align: 'center',
          label: '小计金额',
          field: 'oid_totalPrice'
        },
        {
          align: 'center',
          label: '备注',
          field: 'oid_note'
        }
      ],

      oilTurnInOutData: [
        {
          label: '油品',
          align: 'center',
          field: 'oid_oilName'
        },
        {
          align: 'center',
          label: '吨数',
          field: 'oid_tonCount'
        },
        {
          label: '升数',
          align: 'center',
          field: 'oid_literCount'
          // format: this.formatStatus
        },
        {
          label: '密度',
          align: 'center',
          field: 'oid_density'
          // format: this.formatTime
        },
        {
          label: '单价',
          align: 'center',
          field: 'oid_price'
        },
        {
          align: 'center',
          label: '小计金额',
          field: 'oid_totalPrice'
        },
        {
          align: 'center',
          label: '备注',
          field: 'oid_note'
        }
      ],
      oilDetailData: [],
      localeText: this.$ag_grid_localeText,
      context: '',
      showDialog: true
    }
  },
  created () {},
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.8) + 'px'
    }
  },
  methods: {
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('turnoil/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.invoiceData = res.data
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
          .catch((err) => {})
      }
    },
    formatTime (val) {
      if (!val) {
        return ''
      } else {
        return this.$q_date.formatDate(val * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    // 隐藏弹窗
    hideNowPage () {
      this.$emit('dataList')
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 1000
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 784
      }
      return parseInt(nowWidth * px)
    }
  }
}
</script>
