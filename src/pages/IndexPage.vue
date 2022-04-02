<template>
  <q-page class="flex column content-center q-pa-xl">
    <div class="flex column items-center">
      <p class="text-h3">开源软件漏洞检测系统</p>
      <p>V1.0.0</p>
    </div>
    <q-separator spaced class="flex-break"/>
    <div class="row q-col-gutter-xl justify-evenly page-item">
      <item class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-12"
            v-for = "item in showItems"
            :key = "item.title"
            :icon="item.icons"
            :title="item.title"
            :caption="item.caption"
            style="min-width: 200px;"
      ></item>
    </div>
    <q-separator spaced class="flex-break" style="text-align: center"/>
    <div class="flex column items-center">
      <span>华中科技大学网络空间安全学院开源软件漏洞检测系统团队</span>
    </div>
  </q-page>
</template>

<script>
import {defineAsyncComponent, defineComponent} from "vue";

export default defineComponent({
  name: "PageIndex",
  components: {
    item : defineAsyncComponent(()=>import("components/item.vue"))
  },
  data: () =>{
    return{
      showItems : [
        {
          icons : "difference",
          title : "代码查重",
          caption : "检查源代码间差异"
        },
        {
          icons : "rule",
          title : "漏洞检测",
          caption : "检查源代码潜在漏洞"
        },
      ]
    }
  }
});
</script>
