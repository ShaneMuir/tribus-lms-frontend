import {ref} from "vue";

export default () => {
    const expanded = ref(false); // Controls whether the sidebar is expanded or collapsed

    const expand = () => {
        expanded.value = true;
    }

    const collapse = () => {
        expanded.value = false;
    }

    return {
        expanded, expand, collapse
    }
}