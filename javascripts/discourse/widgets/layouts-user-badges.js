import DiscourseURL from 'discourse/lib/url';
import { createWidget } from 'discourse/widgets/widget';
import I18n from 'I18n';
import { h } from 'virtual-dom';
const { iconNode } = require('discourse-common/lib/icon-library');

let layouts;

// Import layouts plugin with safegaurd for when widget exists without plugin:
try {
  layouts = requirejs(
    'discourse/plugins/discourse-layouts/discourse/lib/layouts'
  );
} catch (error) {
  layouts = { createLayoutsWidget: createWidget };
  // eslint-disable-next-line no-console
  console.warn(error);
}

export default layouts.createLayoutsWidget('user-badges', {
  html(attrs) {
    const { currentUser, userBadges } = attrs;

    if (userBadges === null || userBadges === undefined) {
      return;
    }

    const contents = [];
    const badges = [];

    contents.push(
      h(
        'a.layouts-badge-header',
        {
          attributes: {
            href: `/u/${currentUser.username}/badges`,
          },
        },
        I18n.t(themePrefix('header_title'))
      )
    );

    if (userBadges) {
      userBadges.forEach((badge) => {
        badges.push(this.attach('layouts-user-badge', badge));
      });
      contents.push(h('ul.layouts-badge-items', badges));
    }

    return contents;
  },
});

createWidget('layouts-user-badge', {
  tagName: `li.layouts-user-badge`,
  buildKey: (attrs) => `layouts-user-badge-${attrs.id}`,

  getBadgeType(id) {
    const types = { bronze: 3, silver: 2, gold: 1 };

    let badgeType;
    Object.entries(types).forEach((type) => {
      if (id === type[1]) {
        badgeType = type[0];
      }
    });

    return badgeType;
  },

  html(attrs) {
    const contents = [];
    const icon = attrs.icon.replace('fa-', '');
    const badgeType = this.getBadgeType(attrs.badge_type_id);

    contents.push(
      h(`div.badge-link.badge-type-${badgeType}`, [iconNode(icon), attrs.name])
    );

    return contents;
  },

  click() {
    DiscourseURL.routeTo(`/badges/${this.attrs.id}/${this.attrs.slug}`);
  },
});
