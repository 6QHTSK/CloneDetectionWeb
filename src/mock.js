const Mock = require('mockjs')
const Random = Mock.Random

function compare(options){
  console.log(JSON.parse(options.body));  // expected: {"code1":"...","code2":"..."}
  let rtn = [
    { // 发现相似
      result: true,
      data: {similar: true, possibility: 75}, // 概率为百分数
    },
    { // 发现不相似
      result: true,
      data: {similar: false},
    },
    { // 后端出错
      result: false,
      error: 'test error',
    }
  ]
  return  Random.pick(rtn)
}

function check(options){
  console.log(JSON.parse(options.body));  // expected: {"code"}
  let rtn = [
    { // 发现漏洞
      result: true,
      data: {vulnerable: true, vulnerabilityList: [
          {name:"CVE-test-1",possibility:75},
          {name:"CVE-test-2",possibility:65},
          {name:"CVE-test-3",possibility:35},
          {name:"CVE-test-4",possibility:15},
          {name:"CVE-test-5",possibility:10},
        ]}, // 漏洞列表长度保证在6个以内，概率为百分数
    },
    { // 发现无漏洞
      result: true,
      data: {vulnerable: false},
    },
    { // 后端出错
      result: false,
      error: 'test error2',
    }
  ]
  return  Random.pick(rtn)
}


Mock.mock('/api/compare','post',{"result": true, "data": {"similar": true, "ast_similarity": 98, "metrics_similarity": 99}})
Mock.mock('/api/check','post',check)
