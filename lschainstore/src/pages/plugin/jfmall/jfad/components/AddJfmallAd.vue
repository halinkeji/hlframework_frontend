<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="addAd" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
        class="q-pa-sm "
      >
        <q-card-section class="row items-center q-py-sm">
          <div class="text-h6">
            {{ dataId > 0 ? '修改广告' : '新增广告' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>

        <q-form ref="adDataRef" class="q-gutter-md">

          <div class="row q-px-sm">
            <div class="col-12 col-md-8">
              <q-input
              outlined
              dense
              v-model="adData.ja_sort"
              label="排序:数字越小，排序越靠前"
              lazy-rules
              maxlength="10"
              :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']"
            />

               <q-select outlined option-value="value" option-label="label" class="q-mb-md" emit-value map-options v-model="adData.ja_status"
               :options="[
                  { label: '开启', value: '1' },
                  { label: '关闭', value: '2' },
                  ]" dense label="状态" />

              <q-input outlined dense  v-model="adData.ja_title" label="广告标题" maxlength="255" lazy-rules :rules="[(val) => !!val || '广告标题不能为空']" />

              <q-select outlined option-value="value" option-label="label" emit-value map-options v-model="adData.ja_type" :options="adPosition" dense label="请选择广告类型" :error="false" />
              <div>
                <q-input v-if="adData.ja_type == '2'" outlined dense v-model="adData.ja_url" label="广告链接" lazy-rules :rules="[(val) => !!val || '广告链接不能为空']" />
              </div>

              <q-input  outlined dense disable v-model="jfgoodsData.jg_name" label="关联商品" v-if="adData.ja_type == '1'" >
                <template v-slot:after>
                  <q-btn  label="选择商品" color="primary" unelevated @click="chooseJfgoods" />
                </template>
              </q-input>

            </div>
            <div class="col-12 col-md-4 q-px-sm text-center">
              <hl-upload
                :multiple="false"
                :currentAttach="adData.coverImage"
                @input="(val)=>{ $nextTick(()=>{ adData.ja_cover_image = val })}"
                currentTitle="广告图"
                currentDescription="建议尺寸比例2:1"
              />
           </div>
          </div>
          <div class="row">
            <q-input outlined dense class="col-12 q-px-sm" v-model="adData.ja_description" type="textarea" label="简介" />
          </div>
          <div class="row q-gutter-sm justify-center">
            <q-btn class="q-px-xl" label="提交" @click="saveData()" color="primary" unelevated />
            <q-btn class="q-px-xl" label="关闭" color="grey" unelevated @click="hideNowPage()" />
          </div>
        </q-form>
      </q-card>
      <choose-jfgoods v-if="chooseVisible" ref="chooseJfgoodsList" @getChooseJfgoodsData="receivingAdministrator" @closeChooseGoods="closeChooseGoods"></choose-jfgoods>
    </q-dialog>
  </div>
</template>

<script>
import ChooseJfgoods from './ChooseJfgoods.vue'
export default {
  name: 'AddJfmallAdAd',
  components: {
    ChooseJfgoods
  },

  data () {
    return {
      jfgoodsData: {},
      chooseVisible: false,
      dialogWidth: '1000px',
      addAd: false,
      dataId: 0,
      adData: {
        ja_title: '',
        ja_sort: 0,
        ja_type: '1',
        ja_cover_image: '',
        ja_status: '1',
        ja_url: ''
      },
      adPosition: [
        {
          value: '1',
          label: '关联商品广告'
        },
        {
          value: '2',
          label: '外部链接广告'
        }
      ],
      stop: false
    }
  },
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.5) + 'px'
    }
  },
  computed: {},
  created () {},
  methods: {
    getItem (id) {
      this.dataId = id
      this.addAd = true
      if (id > 0) {
        this.$store.dispatch('jfad/getItem', id).then((res) => {
          if (res.code == 200) {
            this.adData = res.data ? res.data : {}
            this.jfgoodsData = res.data && res.data.ja_type == '1' ? res.data.goods : {}
          }
        })
      }
    },
    saveData () {
      this.$refs.adDataRef.validate().then((success) => {
        if (success) {
          if (this.adData.ja_type == 1 && !this.jfgoodsData.id) {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '请选择商品',
              color: 'red'
            })
            return ''
          }
          this.stop = true
          this.addAd = false
          if (this.adData.ja_type == 1) {
            this.adData.goods_id = this.jfgoodsData.id
          }
          const obj = {
            ...this.adData,
            id: this.dataId
          }
          this.$store
            .dispatch('jfad/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}广告成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.stop = false
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
              this.stop = false
            })
        }
      })
    },
    // 选择商品
    chooseJfgoods () {
      this.chooseVisible = true
      // this.addAd = false;
      this.$nextTick(() => {
        this.$refs.chooseJfgoodsList.getGoodsData()
      })
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      this.jfgoodsData = val[0]
    },
    // 关闭
    closeChooseGoods () {
      this.chooseVisible = false
      // this.addAd = true;
    },

    hideNowPage () {
      this.$emit('getMethods')
    }
  }
}
</script>
