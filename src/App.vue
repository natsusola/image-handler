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
          v-model.trim="imgUrl"
          :disabled="uploadType !== 'url'"/>
      </div>
      <button class="btn btn-primary" @click="doUploadImage()">Upload</button>
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
            <a href @click.prevent="doPixelate()">Pixelate</a> |
            <a href @click.prevent="doReset()">Reset</a>
          </div>
          <div ref="editCvsContainer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cropper from '@/plugins/cropperjs/src';

  export default {
    data: () => ({
      uploadType: 'file',
      imgFile: null,
      imgUrl: '',
      cropper: null,
    }),
    methods: {
      doUploadImage() {
        if (
          (this.uploadType === 'file' && !this.imgFile) ||
          (this.uploadType === 'url' && !this.imgUrl)
        ) {
          alert('Please set image source.');
          return
        }
        if (this.uploadType === 'file') this.imageHandler(this.imgFile);
        else if (this.uploadType === 'url') this.imageHandler(this.imgUrl);
      },
      onUploadImageFile(e) {
        if (e.target.files[0]) { this.imgFile = e.target.files[0]; }
      },
      imageHandler(imgSrc) {
        let _img = new Image();
        _img.onload = (e) => {
          this.initCanvas(_img);
        };
        _img.onerror = () => { alert('Not a image file.'); }
        if (typeof imgSrc === 'object') _img.src = URL.createObjectURL(imgSrc);
        else if (typeof imgSrc === 'string') _img.src = imgSrc;
      },
      doCropper() {
        this.$refs.editCvsContainer.innerHTML = '';
        let _cropedCanvas = this.cropper.getCroppedCanvas();
        _cropedCanvas.id = 'edit-canvas';
        this.$refs.editCvsContainer.appendChild(_cropedCanvas);
        this.cropper = new Cropper(_cropedCanvas, { zoomOnWheel: false });
      },
      doPixelate() {
        let _oldCropData = this.cropper.getCropBoxData();
        let _oldCanvas = document.getElementById('edit-canvas');
        this.cropper.setCropBoxData({
          left: 0,
          top: 0,
          width: _oldCanvas.width,
          height: _oldCanvas.height
        });
        _oldCanvas = this.cropper.getCroppedCanvas();
        _oldCanvas.id = 'edit-canvas';
        let _oldCtx = _oldCanvas.getContext('2d');

        this.cropper.setCropBoxData(_oldCropData);
        let _editCanvas = this.cropper.getCroppedCanvas();
        let _editCtx = _editCanvas.getContext('2d');

        let  w =_editCanvas.width * 0.15;
        let  h =_editCanvas.height * 0.15;

        _editCtx.drawImage(_editCanvas, 0, 0, w, h);

        _editCtx.msImageSmoothingEnabled = false;
        _editCtx.mozImageSmoothingEnabled = false;
        _editCtx.webkitImageSmoothingEnabled = false;
        _editCtx.imageSmoothingEnabled = false;

        _editCtx.drawImage(_editCanvas, 0, 0, w, h, 0, 0, _editCanvas.width, _editCanvas.height);
        _oldCtx.drawImage(_editCanvas, _oldCropData.left, _oldCropData.top);

        this.$refs.editCvsContainer.innerHTML = '';
        this.$refs.editCvsContainer.appendChild(_oldCanvas);
        this.cropper = new Cropper(_oldCanvas, {
          zoomOnWheel: false,
          ready: () => { this.cropper.setCropBoxData(_oldCropData); }
        });
      },
      doReset() {
        this.$refs.editCvsContainer.innerHTML = '';

        let _originCanvas = document.getElementById('origin-canvas');
        let _editCanvas = _originCanvas.cloneNode(true);
        _editCanvas.id = 'edit-canvas';
        _editCanvas.getContext('2d').drawImage(_originCanvas, 0, 0);
        this.$refs.editCvsContainer.appendChild(_editCanvas);
        this.cropper = new Cropper(_editCanvas, {zoomOnWheel: false});
      },
      doDownload() {

      },
      initCanvas(img) {
        this.$refs.originCvsContainer.innerHTML = '';
        this.$refs.editCvsContainer.innerHTML = '';

        let _originCanvas = document.createElement('canvas');
        _originCanvas.id = 'origin-canvas'
        _originCanvas.width = img.width;
        _originCanvas.height = img.height;
        let _editCanvas = _originCanvas.cloneNode(true);
        _editCanvas.id = 'edit-canvas';
        _originCanvas.getContext('2d').drawImage(img, 0, 0);
        _editCanvas.getContext('2d').drawImage(img, 0, 0);

        this.$refs.originCvsContainer.appendChild(_originCanvas);
        this.$refs.editCvsContainer.appendChild(_editCanvas);

        this.cropper = new Cropper(_editCanvas, {zoomOnWheel: false});
      }
    },
  };
</script>
