import {parseString} from 'xml2js';

// "0":{"width":5,"offset":[0,6],"rect":[58,2,4,5]}

export default function loadFont(imgSrc, xmlUrl) {
    return new Promise((resolve, reject) => {
        let fontData = {};
        fetch(xmlUrl)
        .then(async response => {
            const xmlString = await response.text();
            parseString(xmlString, function (err, xmlObject) {
                if(err) {
                    return reject(err);
                }
    
                if(
                    !xmlObject.Font || 
                    !xmlObject.Font.$ || 
                    !xmlObject.Font.Char
                ) {
                    return reject(new Error('Unexpected XML Format'));
                }
    
                fontData = {
                    metadata: xmlObject.Font.$
                };
                fontData.characters = xmlObject.Font.Char.reduce(
                    (obj, item) => {
                        if(item.$) {
                            obj[item.$.code] = {
                                width: parseInt(item.$.width),
                                offset: item.$.offset.split(' ').map(i => parseInt(i)),
                                rect: item.$.rect.split(' ').map(i => parseInt(i))
                            };
                        }
    
                        return obj;
                    },
                    {}
                );
    
                fontData.image = new Image();
                fontData.image.addEventListener('load', 
                    () => resolve(fontData), false);
                fontData.image.addEventListener('error', reject, false);
                fontData.image.src = imgSrc;
            });
        })
        .catch(reject);
    });

}