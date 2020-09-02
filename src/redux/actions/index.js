import * as authActions from './authActions';
import * as mainActions from './mainActions';
import * as cartActions from './cartActions';

const rootActions = {
  ...authActions,
  ...mainActions,
  ...cartActions
};

export default rootActions;
