// Images d'exemple dessinées, utilisées tant qu'il n'y a pas de vrais avant/après dans public/exemples/.
// @ts-nocheck
export function demoScene(kind: string, after: boolean): string {
  const x0 = 0; void x0
  const c=document.createElement('canvas');c.width=400;c.height=300;const x=c.getContext('2d');
  if(kind==='plage'){
    let g=x.createLinearGradient(0,0,0,180);
    if(after){g.addColorStop(0,'#3b2a6b');g.addColorStop(.55,'#e2577a');g.addColorStop(1,'#ffb35c')}else{g.addColorStop(0,'#3d7fd6');g.addColorStop(1,'#bfe3f2')}
    x.fillStyle=g;x.fillRect(0,0,400,300);
    if(after){x.fillStyle='#ffd27a';x.beginPath();x.arc(290,170,34,0,7);x.fill()}
    else{x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.ellipse(110,70,50,20,0,0,7);x.fill()}
    g=x.createLinearGradient(0,175,0,230);g.addColorStop(0,after?'#7a4b8f':'#1aa6b7');g.addColorStop(1,after?'#d97a7a':'#5fd3c6');x.fillStyle=g;x.fillRect(0,175,400,60);
    x.fillStyle=after?'#c9a072':'#ecd39a';x.beginPath();x.moveTo(0,240);x.quadraticCurveTo(200,215,400,235);x.lineTo(400,300);x.lineTo(0,300);x.fill();
    x.strokeStyle='#4a3420';x.lineWidth=7;x.beginPath();x.moveTo(70,290);x.quadraticCurveTo(85,220,115,170);x.stroke();
    x.fillStyle=after?'#1d3b2a':'#2c8a4a';for(let a=0;a<6;a++){x.save();x.translate(115,170);x.rotate(a*1.05-.4);x.beginPath();x.ellipse(36,0,40,8,0,0,7);x.fill();x.restore()}
  }
  if(kind==='voiture'){
    x.fillStyle='#cfd9e3';x.fillRect(0,0,400,300);x.fillStyle='#9aa6b2';x.fillRect(0,200,400,100);
    x.fillStyle='#e9eef2';for(let i=0;i<5;i++)x.fillRect(20+i*85,250,40,6);
    const body=after?'#c4231c':'#8b9097';
    x.fillStyle=body;(x as any).beginPath();(x as any).roundRect(60,140,280,62,18);x.fill();
    x.beginPath();x.moveTo(120,142);x.lineTo(160,100);x.lineTo(260,100);x.lineTo(300,142);x.fill();
    x.fillStyle='#1d2733';x.beginPath();x.moveTo(135,140);x.lineTo(165,108);x.lineTo(205,108);x.lineTo(205,140);x.fill();
    x.beginPath();x.moveTo(215,140);x.lineTo(215,108);x.lineTo(255,108);x.lineTo(285,140);x.fill();
    x.fillStyle='#16191e';([120,280] as number[]).forEach(cx=>{x.beginPath();x.arc(cx,204,26,0,7);x.fill()});
    x.fillStyle=after?'#2b2f36':'#c9ced4';([120,280] as number[]).forEach(cx=>{x.beginPath();x.arc(cx,204,12,0,7);x.fill()});
    x.fillStyle='#fff7c2';x.fillRect(326,158,12,10);
  }
  if(kind==='maison'){
    let g=x.createLinearGradient(0,0,0,220);g.addColorStop(0,'#7fb6e8');g.addColorStop(1,'#d8ecf7');x.fillStyle=g;x.fillRect(0,0,400,300);
    x.fillStyle='#6fa85a';x.fillRect(0,225,400,75);
    x.fillStyle=after?'#3fb7b0':'#efece6';x.fillRect(100,125,200,105);
    x.fillStyle=after?'#c8432f':'#8a8f96';x.beginPath();x.moveTo(85,128);x.lineTo(200,60);x.lineTo(315,128);x.fill();
    x.fillStyle=after?'#f6d36b':'#6b5440';x.fillRect(185,170,32,60);
    x.fillStyle='#d6eaf5';x.fillRect(122,150,40,32);x.fillRect(240,150,40,32);
    x.strokeStyle='#fff';x.lineWidth=3;x.strokeRect(122,150,40,32);x.strokeRect(240,150,40,32);
    if(after){([['#e94e77',110],['#ffcc3d',135],['#e94e77',265],['#ff8c42',290]] as [string,number][]).forEach(([col,fx])=>{x.fillStyle='#3e7d3a';x.fillRect(fx-2,222,4,10);x.fillStyle=col;x.beginPath();x.arc(fx,220,7,0,7);x.fill()})}
  }
  return c.toDataURL('image/jpeg',.85);
}
