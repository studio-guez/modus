<template>
    <app-project-list 
        api-endpoint="bibliotheque" 
        page-type="report"
        empty-message="Aucun rapport ne correspond à votre recherche."
        @pdf-download="handlePdfDownload"
    />
</template>

<script setup lang="ts">
import AppProjectList from "~/components/AppProjectList.vue";

function handlePdfDownload(pdfUrl: string) {
    window.open(pdfUrl, '_blank')
}
</script>
