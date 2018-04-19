<template>
  <div class="content">
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
          :disabled="uploadType !== 'file'"/>
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
    <div style="margin-top: 20px">
      <h4>Adjust Image</h4>
      <div class="row">
        <div class="col-4">
          Origin
        </div>
        <div class="col-4">
          After
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      url: '',
      uploadType: 'file'
    }),
  };
</script>
