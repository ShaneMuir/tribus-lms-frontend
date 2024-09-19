import { createApp } from 'vue'

// Import our styles
import './style.css'

// Import our App
import App from './App.vue'

// Import the router
import {initRouter} from "./router";

// Import the FontAwesome core
import { library } from '@fortawesome/fontawesome-svg-core';

// Import the FontAwesome icon component
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import specific icons (e.g., solid icons)
import { faHome, faTasks, faUser, faTableList, faQuestion, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import 'mosha-vue-toastify/dist/style.css'

const router = initRouter();

// Add icons to the library
library.add(faHome, faTasks, faUser, faTableList, faQuestion, faRightFromBracket);

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .mount('#app')
