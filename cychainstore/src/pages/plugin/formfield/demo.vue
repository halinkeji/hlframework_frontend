<template>
  <q-page>
    <template-components :idData="idData"></template-components>
  </q-page>
</template>
<script>
import TemplateComponents from './TemplateComponents'
export default {
  name: 'demo',
  components: {
    TemplateComponents
  },
  data () {
    return {
      idData: {
        formId: 51,
        templateId: 19
      }

    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
