<template>
	<div class="container">
    <div class="head" :class="{'page-head': errorLength}">
      <div class="pull-right error-count" v-if="errorLength">发现违禁词共<i class="text-danger">{{errorLength}}</i>处</div>
      <label for="words">违禁词检查工具</label>
      <el-button type="text" @click="wordsAdd">添加违禁词</el-button>
      <el-button type="text" @click="wordsList">违禁词列表</el-button>
    </div>
		<template v-if="!hasForbiddenWords">
			<div class="box">
				<textarea cols="60" rows="20" v-focus placeholder="请在此处输入待检测的内容，最多不能超过10W个字符，您可以使用快捷键Ctrl+Enter快速提交检查！" v-model="words" id="words" @keyup.ctrl.enter="checkWords"></textarea>
			</div>
      <span v-if="numberCount">您共输入了<i class="text-lg" v-text="numberCount"></i>个字符！</span>
			<el-button type="primary" class="pull-right" @click="checkWords" :loading="isLoading">检查</el-button>
		</template>
		<template v-if="isShowForbiddenWords">
			<el-dialog title="违禁词信息" :visible.sync="dialogTableVisible">
			  <el-table :data="fbData">
          <el-table-column property="text" label="文本上下文"></el-table-column>
			    <el-table-column property="word" label="违禁词"></el-table-column>
			  </el-table>
			</el-dialog>
		</template>
		<template v-if="hasForbiddenWords">
			<div class="words-wrapper" v-html="text"></div>
			<el-button type="primary" class="pull-right" @click="showForbiddenWords">显示违禁词</el-button>
			<el-button class="pull-right mr10" @click="backCheckWords">返回</el-button>
		</template>
		<el-dialog
		  title="提示"
		  :visible.sync="dialogVisible"
		  size="tiny"
		  :before-close="handleClose">
		  <span><i class="text-lg" :class="dialogIcon"></i>{{dialogText}}</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		  </span>
		</el-dialog>
    <template v-if="isOverMax">
      <el-dialog
        title="提示"
        :visible.sync="isOverMax"
        size="tiny"
        :before-close="cancelSliceStr">
        <span><i class="text-lg el-icon-warning text-warning"></i>您输入的内容已经超过最大限制（100000个字符），继续输入将会被截断，确认继续吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelSliceStr">取消</el-button>
		    <el-button type="primary" @click="sliceStr">确 定</el-button>
		  </span>
      </el-dialog>
    </template>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				words: '',
				text: '',
				isLoading: false,
				dialogVisible: false,
				hasForbiddenWords: false,
				isShowForbiddenWords: false,
				fbData: [],
        dialogText: '',
				dialogTableVisible: false,
        dialogIcon: '',
        numberCount: 0,
        errorLength: 0,
        isOverMax: false
			}
		},
    directives: {
		  focus: {
        inserted (el) {
            el.focus()
        }
      }
    },
    watch: {
		    words (val) {
        this.numberCount = val.trim().replace(/[\r\n]{2,}/g, "\r\n").length
        if(this.numberCount > 100000) {
          this.isOverMax = true
        }
      }
    },
		methods: {
			checkWords () {
        if(this.numberCount <= 100000) {
          if(this.words.trim() !== '') {
            this.isLoading = true
            this.$http.post("/words/checkwords.php", {
              text: this.words.trim()
            }).then((res) => {
              //不存在违禁词
              if(res.data.status) {
                this.dialogVisible = true
                this.dialogText = '恭喜，您输入的内容不包含违禁词！'
                this.dialogIcon = 'el-icon-circle-check text-success'
              }else {
                this.hasForbiddenWords = true
                this.fbData = res.data.error
                this.errorLength = res.data.error.length
                this.text = res.data.text
              }
              this.isLoading = false
            }, (err) => {
              this.isLoading = false
              this.dialogVisible = true
              this.dialogText = '发生内部错误，请稍后再试！'
              this.dialogIcon = 'el-icon-circle-close text-danger'
            })
          }
        }else {
          this.isOverMax = true
        }
			},
			backCheckWords () {
				this.hasForbiddenWords = false
        this.errorLength = 0
			},
			handleClose (done) {
				this.dialogVisible = false
				done()
			},
			showForbiddenWords () {
				this.isShowForbiddenWords = true
				this.dialogTableVisible = true
			},
      sliceStr () {
        this.words = this.words.trim().substring(0, 99999)
        this.isOverMax = false
      },
      cancelSliceStr () {
			    this.words = ''
          this.isOverMax = false
      },
      wordsAdd () {
			    this.$emit('on-add')
      },
      wordsList () {
			    this.$emit('on-list')
      }
		}
	}
</script>

<style>
  * {
    box-sizing: border-box;
  }
	.container {
		width: 80%;
		margin-left: auto;
		margin-right: auto;
	}
  .page-head {
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
  label {
    display: inline-block;
    font-size: 24px;
    padding: 15px 0;
  }
  .error-count {
    padding: 15px 0;
    font-size: 16px;
  }
	textarea {
    display: block;
    width: 100%;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    margin-bottom: 20px;
	}
  h1 {
    font-size: 24px;
  }
  .text-success {
    color: #13CE66;
  }
  .text-danger {
    color: #FF4949;
  }
  .text-warning {
    color: #F7BA2A;
  }
  .text-info {
    color: #20A0FF;
  }
  .text-lg {
    font-size: 24px;
    vertical-align: middle;
    margin-right: 5px;
  }
	.pull-right {
		float: right;
	}
  .mr10 {
    margin-right: 10px !important;
  }
  .mr20 {
    margin-right: 20px !important;
  }
  .ml20 {
    margin-left: 20px !important;
  }
  .words-wrapper {
    max-height: 480px;
    overflow: auto;
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 15px;
  }
  .words-wrapper b {
    color: #FF4949;
    font-size: 18px
  }
</style>
