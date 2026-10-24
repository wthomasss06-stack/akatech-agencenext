// lib/device-mockups.js
// Constantes des deux maquettes d'appareils (portable + téléphone), générées à
// partir des images fournies (fond retiré, écran évidé en transparence).
// Repère commun : l'image de cadre fait 736 × 920 px ; `content` est posé
// derrière le cadre, déformé en perspective (matrix3d) pour épouser l'écran,
// puis rogné par `clip` (le cadre cache le reste). Ne pas modifier à la main :
// toute retouche des cadres impose de recalculer ces valeurs.

export const DEVICE_FRAME = { w: 736, h: 920 }

export const LAPTOP = {
  frame: '/images/devices/laptop-frame.webp',
  // Écran retaillé au format des vidéos / aperçus (1600 × 736, soit 2,17:1) :
  // le couvercle du portable a été déformé en perspective pour l'obtenir.
  content: { w: 1600, h: 736 },
  matrix: 'matrix3d(0.3529797,0.088943712,0,-6.1844928e-05,0.0036208177,0.42626325,0,1.0485343e-05,0,0,1,0,57.798111,208.26776,0,1)',
  clip: 'polygon(58px 208px,691px 389px,688px 731px,60px 518px)',
}

export const PHONE = {
  frame: '/images/devices/phone-frame.webp',
  content: { w: 390, h: 844 },
  matrix: 'matrix3d(0.65862013,0.39463363,0,6.3200682e-05,-0.30375198,0.70579444,0,-4.8820134e-05,0,0,1,0,385.89999,58.400002,0,1)',
  clip: 'polygon(411px 74px,393px 74px,382px 78px,372px 89px,365px 102px,156px 623px,149px 646px,149px 670px,153px 683px,161px 695px,174px 706px,348px 801px,365px 807px,382px 807px,394px 802px,405px 791px,412px 779px,433px 725px,434px 720px,438px 712px,439px 707px,443px 699px,450px 678px,456px 665px,466px 636px,475px 615px,479px 602px,488px 581px,495px 560px,504px 539px,508px 526px,517px 505px,521px 492px,525px 484px,540px 442px,544px 434px,548px 421px,552px 413px,556px 400px,562px 387px,569px 366px,575px 353px,582px 332px,587px 322px,593px 322px,593px 315px,596px 314px,596px 310px,598px 309px,601px 299px,604px 294px,605px 289px,618px 257px,622px 241px,622px 219px,619px 207px,616px 200px,610px 191px,596px 178px,554px 151px,552px 151px,550px 149px,546px 148px,542px 144px,538px 143px,537px 141px,531px 140px,530px 142px,526px 142px,524px 140px,524px 133px,517px 133px,516px 128px,509px 128px,508px 127px,508px 123px,504px 123px,503px 125px,499px 125px,432px 83px,425px 79px)',
}
