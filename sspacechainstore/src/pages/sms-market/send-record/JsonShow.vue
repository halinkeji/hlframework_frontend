<template>
  <div>
    <q-btn unelevated round icon="las la-eye" dense flat color="primary">
      <q-menu>
        <vue-json-viewer :value="JSON.parse(params.data.ssr_send_content)"></vue-json-viewer>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {}
  },
  created () {},
  computed: {},
  methods: {}
}
</script>
