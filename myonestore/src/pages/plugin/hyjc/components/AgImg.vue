<template>
  <div class="row items-center">
    <q-img
      :src="paramsData.coverImage && paramsData.coverImage.id ? $q.localStorage.getItem('myonestore_system_local').attach_url + paramsData.coverImage.path : ''"
      :ratio="1"
      style="height: 50px ;width: 50px"
    />
  </div>
</template>
<script>
export default {
  name: 'AgImg',
  components: {},
  data () {
    return {
      paramsData: {}
    }
  },
  created () {
    this.paramsData = this.params.data
  },
  mounted () {},
  computed: {},
  methods: {}
}
</script>
