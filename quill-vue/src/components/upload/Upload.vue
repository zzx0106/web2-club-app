<template>
  <input ref="input" type="file" class="upload-button" @change="handleChange" :multiple="multiple" :accept="accept">
</template>
<script>
import ajax from './ajax';
export default {
  props: {
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default() {
        return {};
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    name: {
      type: String,
      default: 'file'
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    showUploadList: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'select'
    },
    format: {
      type: Array,
      default() {
        return [];
      }
    },
    accept: {
      type: String
    },
    maxSize: {
      type: Number
    },
    beforeUpload: Function,
    onProgress: {
      type: Function,
      default() {
        return {};
      }
    },
    onSuccess: {
      type: Function,
      default() {
        return {};
      }
    },
    onError: {
      type: Function,
      default() {
        return {};
      }
    },
    onRemove: {
      type: Function,
      default() {
        return {};
      }
    },
    onPreview: {
      type: Function,
      default() {
        return {};
      }
    },
    onExceededSize: {
      type: Function,
      default() {
        return {};
      }
    },
    onFormatError: {
      type: Function,
      default() {
        return {};
      }
    },
    defaultFileList: {
      type: Array,
      default() {
        return [];
      }
    },
    paste: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    interceptor: {
      type: Boolean,
      default: false
    },
    beforeAjax: {
      type: Function,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      fileList: []
    };
  },
  mounted() {},
  methods: {
    handleChange(e) {
      console.log('handleChange', e);
      const files = e.target.files;
      if (!files) {
        return;
      }
      this.uploadFiles(files);
      this.$refs.input.value = null;
    },
    uploadFiles(files) {
      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) postFiles = postFiles.slice(0, 1);

      if (postFiles.length === 0) return;

      postFiles.forEach(file => {
        this.upload(file);
      });
    },
    upload(file) {
      if (!this.beforeUpload) {
        return this.post(file);
      }

      const before = this.beforeUpload(file);
      if (before && before.then) {
        before.then(
          processedFile => {
            if (
              Object.prototype.toString.call(processedFile) === '[object File]'
            ) {
              this.post(processedFile);
            } else {
              this.post(file);
            }
          },
          () => {
            // this.$emit('cancel', file);
          }
        );
      } else if (before !== false) {
        this.post(file);
      } else {
        // this.$emit('cancel', file);
      }
    },
    post(file) {
      console.log('pose', file, this.format);
      // check format
      console.log('flie size', file.size, file.name, file.type);
      // check maxSize
      if (this.maxSize) {
        if (file.size > this.maxSize * 1024) {
          this.onExceededSize(file, this.fileList);
          return false;
        }
      }

      this.handleStart(file);
      // let formData = new FormData();
      // formData.append(this.name, file);

      ajax({
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: file,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => {
          this.onProgress(e, file);
        },
        onSuccess: res => {
          this.onSuccess(res, file);
        },
        onError: (err, response) => {
          this.onError(err, response, file);
        }
      });
    },
    handleStart(file) {
      file.uid = Date.now() + this.tempIndex++;
      const _file = {
        status: 'uploading',
        name: file.name,
        size: file.size,
        percentage: 0,
        uid: file.uid,
        showProgress: true
      };

      this.fileList.push(_file);
    }
  }
};
</script>
<style>
</style>
