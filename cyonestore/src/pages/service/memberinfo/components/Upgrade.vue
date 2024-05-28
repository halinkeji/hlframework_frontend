<template>
  <q-dialog v-model="levelChange">
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
    >
      <q-toolbar>
        <q-toolbar-title>会员升级</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup @click="closeButton" />
      </q-toolbar>
      <q-card-section>
        <div class="row">
          <div class="col">
            <q-select
              outlined
              emit-value
              map-options
              option-label="mcl_level_name"
              option-value="id"
              option-disable="inactive"
              dense
              v-model="memberInformation.membercardlevel_id"
              :options="levelData"
              label="会员级别"
            />
          </div>
        </div>
        <div class="row q-mt-md">
          <q-space />
          <q-btn outline unelevated color="grey" label="关闭" v-close-popup @click="closeButton" />
          <q-btn unelevated color="primary" label="保存" class="q-ml-sm" @click="saveBut" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'Upgrade',
  data () {
    return {
      memberInformation: {
        membercardlevel_id: '',
        changeOperate: 'upgrade'
      },
      levelChange: false,
      levelData: [],
      levelName: ''
    }
  },
  mounted () {},
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },
  computed: {},
  methods: {
    getLevelData () {
      const obj = {}
      this.$store
        .dispatch('level/getAllData', obj)
        .then((res) => {
          if (res.data) {
            this.levelData = res.data
          } else {
            this.levelData = []
          }
        })
        .catch((error) => {})
    },

    init (val) {
      if (val > 0) {
        this.getLevelData()
        this.memberInformation.id = val
        this.levelChange = true
      }
    },
    // 关闭
    closeButton () {
      this.levelChange = false
      this.memberInformation.id = ''
      this.memberInformation.membercardlevel_id = ''
    },
    // 获取等级名称
    levelNameBut () {
      let levelName = ''
      const membercardlevel_id = this.memberInformation.membercardlevel_id
      this.levelData.forEach(function (item) {
        if (membercardlevel_id == item.id) {
          levelName = item.mcl_level_name
        }
      })
      this.levelName = levelName
    },
    // 保存
    saveBut () {
      const obj = {
        ...this.memberInformation
      }
      this.$store
        .dispatch('member/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '会员级别更新成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.levelNameBut()
            this.$emit('returnMethod', this.levelName)
            this.closeButton()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>
