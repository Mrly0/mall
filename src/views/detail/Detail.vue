<template>
    <div id="detail">
      <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
      <scroll class="content" ref="scroll" @scroll="detailScroll" :probe-type="3">
        <detail-swiper :top-images="topImages"/>
        <detail-base-info :goods="goods"/>
        <detail-shop-info :shop="shop" />
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
        <detail-param-info ref="params" :paramInfo="paramInfo"/>
        <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>

        <goods-list ref="recommend" :goods="recommends"/>
      </scroll>

      <detail-bottom-bar @addCart="addToCart"/>

      <back-top @click.native="backClick" v-show="isShowBackTop"/>

    </div>
</template>

<script>
  // 公共组件
  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from 'components/content/goods/GoodsList';

  // 子组件
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import {getDetail ,getRecommend ,Goods ,Shop ,GoodsParam} from "network/detail";
  import {debounce} from "common/utils";
  import {itemImgListenerMixin,backTopMixin} from "common/mixin";
  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    components: {
      GoodsList,
      DetailSwiper,
      DetailNavBar,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll
    },
    mixins: [itemImgListenerMixin,backTopMixin],
    data(){
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        message:'',
        show: false
      }
    },
    methods:{
      ...mapActions(['addCart']),

      imageLoad(){
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index){
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index] , 800)
      },
      detailScroll(position){
        const positionY = -position.y
        let length = this.themeTopYs.length
        // [0, 2879, 3724, 4014]
        for (let i = 0; i < length-1; i++) {
          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

      //
        this.listenShowBackTop(position)
      },
      addToCart(){
        // 1.获取购物车需要展示的内容
        const product = {}
        product.imgURL = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        //  2.添加到购物车
        this.addCart(product).then(res => {
          // this.show = true
          // this.message = res
          // console.log(res)
          //
          // setTimeout(() => {
          //   this.show = false
          //   this.message = ''
          // },1500)
          this.$toast.show(res,800)
        })
        // this.$store.commit('addCart',product)
        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res)
        // })

      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.id
      //2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 0.console.log(res)
        const data = res.result
        // 1.获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages
        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns , data.shopInfo.services)
        // 3.获取店铺信息
        this.shop = new Shop(data.shopInfo)
        // 4.获取商品详细信息
        this.detailInfo = data.detailInfo
        // 5.保存参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // 6.保存评论数据
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }

        // this.themeTopYs = []
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
        // console.log(this.themeTopYs);
        //
        // this.$nextTick(() => {
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
        //   console.log(this.themeTopYs);
        // })
      })
      // 3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      },100)
      // 4.
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs);
      })
    },
    mounted() {
    },
    updated() {
      // this.themeTopYs = []
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
      // console.log(this.themeTopYs);
    },
    destroyed() {
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .content{
    height:calc(100vh - 92px);
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
