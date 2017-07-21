<template>
  <div id="app">
      <words-add v-if="isAdd" :type="type" @on-back-check="switchCheck" @on-back-list="showWordsList"></words-add>
      <words-check v-if="isCheck" @on-add="addErrorWords" @on-list="showWordsList"></words-check>
      <words-list v-if="isList" @on-back-check="switchCheck" @on-add-words="addErrorWords" @on-add-ignore-words="addIgnoreWords"></words-list>
      <words-footer></words-footer>
  </div>
</template>

<script>
import wordsCheck from './components/wordsCheck'
import wordsFooter from './components/wordsFooter'
import wordsAdd from './components/wordsAdd'
import wordsList from './components/wordsList'
export default {
  data () {
    return {
      isAdd: false,
      isList: false,
      isCheck: true,
      type: 0
    }
  },
  components: {
    wordsCheck,
    wordsFooter,
    wordsAdd,
    wordsList
  },
  methods: {
    addErrorWords () {
        this.isAdd = true
        this.isList = false
        this.isCheck = false
        this.type = 0
    },
    switchCheck () {
        this.isAdd = false
        this.isList = false
        this.isCheck = true
    },
    showWordsList () {
        this.isCheck = false
        this.isAdd = false
        this.isList = true
    },
    addIgnoreWords () {
      this.isAdd = true
      this.isList = false
      this.isCheck = false
      this.type = 1
    }
  }
}
</script>

<style scoped>

</style>
