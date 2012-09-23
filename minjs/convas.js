var FG_R=1,FG_G=2,FG_B=4,FG_H=8,BG_R=16,BG_G=32,BG_B=64,BG_H=128,CONVAS_STATE_READY=0,CONVAS_STATE_READ_KEY=1,CONVAS_STATE_READ_LINE=2;
function Convas(a,b,c,d){this.id="______convas_"+a;this.w=b;this.h=c;this.font_size=d;this.font_name="\u6587\u6cc9\u9a7f\u7b49\u5bbd\u5fae\u7c73\u9ed1";this._initFontWH();this.color_scheme=new ConvasColorSchemeXTerm;document.write("<canvas id='"+this.id+"' width="+(b*this.font_w+4)+" height="+(c*this.font_h+4)+" style='cursor: text; border: solid #0f0 1px;'>Sorry!</canvas>");this.canvas=eval(this.id);this.c=this.canvas.getContext("2d");this.c.textAlign="left";var e=this;document.addEventListener("keypress",
function(a){e._keyPress(a.keyCode)},!0);document.addEventListener("keydown",function(a){e._keyDown(a)},!0);this.buffer=new ConvasBuffer(b,c);this.refresh()}Convas.prototype.refresh=function(){this.show_cursor=!0;this._refresh();this._resetTimerSplash()};Convas.prototype.readKey=function(a,b){this.state=CONVAS_STATE_READ_KEY;this.is_echo=a;this.callback=b};Convas.prototype.readLine=function(a,b){this.state=CONVAS_STATE_READ_LINE;this.is_echo=a;this.line_buf="";this.callback=b};
Convas.prototype.putChar=function(a,b){var c=this.buffer.x,d=this.buffer.y;this.buffer.write(a,b);b&&this.buffer.is_scrolled&&this.refresh();this._refreshCharAt(c,d,!1);this._refreshCharAt(this.buffer.x,this.buffer.y,!0);this._resetTimerSplash()};Convas.prototype.write=function(a,b){for(var c in a)this.putChar(a[c],b)};
Convas.prototype.renderBuffer=function(a,b,c){this.timer_splash&&clearInterval(this.timer_splash);this._refreshCharAt(this.buffer.x,this.buffer.y,!1);for(var d=0;d<a.h;d++)for(var e=0;e<a.w;e++)if(!(b+e>=this.buffer.w||c+d>=this.buffer.h)&&!(this.buffer.getCharAt(b+e,c+d)==a.getCharAt(e,d)&&this.buffer.getColorAt(b+e,c+d)==a.getColorAt(e,d)))this.buffer.setCharAt(b+e,c+d,a.getCharAt(e,d)),this.buffer.setColorAt(b+e,c+d,a.getColorAt(e,d)),this._refreshCharAt(b+e,c+d,!1);this._resetTimerSplash()};
Convas.prototype.cursorTo=function(a,b){var c=this.buffer.x,d=this.buffer.y;this.buffer.cursorTo(a,b);this._refreshCharAt(c,d,!1);this._refreshCharAt(this.buffer.x,this.buffer.y,!0)};Convas.prototype.getCursorPos=function(){return{x:this.buffer.x,y:this.buffer.y}};Convas.prototype.setCursorPos=function(a){this.cursorTo(a.x,a.y)};Convas.prototype.clear=function(){this.buffer.reset();this.refresh()};Convas.prototype.setColor=function(a){this.buffer.color=a};
Convas.prototype._initFontWH=function(){var a=document.createElement("span");a.style="font-family: "+this.font_name+"; font-size: "+this.font_size+";";a.textContent="y";document.body.appendChild(a);this.font_w=a.offsetWidth+2;this.font_h=a.offsetHeight+2;document.body.removeChild(a)};Convas.prototype._resetTimerSplash=function(){this.timer_splash&&clearInterval(this.timer_splash);var a=this;this.timer_splash=setInterval(function(){a._splashCursor()},500)};
Convas.prototype._refresh=function(){this.c.fillStyle="#000";this.c.fillRect(0,0,this.canvas.width,this.canvas.height);for(var a=0;a<this.h;a++)for(var b=0;b<this.w;b++)this._refreshCharAt(b,a,this.show_cursor)};Convas.prototype._refreshCharAt=function(a,b,c){var d=this.buffer.getColorAt(a,b),e=this.buffer.getCharAt(a,b);c&&(a==this.buffer.x&&b==this.buffer.y)&&(d=(d>>4|d<<4)&255);this._drawRect(a,b,this.color_scheme.getColor(d>>4));this._drawChar(a,b,this.color_scheme.getColor(d&15),e)};
Convas.prototype._drawRect=function(a,b,c){this.c.fillStyle=c;this.c.fillRect(a*this.font_w+2,b*this.font_h+4,this.font_w,this.font_h)};Convas.prototype._drawChar=function(a,b,c,d){this.c.fillStyle=c;this.c.font=(c.h?"bold ":"")+this.font_size+"px "+this.font_name;this.c.fillText(d,a*this.font_w+2,(b+1)*this.font_h)};
Convas.prototype._keyPress=function(a){var b=String.fromCharCode(a);switch(this.state){case CONVAS_STATE_READ_KEY:this.is_echo&&this.putChar(b);this.state=CONVAS_STATE_READY;this.callback(a);break;case CONVAS_STATE_READ_LINE:this.is_echo&&("\r"==b?this.putChar("\n"):"\b"!=b&&this.putChar(b)),"\b"==b?this.line_buf.length&&(this.line_buf=this.line_buf.slice(0,-1),this.moveCursorBackward(),this.write(" "),this.moveCursorBackward()):"\r"==b?(this.state=CONVAS_STATE_READY,this.callback(this.line_buf)):
this.line_buf+=b}};Convas.prototype._keyDown=function(a){a=a.keyCode;switch(String.fromCharCode(a)){case "\b":this._keyPress(a)}};Convas.prototype.moveCursorBackward=function(){0!=this.buffer.x&&(this.timer_splash&&clearInterval(this.timer_splash),this._refreshCharAt(this.buffer.x,this.buffer.y,!1),this.buffer.x--,this._resetTimerSplash())};Convas.prototype._splashCursor=function(){this.show_cursor=!this.show_cursor;this._refreshCharAt(this.buffer.x,this.buffer.y,this.show_cursor)};
function ConvasBuffer(a,b){this.w=a;this.h=b;this.reset()}ConvasBuffer.prototype.reset=function(){this.y=this.x=0;this.color=FG_R|FG_G|FG_B;this.buffer=Array(this.w*this.h);for(var a=0;a<this.w*this.h;a++)this.buffer[a]=[this.color," "]};ConvasBuffer.prototype.getColorAt=function(a,b){return this.buffer[b*this.w+a][0]};ConvasBuffer.prototype.setColorAt=function(a,b,c){this.buffer[b*this.w+a][0]=c};ConvasBuffer.prototype.getCharAt=function(a,b){return this.buffer[b*this.w+a][1]};
ConvasBuffer.prototype.setCharAt=function(a,b,c){this.buffer[b*this.w+a][1]=c};ConvasBuffer.prototype.cursorTo=function(a,b){this.x=0>a?0:a>=this.w?this.w-1:a;this.y=0>b?0:b>=this.h?this.h-1:b};ConvasBuffer.prototype.advanceCursor=function(a){++this.x==this.w&&(this.x=0,++this.y==this.h&&(a?this.scrollDown():this.y--))};ConvasBuffer.prototype.putChar=function(a,b,c){this.buffer[this.y*this.w+this.x]=[this.color,a];b||this.advanceCursor(c)};
ConvasBuffer.prototype.putCharAt=function(a,b,c){this.cursorTo(b,c);this.buffer[this.y*this.w+this.x]=[this.color,a]};ConvasBuffer.prototype.copyTo=function(a,b,c,d,e,j,k){for(var f=c;f<c+e;f++){var h=f-c+k;if(h>=a.h)break;for(var g=b;g<b+d;g++){var i=g-b+j;if(i>=a.w)break;a.buffer[h*a.w+i]=this.buffer[f*this.w+g].slice()}}};ConvasBuffer.prototype.newLine=function(a){this.x=0;++this.y==this.h&&(a?this.scrollDown():this.y--)};
ConvasBuffer.prototype.write=function(a,b){this.is_scrolled=!1;for(var c=0;c<a.length;c++)"\n"==a[c]?this.newLine(b):this.putChar(a[c],!1,b)};ConvasBuffer.prototype.scrollDown=function(){this.buffer.splice(0,this.w);for(var a=0;a<this.w;a++)this.buffer.push([FG_R|FG_G|FG_B," "]);this.y--;this.is_scrolled=!0};
ConvasBuffer.prototype.toString=function(){for(var a="chars:\n",b=0;b<this.h;b++){for(var c=0;c<this.w;c++)a+=this.buffer[b*this.w+c][1];a+="\n"}a+="\ncolors:\n";for(b=0;b<this.h;b++){for(c=0;c<this.w;c++)a+=""+this.buffer[b*this.w+c][0];a+="\n"}return a};function ConvasColorSchemeXTerm(){this.colors="#000000 #CD0000 #00CD00 #CDCD00 #1E90FF #CD00CD #00CDCD #E5E5E5 #4C4C4C #FF0000 #00FF00 #FFFF00 #4682B4 #FF00FF #00FFFF #FFFFFF".split(" ")}
ConvasColorSchemeXTerm.prototype.getColor=function(a){return this.colors[a&15]};
