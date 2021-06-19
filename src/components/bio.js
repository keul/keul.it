/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 150,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <div
              style={{
                marginBottom: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <div>
                I'm <strong>{author}</strong>, I'm a (Web?) (Full-stack?)
                (Front-end?) developer at{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://www.bopen.it/"
                >
                  B-Open
                </a>
                .
              </div>
              <div className="bio-section">
                <span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://twitter.com/${social.twitter}`}
                  >
                    <img className="social-icon" alt="" src="/twitter.svg" />{" "}
                    <span className="social-link-text">
                      Follow me on Twitter
                    </span>
                  </a>
                </span>
                <span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.linkedin.com/in/${social.linkedin}`}
                  >
                    <img className="social-icon" alt="" src="/linkedin.svg" />{" "}
                    <span className="social-link-text">
                      Follow me on Linkedin
                    </span>
                  </a>
                </span>
                <span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://myspace.com/keul"
                    onClick={ev => {
                      ev.preventDefault()
                      alert("Are you serious? Are you living in 2003?")
                    }}
                  >
                    <img className="social-icon" alt="" src="/myspace.svg" />{" "}
                    <span className="social-link-text">
                      Follow me on MySpace
                    </span>
                  </a>
                </span>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 150, height: 150) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
          linkedin
        }
      }
    }
  }
`

export default Bio
