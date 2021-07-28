<template>
  <div ref="wrapper" class="wrapper">
    <div>
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
BScroll.use(Pullup)

export default {
  name: "Scroll",
  props: {
    probeType:{
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scroll: null
    }
  },
  mounted() {
    let wrapper = this.$refs.wrapper
    //1.创建Bscroll对象
    this.scroll = new BScroll(wrapper,{
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
      click: true
    })
    // 2.监听滚动的位置
    if(this.probeType ===2 || this.probeType === 3){
      this.scroll.on('scroll',(position) => {
        this.$emit('scroll',position)
      })
    }
    //3.监听上拉事件
    if(this.pullUpLoad){
      this.scroll.on('pullingUp',() => {
        this.$emit('pullingUp')
      })
    }

    // setTimeout(() => {
    //   this.refresh()
    // },2000)
  },
  methods:{
    scrollTo(x, y, time=500) {
      this.scroll  && this.scroll.scrollTo && this.scroll.scrollTo(x, y,time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    getScrollY(){
      return this.scroll ? this.scroll.y : 0
    }

  }
}
</script>

<style scoped>

</style>
