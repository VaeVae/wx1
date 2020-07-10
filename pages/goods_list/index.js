// pages/goods_list/index.js
import { request } from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs
    tabs:[
      { 
        id:0,
        value:'综合',
        isActive:true
      },
      { 
        id:1,
        value:'销量',
        isActive:false
      },
      { 
        id:2,
        value:'价格',
        isActive:false
      },
    ],
    goods_list:[]
  },
  // 请求参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  // 数据的总页数
  totalPage:0,
  // 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {cid} = options
    this.QueryParams.cid=cid;
    this.getGoodsList();
  },
  // 获取商品列表
  async getGoodsList(){
    const {goods,total} = await request({url:'/goods/search',data:this.QueryParams});
    this.totalPage=Math.ceil(total/this.QueryParams.pagesize)
    this.setData({
      // 列表重要显示所有的数据
      goods_list:[...this.data.goods_list,...goods]
    })
    // 当数据请求回来之后就需要关闭下拉刷新的等待效果
    wx.stopPullDownRefresh();
  },
  // 接收子组件传来的tabindex
  recTabIndex(e){
    // 获取index
    const {index}=e.detail;
    let arr = [...this.data.tabs]
    // 修改列表
    arr.map((item,i)=>i==index?item.isActive=true:item.isActive=false)
    // 重新渲染
    this.setData({
      tabs:arr
    })
  },
  // 用户上滑滚动条触底，开始加载下一页的数据
  // 判断是否有下一页的数据 数据的总条数，page，pagesize 总页数= Math.ceil(总条数/pagesize)
  // 有就请求加载下一页的数据
  // 没有，弹出提示
  // 页面触底上滑事件：
  onReachBottom(){
    if(this.totalPage>this.QueryParams.pagenum){
      // 请求下一页
      // 当前的pagenum+1，发送请求，请求回来的数据添加到list中
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }else{
      // 当前已经是最后一页了
      wx.showToast({
        title: '当前是最后一页数据',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });

    }
  },
  // 下拉刷新页面
  // 下拉刷新，页面配置设为true
  // 重置数据
  // 页码重置
  // 关闭等待效果
  // 定义下拉刷新事件
  onPullDownRefresh(){
    // 重置商品列表数组
    this.setData({
      goods_list:[]
    });
    // 页码重置
    this.QueryParams.pagenum=1;
    this.getGoodsList();
  }
})