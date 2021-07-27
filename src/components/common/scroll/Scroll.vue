<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
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
      this.scroll.on('scroll',(position) => {
        // console.log(position);
        this.$emit('scroll',position)
      })
      //3.监听上拉事件
      this.scroll.on('pullingUp',() => {
        this.$emit('pullingUp')
      })

  },
  methods:{
    scrollTo(x, y, time=500) {
      this.scroll.scrollTo(0,0,time)
    },
    finishPullUp() {
      this.scroll.finishPullUp()
    },
    refresh() {
      this.scroll.refresh()
    }

  }
}
</script>

<style scoped>

</style>
