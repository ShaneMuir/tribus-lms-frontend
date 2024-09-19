import { createToast } from 'mosha-vue-toastify';

export const toast = (content, options = {}) => {
    createToast(content, {...options});
}