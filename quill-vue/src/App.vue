<template>
  <div id="app" ref="app" class="home">
    <div v-if="viewType === 0" class="editor-box">
      <div id="toolbar">
        <!-- Add font size dropdown -->
        <select class="ql-header">
          <option value="1">标题1</option>
          <option value="2">标题2</option>
          <option value="3">标题3</option>
          <option selected>正文</option>
        </select>
        <!-- 粗体 -->
        <button class="ql-bold"></button>
        <!-- 斜体 -->
        <button class="ql-italic"></button>
        <!-- 下划线 -->
        <button class="ql-underline"></button>
        <button class="ql-code-block"></button>
        <select class="ql-align"></select>
        <select class="ql-color"></select>
        <select class="ql-background"></select>
        <button class="ql-image"></button>
        <button class="ql-link"></button>
        <button class="ql-video"></button>
        <!-- Add subscript and superscript buttons -->
        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>
      </div>
      <div class="topic-title-box">
        <input v-model="title" class="topic-title" type="text" placeholder="请输入标题">
      </div>
      <div class="div-1px"></div>
      <div ref="editor" class="quill-box"></div>
      <Upload multiple ref="upload" class="file-button" :accept="accept" :before-upload="beforeUpload" :on-success="handleSuccess" :on-error="handleError" :on-progress="handleProgress" :max-size="2048" :format="['jpg','jpeg','png','gif']"
        :action="formUrl" :data="uploadData"></Upload>
    </div>
    <!-- <div v-else class="editor-box">
      <div class="quill-box quill-editor ql-container ql-snow">
        <div class="ql-editor" v-html="html"></div>
      </div>
    </div> -->
    <!-- 文本显示处 -->
    <div v-else class="quill-box quill-editor ql-container ql-snow">
      <h1 class="title">{{topic.title}}</h1>
      <div class="topic-info">
        <div class="info-left">
          <img class="avatar" :src="author.avatar" :alt="author.nickname">
          <span class="nickname">{{author.nickname}}</span>
        </div>
        <div class="info-right">
          <div class="btn-success btn">关注</div>
        </div>
      </div>
      <div class="ql-editor" ref="content" v-html="html"></div>
    </div>
  </div>
</template>
<script>
import 'quill/dist/quill.snow.css';
import 'highlight.js/styles/tomorrow-night.css';
import Upload from './components/upload/Upload';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module'; // 富文本支持改变图片大小
import Config from './config/config.js';
import hljs from 'highlight.js/lib/highlight'; // 这样能避免把所有的语言引入
console.log('hljs', hljs);
Quill.register('modules/imageResize', ImageResize);

export default {
  data() {
    return {
      quill: null,
      html: '',
      show: false,
      title: '',
      topic: {},
      author: {
        nickname: '',
        avatar: '',
        name: ''
      },
      _html: '',
      formUrl: `http://up-z2.qiniu.com`, // 七牛cdn
      qiniu_store: `http://poq55glum.bkt.clouddn.com/`, // 七牛仓库
      // formUrl: `${location.protocol}https://up-z2.qiniu.com`, // 七牛cdn
      // qiniu_store: `${location.protocol}https://poq55glum.bkt.clouddn.com/`, // 七牛仓库
      uploadData: {}, // 表单传递的data
      qiniu_token: '', // 七牛token
      fullscreenLoading: false, // 上传读条
      uploadType: 'image', // 上传类型
      getTokenCallBack: null, // 获取token回调
      accept: 'image/*', // file 读取文件类型
      viewType: window.viewType || 0,
      tableHeight: '500',
      screenHeight: window.innerHeight
    };
  },
  created() {
    try {
      console.log('view TYpe', window, window.viewType, this.viewType);
      // 监听原生调用，发送给原生应用标题和内容
      window.WV_viewType = type => {
        console.log('WV_viewType', type);
        this.viewType = type;
      };
      window.WV_getHtml = () => {
        console.log(this.html);
        this.sendToRN('SUBMIT', {
          title: this.title,
          html: this.html
        });
      };
      // 获取token
      window.WV_qiniuToken = token => {
        console.log('token', token);
        // this.qiniu_token = token;
        if (this.getTokenCallBack) this.getTokenCallBack(token);
      };
      // 获取html
      window.WV_renderHtml = topic => {
        console.log('WV_renderHtml ', topic);
        this.html = topic.content;
        this.topic = topic;
        this.author = topic.author;
      };
      // // 撤回 后撤 ctrl + z
      window.WV_undo = () => {
        console.log('vue 后撤', this.quill);
        if (this.quill) this.quill.history.undo();
      };
      // 撤回 前撤 ctrl + y
      window.WV_redo = () => {
        console.log('vue 前撤');
        if (this.quill) this.quill.history.redo();
      };
      // qiniu上传结果
      window.WV_qiniuUpload = e => {
        console.log('上传', e);
        this.handleSuccess(e);
      };
    } catch (error) {
      console.error('created error', error);
    }
  },
  mounted() {
    try {
      if (!this.viewType) {
        let _this = this;

        const languages = Object.keys(Config.height_config.languages);
        if (languages.length > 0) {
          // 注册高亮语言
          languages.forEach((language, index) => {
            hljs.registerLanguage(
              language,
              Config.height_config.languages[language]
            );
          });
        }
        hljs.initHighlightingOnLoad();
        this.quill = new Quill(this.$refs.editor, {
          placeholder: '',
          theme: 'snow',
          modules: {
            syntax: {
              highlight: function(text) {
                return hljs.highlightAuto(text).value;
              }
            },
            toolbar: {
              container: '#toolbar', // Selector for toolbar container
              handlers: {
                image(value) {
                  if (value) {
                    // this.uploadType = "image";
                    document.querySelector('.upload-button').click(); // 触发图片上传
                    console.log('value', value);
                  } else {
                    _this.quill.format('image', false);
                  }
                }
              }
            },
            imageResize: {
              displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              }
            }
          }
        });
        this.quill.on('scroll-optimize', (delta, oldDelta, source) => {
          // console.log('scroll-optimize', delta, oldDelta, source);
          let html = this.$refs.editor.children[0].innerHTML;
          this.html = html.replace('contenteditable="true"', ''); // 去除div可编辑状态
          // html.replace('contenteditable="true"', '');
        });
      }
      const updateHeight = () => {
        console.log('document.title', document.title);
        this.sendToRN('HEIGHT', {
          show: true,
          height: this.$refs.app.clientHeight
          // height: window.screenHeight
        });
      };
      updateHeight();
      window.addEventListener('load', function() {
        updateHeight();
      });
      window.addEventListener('resize', updateHeight);
    } catch (error) {
      console.error('mounted', error);
    }
  },
  methods: {
    /**
     * 发送数据给原生端
     * @param {String} type 类型
     * @param {Object} data 数据
     */
    sendToRN(type = '', data = {}) {
      try {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type,
            data
          })
        );
      } catch (error) {
        console.error('send to rn error', error);
      }
    },
    beforeUpload(file) {
      console.log('befor upload', file);

      return this.qiniuUpload(file);
    },
    getToken(file, suffix, time, ext, cb) {
      return new Promise((res, rej) => {
        this.sendToRN('QN_TOKEN', {});
        let _this = this;
        this.getTokenCallBack = function(token) {
          _this.uploadData = {
            key: `image/${suffix.join('.')}_${time}.${ext}`,
            token
          };
          res(_this.uploadData);
        };

        // setTimeout(() => {
        //   this.getTokenCallBack(
        //     'AXSX8STI4-PDHtgqck2QKC7ku7T7NBw5gstidw2e:-zg5YzSeX8B7dXjyYtvGnVKxjbk=:eyJzY29wZSI6IndlYjItY2x1YiIsImRlYWRsaW5lIjoxNTUzNDk5MzI4fQ=='
        //   );
        // }, 2000);
      });
    },
    // getObjectURL(file) {
    //   var url = null;
    //   if (window.createObjectURL != undefined) {
    //     // basic
    //     url = window.createObjectURL(file);
    //   } else if (window.URL != undefined) {
    //     // mozilla(firefox)
    //     url = window.URL.createObjectURL(file);
    //   } else if (window.webkitURL != undefined) {
    //     // web_kit or chrome
    //     url = window.webkitURL.createObjectURL(file);
    //   }
    //   return url;
    // },
    qiniuUpload(file) {
      this.fullscreenLoading = true;
      const suffix = file.name.split('.');
      const ext = suffix.splice(suffix.length - 1, 1)[0];
      // if (this.uploadType === "image") {
      // return promise 的原因是让this.uploadData 与form表单同步
      // 否则在this.uploadData值之前表单就会提交
      // console.log("进入这里");
      let time = new Date().getTime();
      return this.getToken(file, suffix, time, ext);
      // } else if (this.uploadType === "video") {
      // }
    },
    handleProgress(e, file) {
      console.log('handleProgress', e);
    },
    handleError(e, response) {
      console.log('error', e, response);
    },
    handleSuccess(e, file = {}, fileList = []) {
      this.fullscreenLoading = false;
      let url = '';
      if (this.uploadType === 'image') {
        // 获得文件上传后的URL地址
        console.log('handleSuccess', e);
        console.log('handleSuccess', file);
        console.log('handleSuccess', fileList);
        url = this.qiniu_store + e.key;
      } else if (this.uploadType === 'video') {
        url = STATVIDEO + e.key;
      }

      // 获取富文本组件实例
      // 如果上传成功
      if (url) {
        // 获取光标所在位置
        let length = this.quill.getSelection().index;
        this.quill.insertEmbed(
          length,
          this.uploadType,
          url,
          Quill.sources.USER
        );
        // 调整光标到最后
        this.quill.setSelection(length + 1);
      } else {
        // 提示信息，需引入Message
        console.error('图片插入失败');
      }
    }
  },
  components: { Upload }
};
</script>
<style lang="scss" scoped>
@import './assets/common.scss';
.editor-box {
  -webkit-overflow-scrolling: touch;
  height: 100vh;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;

  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  -webkit-flex-direction: column;
}
.ivu-upload {
  display: none;
}
.div-1px {
  margin-top: 20px;
  @include border-w-1px();
}
.topic-title {
  font-size: 38px;
  font-weight: 600;
  border: none;
  box-flex: 1;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  flex: 1;
  -webkit-flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  font-family: Menlo, Monaco, Consolas, Courier New, monospace, monospace;
  background: none;
  outline: none;
  border: 0px;
  margin-left: 25px;
  &:focus {
    outline: none;
  }
}
.file-button {
  visibility: hidden;
  height: 0;
  width: 0;
}
#toolbar {
  /* visibility: hidden; */
  /* height: 3rem;
    overflow: scroll; */
}
.quill-box {
  // box-flex: 1;
  // -webkit-box-flex: 1;
  // -moz-box-flex: 1;
  // flex: 1;
  // -webkit-flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  font-family: Menlo, Monaco, Consolas, Courier New, monospace, monospace;
  /* min-height: 150px; */
  // height: auto;
}
.ql-toolbar.ql-snow {
  border: none;
}
.editor-contener {
  text-align: left;
}
.ql-container {
  font-size: 28px;
}
.ql-snow .ql-tooltip {
  z-index: 30;
}

.quill-box h1 {
  font-weight: 500;
}
.quill-box h2 {
  font-weight: 500;
}
.quill-box h3 {
  font-weight: 500;
}
.quill-box pre {
  font-family: Menlo, Monaco, Consolas, Courier New, monospace, monospace;
  font-size: 28px;
}

.ql-container.ql-snow {
  border: none;
}
.quill-box {
  border-left: none;
  border-right: none;
}
.ql-container.ql-snow.ql-editor {
  padding: 0;
  min-height: 120px;
}
button {
  color: red;
}
.title {
  font-size: 38px;
  font-weight: 600;
  padding: 0 24px;
}
.topic-info {
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .info-left {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    line-height: 60px;
    .avatar {
      width: 60px;
      height: 60px;
      margin: 0, 24px 0 0;
      display: inline-block;
    }
    .nickname {
      display: inline-block;
      font-weight: 500;
      font-size: 24;
    }
  }
  .btn-success {
    color: #fff;
    background-color: #4caf50;
  }
  .btn {
    text-align: center;
    font-size: 28px;
    min-width: 120px;
    height: 52px;
    line-height: 52px;
    border-radius: 4px;
    -webkit-box-shadow: 0 6px 2px -4px rgba(0, 0, 0, 0.2),
      0 4px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 6px 2px -4px rgba(0, 0, 0, 0.2),
      0 4px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }
}
</style>
