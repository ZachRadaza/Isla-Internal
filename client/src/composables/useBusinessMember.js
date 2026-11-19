import { readonly, ref } from "vue";

const member = ref(null);
const loading = ref(false);
const error = ref(false);

export default () => ({
    member: readonly(member)
});