export class RandomColor {

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      getRandomColorRGBeRGBA() {
    
        var rgba = 'rgba( '
        var rgb = 'rgb( '
        var color: any;
        for (var i = 0; i < 3; i++) {
          color = Math.floor(Math.random() * 255) ;
          rgba += color + ' , '; 
          rgb +=  color + ' , '; 
        }
        rgba += ' 0.3 )';
        rgb =  rgb.substring(0,  rgb.length - 3) + ' )';
    
        return  { rgba: rgba, rgb: rgb };
      }

}