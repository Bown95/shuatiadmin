<template>
    <div>
        <myeditor ref="myQuillEditor0" :value="'<h1>dsdsd</h1>'"></myeditor>

        <button @click="getContent">获取值</button>
    </div>　
</template>

<script>
    import myeditor from '../../components/myeditor'
    export default {
        name: "editortest",
        components: {
            myeditor
        },

        methods:{
            getContent:function(){
                var content = this.$refs.myQuillEditor0.editor.container.firstChild.innerHTML;
                var content_txt = this.$refs.myQuillEditor0.editor.getText();
            }
        }
    }
</script>

<style scoped>

</style>
