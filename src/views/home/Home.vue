<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <tab-control
      :title="['推荐','新品','精选']"
      @tabClick = 'tabClick'
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />

    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pullUpLoad="true"
            @pullingUp="LoadMore">
      <!--  轮播图    -->
      <home-swiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad"
      />
      <!--  推荐    -->
      <recommend-view :recommends="recommends"/>
      <!--   流行   -->
      <feature-view/>
      <!--   tab-control   -->
      <tab-control
        :title="['推荐','新品','精选']"
        @tabClick = 'tabClick'
        ref="tabControl2"
      />
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>
</template>

<script>
  //公共引用
  import NavBar from 'components/common/navbar/NavBar';
  import Scroll from "components/common/scroll/Scroll";
  import TabControl from 'components/content/tabControl/TabControl';
  import GoodsList from 'components/content/goods/GoodsList';

  //子组件引用
  import HomeSwiper from './childComps/HomeSwiper';
  import RecommendView from './childComps/HomeRecommendView';
  import FeatureView from "./childComps/FeatureView";

  // 导入数据相关
  import {getHomeMultidata, getHomeGoods} from 'network/home';
  import {debounce} from "common/utils";
  import {itemImgListenerMixin,backTopMixin} from "common/mixin";

  export default {
    name: "Home",
    components: {
      NavBar ,
      HomeSwiper ,
      RecommendView ,
      FeatureView ,
      TabControl,
      GoodsList,
      Scroll
    },
    mixins:[itemImgListenerMixin,backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0,list: []},
          'new': {page: 0,list: []},
          'sell': {page: 0,list: []}
        },
        goodsPosition: {
          'pop': {saveY:0},
          'new': {saveY:0},
          'sell': {saveY:0}
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        isSaveY: false
      }
    },
    created() {
      //实例创建完成后调用
      // 1.请求多个数据
      this.getHomeMultidata()
      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
    },
    activated() {
      //切换为活跃状态时 加载浏览历史
      this.$refs.scroll.scrollTo(0,this.goodsPosition[this.currentType].saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    computed: {
      //传递数据到goods-list
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    methods: {
      /*
       * 事件监听相关
       * */
      //tab-control 点击切换
      tabClick(index){
        switch (index){
          case 0:
            this.currentType = 'pop'
            break;
          case 1:
            this.currentType = 'new'
            break;
          case 2:
            this.currentType = 'sell'
            break;
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index

        // 切换时加载浏览历史
        this.$refs.scroll.scrollTo(0,this.goodsPosition[this.currentType].saveY,800)
        this.$refs.scroll.refresh()
      },
      // Scroll.vue  监听滚动
      contentScroll(position){
        // 1.判断是否显示返回顶部
        this.listenShowBackTop(position)

        // 2.决定tabcontrol是否吸顶(position: fixed)
        this.isTabFixed = position.y < this.tabOffsetTop

        // 3.实现Home页面浏览数据的保存
        position.y > this.tabOffsetTop ? this.isSaveY = false : this.isSaveY = true
        if(!this.isSaveY){
          for (let goodsKey in this.goodsPosition) {
            this.goodsPosition[goodsKey].saveY = this.tabOffsetTop
          }
        }
        if(this.isSaveY){
          for (let goodsKey in this.goodsPosition) {
            if(this.currentType !== goodsKey ){
              if (this.goodsPosition[goodsKey].saveY > this.tabOffsetTop){
                this.goodsPosition[goodsKey].saveY = this.tabOffsetTop
              }
            }
            this.goodsPosition[this.currentType].saveY = position.y
          }
        }

      },
      //上拉加载更多
      LoadMore(){
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.refresh()
      },
      // 获取tabcontrol的offsetTop
      swiperImageLoad(){
        this.tabOffsetTop = -this.$refs.tabControl2.$el.offsetTop
      },
      /*
      * 网络请求相关
      * */
      //getHomeMultidata获取轮播图数据
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      //获取商品数据
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          // 完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    /*padding-top: 44px;*/
    height:100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;

    /*在使用浏览器原生滚动时,为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index:9;*/
  }

  .content{
    /*height:calc(100vh - 93px);*/
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control{
    position: relative;
    z-index: 9;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
</style>
