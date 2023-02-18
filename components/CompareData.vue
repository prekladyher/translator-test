<script setup lang="ts">
const { data } = defineProps<{
  data: {
    source: string,
    target: string,
    deepl: string,
    google: string,
    lindat: string,
    lingea: string
  }[]
}>();
</script>

<template>
    <dl v-for="(unit, index) in data" :key="index">
        <dt>Source</dt>
        <dd>{{ unit.source }}</dd>
        <dt>Target</dt>
        <dd>{{ unit.target }}</dd>
        <dt>DeepL</dt>
        <dd>{{ unit.deepl }}</dd>
        <dt>Google</dt>
        <dd>{{ unit.google }}</dd>
        <dt>LINDAT</dt>
        <dd>{{ unit.lindat }}</dd>
        <dt>Lingea</dt>
        <dd>{{ unit.lingea }}</dd>
    </dl>
</template>

<style scoped>
dl + dl {
    border-top: 1px solid var(--vp-c-divider);
    padding-top: 1em;
}
dl {
    display: grid;
    grid-template-columns: 50px auto;
    row-gap: 10px;
}
dt {
    font-size: 12px;
    text-transform: uppercase;
    color: var(--vp-c-text-3);
}
dd {
    font-size: 14px;
}
</style>
