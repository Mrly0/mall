<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pullUpLoad="true"
            @pullingUp="LoadMore">
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :title="['推荐','新品','精选']"
                   class="tab-control"
                   @tabClick = 'tabClick'
      ></tab-control>
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
  import BackTop from "components/content/backTop/BackTop";

  //子组件引用
  import HomeSwiper from './childComps/HomeSwiper';
  import RecommendView from './childComps/HomeRecommendView';
  import FeatureView from "./childComps/FeatureView";

  // 获取数据
  import {getHomeMultidata, getHomeGoods} from 'network/home';

  export default {
    name: "Home",
    components: {
      NavBar ,
      HomeSwiper ,
      RecommendView ,
      FeatureView ,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0,list: []},
          'new': {page: 0,list: []},
          'sell': {page: 0,list: []}
        },
        currentType: 'pop',
        isShowBackTop: false
      }
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    methods: {
      /*
       * 事件监听相关
       * */
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
        this.$refs.scroll.scroll.refresh()
      },
      backClick(){
        // console.log('backClick');
        this.$refs.scroll.scrollTo(0,0,500)
      },
      contentScroll(position){
        position.y < -1000 ? this.isShowBackTop = true : this.isShowBackTop = false ;
      },
      LoadMore(){
        //上拉加载更多
        console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.scroll.refresh()
      },
      /*
      * 网络请求相关
      * */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
          // console.log(res);
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      }
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()
      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

      // 3.监听itam中图片加载完成
      this.$bus.$on('itemImageLoad' , () => {
        this.$refs.scroll.refresh()
      })
    }
  }
</script>

<style scoped>
  #home{
    padding-top: 44px;
    height:100vh;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index:1;
  }

  .content{
    height:calc(100vh - 93px);
    overflow: hidden;
    /*margin-top: 44px;*/
  }
  .content .tab-control{
    position: sticky;
    overflow: hidden;
    top: 44px;
  }
</style>
