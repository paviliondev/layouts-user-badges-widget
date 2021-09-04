import { ajax } from 'discourse/lib/ajax';
import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
  name: 'layouts-user-badges',

  initialize(container) {
    let layouts;
    let layoutsError;

    // Import layouts plugin with safegaurd for when widget exists without plugin:
    try {
      layouts = requirejs(
        'discourse/plugins/discourse-layouts/discourse/lib/layouts'
      );
    } catch (error) {
      layoutsError = error;
      // eslint-disable-next-line no-console
      console.warn(layoutsError);
    }

    if (layoutsError) {
      return;
    }

    let currentUser;
    withPluginApi('0.12.2', (api) => {
      currentUser = api.getCurrentUser();
    });

    ajax(`/user-badges/${currentUser.username}.json`).then((result) => {
      const userBadges = result.badges;
      // eslint-disable-next-line no-console
      console.log(userBadges);

      const props = {
        userBadges,
        currentUser,
      };

      layouts.addSidebarProps(props);
    });
  },
};
