import AMap from 'AMap';
let tool = {
    drawLine: (map,lineArray,info) => {
        if(lineArray){
            let data = new AMap.Polyline({
                path: lineArray,          //设置线覆盖物路径
                strokeColor: "#ff7575", //线颜色
                strokeOpacity: 1,       //线透明度
                strokeWeight: 4,        //线宽
                strokeStyle: "solid",   //线样式
                strokeDasharray: [10, 5] //补充线样式
            })
            data.setMap(map)
            data.on('click',() => {
                for(let item in info.popSeries){
                    info.popSeries[item].show = false
                }
                info.popSeries.line.show = true
            })
            return data
        }
    }
    ,
    drawCircle: (map,posArray,info) => {
        let list = []
        if(posArray){
            posArray.forEach(item => {
                let data = new AMap.Circle({
                    center: new AMap.LngLat(item[0], item[1]),// 圆心位置
                    radius: 60, //半径
                    strokeColor: "#1b73d5", //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 2, //线粗细度
                    fillColor: "#fff", //填充颜色
                    fillOpacity: 0.35//填充透明度
                })
                data.setMap(map)
                data.on('click',() => {
                    for(let item in info.popSeries){
                        info.popSeries[item].show = false
                    }
                    info.popSeries.ganta.show = true
                })
                list.push(data)
            })
        }
        return list
    }
    ,
    addMarker: (map,posArray,iconUrl,info,type) => {
        let list = []
        if(posArray){
            posArray.forEach(item => {
                let data = new AMap.Marker({
                    map: map,
                    position: item,
                    icon: new AMap.Icon({            
                        size: new AMap.Size(40, 50),  //图标大小
                        image: iconUrl,
                        imageOffset: new AMap.Pixel(0, -60)
                    })        
                })
                data.setMap(map)
                data.on('click',() => {
                    for(let item in info.popSeries){
                        info.popSeries[item].show = false
                    }
                    info.popSeries[type].show = true
                })
                list.push(data)
            })
            return list
        }
    }
    ,
    addText: (map,posArray) => {
        if(posArray){
            posArray.forEach((item,index) => {
                new AMap.Text({
                    text: `#${index}`,
                    textAlign:'center', // 'left' 'right', 'center',
                    verticalAlign:'middle', //middle 、bottom
                    draggable:false,
                    cursor:'pointer',
                    angle:0,
                    style:{
                        color: 'red',
                        border: 'none',
                        background: 'rgba(0,0,0,0)'
                    },
                    position: pos
                }).setMap(map)
            })
        }
    }
    ,
    posGanta: (map,pos,iconUrl) => {
        let data = new AMap.Marker({
            map: map,
            position: pos,
            icon: new AMap.Icon({            
                size: new AMap.Size(40, 50),  //图标大小
                image: iconUrl,
                imageOffset: new AMap.Pixel(0, -60)
            })        
        })
        data.setMap(map)
        return data
    }
}
export default tool