var m0=Object.defineProperty;var t0=(f,r,e)=>r in f?m0(f,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):f[r]=e;var L=(f,r,e)=>(t0(f,typeof r!="symbol"?r+"":r,e),e);(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerpolicy&&(i.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?i.credentials="include":a.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=e(a);fetch(a.href,i)}})();var w0=ArrayBuffer,g=Uint8Array,Q=Uint16Array,g0=Int16Array,X=Int32Array,b=function(f,r,e){if(g.prototype.slice)return g.prototype.slice.call(f,r,e);(r==null||r<0)&&(r=0),(e==null||e>f.length)&&(e=f.length);var n=new g(e-r);return n.set(f.subarray(r,e)),n},K=function(f,r,e,n){if(g.prototype.fill)return g.prototype.fill.call(f,r,e,n);for((e==null||e<0)&&(e=0),(n==null||n>f.length)&&(n=f.length);e<n;++e)f[e]=r;return f},s0=function(f,r,e,n){if(g.prototype.copyWithin)return g.prototype.copyWithin.call(f,r,e,n);for((e==null||e<0)&&(e=0),(n==null||n>f.length)&&(n=f.length);e<n;)f[r++]=f[e++]},E0=["invalid zstd data","window size too large (>2046MB)","invalid block type","FSE accuracy too high","match distance too far back","unexpected EOF"],E=function(f,r,e){var n=new Error(r||E0[f]);if(n.code=f,Error.captureStackTrace&&Error.captureStackTrace(n,E),!e)throw n;return n},v0=function(f,r,e){for(var n=0,a=0;n<e;++n)a|=f[r++]<<(n<<3);return a},k0=function(f,r){return(f[r]|f[r+1]<<8|f[r+2]<<16|f[r+3]<<24)>>>0},A0=function(f,r){var e=f[0]|f[1]<<8|f[2]<<16;if(e==3126568&&f[3]==253){var n=f[4],a=n>>5&1,i=n>>2&1,o=n&3,v=n>>6;n&8&&E(0);var c=6-a,d=o==3?4:o,F=v0(f,c,d);c+=d;var m=v?1<<v:a,t=v0(f,c,m)+(v==1&&256),s=t;if(!a){var C=1<<10+(f[5]>>3);s=C+(C>>3)*(f[5]&7)}s>2145386496&&E(1);var h=new g((r==1?t||s:r?0:s)+12);return h[0]=1,h[4]=4,h[8]=8,{b:c+m,y:0,l:0,d:F,w:r&&r!=1?r:h.subarray(12),e:s,o:new X(h.buffer,0,3),u:t,c:i,m:Math.min(131072,s)}}else if((e>>4|f[3]<<20)==25481893)return k0(f,4)+8;E(0)},U=function(f){for(var r=0;1<<r<=f;++r);return r-1},q=function(f,r,e){var n=(r<<3)+4,a=(f[r]&15)+5;a>e&&E(3);for(var i=1<<a,o=i,v=-1,c=-1,d=-1,F=i,m=new w0(512+(i<<2)),t=new g0(m,0,256),s=new Q(m,0,256),C=new Q(m,512,i),h=512+(i<<1),w=new g(m,h,i),H=new g(m,h+i);v<255&&o>0;){var S=U(o+1),k=n>>3,N=(1<<S+1)-1,A=(f[k]|f[k+1]<<8|f[k+2]<<16)>>(n&7)&N,l=(1<<S)-1,I=N-o-1,B=A&l;if(B<I?(n+=S,A=B):(n+=S+1,A>l&&(A-=I)),t[++v]=--A,A==-1?(o+=A,w[--F]=v):o-=A,!A)do{var z=n>>3;c=(f[z]|f[z+1]<<8)>>(n&7)&3,n+=2,v+=c}while(c==3)}(v>255||o)&&E(0);for(var R=0,M=(i>>1)+(i>>3)+3,T=i-1,_=0;_<=v;++_){var y=t[_];if(y<1){s[_]=-y;continue}for(d=0;d<y;++d){w[R]=_;do R=R+M&T;while(R>=F)}}for(R&&E(0),d=0;d<i;++d){var u=s[w[d]]++,p=H[d]=a-U(u);C[d]=(u<<p)-i}return[n+7>>3,{b:a,s:w,n:H,t:C}]},F0=function(f,r){var e=0,n=-1,a=new g(292),i=f[r],o=a.subarray(0,256),v=a.subarray(256,268),c=new Q(a.buffer,268);if(i<128){var d=q(f,r+1,6),F=d[0],m=d[1];r+=i;var t=F<<3,s=f[r];s||E(0);for(var C=0,h=0,w=m.b,H=w,S=(++r<<3)-8+U(s);S-=w,!(S<t);){var k=S>>3;if(C+=(f[k]|f[k+1]<<8)>>(S&7)&(1<<w)-1,o[++n]=m.s[C],S-=H,S<t)break;k=S>>3,h+=(f[k]|f[k+1]<<8)>>(S&7)&(1<<H)-1,o[++n]=m.s[h],w=m.n[C],C=m.t[C],H=m.n[h],h=m.t[h]}++n>255&&E(0)}else{for(n=i-127;e<n;e+=2){var N=f[++r];o[e]=N>>4,o[e+1]=N&15}++r}var A=0;for(e=0;e<n;++e){var l=o[e];l>11&&E(0),A+=l&&1<<l-1}var I=U(A)+1,B=1<<I,z=B-A;for(z&z-1&&E(0),o[n++]=U(z)+1,e=0;e<n;++e){var l=o[e];++v[o[e]=l&&I+1-l]}var R=new g(B<<1),M=R.subarray(0,B),T=R.subarray(B);for(c[I]=0,e=I;e>0;--e){var _=c[e];K(T,e,_,c[e-1]=_+v[e]*(1<<I-e))}for(c[0]!=B&&E(0),e=0;e<n;++e){var y=o[e];if(y){var u=c[y];K(M,e,u,c[y]=u+(1<<I-y))}}return[r,{n:T,b:I,s:M}]},S0=q(new g([81,16,99,140,49,198,24,99,12,33,196,24,99,102,102,134,70,146,4]),0,6)[1],C0=q(new g([33,20,196,24,99,140,33,132,16,66,8,33,132,16,66,8,33,68,68,68,68,68,68,68,68,36,9]),0,6)[1],I0=q(new g([32,132,16,66,102,70,68,68,68,68,36,73,2]),0,5)[1],u0=function(f,r){for(var e=f.length,n=new X(e),a=0;a<e;++a)n[a]=r,r+=1<<f[a];return n},f0=new g(new X([0,0,0,0,16843009,50528770,134678020,202050057,269422093]).buffer,0,36),R0=u0(f0,0),r0=new g(new X([0,0,0,0,0,0,0,0,16843009,50528770,117769220,185207048,252579084,16]).buffer,0,53),p0=u0(r0,3),O=function(f,r,e){var n=f.length,a=r.length,i=f[n-1],o=(1<<e.b)-1,v=-e.b;i||E(0);for(var c=0,d=e.b,F=(n<<3)-8+U(i)-d,m=-1;F>v&&m<a;){var t=F>>3,s=(f[t]|f[t+1]<<8|f[t+2]<<16)>>(F&7);c=(c<<d|s)&o,r[++m]=e.s[c],F-=d=e.n[c]}(F!=v||m+1!=a)&&E(0)},B0=function(f,r,e){var n=6,a=r.length,i=a+3>>2,o=i<<1,v=i+o;O(f.subarray(n,n+=f[0]|f[1]<<8),r.subarray(0,i),e),O(f.subarray(n,n+=f[2]|f[3]<<8),r.subarray(i,o),e),O(f.subarray(n,n+=f[4]|f[5]<<8),r.subarray(o,v),e),O(f.subarray(n),r.subarray(v),e)},_0=function(f,r,e){var n,a=r.b,i=f[a],o=i>>1&3;r.l=i&1;var v=i>>3|f[a+1]<<5|f[a+2]<<13,c=(a+=3)+v;if(o==1)return a>=f.length?void 0:(r.b=a+1,e?(K(e,f[a],r.y,r.y+=v),e):K(new g(v),f[a]));if(!(c>f.length)){if(o==0)return r.b=c,e?(e.set(f.subarray(a,c),r.y),r.y+=v,e):b(f,a,c);if(o==2){var d=f[a],F=d&3,m=d>>2&3,t=d>>4,s=0,C=0;F<2?m&1?t|=f[++a]<<4|(m&2&&f[++a]<<12):t=d>>3:(C=m,m<2?(t|=(f[++a]&63)<<4,s=f[a]>>6|f[++a]<<2):m==2?(t|=f[++a]<<4|(f[++a]&3)<<12,s=f[a]>>2|f[++a]<<6):(t|=f[++a]<<4|(f[++a]&63)<<12,s=f[a]>>6|f[++a]<<2|f[++a]<<10)),++a;var h=e?e.subarray(r.y,r.y+r.m):new g(r.m),w=h.length-t;if(F==0)h.set(f.subarray(a,a+=t),w);else if(F==1)K(h,f[a++],w);else{var H=r.h;if(F==2){var S=F0(f,a);s+=a-(a=S[0]),r.h=H=S[1]}else H||E(0);(C?B0:O)(f.subarray(a,a+=s),h.subarray(w),H)}var k=f[a++];if(k){k==255?k=(f[a++]|f[a++]<<8)+32512:k>127&&(k=k-128<<8|f[a++]);var N=f[a++];N&3&&E(0);for(var A=[C0,I0,S0],l=2;l>-1;--l){var I=N>>(l<<1)+2&3;if(I==1){var B=new g([0,0,f[a++]]);A[l]={s:B.subarray(2,3),n:B.subarray(0,1),t:new Q(B.buffer,0,1),b:0}}else I==2?(n=q(f,a,9-(l&1)),a=n[0],A[l]=n[1]):I==3&&(r.t||E(0),A[l]=r.t[l])}var z=r.t=A,R=z[0],M=z[1],T=z[2],_=f[c-1];_||E(0);var y=(c<<3)-8+U(_)-T.b,u=y>>3,p=0,G=(f[u]|f[u+1]<<8)>>(y&7)&(1<<T.b)-1;u=(y-=M.b)>>3;var V=(f[u]|f[u+1]<<8)>>(y&7)&(1<<M.b)-1;u=(y-=R.b)>>3;var $=(f[u]|f[u+1]<<8)>>(y&7)&(1<<R.b)-1;for(++k;--k;){var Y=T.s[G],e0=T.n[G],Z=R.s[$],a0=R.n[$],n0=M.s[V],i0=M.n[V];u=(y-=n0)>>3;var o0=1<<n0,P=o0+((f[u]|f[u+1]<<8|f[u+2]<<16|f[u+3]<<24)>>>(y&7)&o0-1);u=(y-=r0[Z])>>3;var x=p0[Z]+((f[u]|f[u+1]<<8|f[u+2]<<16)>>(y&7)&(1<<r0[Z])-1);u=(y-=f0[Y])>>3;var j=R0[Y]+((f[u]|f[u+1]<<8|f[u+2]<<16)>>(y&7)&(1<<f0[Y])-1);if(u=(y-=e0)>>3,G=T.t[G]+((f[u]|f[u+1]<<8)>>(y&7)&(1<<e0)-1),u=(y-=a0)>>3,$=R.t[$]+((f[u]|f[u+1]<<8)>>(y&7)&(1<<a0)-1),u=(y-=i0)>>3,V=M.t[V]+((f[u]|f[u+1]<<8)>>(y&7)&(1<<i0)-1),P>3)r.o[2]=r.o[1],r.o[1]=r.o[0],r.o[0]=P-=3;else{var J=P-(j!=0);J?(P=J==3?r.o[0]-1:r.o[J],J>1&&(r.o[2]=r.o[1]),r.o[1]=r.o[0],r.o[0]=P):P=r.o[0]}for(var l=0;l<j;++l)h[p+l]=h[w+l];p+=j,w+=j;var W=p-P;if(W<0){var D=-W,y0=r.e+W;D>x&&(D=x);for(var l=0;l<D;++l)h[p+l]=r.w[y0+l];p+=D,x-=D,W=0}for(var l=0;l<x;++l)h[p+l]=h[W+l];p+=x}if(p!=w)for(;w<h.length;)h[p++]=h[w++];else p=h.length;e?r.y+=p:h=b(h,0,p)}else if(e){if(r.y+=t,w)for(var l=0;l<t;++l)h[l]=h[w+l]}else w&&(h=b(h,w));return r.b=c,h}E(2)}},H0=function(f,r){if(f.length==1)return f[0];for(var e=new g(r),n=0,a=0;n<f.length;++n){var i=f[n];e.set(i,a),a+=i.length}return e};function z0(f,r){for(var e=0,n=[],a=+!r,i=0;f.length;){var o=A0(f,a||r);if(typeof o=="object"){for(a?(r=null,o.w.length==o.u&&(n.push(r=o.w),i+=o.u)):(n.push(r),o.e=0);!o.l;){var v=_0(f,o,r);v||E(5),r?o.e=o.y:(n.push(v),i+=v.length,s0(o.w,0,v.length),o.w.set(v,o.w.length-v.length))}e=o.b+o.c*4}else e=o;f=f.subarray(e)}return H0(n,i)}const M0=["#000000","#800000","#008000","#808000","#000080","#800080","#008080","#c0c0c0","#808080","#ff0000","#00ff00","#ffff00","#0000ff","#ff00ff","#00ffff","#ffffff","#000000","#00005f","#000087","#0000af","#0000d7","#0000ff","#005f00","#005f5f","#005f87","#005faf","#005fd7","#005fff","#008700","#00875f","#008787","#0087af","#0087d7","#0087ff","#00af00","#00af5f","#00af87","#00afaf","#00afd7","#00afff","#00d700","#00d75f","#00d787","#00d7af","#00d7d7","#00d7ff","#00ff00","#00ff5f","#00ff87","#00ffaf","#00ffd7","#00ffff","#5f0000","#5f005f","#5f0087","#5f00af","#5f00d7","#5f00ff","#5f5f00","#5f5f5f","#5f5f87","#5f5faf","#5f5fd7","#5f5fff","#5f8700","#5f875f","#5f8787","#5f87af","#5f87d7","#5f87ff","#5faf00","#5faf5f","#5faf87","#5fafaf","#5fafd7","#5fafff","#5fd700","#5fd75f","#5fd787","#5fd7af","#5fd7d7","#5fd7ff","#5fff00","#5fff5f","#5fff87","#5fffaf","#5fffd7","#5fffff","#870000","#87005f","#870087","#8700af","#8700d7","#8700ff","#875f00","#875f5f","#875f87","#875faf","#875fd7","#875fff","#878700","#87875f","#878787","#8787af","#8787d7","#8787ff","#87af00","#87af5f","#87af87","#87afaf","#87afd7","#87afff","#87d700","#87d75f","#87d787","#87d7af","#87d7d7","#87d7ff","#87ff00","#87ff5f","#87ff87","#87ffaf","#87ffd7","#87ffff","#af0000","#af005f","#af0087","#af00af","#af00d7","#af00ff","#af5f00","#af5f5f","#af5f87","#af5faf","#af5fd7","#af5fff","#af8700","#af875f","#af8787","#af87af","#af87d7","#af87ff","#afaf00","#afaf5f","#afaf87","#afafaf","#afafd7","#afafff","#afd700","#afd75f","#afd787","#afd7af","#afd7d7","#afd7ff","#afff00","#afff5f","#afff87","#afffaf","#afffd7","#afffff","#d70000","#d7005f","#d70087","#d700af","#d700d7","#d700ff","#d75f00","#d75f5f","#d75f87","#d75faf","#d75fd7","#d75fff","#d78700","#d7875f","#d78787","#d787af","#d787d7","#d787ff","#d7af00","#d7af5f","#d7af87","#d7afaf","#d7afd7","#d7afff","#d7d700","#d7d75f","#d7d787","#d7d7af","#d7d7d7","#d7d7ff","#d7ff00","#d7ff5f","#d7ff87","#d7ffaf","#d7ffd7","#d7ffff","#ff0000","#ff005f","#ff0087","#ff00af","#ff00d7","#ff00ff","#ff5f00","#ff5f5f","#ff5f87","#ff5faf","#ff5fd7","#ff5fff","#ff8700","#ff875f","#ff8787","#ff87af","#ff87d7","#ff87ff","#ffaf00","#ffaf5f","#ffaf87","#ffafaf","#ffafd7","#ffafff","#ffd700","#ffd75f","#ffd787","#ffd7af","#ffd7d7","#ffd7ff","#ffff00","#ffff5f","#ffff87","#ffffaf","#ffffd7","#ffffff","#080808","#121212","#1c1c1c","#262626","#303030","#3a3a3a","#444444","#4e4e4e","#585858","#626262","#6c6c6c","#767676","#808080","#8a8a8a","#949494","#9e9e9e","#a8a8a8","#b2b2b2","#bcbcbc","#c6c6c6","#d0d0d0","#dadada","#e4e4e4","#eeeeee"],l0=[0,.10666666666666666,.35900235294117644,.4656690196078431,.03624156862745098,.14290823529411764,.3952439215686274,.7528658823529413,.5019105882352941,.2125,.7152,.9276999999999999,.0722,.2847,.7873999999999999,.9998999999999999,0,.026898039215686273,.038223529411764705,.04954901960784314,.06087450980392157,.0722,.26644705882352937,.2933450980392156,.3046705882352941,.3159960784313725,.32732156862745093,.33864705882352936,.378635294117647,.4055333333333333,.4168588235294117,.4281843137254902,.4395098039215686,.45083529411764706,.4908235294117647,.517721568627451,.5290470588235293,.5403725490196077,.5516980392156863,.5630235294117647,.6030117647058824,.6299098039215687,.641235294117647,.6525607843137254,.6638862745098039,.6752117647058824,.7152,.7420980392156862,.7534235294117647,.764749019607843,.7760745098039215,.7873999999999999,.07916666666666666,.10606470588235295,.11739019607843137,.1287156862745098,.14004117647058822,.15136666666666668,.34561372549019603,.37251176470588226,.38383725490196074,.39516274509803917,.4064882352941176,.417813725490196,.4578019607843137,.48469999999999996,.4960254901960784,.5073509803921568,.5186764705882353,.5300019607843137,.5699901960784314,.5968882352941177,.608213725490196,.6195392156862745,.6308647058823529,.6421901960784314,.6821784313725491,.7090764705882353,.7204019607843136,.7317274509803922,.7430529411764706,.754378431372549,.7943666666666666,.8212647058823529,.8325901960784313,.8439156862745096,.8552411764705882,.8665666666666666,.1125,.13939803921568628,.1507235294117647,.16204901960784313,.17337450980392155,.1847,.37894705882352936,.40584509803921565,.41717058823529407,.42849607843137255,.4398215686274509,.45114705882352935,.491135294117647,.5180333333333333,.5293588235294117,.5406843137254901,.5520098039215686,.563335294117647,.6033235294117647,.630221568627451,.6415470588235294,.6528725490196078,.6641980392156862,.6755235294117647,.7155117647058824,.7424098039215686,.7537352941176471,.7650607843137255,.7763862745098039,.7877117647058823,.8276999999999999,.8545980392156862,.8659235294117646,.877249019607843,.8885745098039215,.8998999999999999,.14583333333333334,.1727313725490196,.18405686274509803,.19538235294117645,.20670784313725488,.21803333333333333,.4122803921568627,.43917843137254897,.4505039215686274,.4618294117647059,.47315490196078425,.4844803921568627,.5244686274509803,.5513666666666667,.562692156862745,.5740176470588234,.585343137254902,.5966686274509804,.636656862745098,.6635549019607844,.6748803921568627,.6862058823529411,.6975313725490195,.7088568627450981,.7488450980392157,.775743137254902,.7870686274509804,.7983941176470588,.8097196078431372,.8210450980392157,.8610333333333332,.8879313725490195,.899256862745098,.9105823529411763,.9219078431372548,.9332333333333332,.17916666666666667,.20606470588235296,.21739019607843138,.2287156862745098,.24004117647058823,.2513666666666667,.445613725490196,.4725117647058823,.4838372549019607,.4951627450980392,.5064882352941176,.517813725490196,.5578019607843137,.5847,.5960254901960783,.6073509803921568,.6186764705882353,.6300019607843137,.6699901960784314,.6968882352941177,.708213725490196,.7195392156862744,.7308647058823529,.7421901960784314,.782178431372549,.8090764705882353,.8204019607843137,.8317274509803921,.8430529411764706,.854378431372549,.8943666666666665,.9212647058823529,.9325901960784313,.9439156862745097,.9552411764705881,.9665666666666666,.2125,.23939803921568628,.2507235294117647,.26204901960784316,.27337450980392153,.2847,.4789470588235294,.5058450980392156,.517170588235294,.5284960784313725,.5398215686274509,.5511470588235293,.591135294117647,.6180333333333333,.6293588235294116,.6406843137254902,.6520098039215686,.663335294117647,.7033235294117647,.730221568627451,.7415470588235293,.7528725490196078,.7641980392156863,.7755235294117647,.8155117647058824,.8424098039215686,.853735294117647,.8650607843137255,.8763862745098039,.8877117647058823,.9276999999999999,.9545980392156862,.9659235294117646,.977249019607843,.9885745098039215,.9998999999999999,.03136941176470588,.07058117647058824,.10979294117647057,.14900470588235296,.18821647058823532,.22742823529411768,.26663999999999993,.3058517647058823,.34506352941176466,.384275294117647,.4234870588235294,.4626988235294117,.5019105882352941,.5411223529411765,.5803341176470588,.6195458823529412,.6587576470588236,.6979694117647058,.7371811764705881,.7763929411764706,.8156047058823528,.8548164705882353,.8940282352941176,.9332399999999998],c0="$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",h0=960,d0=720;class T0{constructor(){L(this,"FRAMES_PER_CHUNK",30*10);L(this,"WIDTH",160);L(this,"HEIGHT",120);L(this,"chunkPrefix","bad_apple_160x120_xterm256_chunk");L(this,"frameSizeBytes",0);L(this,"chunks",{});L(this,"prevFrameBuffer",null);L(this,"forceFullRender",!1);L(this,"mode",0);this.frameSizeBytes=this.WIDTH*this.HEIGHT}async loadChunk(r){if(r in this.chunks)return;const e=await fetch(`/media/${this.chunkPrefix}${r.toString().padStart(2,"0")}.zst`).then(a=>a.arrayBuffer()),n=new Uint8Array(e);this.chunks[r]=z0(n)}async loadChunkForFrame(r){const e=Math.floor(r/this.FRAMES_PER_CHUNK);await this.loadChunk(e)}render(r,e){const n=Math.floor(r/this.FRAMES_PER_CHUNK),a=r%this.FRAMES_PER_CHUNK,i=this.chunks[n];if(!i){console.error("wtf");return}const o=a*this.frameSizeBytes,v=o+this.frameSizeBytes,c=i.slice(o,v);this.forceFullRender&&(this.prevFrameBuffer=null,this.forceFullRender=!1),this.decodeAndDrawFrame(e,c,a>0&&this.prevFrameBuffer?this.prevFrameBuffer:void 0),this.prevFrameBuffer=c,a>this.FRAMES_PER_CHUNK*.6&&!(n+1 in this.chunks)&&this.loadChunk(n+1)}decodeAndDrawFrame(r,e,n){n||r.clearRect(0,0,h0,d0);for(let a=0;a<this.HEIGHT;++a)for(let i=0;i<this.WIDTH;++i){const o=e[a*this.WIDTH+i];if(!!o&&!(n&&n[a*this.WIDTH+i]===o)){if(r.clearRect(6*i,6*a,6,6),this.mode===0)r.fillStyle=M0[o],r.fillRect(6*i,6*a,6,6);else if(this.mode===1||this.mode===2){let v=l0[o];this.mode===2&&(v=1+-v);const c=Math.floor(v*c0.length),d=c0[c];if(d===" ")continue;r.fillStyle=this.mode===2?"white":"black",r.fillText(d,6*i+3,6*a+3,6)}else if(this.mode===3){r.fillStyle="black";const v=6*(1+-l0[o]),c=(6-v)/2;r.fillRect(6*i+c,6*a+c,v,v)}}}}}(async()=>{const f=new T0;f.loadChunk(0);const r=document.getElementById("canvas");r.width=h0,r.height=d0;const e=r.getContext("2d");if(!e){alert("no");return}e.font="bold 6px Monospace",e.textAlign="center",e.textBaseline="middle";const n=document.getElementById("music");n.volume=.2;const a=()=>Math.floor(n.currentTime*30+6);n.addEventListener("seeked",()=>{f.loadChunkForFrame(a()),f.forceFullRender=!0,f.render(a(),e)}),setInterval(()=>{n.paused||f.render(a(),e)},1e3/30),document.querySelectorAll('input[name="render-mode"]').forEach(i=>{i.addEventListener("change",()=>{if(!(i instanceof HTMLInputElement))return;r.style.backgroundColor="white";let o=0;switch(i.value){case"block":default:o=0;break;case"text":o=1;break;case"text_inverse":o=2,r.style.backgroundColor="black";break;case"size":o=3;break}f.forceFullRender=!0,f.mode=o})})})();
