import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

Wordpress2016.overrideThemeStyles = () => {
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    // ".gatsby-highlight pre": {
    //   overflowX: 'scroll',
    //   maxWidth: '100%',
    // },
    ".gatsby-highlight-code-line": {
      backgroundColor: '#E4DDCA',
      display: 'block',
      marginRight: '-1em',
      marginLeft: '-1em',
      paddingRight: '1em',
      paddingLeft: '0.75em',
      borderLeft: '0.25em solid #f99',
    },
    ".gatsby-highlight": {
      backgroundColor: '#fdf6e3',
      borderRadius: '0.3em',
      margin: '0.5em 0',
      padding: '1em',
      overflow: 'auto',
    },
    '.gatsby-highlight pre[class*="language-"]': {
      backgroundColor: 'transparent',
      margin: 0,
      padding: 0,
      overflow: 'initial',
      float: 'left',
      minWidth: '100%',
    },
    '.gatsby-highlight pre[class*="language-"].line-numbers': {
      paddingLeft: '2.8em',
    },
  }
}

/*

 {
  background-color: #feb;
}

*/

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
