<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.3 + 'px',
        'min-width': this.$q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">
          菜品备注
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-input outlined dense v-model="doc_remarks" placeholder="请输入菜品备注" type="textarea" />
      </q-card-section>
      <q-card-section  class="text-center q-gutter-sm">
        <q-btn unelevated label="确定" class="q-px-xl" :disable="addButtonDisabled" color="positive" @click="setCarData" />
        <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'Remarks',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      doc_remarks: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (value) {
      this.doc_remarks = value || ''
    },
    setCarData () {
      this.showDialog = false

      this.$emit('saveRemarks', this.doc_remarks)
    },
    hideNowPage () {
      this.showDialog = false
      this.$emit('dataList')
    }
  }
}
</script>
