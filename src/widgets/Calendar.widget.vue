<template>
  <v-calendar
    ref="calendar"
    :attributes="attributes"
    :color="primaryColor"
    :style="{ color: primaryColor }"
    is-inline
  />
</template>

<script lang="ts">
import { mapState } from 'vuex'
import { Component, Vue } from 'vue-property-decorator'
import VCalendar from 'v-calendar'
import { sleep } from '@/utils'

Vue.use(VCalendar, {
  language: Intl.DateTimeFormat().resolvedOptions().locale,
})

interface VCalendarType extends Vue {
  move: (date: Date) => void
}

interface CalendarOptions {
  key: string
  highlight: boolean
  dates: Date
}

@Component({
  computed: {
    ...mapState(['primaryColor']),
  },
})
export default class Calendar extends Vue {
  primaryColor!: string
  attributes: CalendarOptions[] | null = null
  date: Date = new Date()

  $refs!: {
    calendar: VCalendarType
  }

  mounted() {
    this.tick()
  }

  async tick(): Promise<void> {
    this.date = new Date()
    this.attributes = [
      {
        key: 'today',
        highlight: true,
        dates: this.date,
      },
    ]
    await this.$nextTick()
    if (this.$refs.calendar) {
      this.$refs.calendar.move(this.date)
    }
    await sleep(300_000) // 5 minutes
    this.tick()
  }
}
</script>

<style lang="scss" scoped>
.vc-container {
  background: none;
  border: none;
  position: fixed;
  bottom: 0;
  left: 30px;

  ::v-deep {
    * {
      color: currentColor !important;
    }
    .vc-arrows-container {
      display: none;
    }
    .vc-highlight {
      background: transparent;
      border: 1px solid currentColor;
      margin-right: -0.5px;
    }
    .vc-text-white {
      color: currentColor;
    }
    .vc-weekday {
      color: currentColor;
    }
    .vc-title-layout {
      justify-content: flex-start;
    }
    .vc-header {
      padding: 10px 3px;
      margin: 0 18px;
      border-bottom: 1px solid currentColor;
    }
    .vc-title {
      padding: 0;
      margin-left: -4px;
      font-weight: 400;
      font-size: 1.2em;
      letter-spacing: 1px;
    }
  }
}
</style>
