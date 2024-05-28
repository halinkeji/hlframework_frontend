<template>
  <q-dialog ref="kzlsItemRef" @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.2) + 'px',
        'max-width': parseInt($q.screen.width * 0.2) + 'px',
      }"
      class="q-pa-md"
    >
      <q-form ref="kzlsItemRef" @submit="setData">
        <q-card-section class="row q-pa-none">
          <span class="text-subtitle2">{{ itemData.id > 0 ? '修改' : '新增' }}开支项</span>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="q-mt-xs">
          <q-select
            outlined
            dense
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="itemData.pki_status"
            :options="[
              { label: '开支', value: '1' },
              { label: '收入', value: '2' },
            ]"
            label="类型"
            class="q-mb-md"
          />
          <q-input
            outlined
            dense
            v-model="itemData.pki_name"
            placeholder="请输入开支项名称"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '请填写开支项名称']"
          />

        </div>

        <div  class="text-center q-gutter-sm">
          <q-btn unelevated label="确认" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddKzlsItem',
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      itemData: {
        pki_name: '',
        pki_status: '1',
        pki_type: '1'
      }
    }
  },
  created () {},
  methods: {
    // 查询开支项单条
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('commonKzls/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.itemData = res.data ? res.data : {}
              this.itemData.pki_status = res.data.pki_status.toString() // 转字符串
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
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          })
      }
    },
    // 新增或修改开支项
    setData () {
      this.$refs.kzlsItemRef.validate().then((success) => {
        if (success) {
          const data = {
            ...this.itemData
          }
          this.$store
            .dispatch('commonKzls/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.itemData.id > 0 ? '修改' : '新增'}` + '开支项成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.addButtonDisabled = true
                this.showDialog = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        }
      })
    },
    // 关闭弹窗执行
    hideNowPage () {
      this.itemData.pki_status = '1'
      this.itemData.pki_name = ''
      this.itemData.id = ''
      this.addButtonDisabled = false
      this.$emit('dataList')
    }
  }
}
</script>
