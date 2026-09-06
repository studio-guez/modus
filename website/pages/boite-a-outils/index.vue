<template>
    <app-project-list
        api-endpoint="boite-a-outils"
        page-type="tool"
        empty-message="Aucun outil ne correspond à votre recherche."
    />
</template>

<script setup lang="ts">
import AppProjectList from "~/components/AppProjectList.vue";
</script>
