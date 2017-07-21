<template>
  <div class="container">
    <div class="page-head">
      <el-button type="text" @click="backList" class="pull-right mr20">违禁词列表</el-button>
      <el-button type="text" @click="backCheck" class="pull-right mr20">返回首页</el-button>
      <h1>违禁词添加</h1>
    </div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="违禁词">
        <template v-if="ruleForm.addtype===1">
          <el-input v-model.trim="ruleForm.words" placeholder="请输入一个违禁词"></el-input>
        </template>
        <template v-if="ruleForm.addtype===2">
          <el-input type="textarea" autosize :rows="2" placeholder="请输入违禁词信息，每行对应一个违禁词信息！" v-model.trim="ruleForm.words"></el-input>
        </template>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择添加的违禁词类型">
          <el-option label="违禁词" :value="0"></el-option>
          <el-option label="排除检测的违禁词" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加方式" prop="addtype">
        <el-radio-group v-model="ruleForm.addtype">
          <el-radio :label="1">单个添加</el-radio>
          <el-radio :label="2">批量添加</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="backCheck">返回</el-button>
      </el-form-item>
    </el-form>
    <template v-if="dialogVisible">
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        size="tiny">
        <span><i class="text-lg" :class="dialogIcon"></i>{{dialogText}}</span>
        <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		  </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      type: {
          type: Number,
          default: 0
      }
    },
    data() {
      return {
        ruleForm: {
          words: '',
          type: this.type,
          addtype: 1
        },
        dialogVisible: false,
        dialogText: '',
        dialogIcon: '',
        showDialog: false
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.ruleForm.words) {
            this.$http.post('/words/add.php', this.ruleForm).then((res)=>{
              this.dialogVisible = true
              this.dialogText = res.data.text
              if(res.data.status) {
                this.dialogIcon = 'el-icon-circle-check text-success'
              }else {
                this.dialogIcon = 'el-icon-circle-close text-danger'
              }
              this.ruleForm.words = ''
            }, (err)=> {
              this.dialogVisible = true
              this.dialogText = '发生内部错误，请重试！'
              this.dialogIcon = 'el-icon-circle-close text-danger'
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      backCheck () {
          this.$emit("on-back-check")
      },
      backList () {
          this.$emit('on-back-list')
      }
    }
  }
</script>

<style scoped="">
</style>
