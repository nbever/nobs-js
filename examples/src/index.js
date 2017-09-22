import isUndefined from 'lodash/isUndefined';
import { ServiceRegistry } from '../../lib';

import BeverageService from './services/BeverageService';
import FoodService from './services/FoodService';

// setup services
ServiceRegistry.register(BeverageService, FoodService);

const AppFrame = require('./AppFrame');

const rootApp = document.createElement('app-frame');
document.body.appendChild(rootApp);
