const express = require('express')
const service = require('./service.js');

const app = express()
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('<div style="text-align:center; padding-top:20%;"><h1>KeanePro</h1><h2>Watermark image generator.!</h2></div>')
});


app.get('/watermark-image-generate', async (req, res) => {
    // http://localhost:5000/watermark-image-generate?display=img&type=full-text&imgSource=https://nganhoa.com.vn/wp-content/uploads/2022/03/S125-67.jpg&logoTxt=AMC-Plastic.com&waterTxt=amcplastic.com 0816735275.
    // http://localhost:5000/watermark-image-generate?display=img&type=full-text&imgSource=https://nganhoa.com.vn/wp-content/uploads/2022/03/S125-67.jpg&logoImg=https://toppng.com/uploads/preview/estle-logo-png-photo-transparent-background-nestle-logo-115630650925abtyzjhz9.png&waterTxt=amcplastic.com 0816735275.

    // http://localhost:5000/watermark-image-generate?display=img&type=center-text&imgSource=https://nganhoa.com.vn/wp-content/uploads/2022/03/S125-67.jpg&logoTxt=AMC-Plastic.com&waterTxt=amcplastic.com 0816735275.&imgW=600&imgH=400
    // http://localhost:5000/watermark-image-generate?display=img&type=center-text&imgSource=https://nganhoa.com.vn/wp-content/uploads/2022/03/S125-67.jpg&logoTxt=AMC-Plastic.com&logoImg=https://toppng.com/uploads/preview/estle-logo-png-photo-transparent-background-nestle-logo-115630650925abtyzjhz9.png&waterTxt=amcplastic.com 0816735275.&imgW=600&imgH=400


    // query params
    let imageSource = req.query['imgSource'];
    let imageWidth = req.query['imgW'];
    let imageHeight = req.query['imgH'];
    let logoImage = req.query['logoImg'];
    let logoText = req.query['logoTxt'];
    let waterText = req.query['waterTxt'];
    let waterImage = req.query['waterImg'];
    let type = req.query['type'];

    let isReturnImage = req.query['display'] === 'img';

    let resp = {
        isSuccess: false,
        imgBase64: '',
        msg: ''
    }
    let respContent = 'no image';

    if (type && imageSource && (logoImage || logoText || waterText || waterImage)) {
        try {
            // console.log(`Watermark image generator: number=${type} , image=${imageSource}`);
            var imgBase64 = await service.generateWartermarkImage({ imageSource, imageWidth, imageHeight, logoImage, logoText, waterText, waterImage, type });
            // console.log('Watermark image generator ok. length:', imgBase64.length);

            respContent = `<img src="data:image/png;base64, ${imgBase64}" />`;
            resp.isSuccess = true;
            resp.imgBase64 = imgBase64;
        } catch (e) {
            respContent = `error ${e}`;
            resp.msg = respContent;
        }
    }

    if (isReturnImage) {
        res.send(respContent);
    } else {
        res.send(resp);
    }
});

app.listen(port, () => {
    console.log(`Website is running at http://localhost:${port}`)
})