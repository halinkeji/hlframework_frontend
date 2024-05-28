<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">

    <div class="col-shrink q-pa-sm full-height bg-white">
      <q-scroll-area class="fit full-height">
        <q-form ref="dataFrom">
          <div class="q-col-gutter-md row">
            <div class="col-md-3 col-12" v-for="(item, key) in templateData">
              <q-card flat bordered class="q-pa-md text-subtitle1">
                <div class="row items-center">
                  <div class="col">
                    {{ item.title }}
                  </div>
                  <div class="col text-right">模板编号: {{ item.pwt_number }}</div>
                </div>
                <q-separator />

                <q-card-section v-if="item.data" class="q-pa-xs text-grey text-caption">
                  <div class="row" v-for="(i, k) in item.data">
                    <div class="col-6">{{ i.key }}</div>
                    <div class="col-6 text-right">{{ i.value }}</div>
                  </div>
                </q-card-section>
                <q-separator class="q-my-sm" />
                <q-input dense outlined v-model="item.pwt_template_id" label="模板ID">
                  <template v-slot:append>
                    <q-toggle v-model="item.pwt_status" color="green" true-value="1" false-value="0" />
                  </template>
                </q-input>
                <q-separator dark />
                <q-card-section class="q-pa-xs">
                  <div class="text-caption">服务类目:{{ item.type }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-form>
      </q-scroll-area>
    </div>
    <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
      <q-btn unelevated color="primary" label="保存" class="q-px-xl" :disable="addDisable" @click="saveTemplateData()" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'template',
  data () {
    return {
      addDisable: false,
      templateData: []
    }
  },
  created () {},
  mounted () {
    this.getTemplateData()
  },

  computed: {},
  methods: {
    getTemplateData () {
      this.$store
        .dispatch('wxapp/getTemplateData')
        .then((res) => {
          if (res.code == 200) {
            this.templateData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },
    saveTemplateData () {
      this.$refs.dataFrom.validate().then((success) => {
        if (success) {
          this.addDisable = true
          const obj = {
            templateData: this.templateData
          }
          this.$store
            .dispatch('wxapp/setTemplateData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存模板消息设置成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
              }
              this.addDisable = false
            })
            .catch((error) => {
              this.addDisable = false
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                position: 'top-right'
              })
            })
        }
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
