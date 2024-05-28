<template>
  <div>
    <q-input outlined readonly dense v-model="params.data.cms_batach_exp" >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="params.data.cms_batach_exp" minimal mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="确定" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  data () {
    return { row: '' }
  },
  mounted () {},
  created () {

  },
  computed: {},
  methods: {

  }
}
</script>
