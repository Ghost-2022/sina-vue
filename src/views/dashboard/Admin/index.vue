<template>
  <!--操作-->
  <div class="mr-3 rowSS" style="justify-content: center; margin-top: 15px">
    <!--条件搜索-->
    <el-form ref="refsearchFormMixin" :inline="true" class="demo-searchFormMixin ml-2">
      <el-form-item label-width="0px" label="" prop="keyword" label-position="left">
        <el-input v-model="searchFormMixin.keyword" class="widthPx-150" placeholder="关键词" />
      </el-form-item>
      <el-form-item label-width="0px" label="" prop="createTime" label-position="left">
        <el-date-picker
          v-model="startEndArrMixin"
          type="datetimerange"
          @change="dateTimePacking"
          class="widthPx-350"
          range-separator="-"
          value-format="YYYY-MM-DD HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <!--查询按钮-->
      <el-button @click="searchBtnClick">查询</el-button>
    </el-form>
  </div>
  <!--表格和分页-->
  <el-table
    id="resetElementDialog"
    ref="refuserTable"
    :height="`calc(100vh - ${settings.delWindowHeight})`"
    size="mini"
    border
    :data="usertableData"
  >
    <el-table-column type="selection" align="center" width="50" />
    <el-table-column align="center" prop="keyword" label="关键字" />
    <el-table-column align="center" prop="startTime" label="开始时间" />
    <el-table-column align="center" prop="endTime" label="结束时间" />
    <!--点击操作-->
    <el-table-column fixed="right" align="center" label="操作">
      <template #default="{ row }">
        <el-button type="text" size="small" @click="detailClick(row)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--分页-->
  <div class="block columnCC mt-2">
    <el-pagination
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotalMixin"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, reactive } from 'vue'
import settings from '@/settings'
let { proxy } = getCurrentInstance()
import bus from '@/utils/bus'
/*表格查询和筛选*/
let usertableData = ref([])
let searchFormMixin = reactive({
  keyword: '',
  startTime: '',
  createTime: '',
  id: ''
})
let selectPageReq = () => {
  const data = Object.assign(reactive({}), {
    page: pageNum,
    size: pageSize
  })
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  let reqConfig = {
    url: '/api/v1/search-list',
    method: 'get',
    data,
    isParams: true,
    isAlertErrorMsg: false
  }
  proxy.$axiosReq(reqConfig).then((resData) => {
    usertableData.value = resData.data?.list
    proxy.pageTotalMixin = resData.data?.total
  })
}

import tablePageHook from '@/hooks/tablePageHook'
import { ElMessage } from 'element-plus'
let { pageNum, pageSize, handleCurrentChange, handleSizeChange } = tablePageHook(selectPageReq)
const dateTimePacking = (timeArr) => {
  if (timeArr && timeArr.length === 2) {
    searchFormMixin.startTime = timeArr[0]
    searchFormMixin.endTime = timeArr[1]
  } else {
    searchFormMixin.startTime = ''
    searchFormMixin.endTime = ''
  }
}
onMounted(() => {
  selectPageReq()
  bus.on('reloadErrorPage', () => {
    selectPageReq()
  })
})

let timer = null

const searchBtnClick = () => {
  const data = Object.assign(searchFormMixin, {})
  let reqConfig = {
    url: '/api/v1/sina-search',
    method: 'post',
    data,
    isParams: false,
    isAlertErrorMsg: true
  }
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  proxy.$axiosReq(reqConfig).then((resData) => {
    let { isDownloading, searchId } = resData.data
    if (isDownloading) {
      timer = setInterval(() => {
        const checkParams = Object.assign(reactive({}), { searchId: searchId })
        Object.keys(checkParams).forEach((fItem) => {
          if (checkParams[fItem] === '' || checkParams[fItem] === null || checkParams[fItem] === undefined)
            delete data[fItem]
        })
        console.log(checkParams, 333)
        let reqConfig = {
          url: '/api/v1/check-spider',
          method: 'get',
          data: checkParams,
          isParams: true
        }
        proxy.$axiosReq(reqConfig).then((resData) => {
          let { status } = resData.data
          if (status) {
            ElMessage({ message: '下载完成', type: 'success' })
            clearInterval(timer)
          }
        })
      }, 1000 * 2)
    }
  })
}

let detailClick = (row) => {
  proxy.$router.push({ name: 'Detail', query: row })
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
