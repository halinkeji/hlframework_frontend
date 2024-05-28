<template>
  <div>
    <template>
      <q-input dense emit-value map-options square readonly v-model="eid_product_time" label="选择生产日期" :disable="this.params.context.erpInFormData.cep_status < 2 ? false: true">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
              <q-date v-model="eid_product_time" mask="YYYY-MM-DD" :options="optionsLimit" today-btn>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="确定" color="primary" @click="changeNumberTime" flat />
                </div>
              </q-date>
            </q-menu>
          </q-icon>
        </template>
      </q-input>
    </template>
  </div>
</template>
<script>
export default {
  name: 'AgProductTime',
  components: {},
  data () {
    return {
      eid_product_time: ''
    }
  },
  watch: {
    eid_product_time (val) {
      this.params.data.eid_product_time = this.$q_date.formatDate(val, 'X')
    }
  },

  computed: {},
  created () {
    this.eid_product_time = this.$q_date.formatDate(this.params.data.eid_product_time * 1000, 'YYYY-MM-DD')
  },
  mounted () {},
  methods: {
    optionsLimit (date) {
      return date <= this.$q_date.formatDate(new Date(), 'YYYY/MM/DD')
    },
    changeNumberTime () {
      this.$store
        .dispatch('erpin/editButtfer', this.params.data)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '修改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
          this.params.context.getList()
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
    }
  }
}
</script>
