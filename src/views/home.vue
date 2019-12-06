<template>
  <div class="layout">
    <Layout>
      <Header :style="{padding: 0}" class="layout-header-bar">
        <router-link tag="span" to="/" :style="{margin:'0 30px 0 25px',cursor:'pointer'}">刷题后台管理</router-link>
        <Icon @click.native="collapsedSider" :style="{margin:'0 20px 0 0',cursor:'pointer'}" type="md-menu" size="24"></Icon>
        <Dropdown class="admin" @on-click="clear">
          <a href="javascript:void(0)">
            {{username}}
            <Icon type="md-arrow-dropdown" />
          </a>
          <DropdownMenu slot="list">
            <DropdownItem>退出</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Header>
      <div class="layout">
        <Layout>
          <Sider ref="side" hide-trigger collapsible :collapsed-width="0" v-model="isCollapsed">
            <Menu active-name="1" theme="light" width="auto" :open-names="['1']" :accordion=true @on-select="band">
              <MenuItem v-if="tag" name="学校管理" to='/home/school'>
                <Icon type="md-cube" />
                学校管理
              </MenuItem>
              <MenuItem v-if="tag" name="管理用户" to='/home/adminuser'>
                <Icon type="ios-contact" />
                管理用户
              </MenuItem>
              <MenuItem v-if="tag" name="学段管理" to='/home/level'>
                <Icon type="logo-buffer" />
                学段管理
              </MenuItem>
              <MenuItem v-if="tag1" name="教师管理" to='/home/teacher'>
                <Icon type="ios-person" />
                教师管理
              </MenuItem>
              <MenuItem name="学生管理" to='/home/user'>
                <Icon type="md-people" />
                学生管理
              </MenuItem>
              <MenuItem name="科目管理" to='/home/subject'>
                <Icon type="md-bookmarks" />               
                科目管理
              </MenuItem>
              <MenuItem name="教材管理" to='/home/book'>
                <Icon type="ios-book" />                
                教材管理
              </MenuItem>
              <MenuItem name="章节管理" to='/home/director'>
                <Icon type="md-bookmark" />
                章节管理
              </MenuItem>
              <MenuItem v-if="tag" name="知识点管理" to='/home/know'>
                <Icon type="ios-card" />
                知识点管理
              </MenuItem>
              <MenuItem name="试题管理" to='/home/question'>
                <Icon type="ios-document" />
                试题管理
              </MenuItem>
            </Menu>
          </Sider>
          <Content :style="{ background: '#fff'}">
            <breadcrumb></breadcrumb>
            <router-view :style="{padding:'0px 20px 12px'}"></router-view>
          </Content>
        </Layout>
      </div>
      <Footer>
        <!-- <p>联系地址：郑州市平安大道湖心环路交叉口建业智慧港D座7楼</p> -->
        <p>技术支持：河南星火燎原软件科技有限公司</p>
        <!-- <p>豫ICP备17031890号-1</p> -->
      </Footer>
    </Layout>
  </div>
</template>
<script>
  import breadcrumb from '@/components/breadcrumb'
  export default {
    data () {
      return {
        tag:false,
        tag1:false,
        atype: localStorage.getItem("atype"),
        isCollapsed: false,
        username: localStorage.getItem('ausername')
      }
    },
    methods: {
      collapsedSider () {
        this.$refs.side.toggleCollapse()
      },
      band(name){
        // console.log(name)
      },
      clear(){
        this.$store.commit('clear')
        this.$router.push('/login')
        localStorage.clear()
      }
    },
    components: {
      breadcrumb
    },
    created(){
      if (this.atype==0) {
        this.tag = true
        this.tag1 = true
      }
      if(this.atype==1){
        this.tag1 = true
      }
    }
  }
</script>

<style scoped lang="less">
.layout{
  position: relative;
  overflow: hidden;
  height: 100%;
  .ivu-layout {
    height: 100%;
  }
}
.ivu-layout-header {
  // background-color: #24262F !important;
  color: #fff;
  font-size: 18px;
  height: 55px;
  line-height: 55px;
}
.layout-header-bar {
  a {
    font-size: 16px;
    color: #fff;
    margin-right: 20px;
  }
  .admin {
    float: right;
  }
}
.ivu-layout-sider {
  background-color: #fff !important;
  // .ivu-menu-item {
  //   border-bottom: 1px solid #eee;
  // }
}
.ivu-menu {
  height: 100%;
}
.ivu-layout-footer {
  margin: 0;
  padding: 8px;
  background-color: #24262F !important;
  line-height: 50px;
  box-sizing: border-box;
  color: #fff;
  p {
    line-height: 15px;
    margin-top: 3px;
    text-align: center;
  }
}
.ivu-menu-vertical .ivu-menu-item,
.ivu-menu-vertical .ivu-menu-submenu-title {
  padding: 12px 24px;
}

</style>