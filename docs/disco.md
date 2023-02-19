<script setup>
import CompareData from "../components/CompareData.vue"
import units_01 from "../data/disco-01.json";
import units_02 from "../data/disco-02.json";
import units_03 from "../data/disco-03.json";
</script>

# Disco Elysium

## Testovací sada 01

<CompareData :data="units_01"></CompareData>

## Testovací sada 02

<CompareData :data="units_02"></CompareData>

## Testovací sada 03

<CompareData :data="units_03"></CompareData>
