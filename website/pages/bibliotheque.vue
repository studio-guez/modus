<template>
    <app-project-list 
        api-endpoint="bibliotheque" 
        page-type="report"
        empty-message="Aucun rapport ne correspond à votre recherche."
    />
</template>

<script setup lang="ts">
import AppProjectList from "~/components/AppProjectList.vue";
</script>
