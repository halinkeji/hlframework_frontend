<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card style="width: 768px; max-width: 90vw" class="q-pa-md">
      <q-form ref="detailRef">
        <q-card-section class="row q-pa-none">
          <span style="font-size: 18px">{{ detailData.id > 0 ? '修改开支明细' : '新增开支明细' }}</span>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="q-mt-lg row items-center">
          <div class="col-2 ">
            <span class="row justify-end">选择类型</span>
          </div>
          <div class="q-pl-md col-3">
            <q-btn-toggle
              v-model="detailData.pki_status"
              spread
              class="my-custom-toggle"
              no-caps
              unelevated
              @input="getTypeList"
              toggle-color="primary"
              color="white"
              text-color="primary"
              :options="[
                { label: '开支', value: '1' },
                { label: '收入', value: '2' },
              ]"
            />
          </div>
        </div>
        <div class="q-mt-lg row ">
          <div class="col-2 q-mt-sm">
            <span class="row justify-end">选择开支项</span>
          </div>
          <div class="q-pl-md col-10">
            <q-select
              outlined
              square
              class=" q-pr-sm"
              dense
              v-model="detailData.pki_group_id"
              :options="kzlsItemList"
              label="开支项"
              option-label="pki_name"
              option-value="id"
              map-options
              emit-value
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '请选择开支项']"
            />
          </div>
        </div>
        <div class="q-mt-sm row ">
          <div class="col-2 q-mt-sm">
            <span class="row justify-end">开支明细名称</span>
          </div>
          <div class="q-pl-md col-10">
            <q-input
              square
              class=" q-pr-sm "
              outlined
              dense
              v-model="detailData.pki_name"
              placeholder="请输入开支明细名称"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '请填写开支明细名称']"
            />
          </div>
        </div>
        <div class="q-mt-sm row ">
          <div class="col-2 q-mt-sm">
            <span class="row justify-end">开支明细描述</span>
          </div>
          <div class="q-pl-md col-10">
            <q-input
              square
              class=" q-pr-sm "
              outlined
              dense
              rows="2"
              type="textarea"
              v-model="detailData.pki_detail"
              placeholder="请输入开支明细描述"
            />
          </div>
        </div>
        <div align="right" class="q-mt-xl q-mb-sm q-mr-sm">
          <q-btn unelevated label="确认" :disable="addButtonDisabled" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-ml-sm" color="grey" v-close-popup />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddKzlsDetail',
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      kzlsItemList: [],
      secondModel: '1',
      detailData: {
        pki_name: '',
        pki_status: '1',
        pki_detail: '',
        pki_group_id: '',
        pki_type: '2'
      },
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      }
    }
  },
  mounted () {},
  created () {
    this.getTypeList()
  },
  computed: {},
  methods: {
    // 查询开支类型列表
    getTypeList () {
      const obj = {
        status: this.detailData.pki_status,
        type: 1,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('kzls/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.kzlsItemList = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    getInfo (id) {
      this.$store
        .dispatch('kzls/getItemData', id)
        .then((res) => {
          if (res.code == 200) {
            this.detailData = res.data ? res.data : {}
            this.detailData.pki_status = res.data.pki_status.toString()
            this.detailData.pki_group_id = res.data.pki_group_id.toString()
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
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    // 查询开支明细单条
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.getTypeList()
        this.getInfo(id)
      }
    },
    // 新增或修改开支明细
    setData () {
      this.$refs.detailRef.validate().then((success) => {
        if (success) {
          this.showDialog = false
          this.addButtonDisabled = true
          const data = {
            ...this.detailData
          }
          this.$store
            .dispatch('kzls/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.detailData.id > 0 ? '修改' : '新增'}` + '开支明细成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
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
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    // 关闭弹窗执行方法
    hideNowPage () {
      this.detailData.pki_status = '1'
      this.detailData.id = ''
      this.detailData.pki_name = ''
      this.detailData.pki_nameId = ''
      this.detailData.pki_detail = ''
      // this.$emit("dataList");
      this.addButtonDisabled = false
    }
  }
}
</script>
<style>
.my-custom-toggle {
  border: 1px solid #027be3;
}
</style>
