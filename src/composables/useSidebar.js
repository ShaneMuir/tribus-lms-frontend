// useSidebar.js
import { ref } from 'vue';

const sidebarExpanded = ref(false);

const expand = () => {
    sidebarExpanded.value = true;
};

const collapse = () => {
    sidebarExpanded.value = false;
};

export default function useSidebar() {
    return {
        expanded: sidebarExpanded,
        expand,
        collapse,
    };
}
