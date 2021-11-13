<template>
  <!--操作-->
  <div class="mr-3 rowSS" style="justify-content: center; margin-top: 15px">
    <!--条件搜索-->
    <el-form ref="refsearchFormMixin" :inline="true" class="demo-searchFormMixin ml-2">
      <el-form-item label-width="" label="搜索条件" prop="keyword" label-position="left">
        <el-input v-model="keyword" class="widthPx-150" :readonly="true" placeholder="关键词" />
      </el-form-item>
      <el-form-item label-width="0px" label="" prop="createTime" label-position="left">
        <el-date-picker
          v-model="startEndArr"
          type="datetimerange"
          class="widthPx-350"
          range-separator="-"
          :readonly="true"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-button plain @click='exportDetail'>导出</el-button>
    </el-form>
  </div>
  <el-row style="min-width: 1100px; text-align: center" justify="center">
    <el-col :span="12">
      <div id="echartsContainerLineF" style="width: 550px; height: 400px"></div>
    </el-col>
    <el-col :span="12">
      <div id="echartsContainerLineS" style="width: 550px; height: 400px"></div>
    </el-col>
  </el-row>
  <el-row style="min-width: 1200px" justify="center">
    <el-col :span="12">
      <div id="echartsContainerPieF" style="width: 550px; height: 400px"></div>
    </el-col>
    <el-col :span="12">
      <div id="echartsContainerPieS" style="width: 550px; height: 400px"></div>
    </el-col>
  </el-row>
  <el-row style="min-width: 1200px" justify="center">
    <el-col :span="12">
      <div id="echartsArticlePieF" style="width: 550px; height: 400px"></div>
    </el-col>
    <el-col :span="12">
      <div id="echartsCommentPieS" style="width: 550px; height: 400px"></div>
    </el-col>
  </el-row>
  <el-row style="min-width: 1200px" justify="center">
    <el-col :span="12">
      <div id="echartsContainerBarF" style="width: 550px; height: 400px"></div>
    </el-col>
    <el-col :span="12">
      <div id="echartsContainerBarS" style="width: 550px; height: 400px"></div>
    </el-col>
  </el-row>
  <el-row style="min-width: 1200px; min-height: 450px" justify="center">
    <el-col v-if="articleCloudUrl" :span="12">
      <div style="width: 550px; height: 400px">
        <span class="demonstration">词云-博文</span>
        <el-image style="width: 100%; height: 100%" :src="articleCloudUrl" fit="scale-down"></el-image>
      </div>
    </el-col>
    <el-col v-if="commentCouldUrl" :span="12">
      <div style="width: 550px; height: 400px">
        <span class="demonstration">词云-评论</span>
        <el-image style="width: 100%; height: 100%" :src="commentCouldUrl" fit="scale-down"></el-image>
      </div>
    </el-col>
  </el-row>


</template>

<script setup>
import { useRoute } from 'vue-router'
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import bus from '@/utils/bus'
import echarts from 'echarts'
let { proxy } = getCurrentInstance()
const route = useRoute()
const { id, keyword, startTime, endTime } = route.query
const startEndArr = [startTime, endTime]

let articleDataKeys = ref([])
let articleDataValues = ref([])
let commentDataKeys = ref([])
let commentDataValues = ref([])
let articleEmotionValues = ref([])
let commentEmotionValues = ref([])
let articleCloudUrl = ref('')
let commentCouldUrl = ref('')
let commentCountsKeys = ref([])
let commentCountsValues = ref([])
let articleCountsKeys = ref([])
let articleCountsValues = ref([])
let articleGroupValues = ref([])
let commentGroupValues = ref([])

let selectPageReq = async () => {
  const data = {
    searchId: id
  }
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  let reqConfig = {
    url: '/api/v1/sina-search',
    method: 'get',
    data,
    isParams: true,
    isAlertErrorMsg: false
  }
  await proxy.$axiosReq(reqConfig).then((resData) => {
    let {
      articleData,
      commentData,
      commentCounts,
      articleCounts,
      articleEmotion,
      commentEmotion,
      articleCloud,
      commentCloud,
      articleGroup,
      commentGroup
    } = resData.data
    articleData.forEach((elem) => {
      articleDataKeys.value.push(elem.date + '点')
      articleDataValues.value.push(elem.count)
    })
    commentData.forEach((elem) => {
      commentDataKeys.value.push(elem.date + '点')
      commentDataValues.value.push(elem.count)
    })
    articleCounts.forEach((elem) => {
      articleCountsKeys.value.push(elem.name)
      articleCountsValues.value.push(elem.value)
    })
    commentCounts.forEach((elem) => {
      commentCountsKeys.value.push(elem.name)
      commentCountsValues.value.push(elem.value)
    })
    articleGroupValues.value = articleGroup
    commentGroupValues.value = commentGroup
    articleEmotionValues.value = articleEmotion
    commentEmotionValues.value = commentEmotion
    articleCloudUrl.value = import.meta.env.VITE_APP_BASE_URL + articleCloud
    commentCouldUrl.value = import.meta.env.VITE_APP_BASE_URL + commentCloud
    initEchartsF()
    initEchartsS()
    initPieF()
    initPieS()
    initArticlePieF()
    initCommentPieS()
    initBarF()
    initBarS()
  })
}

/*折线图*/
let echartsInstanceF = ref(null)
const initEchartsF = () => {
  echartsInstanceF.value = echarts.init(document.getElementById('echartsContainerLineF'))
  let option = {
    title: {
      text: '博文数量',
      left: 'center'
      // subtext: '纯属虚构'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: true },
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: articleDataKeys.value
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 篇'
      },
      axisPointer: {
        snap: true
      }
    },
    visualMap: {
      show: false,
      dimension: 0,
      color: ['red']
    },
    series: [
      {
        name: '时间',
        type: 'line',
        smooth: true,
        data: articleDataValues.value,
        markArea: {
          itemStyle: {
            color: 'rgba(208,48,56,0.4)'
          }
        }
      }
    ]
  }
  echartsInstanceF.value.setOption(option)
}

let echartsInstanceS = ref(null)
const initEchartsS = () => {
  echartsInstanceS.value = echarts.init(document.getElementById('echartsContainerLineS'))
  let option = {
    title: {
      text: '评论数量',
      left: 'center'
      // subtext: '纯属虚构'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: true },
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: commentDataKeys.value
      // axisPointer: {
      //   snap: true
      // },
      // axisLabel: {
      //   formatter: '{category}:00:00'
      // }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 篇'
      },
      axisPointer: {
        snap: true
      }
    },
    visualMap: {
      show: false,
      dimension: 0,
      color: ['green']
    },
    series: [
      {
        name: '时间',
        type: 'line',
        smooth: true,
        data: commentDataValues.value,
        markArea: {
          itemStyle: {
            color: 'rgba(208,48,56,0.4)'
          }
        }
      }
    ]
  }
  echartsInstanceS.value.setOption(option)
}

let echartsPieF = ref(null)
const initPieF = () => {
  echartsPieF.value = echarts.init(document.getElementById('echartsContainerPieF'))
  let option = {
    title: {
      text: '情感分析-博文',
      // subtext: '纯属虚构',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '情感分析',
        type: 'pie',
        radius: '50%',
        data: articleEmotionValues.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  echartsPieF.value.setOption(option)
}
let echartsPieS = ref(null)
const initPieS = () => {
  echartsPieS.value = echarts.init(document.getElementById('echartsContainerPieS'))
  let option = {
    title: {
      text: '情感分析-评论',
      // subtext: '纯属虚构',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '情感分析',
        type: 'pie',
        radius: '50%',
        data: commentEmotionValues.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  echartsPieS.value.setOption(option)
}

let echartsArticlePieF = ref(null)
const initArticlePieF = () => {
  echartsArticlePieF.value = echarts.init(document.getElementById('echartsArticlePieF'))
  let option = {
    title: {
      text: '分类统计-博文',
      // subtext: '纯属虚构',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '分类统计-博文',
        type: 'pie',
        radius: '50%',
        data: articleGroupValues.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  echartsArticlePieF.value.setOption(option)
}
let echartsCommentPieS = ref(null)
const initCommentPieS = () => {
  echartsCommentPieS.value = echarts.init(document.getElementById('echartsCommentPieS'))
  let option = {
    title: {
      text: '分类统计-评论',
      // subtext: '纯属虚构',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '分类统计-评论',
        type: 'pie',
        radius: '50%',
        data: commentGroupValues.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  echartsCommentPieS.value.setOption(option)
}

let echartsBarF = ref(null)
const initBarF = () => {
  echartsBarF.value = echarts.init(document.getElementById('echartsContainerBarF'))
  let option = {
    title: {
      text: '词频-博文',
      left: 'center'
      // subtext: '纯属虚构'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['词频']
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: true },
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: articleCountsKeys.value
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '数量',
        type: 'bar',
        data: articleCountsValues.value
      }
    ]
  }
  echartsBarF.value.setOption(option)
}
let echartsBarS = ref(null)
const initBarS = () => {
  echartsBarS.value = echarts.init(document.getElementById('echartsContainerBarS'))
  let option = {
    title: {
      text: '词频-评论',
      left: 'center'
      // subtext: '纯属虚构'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['词频']
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: true },
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: commentCountsKeys.value
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '数量',
        type: 'bar',
        data: commentCountsValues.value
      }
    ]
  }
  echartsBarS.value.setOption(option)
}


let exportDetail = async () => {
  const data = {
    searchId: id
  }
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  let reqConfig = {
    url: '/api/v1/sina-search',
    method: 'get',
    data,
    isParams: true,
    isAlertErrorMsg: false
  }
  await proxy.$axiosReq(reqConfig).then((resData) => {

  })
}
onMounted(() => {
  selectPageReq()
  bus.on('reloadErrorPage', () => {
    selectPageReq()
  })
})
</script>

<style scoped>
.demonstration {
  color: #333;
  display: block;
  font-size: 18px;
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
  font-weight: bold;
}
</style>
