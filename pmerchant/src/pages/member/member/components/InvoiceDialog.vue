<template>
  <q-dialog v-model="dialogStatus">
    <q-card
      :style="{
        width: $q.screen.width * 0.9 + 'px',
        'min-width': $q.screen.width * 0.9 + 'px',
        height: $q.screen.height * 0.8 + 'px',
        'min-height': $q.screen.height * 0.8 + 'px',
      }"
      flat
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs">
          <div class="text-subtitle1">查看单据</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="closeDialog" />
        </div>
        <div class="col-shrink full-height">
          <invoice-data :mPmerchantId="m_pmerchant_id" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import InvoiceData from 'pages/set/invoice/index'
export default {
  name: 'InvoiceDialog',
  components: {
    InvoiceData
  },
  data () {
    return {
      dialogStatus: false,
      m_pmerchant_id: '',
      cardPackDataList: [],
      currentMemberId: 0
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
    },

    closeDialog () {
      this.dialogStatus = false
      this.$nextTick(() => {
        this.$emit('closeDialog')
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
