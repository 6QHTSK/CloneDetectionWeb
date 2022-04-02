<template>
  <q-page class="flex column content-center content-start q-gutter-sm q-pa-md">
    <div class="text-h5 text-primary page-item"><q-icon name="difference"/> 代码查重</div>
    <q-separator/>
    <q-splitter v-model="splitterModel"  class="page-item" separator-style="width:0">
      <template v-slot:before>
        <div style="padding-right: 10px">
          <div class="text-subtitle1 text-secondary"><q-icon name="code"/> 待检测代码1</div>
          <q-separator/>
          <VAceEditor v-model:value="code[0]" lang="c_cpp" theme="eclipse" wrap :min-lines="25" :max-lines="25"/>
          <q-separator/>
        </div>
      </template>
      <template v-slot:after>
        <div style="padding-left: 10px">
          <div class="text-subtitle1 text-secondary"><q-icon name="code"/> 待检测代码2</div>
          <q-separator/>
          <VAceEditor v-model:value="code[1]" lang="c_cpp" theme="eclipse" wrap :min-lines="25" :max-lines="25" />
          <q-separator/>
        </div>
      </template>
    </q-splitter>
    <q-btn color="primary" @click="getResult" :loading="request.onLoading" class="page-item text-subtitle2">
      <q-icon name="difference"/>检查重复
      <template v-slot:loading>
        <q-spinner-gears class="on-left"/>
        <span v-show="request.onLoading">计算中...</span>
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
  name: "ComparePage.vue",
  components:{VAceEditor},
  setup() {
    const $q = useQuasar()
    const code = reactive(["",""])
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
      icon_color : "positive"
    })
    const cmOptions = {
      mode: 'text/x-c++src',
      theme: 'base16-light'
    }

    function getResult(){
      request.onLoading = true
      request.viewResult = false
      api.post('/compare',{code1:code[0],code2:code[1]})
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
            if(response.data.data.similar === true){
              bannerInfo.bg_color = "bg-red-2"
              bannerInfo.caption= "发现复制！概率"+Math.round(response.data.data.possibility)+"%。"
              bannerInfo.icon= "gpp_maybe"
              bannerInfo.icon_color = "negative"
            }else{
              bannerInfo.bg_color = "bg-green-2"
              bannerInfo.caption= "恭喜！代码间未见复制。"
              bannerInfo.icon= "gpp_good"
              bannerInfo.icon_color = "positive"
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
    return { code , request, splitterModel, cmOptions, bannerInfo,getResult}
  }
}
</script>

<style scoped>

</style>
