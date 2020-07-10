// pages/goods_detail/index.js
import { request } from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品详情数据
    goodsObj:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;
    this.getGoodsDetail(Number(goods_id))
  },
  // 获取商品详情信息
  async getGoodsDetail(goods_id){
    const res = await request({url:"/goods/detail",data:{goods_id}})
    // 列表中包含超过20个属性，需要的只有四个属性值，需要处理一下数据
    this.setData({
      goodsObj:{
        goods_name:res.goods_name,
      // 处理.webp格式的数据，因为在小程序中IPhone真机部分可能不识别，最好让后台修改，前端也可以临时修改,但是也要保证后天有修改后的格式的对应图片
        // goods_introduce:res.goods_introduce,
        goods_introduce:res.goods_introduce.replace(/\.webp/g,'.jpg'),
        goods_price:res.goods_price,
        pics:res.pics,
        goods_id:res.goods_id
      }
    })

  },
  // 点击轮播图预览大图
  /**
   * 轮播图绑定点击事件
   * 调用小程序的 预览API
   */
  // 点击查看轮播图大图
  handlePreview(e){
    // 需要预览的图片的列表
    const urls = this.data.goodsObj.pics.map(item=>item.pics_mid)
    // 当全部图片的地址
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      // 预览列表
      urls,
      // 当前图片链接地址
      current,
    })
  },
  // 加入购物车
  /**
   * 点击触发事假
   * 获取缓存中的购物车数据（数组）
   * 判断当前商品是否已经存在于购物车中，已经存在修改商品数量，将当前的数据加入缓存，不存在，就直接加入数组包含有购买数量填充到缓存
   * 弹出提示
   */
  // 点击加购
   handleCartAdd(){
    // 1获取缓存中的购物车数组,第一次没有
    let cart = wx.getStorageSync('cart')||[];
    // 2判断商品对象是否存在于购物车列表中
    let index = cart.findIndex(v=>v.goods_id===this.data.goodsObj.goods_id);
    if(index===-1){
      // 不存在第一次加购
      // 添加一个数量属性，第一次为 1，以后依次加一
      this.data.goodsObj.num=1;
      // 添加选中属性，用于购物车列表中选中
      this.data.goodsObj.checked=true;
      cart.push(this.data.goodsObj)
    }else{
      // 已经存在,此商品的数量+1
      cart[index].num++;
    }
    // 重新加入缓存
    wx.setStorageSync('cart', cart);

    // 提示加入成功！
    wx.showToast({
      title: '已加入购物车！',
      icon: 'success',
      mask: true,// 防止用户手抖
    });
  }
})