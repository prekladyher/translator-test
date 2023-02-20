<script setup>
import CompareData from "@/components/CompareData.vue"
import units_01 from "@/data/fallout4-01.json";
import units_02 from "@/data/fallout4-02.json";
import units_03 from "@/data/fallout4-03.json";
</script>

# Náhodný výběr &ndash; Fallout 4

## Testovací sada 01

<CompareData :data="units_01"></CompareData>

## Testovací sada 02

<CompareData :data="units_02"></CompareData>

## Testovací sada 03

<CompareData :data="units_03"></CompareData>
