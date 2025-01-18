import type * as CSS from 'csstype'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Divider, Flex, Input, message, Space, Typography, Upload } from 'antd'
import { domToPng } from 'modern-screenshot'
import { useState } from 'react'
import { bigPic, cover, smallPic } from './constants'
import Footer from './Footer'
import Header from './Header'
import './App.css'

type FlexDirection = CSS.Property.FlexDirection
type TextAlign = CSS.Property.TextAlign
type TextWrap = CSS.Property.TextWrap

export default function App() {
  const { Text } = Typography
  const [title, setTitle] = useState<string>('微信公众号：爱编程的阿彬')
  const [subTitle, setSubTitle] = useState<string>('@Tenifs')
  const [bigPicStyle, setBigPicStyle] = useState({
    width: bigPic.width,
    height: bigPic.height,
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  })

  const [smallPicStyle, setSmallPicStyle] = useState({
    width: smallPic.width,
    height: smallPic.height,
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  })
  const coverStyle = {
    width: cover.width,
    height: cover.height,
    backgroundColor: '#999',
    display: 'flex',
  }

  const titleStyle = {
    color: '#fff',
    fontSize: '36px',
    fontWeight: 900,
    textAlign: 'center' as TextAlign,
    textWrap: 'wrap' as TextWrap,
    padding: '0 8px',
    zIndex: 999,
  }

  const subTitleStyle = {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 900,
    textAlign: 'center' as TextAlign,
    textWrap: 'wrap' as TextWrap,
    padding: '0 8px',
    zIndex: 999,
  }

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column' as FlexDirection,
    justifyContent: 'center',
    alignItems: 'center',
    width: bigPic.width,
    height: bigPic.height,
    background: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(5px)',
  }

  function setBigPic(pic: any) {
    if (pic) {
      setBigPicStyle({
        ...bigPicStyle,
        backgroundImage: `url(${pic})`,
      })
    }
  }

  function setSmallPic(pic: any) {
    if (pic) {
      setSmallPicStyle({
        ...smallPicStyle,
        backgroundImage: `url(${pic})`,
      })
    }
  }

  function bigPicCustomRequest(option: any) {
    const formData = new FormData()
    formData.append('files[]', option.file)
    const reader = new FileReader()
    reader.readAsDataURL(option.file)
    reader.onloadend = function (e) {
      setBigPic(e.target?.result)
      if (e && e.target && e.target.result) {
        option.onSuccess()
      }
    }
  }

  function smallPicCustomRequest(option: any) {
    const formData = new FormData()
    formData.append('files[]', option.file)
    const reader = new FileReader()
    reader.readAsDataURL(option.file)
    reader.onloadend = function (e) {
      setSmallPic(e.target?.result)
      if (e && e.target && e.target.result) {
        option.onSuccess()
      }
    }
  }

  function beforeUpload(file: any) {
    const isJpgOrPngOrWebp = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
    if (!isJpgOrPngOrWebp) {
      message.error('只能上传JPG、PNG或WEBP文件！')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过2MB！')
      return false
    }
    return isJpgOrPngOrWebp && isLt2M
  }

  function exportImage() {
    const node = document.querySelector('#wx-gzh-cover')
    if (node) {
      domToPng(node).then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'wx-gzh-cover'
        link.href = dataUrl
        link.click()
      })
    }
  }

  const bigPicUploadProps = {
    customRequest: bigPicCustomRequest,
    showUploadList: false,
    beforeUpload,
  }

  const smallPicUploadProps = {
    customRequest: smallPicCustomRequest,
    showUploadList: false,
    beforeUpload,
  }

  return (

    <div className="container">
      <Header />
      <Divider />
      <div style={{ width: cover.width, margin: '16px 0', padding: '16px 0' }}>
        <Flex align="center" justify="center">
          <Flex gap="large" align="start" vertical justify="center">
            <Space size="middle" align="center">
              <Text style={{ marginLeft: '1em' }} strong>标题：</Text>
              <Input placeholder="微信公众号：爱编程的阿彬" style={{ width: '200%' }} onChange={e => setTitle(e.target.value)} size="large" />
            </Space>
            <Space size="middle" align="center">
              <Text strong>副标题：</Text>
              <Input placeholder="@Tenifs" style={{ width: '200%' }} onChange={e => setSubTitle(e.target.value)} size="large" />
            </Space>
            <Flex justify="space-between" align="center" gap="large">
              <Space size="middle" align="center">
                <Text strong style={{ marginLeft: '1em' }}>首图：</Text>
                <Upload {...bigPicUploadProps}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Space>
              <Space size="middle" align="center">
                <Text strong>小图：</Text>
                <Upload {...smallPicUploadProps}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Space>
            </Flex>
            <Flex style={{ width: '100%' }} justify="center" align="center">
              <Button type="primary" onClick={exportImage}>导出</Button>
            </Flex>
          </Flex>
        </Flex>
      </div>

      <div style={coverStyle} id="wx-gzh-cover">
        <div style={bigPicStyle}>
          <div style={contentStyle}>
            <p style={titleStyle}>{title}</p>
            <p style={subTitleStyle}>{subTitle}</p>
          </div>
        </div>
        <div style={smallPicStyle}></div>
      </div>

      <Divider />
      <Footer />
    </div>
  )
}
