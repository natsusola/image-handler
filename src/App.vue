<template>
  <div class="content">
    <!-- Form Column -->
    <div>
      <h4>Upload Image</h4>
      <div class="form-check" style="display: flex">
        <input class="form-check-input" type="radio"
          name="imageType"
          id="uploadType1"
          value="file"
          v-model="uploadType">
        <label class="form-check-label" for="uploadType1">
          File
        </label>
        <input ref="fileInput" type="file" class="col form-control-file"
          :disabled="uploadType !== 'file'"
          @change="onUploadImageFile($event)"/>
      </div>
      <div class="form-check" style="display: flex; margin: 10px 0">
        <input class="form-check-input" type="radio"
          name="imageType"
          id="uploadType2"
          value="url"
          v-model="uploadType"
          placeholder="URL">
        <label class="form-check-label" for="uploadType2">
          URL
        </label>
        <input class="col-5 form-control" style="margin-left: 15px"
          v-model.trim="url"
          :disabled="uploadType !== 'url'"/>
      </div>
      <button class="btn btn-primary">Upload</button>
    </div>
    <!-- Form Column -->
    <div style="margin-top: 20px">
      <h4>Adjust Image</h4>
      <div class="row">
        <div class="col-5">
          <div>Origin</div>
          <div ref="originCvsContainer"></div>
        </div>
        <div class="">
          <div>Edit</div>
          <div>
            <a href @click.prevent="doCropper()">Cropper</a> |
          </div>
          <div ref="editCvsContainer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cropper from 'cropperjs';

  export default {
    data: () => ({
      url: '',
      uploadType: 'file',
      originCvsCtx: {},
      editCvsCtx: {},
      cropper: {}
    }),
    mounted() {
    },
    methods: {
      onUploadImageFile(e) {
        if (e.target.files[0]) {
          let _img = new Image();
          _img.onload = _e => { this.initCanvas(_e, _img); };
          _img.src = URL.createObjectURL(e.target.files[0]);
        }
      },
      doCropper() {
        this.$refs.editCvsContainer.innerHTML = '';
        let _editCanvas = this.cropper.getCroppedCanvas();
        this.$refs.editCvsContainer.appendChild(_editCanvas);
        this.cropper = new Cropper(_editCanvas);
      },
      initCanvas(e, img) {
        this.$refs.originCvsContainer.innerHTML = '';
        this.$refs.editCvsContainer.innerHTML = '';

        let _originCanvas = document.createElement('canvas');
        _originCanvas.width = e.path[0].width;
        _originCanvas.height = e.path[0].height;
        let _editCanvas = _originCanvas.cloneNode(true);
        this.originCvsCtx = _originCanvas.getContext('2d');
        this.editCvsCtx = _editCanvas.getContext('2d');

        this.$refs.originCvsContainer.appendChild(_originCanvas);
        this.$refs.editCvsContainer.appendChild(_editCanvas);

        this.originCvsCtx.drawImage(img, 0, 0);
        this.editCvsCtx.drawImage(img, 0, 0);

        this.cropper = new Cropper(_editCanvas);
      }
    },
  };
</script>
