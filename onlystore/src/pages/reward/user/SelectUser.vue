<template>
  <q-page>
    <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.4) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.4) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pa-none q-pa-xs">
          <div class="text-subtitle2">用户列表</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <q-separator />

        <q-card-section class="q-pa-xs">
          <div class="row q-gutter-sm">
            <q-input outlined v-model="searchValue" label="名称/电话" dense />
            <q-btn color="primary" unelevated @click="getUser">搜索</q-btn>
            <q-btn color="grey-6" unelevated @click="handleFormReset">重置</q-btn>
          </div>
          <div class="full-wdith q-mt-sm"  :style="`height:${$q.screen.height * 0.6}px`">
            <q-table
              flat
              :data="userData"
              :columns="columnDefs"
              row-key="id"
              hide-bottom
              bordered
              selection="single"
              separator="cell"
              :selected.sync="selectedUser"
              :pagination="{
                rowsPerPage: 0,
              }"
             card-class="fit"
            />
          </div>
        </q-card-section>

        <q-card-actions class="q-py-xs">
          <div class="row full-width justify-center q-gutter-sm">
            <q-btn class="q-px-xl" unelevated color="green" @click="getSelectedTabel" label="确定" />
            <q-btn class="q-px-xl" unelevated color="grey" @click="hideNowPage" label="关闭" />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'SelectUser',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      searchValue: '',
      userData: [],
      gridOptions: {},
      columnDefs: [
        { name: 'username', align: 'center', label: '职员名称', field: 'username' },
        { name: 'mobile', align: 'center', label: '联系电话', field: 'mobile' }
      ],
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      selectedUser: []
    }
  },
  mounted () {

  },
  computed: {},
  created () {},
  methods: {
    getUser () {
      const that = this
      for (let i = 0; i < 20; i++) {
        const dd = {
          id: i,
          username: 'xxxxx',
          mobile: '18588888888'
        }
        that.userData.push(dd)
      }

      this.addStoreSidebar = true
      const obj = {
        name: this.searchValue
      }
      this.$store.dispatch('commonReward/getUserDataLists', obj).then((res) => {
        if (res.code == 200) {
          // this.userData = res.data ? res.data : []
        }
      })
    },
    getSelectedTabel () {
      this.addStoreSidebar = false
      this.$nextTick(() => {
        this.$emit('getSelectedUserData', this.selectedUser)
      })
    },

    hideNowPage () {
      this.addStoreSidebar = false
    },
    handleFormReset () {
      this.searchValue = ''
      this.getUser()
    }
  }
}
</script>
