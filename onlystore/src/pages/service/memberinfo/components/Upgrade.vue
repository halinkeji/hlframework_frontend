<template>
  <q-dialog v-model="levelChange">
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.4) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.4) + 'px',
      }"
    >
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">会员升级</q-toolbar-title>
      </q-toolbar>
      <q-card-section>
        <q-table
          flat
          bordered
          :pagination="{
            rowsPerPage: 0,
          }"
          :data="levelData"
          :columns="columns"
          row-key="name"
          no-data-label="当前级别为最高级"
          hide-pagination
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <!-- <q-td key="lur_sort" :props="props">
                {{ props.row.lur_sort }}
              </q-td> -->
              <q-td key="lur_before_level_id" :props="props">
                {{ props.row.beforeLevel && props.row.beforeLevel.mcl_level_name ? props.row.beforeLevel.mcl_level_name : '' }}
              </q-td>

              <q-td key="lur_after_level_id" :props="props">
                {{ props.row.afterLevel && props.row.afterLevel.mcl_level_name ? props.row.afterLevel.mcl_level_name : '' }}
              </q-td>

              <q-td key="lur_total_grow_rate" :props="props">
                {{ props.row.lur_total_grow_rate }}
              </q-td>
              <q-td key="id" :props="props">

                <q-radio v-model="memberCardLevelId" @input="changeCheck(props.row)" :val="props.row.lur_after_level_id" />
              </q-td>
            </q-tr>
          </template>

           <template v-slot:no-data="{ icon, message, filter }">
              <div class="full-width row flex-center  q-gutter-sm">

                <span>
                 当前级别为最高级
                </span>

              </div>
            </template>
        </q-table>
      </q-card-section>

      <q-card-actions class="row justify-center q-gutter-sm q-mb-sm">
        <q-btn unelevated color="grey" label="关闭" class="q-px-xl" v-close-popup @click="closeButton" />
        <q-btn unelevated color="primary" label="升级" class="q-px-xl" @click="saveBut" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'Upgrade',
  data () {
    return {
      memberCardLevelId: '',
      currentMemberCardLevelId: '',
      levelChange: false,
      levelData: [],
      levelName: '',
      memberId: '',
      totalGrowRate: '',
      columns: [
        // { name: 'lur_sort', align: 'center', label: '排序', field: 'lur_sort' },
        { name: 'lur_before_level_id', align: 'center', label: '升级前会员级别', field: 'lur_before_level_id' },
        { name: 'lur_after_level_id', align: 'center', label: '升级后会员级别', field: 'lur_after_level_id' },
        { name: 'lur_total_grow_rate', align: 'center', label: '累计成长值', field: 'lur_total_grow_rate' },
        { name: 'id', align: 'center', label: '操作', field: 'id' }
      ]
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    getLevelData () {
      const obj = {
        // before_level_id: this.currentMemberCardLevelId
      }
      this.$store
        .dispatch('level/getUpgrade', obj)
        .then((res) => {
          if (res.code == 200) {
            this.levelData = res.data && res.data.length > 0 ? res.data : []

            this.$nextTick(() => {
              this.getDefaultLevelData()
            })
          }
        })
        .catch((error) => {})
    },

    init (val) {
      if (val && val.id && val.membercardlevel_id > 0) {
        this.currentMemberCardLevelId = val.membercardlevel_id
        this.getLevelData()
        this.memberId = val.id
        this.levelChange = true
      }
    },
    getDefaultLevelData () {
      this.$store
        .dispatch('level/getDefaultLevelOne', this.$route.query.id)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.levelData.push({
              lur_before_level_id: 0,
              afterLevel: res.data,
              lur_after_level_id: res.data.id,
              lur_total_grow_rate: 0,
              beforeLevel: {
                mcl_level_name: '初始级别'
              }
            })
          }
        })
        .catch((error) => {})
    },
    // 关闭
    closeButton () {
      this.levelChange = false
      this.memberId = ''
    },

    changeCheck (row) {
      if (row && row.afterLevel && row.afterLevel.mcl_level_name) {
        this.levelName = row.afterLevel.mcl_level_name
        this.totalGrowRate = row.lur_total_grow_rate
      }
    },

    // 保存
    saveBut () {
      const obj = {
        member_id: this.memberId,
        membercardlevel_id: this.memberCardLevelId,
        totalGrowRate: this.totalGrowRate

      }
      this.$store
        .dispatch('member/upgradeMemberLevel', obj)
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

            this.$emit('returnMethod', {
              levelName: this.levelName,
              newLevelId: this.memberCardLevelId
            })
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
