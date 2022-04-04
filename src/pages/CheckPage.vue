<template>
  <q-page class="flex column content-center content-start q-gutter-sm q-pa-md">
    <div class="text-h5 text-primary page-item"><q-icon name="rule"/> 漏洞检测</div>
    <q-separator/>
    <div>
      <div class="text-subtitle1 text-secondary"><q-icon name="code"/> 待检测代码</div>
      <q-separator/>
      <VAceEditor v-model:value="code" lang="c_cpp" theme="eclipse" class="page-item" wrap :min-lines="25" :max-lines="25"/>
      <q-separator/>
    </div>

    <q-btn color="primary" @click="getResult" :loading="request.onLoading" class="page-item text-subtitle2">
      <q-icon name="rule"/>扫描漏洞
      <template v-slot:loading>
        <q-spinner-gears class="on-left"/>
        <span v-show="request.onLoading">扫描中...</span>
      </template>
    </q-btn>

    <q-slide-transition>
      <div v-if="request.viewResult">
        <q-banner :class="bannerInfo.bg_color + ' page-item'" >
          <template v-slot:avatar>
            <q-icon :name="bannerInfo.icon" :color="bannerInfo.icon_color" />
          </template>
          {{ bannerInfo.caption }}
        </q-banner>
        <q-list bordered separator v-if="bannerInfo.vul_list.length > 0">
          <q-item class="bg-red-1" v-for="(item,index) in bannerInfo.vul_list" :key="item.name">
            <q-item-section avatar>
              <q-icon :name="icon_count[index]"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
            </q-item-section>
            <q-item-section side>{{item.possibility}}%</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-slide-transition>
  </q-page>
</template>

<script>
import {api} from 'boot/axios'
import {ref,reactive} from 'vue'
import {useQuasar} from 'quasar'
import {VAceEditor} from  'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-eclipse'

export default {
  name: "CheckPage.vue",
  components:{VAceEditor},
  setup() {
    const $q = useQuasar()
    const code = ref("")
    const splitterModel = ref(50)
    const request = reactive({
      viewResult : false,
      onLoading : false,
      result: true,
    })
    let bannerInfo = reactive({
      bg_color : "bg-green-2 page-item",
      caption: "恭喜！代码间未见复制。",
      icon: "gpp_good",
      icon_color : "positive",
      vul_list: []
    })
    const cmOptions = {
      mode: 'text/x-c++src',
      theme: 'base16-light'
    }
    const icon_count = ["looks_one","looks_two","looks_3","looks_4","looks_5","looks_6"]

    function getResult(){
      request.onLoading = true
      request.viewResult = false
      api.post('/check',{language:"cpp",code:code.value})
        .then((response) => {
          if(response.status !== 200 || response.data.result === false){
            let errMsg = '发生错误（'+ response.status + '）'
            if(response.data.result === false){
              errMsg += response.data.error
            }
            $q.notify({
              color: 'negative',
              message: errMsg,
              icon: 'report_problem'
            })
          }else{
            if(response.data.data.vulnerable === true){
              bannerInfo.bg_color = "bg-red-2"
              bannerInfo.caption= "存在漏洞！漏洞列表如下："
              bannerInfo.icon= "gpp_maybe"
              bannerInfo.icon_color = "negative"
              bannerInfo.vul_list = response.data.data.vulnerabilityList
            }else{
              bannerInfo.bg_color = "bg-green-2"
              bannerInfo.caption= "恭喜！代码未见漏洞。"
              bannerInfo.icon= "gpp_good"
              bannerInfo.icon_color = "positive"
              bannerInfo.vul_list = []
            }
            request.viewResult = true
          }
          request.onLoading = false
        }).catch(()=>{
        $q.notify({
          color: 'negative',
          message: '请求失败',
          icon: 'report_problem'
        })
        request.onLoading = false
      })
    }

    return { code , request, splitterModel, cmOptions, bannerInfo,icon_count,getResult}
  }
}
</script>

<style scoped>

</style>
