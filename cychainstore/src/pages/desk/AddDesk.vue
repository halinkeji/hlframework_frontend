<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.4 + 'px',
        'min-width': this.$q.screen.width * 0.4 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">
          {{ deskData.id > 0 ? '修改餐桌信息' : '新增餐桌' }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section >
        <q-form ref="deskDataRef" class="row q-col-gutter-sm">
          <div class="col-12 col-md-6 ">
            <q-input outlined dense v-model="deskData.dp_name" label="餐桌名称" lazy-rules :rules="[(val) => !!val || '请输入餐桌名称']" />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              outlined
              dense
              v-model="deskData.dp_type_id"
              :options="deskTypeList"
              label="请选择餐区"
              option-value="id"
              option-label="dt_name"
              emit-value
              map-options
              lazy-rules
              :rules="[(val) => !!val || '请选择餐区']"
            />
          </div>

          <div class="col-12 col-md-6 ">
            <q-input
              outlined
              dense
              v-model="deskData.dp_dine_people_number"
              label="就餐人数"
              :rules="[(val) => /^\d+$/.test(val) || '请输入就餐人数']"
            />
          </div>
          <div class="col-12 col-md-6 ">
            <q-input outlined dense v-model="deskData.dp_sort" label="排序" :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']" />
          </div>

          <div class="col-12 ">
            <q-input v-model="deskData.dp_remarks" outlined dense label="备注" :rows="2" type="textarea" />
          </div>
        </q-form>
        <div class=" row justify-center q-gutter-sm q-mt-sm">
          <q-btn unelevated label="确定" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddDesk',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      deskData: {
        dp_name: '',
        dp_type_id: '',
        dp_dine_people_number: '',
        dp_sort: '0',
        dp_status: '1',
        dp_remarks: ''
      },
      deskTypeList: []
    }
  },
  created () {
    this.getDeskTypeList()
  },
  mounted () {},
  computed: {},
  methods: {
    getDeskTypeList () {
      this.$store
        .dispatch('desk/getTypeList')
        .then((res) => {
          if (res.code == 200) {
            this.deskTypeList = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('desk/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.deskData = res.data ? res.data : {}
              this.deskData.dp_type_id = res.data.dp_type_id.toString()
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
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    setData () {
      this.$refs.deskDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const params = {
            ...this.deskData
          }
          this.$store
            .dispatch('desk/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.deskData.id > 0 ? '修改' : '新增'}` + '餐桌成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
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
                this.addButtonDisabled = false
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    hideNowPage () {
      this.deskData.dp_name = ''
      this.deskData.dp_sort = '0'
      this.deskData.dp_typeid = ''
      this.deskData.dp_status = '1'
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
