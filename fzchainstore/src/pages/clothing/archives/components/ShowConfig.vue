<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.8) + 'px',
        'max-width': parseInt($q.screen.width * 0.8) + 'px',
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">属性字段设置</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form ref="depotDataRef">
          <div class="q-mt-lg row">
            <div class="col-6">
              <q-scroll-area style="height: 700px;" class="q-mx-lg">
                <q-list v-for="(item, key) in configData" :key="key">
                  <q-item tag="label" v-ripple>
                    <q-item-section avatar>
                      <q-checkbox v-model="configShowData" :val="item" color="primary" @input="setData" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ item.headerName }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </div>
            <div class="col-6 ">
              <q-scroll-area style="height: 700px;" class="q-mx-lg">
                <q-list v-for="(item, key) in configShowData" :key="key">
                  <q-item tag="label" v-ripple>
                    <q-item-section avatar>
                      <q-icon color="info" name="format_align_left" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ item.headerName }}</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon color="red" name="delete" @click="deleConfig" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <!-- <q-card-actions align="right" class="q-pb-md">
        <q-btn unelevated label="确认" :disable="addButtonDisabled" color="primary" @click="setData" />
        <q-btn unelevated label="关闭" class="q-ml-sm" color="grey" v-close-popup />
      </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ShowConfig',
  data () {
    return {
      configData: [],
      configShowData: [],
      dialogWidth: '1020px',
      showDialog: true,
      addButtonDisabled: false
    }
  },
  created () {},
  mounted () {
    this.getConfig()
  },
  methods: {
    showConfig () {
      this.showDialog = true
    },
    getConfig () {
      this.$store
        .dispatch('clothingConfig/getConfig')
        .then((res) => {
          if (res.code == 200) {
            if (res.data.configData) {
              this.configShowData = res.data.configData
            }
            this.configData = res.data.defaultData
            this.reschConfig()
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
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    setData () {
      if (this.configShowData.length > 0) {
        const data = {
          configShowData: this.configShowData
        }
        this.$store
          .dispatch('clothingConfig/setData', data)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '修改展示属性信息成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'green'
              })
              this.addButtonDisabled = true
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.data.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.addButtonDisabled = false
            }
            this.reschConfig()
            // this.showDialog = false
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    deleConfig (mainKey) {
      this.$q
        .dialog({
          title: '确定',
          message: '删除展示的属性吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          setTimeout(() => {
            this.configShowData.splice(mainKey, 1)
            this.setData()
            this.getConfig()
          }, 100)
        })
    },
    // 隐藏仓库信息弹窗
    hideNowPage () {
      this.addButtonDisabled = false
    },
    reschConfig () {
      this.configShowData.forEach((value, index) => {
        const data = this.configData.findIndex(function (x) {
          return x.field == value.field
        })
        if (data > -1) {
          this.configData.splice(data, 1)
        }
      })
    }
  }
}
</script>
