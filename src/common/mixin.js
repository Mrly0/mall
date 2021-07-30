import {debounce} from "common/utils";
import BackTop from "components/content/backTop/BackTop";
import {TOP_DISTANCE,POP, NEW, SELL} from "./const";

export const itemImgListenerMixin = {
  data(){
    return{
      itemImgListener: null
    }
  },
  mounted(){
    // 1.监听itam中图片加载完成
    const newRefresh = debounce(this.$refs.scroll.refresh,200)
    // 2.监听itam中图片加载完成
    this.itemImgListener = () => {
      newRefresh()
    }
    this.$bus.$on('itemImageLoad',this.itemImgListener )
  }
}

export const backTopMixin = {
  components:{
    BackTop
  },
  data(){
    return{
      isShowBackTop: false
    }
  },
  methods: {
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500)
    },
    listenShowBackTop(position){
      this.isShowBackTop = -position.y > TOP_DISTANCE
    }
  }
}

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}
