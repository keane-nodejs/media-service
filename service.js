// https://github.com/jontewks/puppeteer-heroku-buildpack => add to buildpacks
//https://github.com/frinyvonnick/node-html-to-image#options

const nodeHtmlToImage = require('node-html-to-image')

module.exports = {
    generateWartermarkImage: async (data) => {
        const { imageSource, imageWidth, imageHeight, logoImage, logoText, waterText, waterImage, type } = data;

        const watermarkContainerClassName = type == 'full-text' ? 'watermark-text-full-text' : 'watermark-text-center-text';
        const eleImageSource = `<img src="${imageSource}" class="main-imnage" />`;
        const eleLogoImage = logoImage != null && logoImage != undefined && logoImage != '' ? `<img src="${logoImage}" class="watermark-logo" />` : '';
        const eleLogoText = eleLogoImage == '' && logoText != null && logoText != undefined && logoText != '' ? `<div class="watermark-logo-text">${logoText}</div>` : '';
        const eleWatermarkImage = waterImage != null && waterImage != undefined && waterImage != '' ? `<img src="${waterImage}" class="watermark-text-image" />` : '';

        let waterTextContent = waterText;
        if (type == 'full-text') {
            waterTextContent = '';
            let spaceNumber = '';
            for (let i = 0; i <= 200; i++) {
                // random 1 - 3                
                waterTextContent += waterText;

                spaceNumber = Math.floor(Math.random() * (5 - 1)) + 1;
                for (let j = 0; j < spaceNumber; j++) {
                    waterTextContent += '&nbsp; ';
                }
            }
        }
        const eleWatermarkText = waterTextContent != null && waterTextContent != undefined ? `<p>${waterTextContent}</p>` : '';

        const styleImageWidth = imageWidth != null && imageWidth != undefined && imageWidth != '' ? `${imageWidth}px` : '1200px';
        const styleImageHeight = imageHeight != null && imageHeight != undefined && imageHeight != '' ? `${imageHeight}px` : '800px';

        const resp = await nodeHtmlToImage({
            puppeteerArgs: {
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            },
            encoding: 'base64',
            html: `<html>

            <head>
                <style>
                    body {
                        width: ${styleImageWidth};
                        height: ${styleImageHeight};
                        position: relative;
                        font-family: system-ui;
                        overflow: hidden;
                        margin: 0;
                        padding: 0;
                    }
            
                    .main-imnage {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 1;
                    }
            
                    .watermark-logo {
                        position: absolute;
                        top: 15;
                        left: 15;
                        /* width: 100px; */
                        width: 15%;
                        opacity: 0.6;
                        z-index: 3;
                    }
            
                    .watermark-logo-text {
                        position: absolute;
                        top: 15;
                        left: 15;
                        opacity: 0.6;
                        z-index: 3;
                        text-shadow: 1px 0px 1px #ff5722;
                        color: red;
                        font-size: 25px;
                    }
            
                    .watermark-text-container {
                        /* Center the content */
                        /* align-items: center;
                        display: flex;
                        justify-content: center; */
                        text-align: center;
                        position: absolute;
                        left: 0px;
                        top: 0px;
                        z-index: 2;
                        height: 100%;
                        width: 100%;
                        user-select: none;
            
                        transform: rotate(-45deg);
                        font-size: 3vw;
                        color: rgba(0, 0, 0, 0.2);
                    }
            
                    .watermark-text-full-text {
                        left: -200px;
                        top: -200px;
                        font-size: 40px;
                        line-height: 120px;
                    }
            
                    .watermark-text-center-text {
                        transform: none;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: rgba(0, 0, 0, 0.3);
                    }
            
                    .watermark-text-image {
                        width: 15%;
                        padding-right: 1%;
                        opacity: 0.5;
                    }
                </style>
            </head>
            
            <body>
                ${eleImageSource}
                ${eleLogoImage}
                ${eleLogoText}
                <div class="watermark-text-container ${watermarkContainerClassName}">
                    ${eleWatermarkImage}
                    ${eleWatermarkText}
                </div>
            </body>
            
            </html>
          `
        });
        // const base64data = resp.toString('base64');
        return resp;
    }
};