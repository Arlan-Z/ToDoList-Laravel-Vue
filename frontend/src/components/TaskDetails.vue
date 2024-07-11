<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <span class="close" @click.stop="closeModal">×</span>
      <h2>{{ task?.title }}</h2>
      <p v-if="task?.descr">Описание: {{ task.descr }}</p>
      <p>Статус: {{ task?.status }}</p>
      <p :class="priorityClass">Приоритет: {{ task?.prior }}</p>
      <p>Создано: {{ task?.createdAt }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showModal: true,
    };
  },
  computed: {
    priorityClass() {
      return {
        "priority-high": this.task?.prior === "High",
        "priority-medium": this.task?.prior === "Medium",
        "priority-low": this.task?.prior === "Low",
      };
    },
  },
  methods: {
    closeModal() {
      console.log("closeModal called");
      this.$emit("close");
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

body {
  font-family: "Roboto", sans-serif;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 60%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.priority-high {
  color: red;
}

.priority-medium {
  color: #ffd700; /* Золотой цвет для medium */
}

.priority-low {
  color: green;
}
</style>
