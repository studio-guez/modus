<template>
  <section class="v-report-tab-enlien">
    <div v-if="tags.length > 0" class="v-report-tab-enlien__tags">
      <nuxt-link v-for="tag in tags" :key="tag.slug" :href="`/tag/${tag.slug}`" class="v-report-tab-enlien__tag">
        {{ tag.name }}
      </nuxt-link>
    </div>
    <div v-if="linkedProjects.length > 0" class="v-report-tab-enlien__related-list">
      <h3 class="v-report-tab-enlien__section-title">Projets en lien</h3>
      <nuxt-link v-for="project in linkedProjects" :key="project.slug" :href="`/project/${project.slug}`"
        class="v-report-tab-enlien__related-item">
        <span class="v-report-tab-enlien__related-title">{{ project.title }}</span> – <span class="v-report-tab-enlien__related-year">{{ formatYear(project.dateStart) }}</span>
      </nuxt-link>
    </div>
    <div v-if="relatedReports.length > 0" class="v-report-tab-enlien__related-list">
      <h3 class="v-report-tab-enlien__section-title">Rapports en lien</h3>
      <nuxt-link v-for="report in relatedReports" :key="report.slug" :href="`/rapport/${report.slug}`"
        class="v-report-tab-enlien__related-item">
        <span class="v-report-tab-enlien__related-title">{{ report.title }}</span> – <span class="v-report-tab-enlien__related-year">{{ formatYear(report.dateStart) }}</span>
      </nuxt-link>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Tag {
  name: string
  slug: string
}

interface RelatedReport {
  slug: string
  title: string
  dateStart?: string
}

interface LinkedProject {
  slug: string
  title: string
  dateStart?: string
}

defineProps<{
  tags: Tag[]
  relatedReports: RelatedReport[]
  linkedProjects: LinkedProject[]
}>()

function formatYear(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? '' : date.getFullYear().toString()
}
</script>

<style lang="scss" scoped>
.v-report-tab-enlien {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: var(--app-color-sage);
  padding: var(--app-report-tab-padding-y) var(--app-report-tab-padding-x);
  min-height: var(--app-report-tab-min-height);
  color: var(--app-color-black);
}

.v-report-tab-enlien__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.v-report-tab-enlien__tag {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  padding: .58333333333rem .83333333333rem;
  line-height: 1;
  font-size: .88888888888rem;
  border-radius: 2rem;
  color: var(--app-color-black);
  border: 2px solid var(--app-color-black);
  background-color: transparent;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, filter 0.2s ease;
  &:hover{
    border-color: var(--app-color-orange-bright);
    background: var(--app-color-orange-bright);
  }
}

.v-report-tab-enlien__related-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.v-report-tab-enlien__section-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.v-report-tab-enlien__related-item {
  display: block;
  text-decoration: none;
  font-size: 0.88888888888rem;
  font-weight: 700;
}

.v-report-tab-enlien__related-title{
  color: var(--app-color-main);
}
</style>
