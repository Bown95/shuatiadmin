import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login')
        },
        {
            path: '/',
            redirect: '/home/homepage',
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('@/views/home'),
            children: [
                {
                    path: 'homepage',
                    name: 'homepage',
                    component: () => import('@/views/home/homepage'),
                    meta: {
                        // title: '首页'
                    }
                },
                {
                    path: 'school',
                    name: 'school',
                    component: () => import('@/views/home/school'),
                    meta: {
                        title: '学校管理'
                    }
                },
                {
                    path: 'adminuser',
                    name: 'adminuser',
                    component: () => import('@/views/home/adminuser'),
                    meta: {
                        title: '管理用户'
                    }
                },
                {
                    path: 'level',
                    name: 'level',
                    component: () => import('@/views/home/level'),
                    meta: {
                        title: '学段管理'
                    }
                },
                {
                    path: 'subject',
                    name: 'subject',
                    component: () => import('@/views/home/subject'),
                    meta: {
                        title: '科目管理'
                    }
                },
                {
                    path: 'book',
                    name: 'book',
                    component: () => import('@/views/home/book'),
                    meta: {
                        title: '教材管理'
                    }
                },
                {
                    path: 'teacher',
                    name: 'teacher',
                    component: () => import('@/views/home/teacher'),
                    meta: {
                        title: '教师管理'
                    }
                },
                {
                    path: 'user',
                    name: 'user',
                    component: () => import('@/views/home/user'),
                    meta: {
                        title: '学生管理'
                    }
                },
                {
                    path: 'director',
                    name: 'director',
                    component: () => import('@/views/home/director'),
                    meta: {
                        title: '章节管理'
                    }
                },
                {
                    path: 'know',
                    name: 'know',
                    component: () => import('@/views/home/know'),
                    meta: {
                        title: '知识点管理'
                    }
                },
                {
                    path: 'question',
                    name: 'question',
                    component: () => import('@/views/home/question'),
                    meta: {
                        title: '试题管理'
                    }
                },
                {
                    path: 'test_editor',
                    name: 'test_editor',
                    component: () => import('@/views/home/test_editor'),
                    meta: {
                        title: '试题管理'
                    }
                },
                {
                    path: 'test_export',
                    name: 'test_export',
                    component: () => import('@/views/home/test_export'),
                    meta: {
                        title: '试题管理'
                    }
                }
            ]
        },

    ]
})
