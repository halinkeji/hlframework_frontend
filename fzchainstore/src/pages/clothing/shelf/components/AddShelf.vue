<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="showDialog">
      <q-card
        :style="{
          width: dialogWidth,
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2">{{ dataForm.id > 0 ? '修改货架信息' : '新增货架信息' }}</div>
          <q-space />
          <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form ref="shelfDataRef">

            <q-select
              outlined
              dense
              v-model="dataForm.cs_status"
              :options="statusRadio"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="状态"
              bottom-slots
            />

            <q-select
              outlined
              dense
              v-model="dataForm.cs_depot_id"
              :options="depotList"
              option-value="id"
              option-label="cd_name"
              emit-value
              map-options
              label="仓库 *"
              :rules="[(val) => !!val || '仓库是必填项']"
            />
            <q-input
              outlined
              dense
              v-model="dataForm.cs_code"
              label="编号"
              lazy-rules
              :rules="[(val) => /^[0-9a-zA-Z]*$/g.test(val) || '请输入正确的编号']"
            >
            </q-input>
            <q-input
              outlined
              dense
              v-model="dataForm.cs_name"
              label="货架名称"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '请填写名称']"
            />

            <q-input  outlined type="textarea" dense :rows="2" v-model="dataForm.cs_note" label="说明" />

            <div align="center" class="q-mt-lg">
              <q-btn unelevated label="确认" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
              <q-btn unelevated label="关闭" class="q-ml-sm q-px-xl" color="grey" v-close-popup />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddShelf',
  data () {
    return {
      dataForm: {
        cs_code: '',
        cs_name: '',
        cs_place: '',
        cs_note: '',
        cs_status: '1',
        cs_depot_id: ''
      },
      statusRadio: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '0' }
      ],
      dialogWidth: '1020px',
      showDialog: true,
      addButtonDisabled: false,
      depotList: []
    }
  },
  created () {},
  mounted () {
    this.getDepotAll()
  },
  methods: {
    getDepotAll () {
      this.$store
        .dispatch('clothingDepot/getAllData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.depotList = res.data ? res.data : []
            }
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
    },
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.dataForm.id = id
        this.$store
          .dispatch('clothingShelf/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.dataForm = res.data
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
    // 新增或修改货架信息方法
    setData () {
      this.$refs.shelfDataRef.validate().then((success) => {
        // 验证表单提交是否正确
        if (success) {
          // 成功执行

          const data = {
            ...this.dataForm
          }
          this.$store
            .dispatch('clothingShelf/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataForm.id > 0 ? '修改' : '新增'}` + '货架信息成功',
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
    // 隐藏货架信息弹窗
    hideNowPage () {
      this.dataForm.id = ''
      this.dataForm.cs_name = ''
      this.dataForm.cs_place = ''
      this.dataForm.cs_note = ''
      this.dataForm.cs_code = ''
      this.dataForm.cs_depot_id = ''
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
