/**
 * rating display
 *
 * Mostra un indicatore tipo contachilometri su una scala da 1 a 4 o 5
 */


import { chart_init } from '../utils/init.js';
import { textToSvgPath } from '../utils/svg-text-to-path.js';

export async function ratingDisplay({

  // SECTION args
  /**
    variabili e funzioni condivise importate da '../utils/init.js' (vedi)
    Può essere parzialmente o completamente integrata con funzioni specifiche
    (ad esempio per cambiare la modailità di implemntazione di svg.js, vedi demo).
    Lasciare come oggetto vuoto se non è necessario modificarlo
  */
  chartUtils = {},

  /** container (selettore o elemento DOM), se null viene restituito il codice SVG */
  container = null,

  /** svuota il container prima del rendering */
  emptyContainer = true,

  /** Converte i font in tracciati NB: da testare per versioni web */
  textToPath = false,

  /** eventuali classi da aggiungere all'elemento svg */
  svgClassName = null,

  /** modailità debug, se attiva mostra dei riferimenti grafici */
  debug = false,

  /**
    valore da rappresentare
    in base a questo viene assegnato il posizionamento rispetto alla scala:
    1-1,99 : prima fascia
    2-2,99 : seconda ...
    La scala parte da 1
    L'ultima porzione rappresenta tutti i valori >= 4 per la versione a 4 porzioni
    e i valori >= 5 per l'altra
  */
  displayValue = null,

  /**
    se true, l'asticella viene posizionata al centro del colore corrispondente
    se false, viene posizionata in proporzione al valore effettivo
  */
  displayValueForceCenter = false,

  /**
    fill, traccia e classe dello sfondo del display principale
    oggetto analogo a
    {
      fill: null,
      strokeWidth: null,
      strokeColor: null,
      className: null,
    }
  */
  displayArc = null,

  /** numero di porzioni del tachimetro  */
  scale = 5, // 4 o 5

  /**
    colori da applicare alle porzioni del tachimetro. Se non impostati vengono usati quelli di base
    I colori vengono assegnati agli el,enti della scala secondo il loro ordine, a partire dal proimo a sinistra
    Se un colore non è presente viene usato il nero (#000)
  */
  scaleColors = null,

  /** eventuale classe da applicare agli elementi della scala */
  scaleClassName = null,

  /**
    segni di separazione degli elementi della scala
    vengono aggiunti anche `stroke-width="1" fill="none" stroke-linecap="butt"`
    se `scaleticksColor` è null, vengono usati gli stessi colori di `scaleColors`
  */
  scaleticksColor = null,
  scaleticksClassName = null,

  /**
    asticella
  */
  rodColor = '#000',
  rodClassName = null,

  /**
    etichetta principale
    se presente è un array in cui ogni elemento corrisponde ad una riga (max 2)
    dell'etichetta:

    displayLabel: [
      {
        label: <text> || null,
        font: obj || null, // oggetto analogo a quello definito in src/utils/init.js
        fill: <color>,
        fontFilePath: path // percorso al file del font, utilizzato se `textToPath === true`
      },
      {...}
    ]
  */
  displayLabel = null,

  /** distanza della prima riga di etichetta dalla base dell'asticella */
  displayLabelTopMargin = 4,


  // =>> minidisplay
  /**
    minidisplay
    se impostato è un array di uno o due elementi, in cui ognuno di questo
    è un oggetto così impostato:

    miniDisplay = [
      {
        position: 'sx' | 'dx' (aliases: left | right),
        value: number,
        type: 'gauge' || 'value'   // gauge = mini tachimetro, value: mostra il valore indicato in value
        typeLabelFont: obj || null // oggetto analogo a quelli definito in displayLabel per la rappresentazione
                                   //  di `type: value`. Se typeLabelFont.label non è presente, viene utilizzato
                                   //  `value` (arrotondato all'intero)
        mdLabel: array || null     // array di oggetti (uno per ogni riga di etichetta) analogo a quello
                                   // indicato nel display principale (displayLabel)
        mdArc: {                   // oggetto simile a displayArc
          fill: null,
          strokeWidth: null,
          strokeColor: null,
          className: null,
        }
      }
      ...
    ],

    se
  */
  miniDisplay = null,

  /** distanza dalla base del display principale */
  miniDisplayTopMargin = 0,


  animation = false,
  // animation_ms = 100, // number
  // animation_fps = 60, // number

  // !SECTION

}) {

  try {

    chartUtils = chart_init(chartUtils);
    scaleColors??= chartUtils.defaults.colors;

    // 30 gradi in radianti
    // ampiezza dell'angolo della parte eccedente il raggio della circonferenza che include l'arco di cerchio
    const rad30 = chartUtils.toRadians(30);

    // =>> sizes

    const sizes = {
      // display principale
      mainDisplay: {

        r: 110,

        get w() { return this.r * 2; },
        /*
          altezza dell'area del display
          è pari al raggio + la distanza corrispondente ad uno spostamento di 30°
          (l'arco di cerchio dell'area display è di 240°),
          distanza che corrisponde al centro di rotazione dell'asticella.
          La base dell'area del display principale è quindi la corda posizionata agli estremi dell'arco
        */
        get h() { return this.r + ( this.r * Math.sin(rad30) ); },

        /*
          centro di rotazione dell'asticella
          corrisponde al centro della circonferenza che include l'arco dell'area display
        */
        get cx() { return this.r; },
        get cy() { return this.r; }
      }
    };

    // =>> dimensione dell'intero svg
    sizes.mainSvg  = {
      w: sizes.mainDisplay.w,
      h: sizes.mainDisplay.h // altezza provvisoria, andrà ricalcolata dopo il rendering dei miniDisplay
    };


    // =>> verifiche e impostazioni di base
    if(displayValue == null || typeof displayValue !== 'number') {
      throw '`displayValue` is requested and must be a number';
    }
    if([4,5].indexOf(scale) === -1) {
      throw '`scale` must be 4 or 5';
    }

    displayValue = Math.min(displayValue, scale + .99);

    const displayScaleStart = 1 // valore iniziale del display. La scala parte da 1
      /*
        la scala parte da 1 e arriva a `scale` (viene tolta una piccola
        porzione finale per maggiore precisione)
      */
      ,parsedDisplayValue = displayValueForceCenter? Math.floor(displayValue) + .499 : displayValue
    ;


    // =>> animazione e posizione iniziale dell'asticella (rod)
    let rotazioneAsticella = 0;

    if(animation) {

      // TODO animazione
      // const display_animation = () => {
      //   const runAnimation = () => {

      //     const animationStepValue = parsedDisplayValue / animation_ms;

      //     let fpsInterval = animation_ms / animation_fps,
      //       currentDisplayValue = displayScaleStart, // valore iniziale. La scala parte da 1
      //       startTimestamp = Date.now(),
      //       animationEnd = false;

      //     const step = () => {
      //       let now = Date.now(),
      //         elapsed = now - startTimestamp;

      //       currentDisplayValue = Math.min(currentDisplayValue, parsedDisplayValue);

      //       if(currentDisplayValue >= parsedDisplayValue) {
      //         animationEnd = true;
      //       }

      //       // request another frame
      //       const animationRequest = window.requestAnimationFrame(step);

      //       // if enough time has elapsed, draw the next frame
      //       if (elapsed >= fpsInterval) {

      //         // Get ready for next frame by setting startTimestamp=now, but...
      //         // Also, adjust for fpsInterval not being multiple of 16.67
      //         startTimestamp = now - (elapsed % fpsInterval);

      //         svgElement.style.setProperty(
      //           '--rd-rot',
      //           Math.max(0, ((currentDisplayValue - displayScaleStart) * 240) / (scale - .001))
      //         );

      //         if(animationEnd) {
      //           window.cancelAnimationFrame(animationRequest);

      //         } else {
      //           currentDisplayValue += animationStepValue;
      //           // easing out a 2/3 del valore
      //           // if(currentDisplayValue >= parsedDisplayValue * 2/3) {
      //           //   fpsInterval += 1;
      //           // }

      //         }
      //       }

      //     };// end step

      //     step();
      //   }; // end animazione_arco

      //   runAnimation();

      // }; // end display_animation

      // // NB la mutazione non è rilevata se la card è già visibile nel viewport
      // // per questo è presente l'if iniziale
      // if(inViewport) {
      //   display_animation();
      // }

    } else {
      rotazioneAsticella = Math.max(0, ((parsedDisplayValue  - displayScaleStart) * 240) / (scale - .001));
    }

    // container element
    const  containerElement = chartUtils.getElementFromContainer(container);

    if(containerElement && emptyContainer) {
      containerElement.innerHTML = '';
    }

    // =>> definizione SVG
    const svgCanvas = chartUtils.createSvgCanvas(container);
    svgCanvas.viewbox(0, 0, sizes.mainSvg.w, sizes.mainSvg.h)
      .size(sizes.mainSvg.w, sizes.mainSvg.h)
      .fill('none');

    if(svgClassName) {
      svgCanvas.addClass(svgClassName);
    }


    // =>> gruppo Display Principale
    const mainDisplayGroup = svgCanvas.group()
      .attr({
        'data-debug-info': debug? 'Gruppo Display Principale' : null,
      });


    // =>> function getDisplayArcPath
    function getDisplayArcPath(radius, cx, cy) {

      const startPointX = cx - (radius * Math.cos(rad30)),
        startPointY = cy + (radius * Math.sin(rad30)),

        endPointX = cx + (radius * Math.cos(rad30)),
        endPointY = cy + (radius * Math.sin(rad30));

      return `M ${startPointX},${startPointY} ` +
        // rx ry angle large-arc-flag sweep-flag dx dy
        `A ${radius} ${radius} 0 1 1 ${endPointX} ${endPointY}`;
    }

    // =>> display principale
    mainDisplayGroup.path(
      // 'M14.5589,164.7274C5.2967,148.6096,0,129.9234,0,110,0,49.2487,49.2487,0,110,0s110,49.2487,110,110c0,20.0586-5.3689,38.8632-14.748,55.0552l-190.6931-.3278Z'
      getDisplayArcPath(sizes.mainDisplay.r, sizes.mainDisplay.cx, sizes.mainDisplay.cy)
    )
      .attr({
        'data-debug-info': debug? 'area display principale' : null,
        class: displayArc?.className, // se il valore è null o undefined l'attributo viene ignorato
        fill: displayArc?.fill?? 'none',
        stroke: displayArc?.strokeColor,
        'stroke-width': displayArc?.strokeWidth,
      });


    // =>> scale & ticks

    let ticks_paths, scale_paths;
    if(scale === 4) {
      ticks_paths = [
        'M31.8145,64.3924l-12.5627-7.253',
        'M110.2255,31.2336V4.6702',
        'M174.4747,72.6224l26.6597-15.3919'
      ];

      scale_paths = [
        'M25.1449,65.1604l-7.8217-4.5158C1.0679,91.4936,.5203,129.7554,19.2431,162.1841l-.0406-.3084c-14.0813-33.5175-11.9978-69.7327,5.9424-96.7153Z',
        'M106.2255,4.745c-16.5541,.6089-33.2051,5.1472-48.5497,14.0065-16.5527,9.5566-29.5166,22.9407-38.4241,38.3877l8.1965,4.7322c7.0425-9.5853,16.1881-17.8798,27.4637-24.2736,16.1538-9.16,33.9923-12.8843,51.3135-11.7545V4.745Z',
        'M199.0645,53.8066C179.2813,22.2909,145.2283,4.7195,110.2255,4.6702V26.1936c26.4244,2.8778,51.228,17.0771,66.4696,40.528l22.3694-12.915Z',
        'M201.1344,57.2305l-22.3293,12.8918c.0073,.0126,.0153,.0248,.0227,.0374,11.402,19.8312,12.2809,44.9971,.02,66.2336-1.9507,3.3787-4.1538,6.5209-6.5719,9.4163l28.9064,16.2815c18.0334-31.3837,19.3337-71.2517-.0479-104.8605Z'
      ];

    } else { // 5
      ticks_paths = [
        'M22.1717,81.0456l-11.8401-3.8471',
        'M76.5125,33.9593l-9.0032-20.2213',
        'M140.9257,40.7459l12.0048-26.963',
        'M180.4367,86.9106l29.6283-9.6269'
      ];

      scale_paths = [
        'M15.9428,83.2275l-6.7733-2.2007c-7.4723,26.3461-4.7006,55.5677,10.0736,81.1573l-.0406-.3084c-11.1296-26.4916-12.1697-54.674-3.2596-78.6482Z',
        'M63.8892,15.4414c-2.0916,1.0298-4.1652,2.1275-6.2134,3.3101-23.385,13.5013-39.6072,34.641-47.3442,58.447l7.0957,2.3055c7.2439-17.1207,19.7513-31.8504,37.4847-41.9061,5.0895-2.886,10.3474-5.2258,15.7025-7.0513l-6.7253-15.1052Z',
        'M149.2476,12.2204C123.5877,1.9537,94.1199,1.8658,67.5094,13.7379l6.9424,15.593c21.8262-6.3824,44.9893-4.3134,64.9426,5.0201l9.8533-22.1306Z',
        'M184.0155,81.542l24.7449-8.04c-2.0469-5.5565-4.5906-11.0154-7.6519-16.3178-11.5244-19.9607-28.6157-34.6992-48.178-43.4012l-9.9482,22.3439c14.4784,7.5615,27.0454,19.0628,35.8455,34.0328,2.0891,3.6336,3.8213,7.4476,5.1877,11.3823Z',
        'M185.2117,85.3591c4.668,16.5795,2.9308,34.935-6.364,51.0341-1.9507,3.3787-4.1538,6.5209-6.5719,9.4163l28.9064,16.2815c14.5532-25.327,18.2002-56.1781,8.8828-84.8073l-24.8533,8.0754Z'
      ];
    }

    const ticksGroup = mainDisplayGroup.group()
      .attr({
        'data-debug-info': debug? 'ticks' : null,
        class: scaleticksClassName,
        fill: 'none',
        'stroke-width': .5,
        'stroke-linecap': 'butt',

      });
    ticks_paths.forEach((p, idx) => {
      ticksGroup.path(p)
        .attr({
          stroke: scaleticksColor? scaleticksColor : scaleColors?.[idx + 1]?? '#000',
        });
    });

    const scaleGroup = mainDisplayGroup.group().attr({
      'data-debug-info': debug? 'scales' : null,
      class: scaleClassName,
      stroke: 'none',
    });
    scale_paths.forEach((p, idx) => {
      scaleGroup.path(p)
        .attr({
          fill: scaleColors?.[idx]?? '#000'
        });
    });


    // =>> asticella
    const rodGroup = mainDisplayGroup.group()
      .attr({
        'data-debug-info': debug? 'asticella' : null,
        fill: rodColor,
        class: rodClassName
      });

    // centro
    // rodGroup.path('M120.5713,103.6898c3.3137,5.7395,1.3472,13.0786-4.3923,16.3923-5.7395,3.3137-13.0786,1.3472-16.3923-4.3923s-1.3472-13.0786,4.3923-16.3923c5.7395-3.3137,13.0786-1.3472,16.3923,4.3923Zm-13.8923-.0622c-3.348,1.933-4.4952,6.2141-2.5622,9.5622s6.2141,4.4952,9.5622,2.5622,4.4952-6.2141,2.5622-9.5622-6.2141-4.4952-9.5622-2.5622Z');

    // versione con path calcolato
    // https://www.smashingmagazine.com/2019/03/svg-circle-decomposition-paths/
    const rodRingRadius = 24,
      rodInnerRingRadius = 14;
    rodGroup.path(
      `M ${sizes.mainDisplay.cx - rodRingRadius/2}, ${sizes.mainDisplay.cy}`+
      `a ${rodRingRadius/2},${rodRingRadius/2} 0 1,0 ${rodRingRadius},0 ` +
      `a ${rodRingRadius/2},${rodRingRadius/2} 0 1,0 -${rodRingRadius},0 ` +

      `M ${sizes.mainDisplay.cx - rodInnerRingRadius/2}, ${sizes.mainDisplay.cy} ` +
      `a ${rodInnerRingRadius/2},${rodInnerRingRadius/2} 0 1,0 ${rodInnerRingRadius},0 ` +
      `a ${rodInnerRingRadius/2},${rodInnerRingRadius/2} 0 1,0 -${rodInnerRingRadius},0`
    )
      .attr({'fill-rule': 'evenodd'});

    // bbox del solo anello di base dell'asticella
    // usato per il posizionamento delle etichette
    const rodGroupBaseBbox = rodGroup.bbox();

    // asta
    rodGroup.polygon('59.1813 139.0943 59.1813 139.0943 98.8572 108.491 105.5448 120.0899 59.1813 139.0943')
      .transform({

        origin: {
          x: sizes.mainDisplay.cx,
          y: sizes.mainDisplay.cy,
        },
        rotate: rotazioneAsticella
      });



    // =>> function setTextElement
    async function setTextElement(textObj, parentEl = svgCanvas) {
      /*
      {
        label: <text> || null,
        font: obj || null, // oggetto analogo a quello definito in src/utils/init.js
        fill: <color>,
        fontFilePath: path // percorso al file del font, utilizzato se `textToPath === true`
      }
      */

      let textEl;

      textObj.font = {...chartUtils.defaults.font, ...(textObj.font??{}) };

      textObj.fill??= '#000';

      if(textToPath) {

        if(!textEl.fontFilePath) {
          throw `Missing 'fontFilePath' for text ${textObj.label}`;
        }
        const { pathData/* , pathElementString */ } = await textToSvgPath(textObj.fontFilePath, textObj.label, textObj.font?.size??16);
        textEl = parentEl.path(pathData).attr({fill: textObj.fill});

      } else {
        // larghezza testo
        textEl = parentEl.plain(textObj.label).font({
          fill: textObj.fill,
          ...textObj.font,
        });
      }

      return [ textEl, textEl.bbox() ];
    }

    // =>> function setLabel
    async function setLabel({
      labelObj,
      islabelRow1,
      firstRowLabelY,
      parentEl = svgCanvas
    }) {
      if(labelObj?.label) {

        const [labelEl, label_bbox] = await setTextElement(labelObj, parentEl);


        // posizionamento, al centro sotto l'asticella
        const labelY = firstRowLabelY + (islabelRow1? 0 : prevLabelHeight + 2);

        labelEl.move(
          sizes.mainDisplay.cx - label_bbox.width / 2,
          labelY
        );

        prevLabelHeight = label_bbox.height;

        labelEl.attr({
          'data-debug-info': debug? `label “${labelObj.label}”` : null,
          textLength: textToPath? null : label_bbox.width,
          lengthAdjust: textToPath? null : 'spacingAndGlyphs',
        });

      }
    }

    // =>> displayLabel
    if(displayLabelTopMargin != null && typeof displayLabelTopMargin !== 'number') {
      throw '`displayLabelTopMargin` must be null or a number';
    }

    displayLabel??=[];
    if(displayLabel.length > 2) {
      throw 'No more than 2 `displayLabel` elements can be defined';
    }

    let labelIdx = 0, prevLabelHeight = 0;
    for await (const labelObj of displayLabel) {

      await setLabel({
        labelObj: labelObj,
        islabelRow1: labelIdx === 0,
        firstRowLabelY: rodGroupBaseBbox.y2 + (displayLabelTopMargin??0),
        parentEl: mainDisplayGroup
      });
      labelIdx++;
    }

    // =>> ricalcolo altezza gruppo principale
    const mainDisplayGroupBbox = mainDisplayGroup.bbox();
    sizes.mainSvg.h = mainDisplayGroupBbox.y + mainDisplayGroupBbox.y2;

    // SECTION miniDisplay
    if(miniDisplayTopMargin != null && typeof miniDisplayTopMargin !== 'number') {
      throw '`miniDisplayTopMargin` must be null or a number';
    }

    miniDisplay??=[];
    if(miniDisplay.length > 2) {
      throw 'No more than 2 `miniDisplay` elements can be defined';
    }


    let miniDisplayIdx = 1, miniDisplayMaxHeight = 0;
    for await (const md of miniDisplay) {


      const errorPrefix = `miniDisplay #${miniDisplayIdx}`;

      // =>> controlli
      ['position', 'type', 'value'].forEach(item => {
        if(md[item] == null) {
          throw `${errorPrefix}: '${item}' is requested`;
        }
      });

      if(['sx', 'dx', 'left', 'right'].indexOf(md.position) === -1) {
        throw `${errorPrefix}: 'position' must be one of 'sx', 'dx', 'left' or 'right'`;
      }

      if(typeof md.value !== 'number') {
        throw `${errorPrefix}: 'value' must be a number`;
      }

      if(['gauge', 'value'].indexOf(md.type) === -1) {
        throw `${errorPrefix}: 'type' must be one of 'gauge' or 'value'`;
      }

      // default
      md.mdArc ??= {};
      md.mdArc.strokeWidth ??= 0;


      // =>> dimensioni
      const
        // raggio circonferenza che include l'arco
        mdRadius = 26,

        mdWidrh = (mdRadius * 2) + (md.mdArc?.strokeWidth??0), // impegna sia la parte destra che la sinistra

        // margine orizzontale dal bordo esterno dell'SVG
        xMargin = 20,

        // coordinate dell'origine del miniDisplay
        mdOrigin = {
          y: sizes.mainSvg.h + (miniDisplayTopMargin?? 0),
          x: (md.position === 'sx' || md.position === 'left')
            ? xMargin
            : sizes.mainSvg.w - xMargin - mdWidrh
        }
      ;


      // =>> mdGroup
      const mdGroup = svgCanvas.group()
        .attr({
          'data-debug-info': debug? `miniDisplay #${miniDisplayIdx}` : null,
        });

      // =>> definizione arco
      const
        // altezza aggiuntiva dell'arco di cerchio oltre la lunghezza del raggio
        // extraHeight = mdRadius * Math.sin(rad30),

        // altezza complessiva dell'arco di cerchio, calcolata sulla base
        // della sua ampiezza totale di 240°
        // mdArcHeight = mdRadius + extraHeight +
        //   md.mdArc.strokeWidth / 2, // il bordo è applicato solo sull'arco e non sulla corda che lo sottende

        // coordinate del centro della circonferenza che include l'arco
        mdArcCx= mdOrigin.x + mdRadius, // + md.mdArc.strokeWidth / 2,
        mdArcCy= mdOrigin.y + mdRadius // + md.mdArc.strokeWidth / 2,
      ;


      mdGroup.path(getDisplayArcPath(mdRadius, mdArcCx, mdArcCy))
        .attr({
          'data-debug-info': debug? `miniDisplay #${miniDisplayIdx}: arco` : null,
          class: md.mdArc.className, // se il valore è null o undefined l'attributo viene ignorato
          fill: md.mdArc.fill?? 'none',
          stroke: md.mdArc.strokeWidth > 0? md.mdArc.strokeColor : null,
          'stroke-width': md.mdArc.strokeWidth > 0? md.mdArc.strokeWidth : null,
          'stroke-linecap': md.mdArc.strokeWidth > 0? 'round' : null,
        });

      // =>> modalità "value"
      if(md.type === 'value') {

        md.typeLabelFont ??= {};
        md.typeLabelFont.label ??= String(Math.round(md.value));

        const [valueEl, value_bbox] = await setTextElement(md.typeLabelFont, mdGroup);

        valueEl.move(
          mdArcCx - value_bbox.w/2,
          mdArcCy - value_bbox.h/2 - 2, // 2: spostamento basline verso l'alto
        );

      // =>> modalità "gauge"
      } else {

        // segmento indicatore colore
        const segmentStrokeWidth = 6
          ,segmentAngle = chartUtils.toRadians(240 / scale)
          ,segmentRadius = mdRadius - segmentStrokeWidth/2 - 1

          ,startPointX = mdArcCx - (segmentRadius * Math.cos(rad30))
          ,startPointY = mdArcCy + (segmentRadius * Math.sin(rad30))
          ,endPointX = mdArcCx - (segmentRadius * Math.cos(segmentAngle))
          ,endPointY = mdArcCy + (segmentRadius * Math.sin(segmentAngle))

          ,segmentPath = `M ${startPointX},${startPointY} ` +
          //   // rx ry angle large-arc-flag sweep-flag dx dy
          `A ${segmentRadius} ${segmentRadius} 0 0 0 ${endPointX} ${endPointY}`
        ;

        mdGroup.path(segmentPath)
          .attr({
            stroke: '#c00',
            'stroke-width': segmentStrokeWidth
          });


        // let ratingStrokePath;
        // if(scale === 4) {

        //   endPointX = cx + (radius * Math.cos(rad30)),
        //   endPointY = cy + (radius * Math.sin(rad30));

        //   // ratingStrokePath = 'M7.4197,30.2428c-1.4003-2.4246-2.2015-5.2387-2.2015-8.2398,0-3.0112,.8066-5.8339,2.2155-8.264';
        // } else {


        // ratingStrokePath = 'M7.4197,30.2428c-1.4003-2.4246-2.2015-5.2387-2.2015-8.2398,0-1.7807,.2821-3.4955,.804-5.1021';
        // }
        // return `M ${startPointX},${startPointY} ` +
        //   // rx ry angle large-arc-flag sweep-flag dx dy
        //   `A ${radius} ${radius} 0 1 1 ${endPointX} ${endPointY}`;

        // const ratingStroke = <path d={ratingStrokePath}
        //   className={classnames(styles.miniDisplayRatingStroke, styles[`strokeRating${props.rating}`])}
        //   transform={`rotate(${rotazione_colore},${sizes.miniDisplay.r},${sizes.miniDisplay.r})`}
        // />;

      }

      // =>> label
      // px di distanza tra il testo e il bordo inferiore del miniDisplay
// const textTopMargin = 16;

      // =>> indicatori per debug
      if(debug) {
        // centro mini display
        const gap = 10;
        const debug_group = mdGroup.group()
          .attr({
            'data-debug-info': 'centro mini display',
            stroke: '#05923e',
            fill: 'none',
            'stroke-width': .5,
            class: 'debug-info'
          });
        debug_group.line({x1: mdArcCx - gap, y1: mdArcCy, x2: mdArcCx + gap, y2: mdArcCy});
        debug_group.line({x1: mdArcCx, y1: mdArcCy - gap, x2: mdArcCx, y2: mdArcCy + gap});

        // origine mini display
        // debug_group.line({x1: mdOrigin.x - gap, y1: mdOrigin.y, x2: mdOrigin.x + gap, y2: mdOrigin.y});
        // debug_group.line({x1: mdOrigin.x, y1: mdOrigin.y - gap, x2: mdOrigin.x, y2: mdOrigin.y + gap});
      }

      // =>> ricalcolo miniDisplayMaxHeight
      miniDisplayMaxHeight = Math.max(
        miniDisplayMaxHeight,
        mdGroup.bbox().h + (miniDisplayTopMargin?? 0) + md.mdArc.strokeWidth // strokeWidth: spessore traccia nel caso non ci sia testo
      );
      miniDisplayIdx++;

    }



    /*



      // parametri per la rotazione dell'asticella e dell'indicatore del valore
      // gli angoli sono differenti tra colore-indicatore e asticella (posizionata la centro del primo)
      // e variano in base alle versioni a 4  o 5 porzioni
      // nella versione a 4 porzioni, ogni sezione ha un arco di 60°, in quella a 5 è di 48°
      // il valore di ogni rotazione è dato dal valore iniziale moltiplicato per `rating - 1`
      // il valore iniziale per i colori è 0, quello dell'asticella è `step_rotazioni/2`
      //
      // il centro di trasformazione è riferito al container svg
      // ma i miniDisplay sono traslati, quindi il riferimento iniziale
      // coincide quelle relative al miniDisplay, ovvero il raggio del bordo esterno (sizes.miniDisplay.r)
      const step_rotazioni = {
          p4: 60,
          p5: 48
        },
        rotazione_colore = step_rotazioni[`p${props.scale}`] * (props.rating - 1),
        rotazione_asticella = rotazione_colore + (step_rotazioni[`p${props.scale}`] / 2);

      // indicatore colore
      let ratingStrokePath;
      if(props.scale === 4) {
        ratingStrokePath = 'M7.4197,30.2428c-1.4003-2.4246-2.2015-5.2387-2.2015-8.2398,0-3.0112,.8066-5.8339,2.2155-8.264';
      } else {
        ratingStrokePath = 'M7.4197,30.2428c-1.4003-2.4246-2.2015-5.2387-2.2015-8.2398,0-1.7807,.2821-3.4955,.804-5.1021';
      }

      const ratingStroke = <path d={ratingStrokePath}
        className={classnames(styles.miniDisplayRatingStroke, styles[`strokeRating${props.rating}`])}
        transform={`rotate(${rotazione_colore},${sizes.miniDisplay.r},${sizes.miniDisplay.r})`}
      />;


      return (
        <g
          // className={styles.miniDisplayWrapper}
          transform={`translate(${config.xCoord} ${sizes.mainDisplay.h + sizes.miniDisplay.topOuterMargin})`}
        >
          <path
            d="M3.6009,32.3872c-1.7353-3.0673-2.7259-6.6116-2.7259-10.3872C.875,10.333,10.333,.875,22,.875s21.125,9.458,21.125,21.125c0,3.9226-1.0691,7.5954-2.9318,10.7431"
            className={config.borderClassName} />



          {props.type === 'currRating'?
            <text
              className={classnames(styles.miniDisplayRatingValue, styles[`fillTextRating${props.rating}`])}
              x={sizes.miniDisplay.w / 2}
              y={sizes.miniDisplay.w / 2}
            >
              {props.rating}
            </text>
            :
            <>
              // asticella
              <g className={styles.miniDisplayRod}
                transform={`rotate(${rotazione_asticella},${sizes.miniDisplay.r},${sizes.miniDisplay.r})`}>
                <path
                  d="M19.1531,23.484c.5194,.9398,1.5047,1.5266,2.5768,1.5343,1.072,.0077,2.0636-.5647,2.5929-1.497,.5293-.9323,.5139-2.079-.0404-2.9987-.835-1.3855-2.623-1.8487-4.0209-1.0416s-1.8908,2.5872-1.1084,4.003m.0736-5.7943c2.377-1.373,5.4195-.555,6.7955,1.8272,1.376,2.3822,.5646,5.4264-1.8125,6.7994-2.377,1.373-5.4195,.555-6.7955-1.8272-1.376-2.3822-.5646-5.4264,1.8125-6.7994" />
                <path
                  d="M20.5202,26.2963c-2.6999,.4226-8.2011,1.0997-8.2011,1.0997,0,0,3.39-4.5154,5.1153-6.6284-.1406,2.2876,1.3013,4.5861,3.0858,5.5287" />

              </g>

              // indicatore valore (colore)
              {ratingStroke}
            </>
          }



          {labels.map((label, idx) => {

            return <text
              x={sizes.miniDisplay.w / 2}
              y={config.textyCoord}
              width={sizes.miniDisplay.w}
              className={styles.minidisplayLabelRow}
              dy={`${label_dy_step * idx}px`}
              key={idx}
            >
              {label}
            </text>;
          })}

        </g>
      );
    }
    */

    // rating precedente
    // {prev_rating &&
    //   <MiniDisplay type='prevRating' scale={scale} {...prev_rating} />
    // }

    // // rating attuale
    // {curr_rating &&
    //   <MiniDisplay type='currRating' scale={scale} {...curr_rating} />
    // }

    // !SECTION end miniDisplay

    // =>> aggiornamento dimensioni SVG
    sizes.mainSvg.h += miniDisplayMaxHeight;
    // sizes.mainSvg.w = mainDisplayGroupBbox.w;

    svgCanvas
      .size(sizes.mainSvg.w, sizes.mainSvg.h)
      .viewbox(0, 0, sizes.mainSvg.w, sizes.mainSvg.h);


    // indicatori per debug
    if(debug) {
      // centro display e rotazione asticella
      const gap = sizes.mainDisplay.r;
      const debug_group1 = svgCanvas.group()
        .attr({
          'data-debug-info': 'centro rotazione asticella',
          stroke: '#e20613',
          fill: 'none',
          'stroke-width': .5,
          class: 'debug-info'
        });
      debug_group1.line({x1: sizes.mainDisplay.cx - gap, y1: sizes.mainDisplay.cy, x2: sizes.mainDisplay.cx + gap, y2: sizes.mainDisplay.cy});
      debug_group1.line({x1: sizes.mainDisplay.cx, y1: sizes.mainDisplay.cy - gap, x2: sizes.mainDisplay.cx, y2: sizes.mainDisplay.cy + gap});
    }

    if(!container) {
      return svgCanvas.svg();
    }

  } catch(e) {
    console.error( 'Charts → ratingDisplay', e ); // eslint-disable-line
  }
}
