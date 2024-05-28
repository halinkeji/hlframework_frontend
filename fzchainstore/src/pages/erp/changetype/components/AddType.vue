<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: dialogWidth,
      }"
    >
      <q-card-section class="row items-center">
        <div class="text-subtitle2">{{ buyerData.id > 0 ? '修改调整状态信息' : '新增调整状态信息' }}</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-py-none">
        <q-form ref="buyerDataRef">
          <q-select
            outlined
            dense
            v-model="buyerData.ect_status"
            :options="statusRadio"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            label="状态"
            bottom-slots
          />

          <q-input
            outlined
            dense
            v-model="buyerData.ect_name"
            label="调整状态名称"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '请填写名称']"
          />
          <q-select
            outlined
            v-model="buyerData.ect_type"
            :options="options"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            dense
            label="请选择调整状态类型"
            bottom-slots
          />

          <q-input outlined type="textarea"  bottom-slots dense :rows="2" v-model="buyerData.ect_note" label="说明" />
        </q-form>
      </q-card-section>

      <q-card-actions align="center" >
        <q-btn unelevated label="确认" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
        <q-btn unelevated label="关闭" class="q-ml-sm q-px-xl" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddType',
  data () {
    return {
      buyerData: {
        ect_name: '',
        ect_type: '1',
        ect_note: '',
        ect_status: '1'
      },
      options: [
        {
          label: '增加（+）',
          value: '1'
        },
        {
          label: '减少（-）',
          value: '2'
        }
      ],
      statusRadio: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '0' }
      ],
      dialogWidth: '1020px',
      showDialog: true,
      addButtonDisabled: false
    }
  },
  created () {},
  methods: {
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.buyerData.id = id
        this.$store
          .dispatch('erpChangeType/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.buyerData = res.data
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
    setData () {
      this.$refs.buyerDataRef.validate().then((success) => {
        if (success) {
          const data = {
            ...this.buyerData
          }
          this.$store
            .dispatch('erpChangeType/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.buyerData.id > 0 ? '修改' : '新增'}` + '调整状态信息成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.addButtonDisabled = true
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: error.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
              }
              this.showDialog = false
            })
            .catch((error) => {})
        }
      })
    },
    // 隐藏调整状态信息弹窗
    hideNowPage () {
      this.buyerData.id = ''
      this.buyerData.ect_name = ''
      this.buyerData.ect_note = ''
      this.buyerData.ect_type = ''
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
