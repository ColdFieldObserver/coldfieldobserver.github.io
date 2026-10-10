<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useData } from 'vitepress';
import { setupScrollReveal } from './composables/useScrollReveal';
import { initTheme } from './composables/useTheme';
import { openSearchDialog, searchDialogOpen } from './composables/useSearch';
import SiteHeader from './components/SiteHeader.vue';
import SiteSidebar from './components/SiteSidebar.vue';
import SiteRightBar from './components/SiteRightBar.vue';
import MechaLoader from './components/MechaLoader.vue';
import SearchDialog from './components/SearchDialog.vue';
import HomeView from './components/views/HomeView.vue';
import ToolsHomeView from './components/views/ToolsHomeView.vue';
import ToolView from './components/views/ToolView.vue';
import AboutView from './components/views/AboutView.vue';
import PostsHomeView from './components/views/PostsHomeView.vue';
import PostView from './components/views/PostView.vue';
import ArchiveView from './components/views/ArchiveView.vue';
import CategoryIndexView from './components/views/CategoryIndexView.vue';
import CategoryView from './components/views/CategoryView.vue';
import TagIndexView from './components/views/TagIndexView.vue';
import TagView from './components/views/TagView.vue';
import SearchView from './components/views/SearchView.vue';
import NotFoundView from './components/views/NotFoundView.vue';

// 与 VitePress 自定义主题约定一致：按 frontmatter.layout 切换页面外壳
const { page, frontmatter, params } = useData();

const layout = computed(() => (frontmatter.value.layout as string) || 'post');
const currentPage = computed(() => Number(params.value?.page) || 1);

function decodeParam(value: unknown): string {
  const raw = typeof value === 'string' ? value : '';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

const categoryName = computed(() => decodeParam(params.value?.category));
const tagName = computed(() => decodeParam(params.value?.tag));

/** 切页时复位主滚动容器；带锚点的跳转交给页内锚点逻辑处理。 */
function beforePageEnter(): void {
  if (typeof document === 'undefined') return;
  const scroller = document.querySelector<HTMLElement>('.site-main');
  if (scroller && !window.location.hash) scroller.scrollTop = 0;
  // 触发一道横向扫描光（机甲风切页反馈）
  scroller?.classList.add('is-switching');
  window.setTimeout(() => scroller?.classList.remove('is-switching'), 600);
}

/** 等新页面完成进入后再扫描，避免 out-in 过渡空档中收集到旧页面节点。 */
function afterPageEnter(): void {
  setupScrollReveal();
}

/** Ctrl / ⌘ + K 打开全站搜索 */
function onKeydown(event: KeyboardEvent): void {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearchDialog();
    return;
  }
  if (event.key === '/' && !searchDialogOpen.value) {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    event.preventDefault();
    openSearchDialog();
  }
}

onMounted(() => {
  initTheme();
  beforePageEnter();
  afterPageEnter();
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <MechaLoader />
  <SiteHeader />
  <SiteSidebar />

  <!-- 主内容地标：浏览器阅读模式据此定位正文，忽略侧栏等噪声 -->
  <main id="content" class="site-main" role="main" :data-layout="layout">
    <!-- 每个视图都带「路由身份」key：切换时由 Transition 先离场、再进入。 -->
    <Transition
      name="page"
      mode="out-in"
      appear
      @before-enter="beforePageEnter"
      @after-enter="afterPageEnter"
    >
      <NotFoundView v-if="page.isNotFound" key="not-found" />
      <HomeView v-else-if="layout === 'home'" key="home" />
      <ToolsHomeView v-else-if="layout === 'tools'" key="tools" />
      <ToolView v-else-if="layout === 'tool'" :key="`tool-${page.relativePath}`" />
      <AboutView v-else-if="layout === 'about'" key="about" />
      <PostsHomeView
        v-else-if="layout === 'posts-home'"
        :key="`posts-${currentPage}`"
        :page="currentPage"
      />
      <ArchiveView v-else-if="layout === 'archive'" :key="`archive-${currentPage}`" :page="currentPage" />
      <CategoryIndexView v-else-if="layout === 'category-index'" key="category-index" />
      <CategoryView
        v-else-if="layout === 'category'"
        :key="`category-${categoryName}-${currentPage}`"
        :name="categoryName"
        :page="currentPage"
      />
      <TagIndexView v-else-if="layout === 'tag-index'" key="tag-index" />
      <TagView
        v-else-if="layout === 'tag'"
        :key="`tag-${tagName}-${currentPage}`"
        :name="tagName"
        :page="currentPage"
      />
      <SearchView v-else-if="layout === 'search'" key="search" />
      <PostView v-else :key="`post-${page.relativePath}`" />
    </Transition>
  </main>

  <SiteRightBar />
  <SearchDialog />
</template>
