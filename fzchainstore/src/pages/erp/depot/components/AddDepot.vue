<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="showDialog">
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.4) + 'px',
          'max-width': parseInt($q.screen.width * 0.4) + 'px',
        }"
        class="q-pa-md"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ depotData.id > 0 ? '修改仓库信息' : '新增仓库信息' }}</div>

          <q-space />
          <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form ref="depotDataRef">
            <q-input
              outlined
              dense
              v-model="depotData.ed_code"
              label="编号"
              lazy-rules
              :rules="[(val) => /^\d+$/.test(val) || '请输入正确的编号']"
            >
              <template v-slot:after>
                <q-btn color="warning" class="full-width" unelevated label="一键生成编号" @click="math" />
              </template>
            </q-input>
            <q-input
              class="col-12 col-md-6 q-pr-sm q-mt-xs"
              outlined
              dense
              v-model="depotData.ed_name"
              label="仓库名称"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '请填写名称']"
            />
            <q-input
              class="col-12 col-md-6 q-pr-sm q-mt-xs"
              outlined
              dense
              v-model="depotData.ed_place"
              label="仓库位置"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '请填写仓库位置']"
            />

            <q-input class="col-12 col-md-6 q-pr-sm q-mt-xs" outlined type="textarea" dense :rows="2" v-model="depotData.ed_note" label="说明" />
            <q-select
              outlined
              dense
              class="col-12 col-md-6 q-pr-sm q-mt-md"
              label="选择操作员"
              v-model="depotData.ed_bind_user"
              multiple
              option-value="id"
              option-label="username"
              :options="userDataList"
              emit-value
              map-options
              use-chips
              stack-label
            />

            <div class="row col-12 col-md-6 q-pr-sm q-mt-xs">
              <span class="q-mt-sm">状态</span>
              <q-option-group class="row q-ml-sm" :options="statusRadio" type="radio" v-model="depotData.ed_status" />
            </div>

            <div align="right" class="q-mt-lg">
              <q-btn unelevated label="确认" v-if="authorityMeta('save')" :disable="addButtonDisabled" color="primary" @click="setData" />
              <q-btn unelevated label="关闭" class="q-ml-sm" color="grey" v-close-popup />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
export default {
  name: 'AddDepot',
  data () {
    return {
      depotData: {
        ed_code: '',
        ed_name: '',
        ed_place: '',
        ed_note: '',
        ed_status: 1,
        ed_bind_user: null
      },
      statusRadio: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 2 }
      ],
      dialogWidth: '1020px',
      showDialog: true,
      addButtonDisabled: false,
      userDataList: [],
      model: null,
      filterOptions: stringOptions
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    init (id) {
      this.showDialog = true
      this.depotData.id = id
      if (id > 0) {
        this.$store
          .dispatch('erpdepot/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.depotData = res.data
              if (this.depotData.ed_bind_user) {
                this.depotData.ed_bind_user = this.depotData.ed_bind_user.split(',')
              } else {
                this.depotData.ed_bind_user = []
              }
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
    // 新增或修改仓库信息方法
    setData () {
      this.$refs.depotDataRef.validate().then((success) => {
        // 验证表单提交是否正确
        if (success) {
          // 成功执行

          const data = {
            ...this.depotData
          }
          this.$store
            .dispatch('erpdepot/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.depotData.id > 0 ? '修改' : '新增'}` + '仓库信息成功',
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
    getUserList () {
      this.$store
        .dispatch('user/getUserAllData')
        .then((res) => {
          this.userDataList = res.data ? res.data : []
        })
        .catch((error) => {})
    },
    math () {
      this.depotData.ed_code = new Date().getTime().toString()
    },
    // 隐藏仓库信息弹窗
    hideNowPage () {
      this.depotData.ed_name = ''
      this.depotData.ed_place = ''
      this.depotData.ed_note = ''
      this.depotData.ed_code = ''
      this.depotData.ed_bind_user = null
      this.$emit('dataList')
      this.addButtonDisabled = false
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
    }
  }
}
</script>
