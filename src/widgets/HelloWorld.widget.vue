<template>
  <h1>Hello, {{ value }}!</h1>
</template>

<script>
// example widget without TypeScript :)
import { run } from '@/utils'

export default {
  name: 'HelloWorld',
  data: () => ({
    value: null,
  }),
  async mounted() {
    this.value = (await run(`whoami`)).trim()
  },
}
</script>

<style scoped lang="scss">
h1 {
  color: #fff;
  font-weight: 200;
  font-size: 3em;
  position: fixed;
  top: 50%;
  left: 44px;
  transform: translateY(-100%);
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
