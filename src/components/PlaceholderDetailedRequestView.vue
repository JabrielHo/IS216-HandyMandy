<template>
  <div class="d-flex justify-content-center align-items-center column rounded-start">
    <div class="placeholder-glow">
      <div class="placeholder w-100" style="height: 400px"></div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-8 col-sm-12 col-lg-8 mt-3">
      <h1 class="title placeholder-glow">
        <span class="placeholder col-6"></span>
      </h1>
      <hr />
      <h1 class="description-header placeholder-glow">
        <span class="placeholder col-4"></span>
      </h1>
      <span class="desc placeholder-glow">
        <span class="placeholder col-12"></span>
      </span>
      <hr />
    </div>

  </div>
</template>

<style scoped>
.column {
  background-color: lightgray;
}

.title {
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 8px;
}

.category-header {
  font-size: 14px;
  line-height: 22px;
  color: rgb(109, 110, 113);
}

.category {
  font-size: 16px;
  line-height: 24px;
}

.description-header {
  font-size: 20px;
  line-height: 28px;
}

.card {
  padding: 10px;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05), 0 15px 40px rgba(166, 173, 201, 0.2);
}

.userInfo {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.text-container {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 14px;
  font-weight: 600;
}

.location {
  font-size: 14px;
  color: rgb(105, 105, 105);
}
</style>