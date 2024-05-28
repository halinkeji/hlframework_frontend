<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="showDialog">
      <q-card
        :style="{
          width: dialogWidth,
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2">{{ locationData.id > 0 ? '修改货位信息' : '新增货位信息' }}</div>

          <q-space />
          <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form ref="locationDataRef">
            <q-select
              outlined
              dense
              v-model="locationData.cl_status"
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
              v-model="locationData.cl_depot_id"
              :options="depotList"
              option-value="id"
              option-label="cd_name"
              emit-value
              map-options
              label="仓库 *"
              :rules="[(val) => !!val || '仓库是必填项']"
            />
            <q-select
              outlined
              dense
              v-model="locationData.cl_shelf_id"
              :options="shelfList"
              option-value="id"
              option-label="cs_name"
              emit-value
              map-options
              label="货架 *"
              :rules="[(val) => !!val || '货架是必填项']"
            />
            <q-input outlined v-model="locationData.cl_sort" dense label="排序" :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']" />
            <q-input
              outlined
              dense
              v-model="locationData.cl_code"
              label="编号"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '请填写编号', (val) => /^[0-9a-zA-Z]*$/g.test(val) || '请输入正确的编号']"
            >
            </q-input>
            <q-input
              outlined
              dense
              v-model="locationData.cl_name"
              label="货位名称"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '请填写货位名称']"
            />

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
  name: 'AddLocation',
  data () {
    return {
      locationData: {
        cl_code: '',
        cl_name: '',
        cl_note: '',
        cl_status: '1',
        cl_sort: '',
        cl_depot_id: '',
        cl_shelf_id: ''
      },
      statusRadio: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '0' }
      ],
      dialogWidth: '1020px',
      showDialog: true,
      addButtonDisabled: false,
      depotList: [],
      shelfList: []
    }
  },
  created () {},
  mounted () {
    this.getDepotAll()
    this.getShelfAll()
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
    getShelfAll () {
      this.$store
        .dispatch('clothingShelf/getAllData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.shelfList = res.data ? res.data : []
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
        this.locationData.id = id
        this.$store
          .dispatch('clothingLocation/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.locationData = res.data
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
    // 新增或修改货位信息方法
    setData () {
      this.$refs.locationDataRef.validate().then((success) => {
        // 验证表单提交是否正确
        if (success) {
          // 成功执行

          const data = {
            ...this.locationData
          }
          this.$store
            .dispatch('clothingLocation/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.locationData.id > 0 ? '修改' : '新增'}` + '货位信息成功',
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
    // 隐藏货位信息弹窗
    hideNowPage () {
      this.locationData = {
        cl_code: '',
        cl_name: '',
        cl_note: '',
        cl_status: '1',
        cl_sort: '',
        cl_depot_id: '',
        cl_shelf_id: ''
      }
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
