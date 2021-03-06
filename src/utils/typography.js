import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

Wordpress2016.overrideThemeStyles = () => {
  return {
    blockquote: {
      marginLeft: 0,
      marginRight: 0,
    },
    ul: {
      paddingLeft: "1rem",
    },
    li: {
      marginBottom: "0.5rem",
    },
    a: {
      color: "#333",
    },
    'a > code[class*="language-"]': {
      color: "white",
    },
    'a:not(pre) > code[class*="language-"]': {
      backgroundColor: "#007acc",
    },
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    // ".gatsby-highlight pre": {
    //   overflowX: 'scroll',
    //   maxWidth: '100%',
    // },
    ".gatsby-highlight-code-line": {
      backgroundColor: "#E4DDCA",
      display: "block",
      marginRight: "-1em",
      marginLeft: "-1em",
      paddingRight: "1em",
      paddingLeft: "0.75em",
      borderLeft: "0.25em solid #f99",
    },
    ".gatsby-highlight": {
      backgroundColor: "#fdf6e3",
      borderRadius: "0.3em",
      margin: "0.5em 0",
      padding: "1em",
      overflow: "auto",
    },
    '.gatsby-highlight pre[class*="language-"]': {
      backgroundColor: "transparent",
      margin: 0,
      padding: 0,
      overflow: "initial",
      float: "left",
      minWidth: "100%",
    },
    '.gatsby-highlight pre[class*="language-"].line-numbers': {
      paddingLeft: "2.8em",
    },
    "a.anchor": {
      boxShadow: "none",
    },
    'img[alt*=" - left"]': {
      float: "left",
      marginRight: "1rem",
    },
    'img[alt*=" - right"]': {
      float: "right",
      marginLeft: "1rem",
    },
    'img[alt*=" - center"]': {
      margin: "0 auto",
      display: "block",
    },
    "main > hr": {
      clear: "both",
    },
    h4: {
      textTransform: "none",
    },
    ".bio-section": {
      display: "flex",
      flexDirection: "column",
    },
    ".social-icon": {
      marginBottom: 0,
    },
    "@media (max-width: 375px)": {
      ".social-link-text": {
        display: "none",
      },
      ".bio-section": {
        flexDirection: "row",
        gap: "0.3em",
      },
    },
  }
}

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
