import './App.css'
import { useState } from 'react'
import { ImageUploader, Radio, Space, Button, Toast, Image } from 'antd-mobile'
import axios from 'axios';

async function upload(file) {
  return {
    file,
    url: URL.createObjectURL(file),
  }
}

function App() {
  const [fileList, setFileList] = useState([])
  const [bg, setBg] = useState()
  const [loading, setLoading] = useState(false)
  const [resultImg, setResultImg] = useState(null)

  const submit = async () => {
    if (!fileList.length) {
      Toast.show({ content: '请上传图片' })
      return
    }
    setLoading(true)
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fileList[0].file);
    if (bg) {
      formData.append('bg_color', bg);
    }
    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
          'X-Api-Key': '' // 替换为你的密钥key,在https://www.remove.bg/api获取
        },
      });
      const blob = new Blob([response.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(blob);
      setResultImg(imageUrl);
    } catch (error) {
      console.error(error);
      Toast.show({ content: '处理图片时出错' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ImageUploader value={fileList}
        onChange={setFileList}
        upload={upload}
        maxCount={1} />
      <div>请选择你要更换的底色，默认为透明色</div>
      <Radio.Group value={bg} onChange={setBg}>
        <Space direction='vertical'>
          <Radio value='blue'>蓝底</Radio>
          <Radio value='red'>红底</Radio>
          <Radio value='white'>白底</Radio>
        </Space>
      </Radio.Group>
      <Button color='primary' fill='solid' block onClick={submit} loading={loading}>
        点击免费生成
      </Button>
      {resultImg && <Image src={resultImg} />}
    </>
  )
}

export default App
