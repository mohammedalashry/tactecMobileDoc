import {palette} from './palette';

/**
 * Roles for colors.  Prefer using these over the palette.  It makes it easier
 * to change things.
 *
 * The only roles we need to place in here are the ones that span through the app.
 *
 * If you have a specific use-case, like a spinner color.  It makes more sense to
 * put that in the <Spinner /> component.
 */
export const color = {
  /**
   * The palette is available to use, but prefer using the name.
   */
  palette,
  /**
   * A helper for making something see-thru. Use sparingly as many layers of transparency
   * can cause older Android devices to slow down due to the excessive compositing required
   * by their under-powered GPUs.
   */
  transparent: 'rgba(0, 0, 0, 0)',
  /**
   * The screen background.
   */
  background: '#141414',
  /**
   * The main tinting color.
   */
  primary: '#03A4FF',
  primarybg:"#202020",
  uploadImgbg:'#373737',
  linewellness:'#373737',

  /**
   * A subtle color used for borders and lines.
   */
  line: palette.offWhite,
  /**
   * The default color of text in many components.
   */
  text: palette.white,
  /**
   * The default color of selected item.
   */
  blackbg:'#141414',
  placeholder: "#999494",
  cardbg:"#141414",
  border:"#474747",
  blue: palette.blue,
  black: '#000',
  primaryLight: '#C4C4C4',
  borders: '#C9C9C9',
  lightGrey: '#939AA4',
  primaryText: "#0092CC"
};
