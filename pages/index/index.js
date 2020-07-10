// 引入请求方法注意路径
import { request } from '../../request/index';
Page({
  data:{
    //   轮播数组
    swiperList:[],
    // 导航数组
    catesList:[],
    // 楼层数组
    floorList:[]
  },
  onLoad(options){
    //   页面加载时监听函数
    // 1.发送请求数据(需要去掉校验)或者自己在小程序配置添加服务器地址,为了避免毁掉地狱使用es6的promise来解决这个问题
    this.getSwiperList();
    this.getCatesList();
    this.getFoorList();
  },
  // 获取轮播数据
  getSwiperList(){
    request({
        url: '/home/swiperdata',
        method: 'GET',
    }).then(result=>{
        this.setData({
            swiperList:result
        })
    })
  },
//  获取导航数据    
   getCatesList(){
    request({
        url: '/home/catitems',
        method: 'GET',
    }).then(result=>{
        this.setData({
            catesList:result
        })
    })
   },
//  获取楼层数据    
   getFoorList(){
    request({
        url: '/home/floordata',
        method: 'GET',
    }).then(result=>{
        this.setData({
            floorList:result
        })
    })
   },

}) 
