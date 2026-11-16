import { ref } from "vue";

const user = ref(null);

export default () => {
    return {
        user
    };
}