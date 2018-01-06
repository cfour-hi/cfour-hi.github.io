<template>
  <div id="worklogs">
    <worklogs-placeholder v-if="!Object.keys(timelines).length"></worklogs-placeholder>
    <ul v-else class="timelines">
      <li v-for="timeline in timelines" :key="timeline.year">
        <dl class="timeline-bar" :style="{ color: timeline.color }">
          <dt class="timeline-year" :style="{ backgroundColor: timeline.color }">{{ timeline.year }}</dt>
            <dd
              v-for="({ id, color, number, month }, index) of timeline.worklogs"
              :key="id"
              :class="{ active: timeline.activeIndex === index }"
              :style="[ timeline.activeIndex === index ? { color: color, backgroundColor: color, borderColor: color } : '' ]"
              class="timeline-month"
              @mouseover="handleToggleTimelineMonth(timeline, index)">
              <router-link
                :to="`${number}`"
                :style="{ color: timeline.activeIndex === index ? '#fff' : timeline.color }"
                class="timeline-month-link"
                append>
                {{ month }}
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
              v-for="(worklog, index) of timeline.worklogs"
              v-show="timeline.activeIndex === index"
              v-html="worklog.summary"
              :key="worklog.id"
              class="timeline-quote">
            </blockquote>
          </transition-group>
        </article>
      </li>
    </ul>
  </div>
</template>

<script>
import WorklogsPlaceholder from './WorklogsPlaceholder'
import { getArticlesByRepoName } from '../api'
import { convertWorklog } from '../assets/js/app'

const FADE_IN_LEFT = 'fadeInLeft'
const FADE_IN_RIGHT = 'fadeInRight'
const FADE_OUT_LEFT = 'fadeOutLeft'
const FADE_OUT_RIGHT = 'fadeOutRight'
const paging = { page: 1, size: 36 }

const convertTimeline = function (worklogs) {
  const timelines = {}

  worklogs.forEach(worklog => {
    const { year, color } = worklog

    if (timelines[year]) {
      timelines[year].worklogs.unshift(worklog)
    } else {
      timelines[year] = {
        activeIndex: 0,
        enterActiveClass: FADE_IN_RIGHT,
        leaveActiveClass: FADE_OUT_LEFT,
        color: color,
        year: year,
        worklogs: [worklog]
      }
    }
  })

  return timelines
}

export default {
  name: 'worklog-articles',

  components: { WorklogsPlaceholder },

  data () {
    return {
      timelines: {}
    }
  },

  created () {
    const { key: repoKey, name: repoName } = this.$route.meta.repository
    getArticlesByRepoName(repoName, paging.page, paging.size)
      .then(articles => {
        articles.forEach(convertWorklog)

        this.timelines = convertTimeline(articles)
        paging.page += 1

        this.$store.commit('updateSpecifyArticles', { articles, key: repoKey })
      })
  },

  methods: {
    handleToggleTimelineMonth (timeline, index) {
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
</script>


<style scoped>
#worklogs {
  padding: 2em;
  background-color: rgba(255, 255, 255, 0.8);
}

.timelines {
  display: flex;
  flex-direction: column-reverse;
  padding: 0;
  margin: 0;
  list-style: none;
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
</style>
