<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: dialogWidth,
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">{{ buyerData.id > 0 ? '修改采购员信息' : '新增采购员信息' }}</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-py-sm">
        <q-form ref="buyerDataRef">
          <q-select
              outlined
              dense
              v-model="buyerData.ceb_status"
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
            v-model="buyerData.ceb_number"
            label="编号"
            lazy-rules
            :rules="[(val) => /^[0-9a-zA-Z]*$/g.test(val) || '请输入正确的编号']"
          >
          </q-input>
          <q-input
            outlined
            dense
            v-model="buyerData.ceb_name"
            label="采购员名称"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '请填写名称']"
          />
          <q-input
            outlined
            dense
            v-model="buyerData.ceb_telephone"
            label="采购员电话"
            lazy-rules
            :rules="[
              (val) => !!val || '请填写采购员电话',
              (val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '电话号不正确',
            ]"
          />
          <q-input outlined type="textarea" dense :rows="2" v-model="buyerData.ceb_note" label="说明" />

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
  name: 'AddBuyer',
  data () {
    return {
      buyerData: {
        ceb_number: '',
        ceb_name: '',
        ceb_telephone: '',
        ceb_note: '',
        ceb_status: '1'
      },
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
          .dispatch('erpBuyer/getItemData', id)
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
    // 新增或修改采购员信息方法
    setData () {
      this.$refs.buyerDataRef.validate().then((success) => {
        // 验证表单提交是否正确
        if (success) {
          // 成功执行

          const data = {
            ...this.buyerData
          }
          this.$store
            .dispatch('erpBuyer/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.buyerData.id > 0 ? '修改' : '新增'}` + '采购员信息成功',
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
    // 隐藏采购员信息弹窗
    hideNowPage () {
      this.buyerData.id = ''
      this.buyerData.ceb_name = ''
      this.buyerData.ceb_note = ''
      this.buyerData.ceb_telephone = ''
      this.buyerData.ceb_number = ''
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
