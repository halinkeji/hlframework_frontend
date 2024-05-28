<template>
  <div>
    <q-btn color="primary" icon="ion-eye" unelevated flat rounded :to="{ name: 'shift', query: { id: params.data.id } }" />
  </div>
</template>
<script>
export default {
  name: 'AgOperating',
  data () {
    return {}
  },
  computed: {},
  components: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>
