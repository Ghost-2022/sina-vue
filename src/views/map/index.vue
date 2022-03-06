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
  // await proxy.$axiosReq(reqConfig).then((resData) => {
  //   console.log(resData)
  //
  // })
  return [
    [116.186376, 39.997011],
    [116.775089, 40.040774],
    [116.450262, 43.492151],
    [124.96821, 43.465356],
    [124.96821, 43.465356]
  ]
}
let baiduMap = () => {
  const map = new window.BMapGL.Map('mapContainer')
  map.centerAndZoom(new window.BMapGL.Point(116.799811, 32.228141), 5)
  map.enableScrollWheelZoom(true)
  let points = getPoints()
  console.log(points)
  for (let i = 0; i < points.length; i++) {
    console.log(i[0], i[1])
    map.addOverlay(new window.BMapGL.Marker(new window.BMapGL.Point(points[i][0], points[i][1])))
  }
}
onMounted(() => {
  baiduMap()
})
</script>

<style scoped>
.mapContainerClass {
  height: 100%;
  width: 100%;
  position: fixed;
}
</style>
