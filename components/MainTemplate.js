import React from 'react'

const { string, object } = React.PropTypes

function createHTML(content) {
  return {
    __html: content
  }
}

const MainTemplate = React.createClass({

  propTypes: {
    content: string.isRequired,
    data: object.isRequired
  },

  getDefaultProps() {
    return {
      content: '',
      data: {}
    }
  },

  render() {
    const { content, data } = this.props

    return (
      <html>
        <head>
          <script dangerouslySetInnerHTML={createHTML('window.__DATA__=' + JSON.stringify(data))}/>
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={createHTML(content)}/>
        </body>
      </html>
    )
  }

})

export default MainTemplate
