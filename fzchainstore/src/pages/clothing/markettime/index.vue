<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-pa-sm full-height">
        <q-scroll-area class="fit full-height">
          <q-form ref="dataFormRef">

            <div class="text-h6 q-pa-xs">上市时间设置</div>
            <q-item class="full-width">
              <q-item-section>
                <q-item-label>上市时间设置</q-item-label>
                <q-item-label caption lines="2">注意!上市时间设置可以按照设置进行生成上市时间，同时也可以设置手动输入上市时间</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-select
                  label="请选择上市时间设置"
                  class="full-width"
                  v-model="marketData.clothing_market_time"
                  option-value="value"
                  option-label="lable"
                  emit-value
                  map-options
                  v-if="authorityMeta('edit')"
                  @input="setStatus(marketData.clothing_market_time, 'clothing_market_time')"
                  dense
                  outlined
                  :options="configData"
                />
              </q-item-section>
            </q-item>
          </q-form>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'markettime',
  data () {
    return {
      marketData: {
        clothing_market_time: ''
      },
      configData: [
        {
          lable: '采购入库日期',
          value: '1'
        },
        {
          lable: '首次发货日期',
          value: '2'
        },
        {
          lable: '首单销售日期',
          value: '3'
        }
      ]
    }
  },
  created () {},
  mounted () {
    this.getStatus()
  },
  computed: {},
  methods: {
    setStatus (val, keyName) {
      const obj = {}
      obj.value = val
      obj.key = keyName
      this.$store
        .dispatch('clothingConfig/setStatus', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '修改成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.getStatus()
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
    getStatus () {
      this.$store
        .dispatch('clothingConfig/getStatus')
        .then((res) => {
          if (res.code == 200) {
            this.marketData = res.data ? res.data : {}
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
