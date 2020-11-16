import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
// import RaisedButton from 'material-ui/RaisedButton'

import ugly from './url'

let justFilename = null

export default class DialogExampleSimple extends React.Component {
  constructor(props) {
    super(props)


    this.state = {
      open: false
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.onChange = this.onChange.bind(this)
    this.downloadNow = this.downloadNow.bind(this)
  }


  onChange(e) {
    const file = e.target.files[0]
    const formData = new FormData();
    formData.append('file', file)
    const url = `http://${ugly}:4000/file/upload`
    fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      mode: 'cors',
      body: formData,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => {
      console.log(response)
      justFilename = file.name
      this.props.filename(`上传了文件！！！ ${file.name}  请点击右下角下载`)
      this.props.setName()
      this.handleClose()
    })
      .catch(error => console.log(error));
  }

  downloadNow() {
    if (this.state.open === false)
      return
    if (justFilename) {
      const url = `http://${ugly}:4000/file/download/?filename=${justFilename}`
      window.open(url)
    } else {
      const url = `http://${ugly}:4000/file/download/`
      window.open(url)
    }
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  // const inputElement = document.getElementById("input");
  // inputElement.addEventListener("change", handleFiles, false);
  // function handleFiles() {
  //   const fileList = this.files; /* now you can work with the file list */
  // }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleClose}
      />
    ];

    return (
      <div>
        <FloatingActionButton
          onClick={this.handleOpen}
          style={{ marginLeft: 20 }}
        >
          <FontIcon
            style={{ fontSize: 32 }}
            className="material-icons"
          >
            {'add_circle'}
          </FontIcon>
          <Dialog
            title="上传或下载文件"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            {/* <RaisedButton */}
            {/*  containerElement="label" // <-- Just add me! */}
            {/* > */}
            <input type="file" name="file" onChange={this.onChange} />
            <FloatingActionButton
              onClick={this.downloadNow}
              style={{ marginLeft: 200 }}
            >
              <FontIcon
                style={{ fontSize: 32 }}
                className="material-icons"
              >
                {'cloud_download'}
              </FontIcon>
            </FloatingActionButton>
            {/* </RaisedButton> */}
          </Dialog>
        </FloatingActionButton>
      </div>
    );
  }
}
