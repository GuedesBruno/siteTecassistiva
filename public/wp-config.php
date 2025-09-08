
<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */
define( 'WP_HOME', 'http://devsite.tecassistiva.com.br/painel' );
define( 'WP_SITEURL', 'http://devsite.tecassistiva.com.br/painel' );
// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'tecassistiva25' );

/** Database username */
define( 'DB_USER', 'tecassistiva25' );

/** Database password */
define( 'DB_PASSWORD', 'Tecasp4020!' );

/** Database hostname */
define( 'DB_HOST', 'tecassistiva25.mysql.dbaas.com.br' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'K@h(Z*98|M>]K~/e`5ixeQR5u6e5U7Hr$3E<ClTf,.;PYk+G9gN;0?UFPmmf%g}y' );
define( 'SECURE_AUTH_KEY',   '*iZTK-GNu3 5/s|4k-CiE3-5-U@R=*o8u6ZdK;.${#lgKuo<;v{WDe(%pc/4Al]R' );
define( 'LOGGED_IN_KEY',     'Q55U<3)G>t6((B<WY}![ZA?05><6Q>M=fX;b3W>-!,Z,OJZ_~BC#oP~jgSO%k5<|' );
define( 'NONCE_KEY',         'EPGi?zE{Ev>cFEX%|~cF2iS(7B0,JQYY7YQ}? t=GjXIX)S.m,.|Z{f5FSPK[BMr' );
define( 'AUTH_SALT',         'JuC2OmunQ<C!=A@u]5K)M7OUJpu:`h{D#<HwO_iUs9u>xhwqiG,&n5tJNIQM,(tj' );
define( 'SECURE_AUTH_SALT',  'Nl%IUuk7%kztP%.o.mL.u]PqTn21~/}yT^tIrZ/xbqZmt!2G6qr(&}EfdiY02_!n' );
define( 'LOGGED_IN_SALT',    'io)adHiwP>QX)V:c]EJFyXGT;BWMUPbWPV|758U<lVo3Oj]&&I/Gpj)L7T1>bJf]' );
define( 'NONCE_SALT',        'V%1Z=r^0uz8/y5Ir&yqi,b{|FdW60H~6qfrP6woMMPZK[:%yQgK@7US#yf6*0!}Y' );
define( 'WP_CACHE_KEY_SALT', '0H57fJ!3o.Jd(*aY5/bO^K**kbk7O[|2R%rc,e0JHXN]0#`6a+vV`HoW||]Aq-%&' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
