<template>
  <div>

    {{ $q_date.formatDate(params.data.drr_start_date * 1000, 'YYYY-MM-DD HH:mm') }}

  </div>
</template>
<script>
export default {
  name: 'AgDate',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
