<template>
  <ul v-if="!!Object.keys(timelines).length" id="worklogs">
    <li v-for="timeline of _sortTimelineYear(timelines)" :key="timeline.year">
      <dl class="timeline-bar" :style="{ color: timeline.color }">
        <dt class="timeline-year" :style="{ backgroundColor: timeline.color }">{{ timeline.year }}</dt>
          <dd
            v-for="(worklog, index) of timeline.worklog"
            :key="worklog.id" :class="{ active: timeline.activeIndex === index }"
            :style="[ timeline.activeIndex === index ? worklog.activeStyle : '' ]"
            class="timeline-month"
            @mouseover="toggleTimelineMonth(timeline, index)">
            <router-link
              :to="`/worklog/${worklog.number}`"
              :style="{ color: timeline.activeIndex === index ? '#fff' : timeline.color }"
              class="timeline-month-link">
              {{ worklog.month }}
            </router-link>
          </dd>
      </dl>
      <article class="timeline-article">
        <transition-group
          :enter-active-class="`animated ${timeline.enterActiveClass}`"
          :leave-active-class="`animated ${timeline.leaveActiveClass}`"
          name="fade"
          mode="out-in">
          <blockquote
            v-for="(worklog, index) of timeline.worklog"
            v-show="timeline.activeIndex === index"
            v-html="worklog.quote"
            :key="worklog.id"
            class="timeline-quote">
          </blockquote>
        </transition-group>
      </article>
    </li>
  </ul>
</template>

<script>
import { getWorklogs } from '../api'
import { convertWorklog } from '../assets/js/app'

const FADE_IN_LEFT = 'fadeInLeft'
const FADE_IN_RIGHT = 'fadeInRight'
const FADE_OUT_LEFT = 'fadeOutLeft'
const FADE_OUT_RIGHT = 'fadeOutRight'
const paging = { page: 1, size: 24 }

export default {
  name: 'worklogs',

  data () {
    return {
      timelines: {}
    }
  },

  created () {
    getWorklogs(paging).then(worklogs => {
      worklogs.forEach(convertWorklog)

      const worklogList = []
      worklogs.forEach(worklog => worklogList.push(convertWorklog(worklog)))
      paging.page += 1
      addTimelineInfo(this, worklogList)
      this.$store.commit('concatArticleList', { category: this.$route.meta.category, list: worklogList })
    })
  },

  methods: {
    _sortTimelineYear (timelines) {
      const timelineList = []
      Object.keys(timelines).forEach(year => timelineList.unshift(timelines[year]))
      return timelineList
    },

    toggleTimelineMonth (timeline, index) {
      if (index > timeline.activeIndex) {
        timeline.enterActiveClass = FADE_IN_RIGHT
        timeline.leaveActiveClass = FADE_OUT_LEFT
      } else {
        timeline.enterActiveClass = FADE_IN_LEFT
        timeline.leaveActiveClass = FADE_OUT_RIGHT
      }

      timeline.activeIndex = index
    }
  }
}

function addTimelineInfo (vm, list) {
  list.forEach(worklog => {
    if (vm.timelines[worklog.year]) {
      vm.$store.state.inMobile ? vm.timelines[worklog.year].worklog.push(worklog) : vm.timelines[worklog.year].worklog.unshift(worklog)
    } else {
      vm.$set(vm.timelines, worklog.year, {
        activeIndex: 0,
        enterActiveClass: FADE_IN_RIGHT,
        leaveActiveClass: FADE_OUT_LEFT,
        color: worklog.color,
        year: worklog.year,
        worklog: [worklog]
      })
    }
  })
}
</script>


<style scoped>
.worklogs {
  padding: 2em;
  list-style: none;
  background-color: rgba(255, 255, 255, 0.8);
}

.timeline-bar {
  overflow: hidden;
  position: relative;
}

.timeline-bar::before {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  left: 3em;
  border-top: 1px solid currentColor;
  opacity: 0.2;
}

.timeline-year {
  float: left;
  width: 3em;
  line-height: 3em;
  text-align: center;
  border-radius: 50%;
  color: #fff;
  background-color: #0096ff;
}

.timeline-month {
  float: left;
  position: relative;
  width: 2em;
  height: 2em;
  margin-left: 2.5em;
  margin-top: 1em;
  font-size: 12px;
  line-height: 1.9em;
  text-align: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  color: currentColor;
  background-color: #fff;
  cursor: pointer;
}

.timeline-month--mobile {
  position: relative;
  margin-left: 0;
}

.timeline-month::after {
  content: "";
  display: none;
  position: absolute;
  bottom: -1em;
  left: 48%;
  height: 1em;
  border-left: 1px solid currentColor;
  opacity: 0.2;
}

.timeline-month.active::after {
  display: block;
}

.timeline-month-link {
  display: block;
  text-decoration: none;
}

.timeline-month-link--mobile {
  position: absolute;
  top: 50%;
  width: 1.5em;
  height: 1.5em;
  border: 1px solid currentColor;
  margin-top: -0.75em;
  margin-left: 0.75em;
  line-height: 1.5;
  border-radius: 50%;
  text-align: center;
  text-decoration: none;
  background-color: #fff;
}

.timeline-article {
  overflow: hidden;
  position: relative;
  top: -1.2em;
  height: 7em;
  margin-left: 3em;
  font-size: 14px;
  border: 1px solid #e9e9e9;
  border-radius: 0.5em;
}

.timeline-quote {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  position: absolute;
  width: 100%;
  padding: 0 1em;
  margin: 0;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  color: #404040;
}

.timeline-quote--mobile {
  position: relative;
  padding: 0 1em;
  border-bottom: 1px dashed #bfbfbf;
  margin-right: 0;
  margin-left: 3.5em;
  font-size: 12px;
  color: #404040;
  opacity: 0.6;
}

.timeline-quote--mobile::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  height: 35%;
  border-left: 1px dashed #bfbfbf;
  transform-origin: right bottom;
  transform: skewX(15deg);
}
</style>

<style>
.page__worklog-timeline .timeline-quote--mobile p {
  margin-bottom: 0.5em;
}
</style>
