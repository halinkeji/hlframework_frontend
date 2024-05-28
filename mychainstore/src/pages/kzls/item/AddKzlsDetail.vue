<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.3) + 'px',
        'max-width': parseInt($q.screen.width * 0.3) + 'px',
      }"
      class="q-pa-md"
    >
      <q-form ref="detailRef">
        <q-card-section class="row q-pa-none">
          <span class="text-subtitle2">{{ detailData.id > 0 ? '修改' : '新增' }}明细</span>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="q-mt-sm">
          <q-select
            outlined
            dense
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @input="detailData.pki_group_id = '';getTypeList(detailData.pki_status)"
            v-model="detailData.pki_status"
            :options="[
              { label: '开支', value: '1' },
              { label: '收入', value: '2' },
            ]"
            label="类型"
            class="q-mb-md"
          />
          <q-select
            outlined
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
          <q-input
            outlined
            dense
            v-model="detailData.pki_name"
            label="名称"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '请填写开支明细名称']"
          />
          <q-input label="开支明细描述" outlined dense rows="2" type="textarea" v-model="detailData.pki_detail"  />
        </div>

        <div class="text-center q-gutter-sm q-mt-sm">
          <q-btn unelevated label="确认" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
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
      }

    }
  },
  mounted () {},
  created () {

  },
  computed: {},
  methods: {
    // 查询开支类型列表
    getTypeList (status) {
      const obj = {
        status,
        type: 1
      }
      this.$store
        .dispatch('commonKzls/getListItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.kzlsItemList = res.data ? res.data : []
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
        .dispatch('commonKzls/getItemData', id)
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
    // 查询开支明细单条
    init (id, status = 1) {
      this.showDialog = true
      this.getTypeList(status)
      if (id > 0) {
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
            .dispatch('commonKzls/setData', data)
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
    // 关闭弹窗执行方法
    hideNowPage () {
      this.detailData.pki_status = '1'
      this.detailData.id = ''
      this.detailData.pki_name = ''
      this.detailData.pki_nameId = ''
      this.detailData.pki_detail = ''
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
