<template>
  <div class="login">
    <div class="header"></div>
    <Card class="p-login" dis-hover>
    <!-- <div class="message">用户登录</div> -->
    <div class="darkbannerwrap"></div>
    <Form
      ref="formDate"
      :model="form.formDate"
      :rules="form.ruleDate"
      :label-width="0"
      label-position="left"  class="form">
      <Form-item prop="username" :style="{'border-radius': '8px'}">
        <Input
          v-model="form.formDate.username"
          size="large"
          prefix="md-person"
          placeholder="请输入账号"
          :style="{'border-color': '#b9b9b9'}" class="input"/>
      </Form-item>
      <Form-item prop="password">
        <Input
          v-model="form.formDate.password"
          type="password"
          size="large"
          prefix="md-lock"
          placeholder="请输入密码" :style="{'border-color': '#b9b9b9'}"
          class="input" />
      </Form-item>
      <Form-item>
        <button
          @click.prevent="login" @keyup.enter.native="login()" :style="{'background-color': '#515a6e'}">
          登录
        </button>
      </Form-item>
    </Form>
  </Card>
  <Button @click="success" v-if="false" ></Button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        formDate: {},
        ruleDate: {
          username: [
            {
              required: true,
              message: '账号不能为空'
            }
          ],
          password: [
            {
              required: true,
              message: '密码不能为空'
            }
          ]
        }
      },
    }
  },
  methods: {
    success(){
      this.$Message.success('登录成功')
    },
    login () {

      this.axios.post('adminuser/login_adminuser',{aloginname:this.form.formDate.username,aloginpwd:this.form.formDate.password})
      .then(res=>{
        if(res.status ==200 && res.data.code==0){
          localStorage.clear()
          localStorage.setItem('ausername',res.data.obj.ausername)
          localStorage.setItem('schoolid',res.data.obj.schoolid)
          localStorage.setItem('auserid',res.data.obj.auserid)
          localStorage.setItem('atype',res.data.obj.atype)
          localStorage.setItem('aloginname',res.data.obj.aloginname)
          localStorage.setItem('levelid',res.data.obj.levelid)
          localStorage.setItem('schoolname',res.data.obj.schoolname)
          this.success()
          setTimeout(()=>{
          this.$router.push('/')
          },500)
        }else{
          this.$Message.error(res.data.msg)
        }
      })
      .catch(err => {
          this.$Message.error(this.$api.monmsg)
      })
    }
  }
}
</script>

<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
  display: inline-block;
  background: url("../assets/beij.jpg") no-repeat;
  background-size: cover;
  .header {
    width: 625px;
    height: 145px;
    position: relative;
    left: 50%;
    top: 18%;
    transform: translate(-50%,0);
    background: url("../assets/header.png") no-repeat;
    background-size: cover;
  }
}
.p-login,
.ivu-card,
.ivu-card-bordered,
.ivu-card-dis-hover {
  position: absolute !important;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -40%);
  background-color: white;
  width: 420px;
  button {
    border: none;
    width: 386px;
    height: 36px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    border-radius: 36px;
  }
}
.darkbannerwrap {
  width: 18px;
  height: 10px;
  margin: 0 0 20px -58px;
  position: relative;
}

</style>
<style lang="less">
.input {
  .ivu-input {
    border: 1px solid #b9b9b9;
    outline: none;
  }
}
</style>
