import React from 'react'
import PropTypes from 'prop-types'
import Icon from '../Common/Icon'
import DeleteConfirmModal from './DeleteConfirmModal'
import { Button, Col, ControlLabel, FormControl, FormGroup, Modal, Radio } from 'react-bootstrap'

export default class SettingModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      shareId: null,
      secretKeyword: null,
      restricted: false,
      showConfirmModal: false,
    }

    this.setRestricted = this.setRestricted.bind(this)
    this.setSecretKeyword = this.setSecretKeyword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { share = {} } = nextProps
    const { id: shareId, secretKeyword = '' } = share

    this.setState({
      shareId,
      secretKeyword,
      restricted: !!secretKeyword,
    })
  }

  setRestricted(value) {
    return () => {
      this.setState({ restricted: value })
    }
  }

  setSecretKeyword(e) {
    this.setState({ secretKeyword: e.target.value })
  }

  canSubmit() {
    const { restricted, secretKeyword } = this.state
    if (!restricted) {
      return true
    }
    return !!secretKeyword && secretKeyword.length > 0
  }

  handleSubmit() {
    const { shareId, secretKeyword, restricted } = this.state
    this.props.crowi.apiPost('/shares/secretKeyword.set', {
      share_id: shareId,
      secret_keyword: restricted ? secretKeyword : null,
    })
  }

  handleOpen() {
    this.setState({ showConfirmModal: true })
  }

  handleClose() {
    this.setState({ showConfirmModal: false })
  }

  handleDelete() {
    const { handleDelete } = this.props
    this.handleClose()
    if (handleDelete) {
      handleDelete()
    }
  }

  render() {
    const { show, onHide, isChanging } = this.props
    const { restricted, secretKeyword, showConfirmModal } = this.state
    return (
      <Modal className="share-setting-modal" show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>リンクの設定</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-horizontal">
            <FormGroup controlId="restricted">
              <Col componentClass={ControlLabel} sm={2}>
                閲覧制限
              </Col>
              <Col sm={10}>
                <Radio name="restricted" onClick={this.setRestricted(false)} defaultChecked={!restricted}>
                  リンクを知っている人
                </Radio>
                <Radio name="restricted" onClick={this.setRestricted(true)} defaultChecked={restricted}>
                  秘密のキーワードを知っている人
                </Radio>
                {restricted && (
                  <FormControl
                    className="secret-keyword"
                    type="text"
                    placeholder="秘密のキーワード"
                    onChange={this.setSecretKeyword}
                    defaultValue={secretKeyword}
                  />
                )}
              </Col>
            </FormGroup>
          </div>
          <DeleteConfirmModal show={showConfirmModal} onHide={this.handleClose} handleDelete={this.handleDelete} />
        </Modal.Body>
        <Modal.Footer>
          <Button className="pull-left" onClick={this.handleOpen} bsStyle="danger" disabled={isChanging}>
            <Icon name={isChanging ? 'spinner' : 'unlink'} spin={isChanging} />
            リンクを削除
          </Button>
          <Button onClick={this.handleSubmit} bsStyle="primary" disabled={!this.canSubmit()}>
            設定を保存
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

SettingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  crowi: PropTypes.object.isRequired,
}
SettingModal.defaultProps = {
  show: false,
}
