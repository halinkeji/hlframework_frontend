<template>
  <q-page class="q-pa-sm">
    <q-card flat class="q-pa-sm">
      <q-tabs
        v-model="kzjlTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="1" label="开支记录" />
        <q-tab name="2" label="开支项" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="kzjlTab" animated>
        <q-tab-panel name="1" class="q-pa-none q-mt-md">
          <kzls-record></kzls-record>
        </q-tab-panel>
        <q-tab-panel name="2" class="q-pa-none q-mt-md">
          <kzls-item></kzls-item>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>
<script>
import KzlsItem from "./components/KzlsItem";
import KzlsRecord from "./components/KzlsRecord";
export default {
  name: "kzjl",
  components: {
    KzlsItem,
    KzlsRecord
  },
  data() {
    return {
      kzjlTab: "1"
    };
  },
  mounted() {},
  created() {},
  computed: {},
  methods: {}
};
</script>
