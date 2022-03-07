<template>
  <div id="mapContainer" class="mapContainerClass"></div>
</template>

<script setup>
import { getCurrentInstance, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const { id } = route.query
let { proxy } = getCurrentInstance()
let getPoints = () => {
  const data = {
    searchId: id
  }
  let reqConfig = {
    url: '/api/v1/get-points',
    method: 'get',
    data,
    isParams: true,
    isAlertErrorMsg: true
  }
  proxy.$axiosReq(reqConfig).then((resData) => {
    baiduMap(resData.data)
  })
}
let baiduMap = (points) => {
  const map = new window.BMapGL.Map('mapContainer')
  map.centerAndZoom(new window.BMapGL.Point(108.813659, 34.347491), 6)
  map.enableScrollWheelZoom(true)
  for (let i = 0; i < points.length; i++) {
    map.addOverlay(new window.BMapGL.Marker(new window.BMapGL.Point(points[i][0], points[i][1])))
  }
}
onMounted(() => {
  getPoints()
})
</script>

<style scoped>
.mapContainerClass {
  height: 100%;
  width: 100%;
  position: fixed;
}
</style>
