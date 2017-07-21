<template>
  <div v-loading="loading1" element-loading-text="拼命加载中">
    <template v-if="!firstIn">
      <template>
        <el-alert
          title="操作提示"
          type="info"
          description="点击每个违禁词，即可执行删除操作，是不是很简单！"
          show-icon>
        </el-alert>
      </template>
      <el-button type="text" @click="addWords" class="pull-right mr20">添加违禁词</el-button>
      <el-button type="text" @click="backHome" class="pull-right mr20">返回首页</el-button>
      <h2>违禁词列表<el-button type="text" class="ml20" @click="addWords">违禁词添加</el-button></h2>
      <div>
        <transition-group tag="ul" name="list">
          <li v-for="forbidden in forbiddens" :key="forbidden" @click="deleteItem(forbidden, 'forbidden')">{{forbidden}}</li>
        </transition-group>
        <h2>排除的违禁词列表<el-button type="text" class="ml20" @click="addIgnoreWords">排除违禁词添加</el-button></h2>
        <ul>
          <transition-group tag="ul" name="list">
            <li v-for="ignore in ignores" :key="ignore" @click="deleteItem(ignore, 'ignore')">{{ignore}}</li>
          </transition-group>
        </ul>
      </div>
    </template>
    <template v-if="dialogVisible">
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        size="tiny">
        <span><i class="text-lg" :class="dialogIcon"></i>{{dialogText}}</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="handleDelete" :loading="isLoading">{{dialogBtnText}}</el-button>
		  </span>
      </el-dialog>
    </template>
    <template v-if="firstIn">
      <el-dialog
            title="操作前须知"
            :visible.sync="firstIn"
            :before-close="backHome"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            size="tiny">
            <span>该页面将展示排查时过滤的违禁词以及取消过滤的违禁词，您可以在此页面点击对应的违禁词进行删除操作，请慎重进行操作，删除后将不能够恢复，点击<strong class="text-info">我已知晓</strong>，24小时之内不会出现该提示。确定要继续访问吗？</span>
            <span slot="footer" class="dialog-footer">
          <el-button @click="backHome">返回</el-button>
          <el-button type="primary" @click="confirmList">我已知晓</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
export default {
    data () {
        return {
          forbiddens: [],
          ignores: [],
          dialogVisible: false,
          isLoading: false,
          dialogBtnText: '确定',
          firstIn: false,
          word: '',
          type: ''
        }
    },
    methods: {
      deleteItem (item, type) {
        this.dialogVisible = true
        this.dialogBtnText = '确定'
        this.dialogText = "你确定要删除“"+item+"”这条数据吗？";
        this.dialogIcon = 'el-icon-delete text-danger'
        this.word = item
        this.type = type
      },
      handleDelete () {
        this.isLoading = true
        this.loading1 = true
        this.dialogBtnText = '删除中'
        this.$http.post('/words/delete.php', {
            type: this.type,
            word: this.word
        }).then(res=>{
            if(res.data.status) {
              this.isLoading = false
              this.forbiddens = res.data.forbidden
              this.ignores = res.data.ignore
              this.$notify({
                title: '成功',
                message: res.data.text,
                type: 'success'
              });
              this.dialogVisible = false
              this.loading1 = false
            }else {
              this.isLoading = false
              this.$notify({
                title: '失败',
                message: res.data.text,
                type: 'error'
              });
              this.dialogVisible = false
              this.loading1 = false
            }
        },err=>{
          this.isLoading = false
          this.dialogIcon = 'el-icon-circle-close text-danger'
          this.dialogText = '发生内部错误，请稍后再试！';
          this.dialogBtnText = '确定'
          this.loading1 = false
        })
      },
      confirmList () {
        this.firstIn = false
        this.$cookies.set('isKnown', 1, '1d')
        this.loading1 = true
        this.$http.post('/words/list.php').then(res=>{
          this.forbiddens = res.data.forbidden
          this.ignores = res.data.ignore
          this.loading1 = false
        }, err => {
            this.loading1 = false
        })
      },
      backHome () {
          this.$emit("on-back-check")
      },
      addWords () {
          this.$emit('on-add-words')
      },
      addIgnoreWords () {
          this.$emit('on-add-ignore-words')
      }
    },
    mounted () {
        let isKnown = this.$cookies.get('isKnown')
        if(isKnown) {
          this.loading1 = true
          this.$http.post('/words/list.php').then(res=>{
            this.forbiddens = res.data.forbidden
            this.ignores = res.data.ignore
            this.loading1 = false
          },err=>{
              this.loading1 = false
          })
        }else {
            this.loading1 = false
            this.firstIn = true
        }
    }
}
</script>

<style scoped="">
  h2 {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    position: relative;
    margin-left: 20px;
  }
  h2:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -20px;
    display: block;
    width: 5px;
    height: 100%;
    background-color: #20a0ff;
  }
  ul {
    list-style: none;
    padding-left: 0;
  }
  ul li {
    display: inline-block;
    padding: 15px;
    cursor: pointer;
  }
  ul li:hover {
    color: #fff;
    background-color: #20A0FF;
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter {
    opacity: 0;
    transform: translateY(30px)
  }
</style>
