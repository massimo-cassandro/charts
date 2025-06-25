// horizontal bars

// TODO title

import { chart_init } from '../utils/init.js';

export async function bars({

  /** modalità di caricamento di svg.js, non impostare per utilizzare il default definito in init */
  svgjs_mode = null,

  /** container (selettore o elemento DOM), se null viene restituito il codice SVG */
  container = null,

  /** svuota il container prima del rendering */
  emptyContainer = true,

  /**
    larghezza e altezza del grafico (px),
    Se il container è presente e i parametro `width` e `height` sono `null`,
    vengono utilizzate le dimensioni  del container.
    Se uno dei due valori non è impostato o ricavabile, viene generato un errore.
    NB: il padding del container viene considerato nelle dimensioni del grafico,
    è preferibile non impostarlo.
    Il valore 'auto' di height fa sì che l'altezza dell'svg sia calcolata sulla base
    del numero di barre e dei valori `barsGap` e `barsHeight`
  */
  width = null, // null || <value>
  height = 300, // <value> || null || 'auto'

  /** valori numerici da associare alle barre del grafico */
  values = [],

  /** etichette delle varie barre, l'indice di ogni elemento corrisponde a quello di `values` a cui si riferisce */
  labels = [],


  // TODO
  /**
    se true, gli elementi di `labels` vengono interpretati come elementi svg
    Le icone devono essere predisposte autonomamente dal grafico in termini di dimensioni, colori ecc.
    Verranno semplicemente posizionate secondo il valore a cui si riferiscono
  */
  // labelsAreIcons = false,

  /** Indica se mostrare o no i valori delle barre (mostrati dopo la barra) */
  showValues = true,

  /**
    Modalità di rappresentazione del valore mostrato.
    Se 'percent', il valore mostrato è la percentuale rispetto al totale dei valori
  */
  showValuesAs = 'number', // number, numbers, percent, euro

  /** In caso di visualizzazione dei valori (showValues === true), numero di decimali da mostrare */
  showValuesFractionDigits = 2,

  /** In caso di visualizzazione dei valori (showValues === true), formattazione locale da utilizzare */
  showValuesLocale =  'it-IT',

  /**
    Impostazioni font per le etichette e i valori
    Impostare solo se non si vogliono usare i colori di default
    se impostato è un oggetto analogo a quello definito in src/utils/config-default.js
    Possono essere impostati solo i valori che si vogliono modificare
  */
  labelsFont = null,
  valuesFont = null,

  /** text fill color */
  labelsFill = '#000',
  valuesFill = '#000',

  /** direzione della barra */
  barsDirection = 'right', // right || left

  /** larghezza minima labels */
  minLabelslWidth = 0,

  /** spazio tra un'etichetta di testo e il grafico */
  textBarsGap = 8,

  /** spazio tra una barra e la successiva */
  barsGap = 10,

  /** altezza barre */
  barsHeight = 40,

  /** corner radius */
  barsCornerRadius = 5,

  /** spessore e colore traccia (0 per non visualizzare) */
  barsStrokeWidth = 0,
  barsStrokeColor = '#000',

  /**
    array dei colori di riempimento da associare ai corrispondenti valori in base al loro indice.
    Impostare solo se non si vogliono usare i colori di default
    se il numero degli elementi supera il numero dei colri disponibili, viene utilizzato il grigio #ccc
  */
  colors = null,

  /** se false le classi vengono ignorate */
  useClasses = false,

  /** array di eventuali classi da associare ai corrispondenti valori in base al loro indice */
  valClasses = null,

  // TODO animazione
  /** se true, attiva l'animazione */ // NB non attivo
  // animazione      = false, // non implementato

  /** frame per secondo dell'animazione */ // NB non attivo
  // fps = 60
}) {

  try {

    const chartUtils = await chart_init(svgjs_mode);

    if(values.filter(v => isNaN(v)).length) {
      throw 'There are non-numeric values';
    }

    if(!values.length) {
      throw 'At least one value is needed';
    }

    if(isNaN(barsStrokeWidth)) {
      throw '`barsStrokeWidth` must be a number';
    } else {
      barsStrokeWidth = +barsStrokeWidth;
    }

    // container element
    const  containerElement = chartUtils.getElementFromContainer(container),
      toRight = barsDirection === 'right';

    if(containerElement && emptyContainer) {
      containerElement.innerHTML = '';
    }

    // dimensioni del grafico
    width = width || (containerElement? chartUtils.truncateDecimal(containerElement.clientWidth) : null);
    height = height || (containerElement? chartUtils.truncateDecimal(containerElement.clientHeight) : null);


    if(barsGap == null) {
      throw '`barsGap` must be set';
    }

    if(height === 'auto') {
      height = (values.length * barsHeight) +
        ((values.length - 1) * barsGap) +
        // la traccia insiste per metà sulla parte interna della barra, quindi va calcolata una sola volta
        (values.length * barsStrokeWidth);

      if(!barsHeight) {
        throw 'With `height = \'auto\'`, `barsHeight` must be set';
      }

    } else { // determinazione altezza barre
      barsHeight = (
        height -
        ((values.length - 1) * barsGap)
      ) / values.length - barsStrokeWidth;
    }


    if(!width || !height) {
      throw `Missing width and/or height: width: ${width}, height: ${height}`;
    }

    // colori forniti o di default
    colors??= chartUtils.defaults.colors;

    // fonts
    labelsFont = {...chartUtils.defaults.fonts, ...(labelsFont??{}) };
    valuesFont = {...chartUtils.defaults.fonts, ...(valuesFont??{}) };

    // somma di tutti i valori per calcolo persentuale
    const totValues = values.reduce((tot, current) => tot + current, 0);

    // definizione etichette valori
    let valueLabels = [];
    if(showValues) {
      valueLabels = values.map(v => {

        if(showValuesAs === 'percent') {
          v = v / totValues;
        }

        let labelStyle;
        switch (showValuesAs) {
          case 'number':
          case 'numbers':
            labelStyle =  {
              style: 'decimal'
            };
            break;

          case 'percent':
            labelStyle =  {
              style: 'percent'
            };
            break;

          case 'euro':
            labelStyle =  {
              currency: 'EUR',
              style: 'currency'
            };
            break;

          // no default
        }

        return v.toLocaleString(showValuesLocale, {
          minimumFractionDigits: showValuesFractionDigits,
          maximumFractionDigits: showValuesFractionDigits,
          ...labelStyle
        });
      });
    }

    const svgCanvas = chartUtils.createSvgCanvas(container); //.size(width, height);
    svgCanvas.viewbox(0, 0, width, height);

    // =>> etichette (labels) & etichette valori (valueLabels)
    // calcolo dimensioni del testo per ricavare lo spazio utile per le barre
    // e posizionamento delle etichette

    // valori per il calcolo dellìingombro massimo
    let max_labels_width = 0, max_value_labels_width = 0;

    // posizionamento iniziale, dopo il rendering verrà ridefinito in base all'altezza del testo
    let labelY = (barsHeight + barsStrokeWidth) / 2;
    // valore provvisorio, verrà reimpostato a fine ciclo (deve tenere conto di tutte le etichette)
    const labelX = toRight? 0 : width;

    const labels_elements = [], value_labels_elements = [], // per allineamenti successivi

      setText = (thisLabel, fontAttr) => {
        const labelEl = svgCanvas.plain(thisLabel)
          .font(fontAttr);

        const bbox = labelEl.bbox();

        labelEl.move(labelX, chartUtils.truncateDecimal(labelY - (bbox.height/2)))
          .attr({textLength: chartUtils.truncateDecimal(bbox.width), lengthAdjust:'spacingAndGlyphs'});

        return [bbox, labelEl];
      };

    values.forEach((_ ,idx) => {

      // svgCanvas.line(0, labelY, width, labelY).stroke({ width: 1, color: '#f06'}); // linea di riferimento per allineamento

      const thisLabel = labels[idx],
        thisValueLabel = valueLabels[idx];

      if(thisLabel) {

        let bbox, labelEl;

        [bbox, labelEl] = setText(thisLabel, {
          fill: labelsFill,
          ...labelsFont,
          'text-anchor': toRight? 'end' : null
        });

        max_labels_width = Math.max(max_labels_width, bbox.width, minLabelslWidth);


        labels_elements.push(labelEl); // per il riposizionamento X successivo

      }

      if(thisValueLabel) {

        const [bbox, labelEl] = setText(thisValueLabel, {
          fill: valuesFill,
          ...valuesFont,
          'text-anchor': toRight? null : 'end'
        });

        max_value_labels_width = Math.max(max_value_labels_width, bbox.width);
        value_labels_elements.push(labelEl);
      }


      labelY += barsHeight + barsStrokeWidth + barsGap;
    });

    // svgCanvas.line(max_labels_width, 0, max_labels_width, height).stroke({ width: 2, color: '#4faa0d'}); // linea di riferimento per allineamento


    // =>> riposizionamento `labels_elements` (prima dell'aggiunta di `textBarsGap`)
    labels_elements.forEach(l => {
      l.ax(chartUtils.truncateDecimal(toRight? max_labels_width : width - max_labels_width));
    });


    // =>> aggiunta `textBarsGap` a `max_labels_width` e `max_value_labels_width`
    if(max_labels_width) {
      max_labels_width += textBarsGap;
    }
    if(max_value_labels_width) {
      max_value_labels_width += textBarsGap;
    }

    // =>> costruzione barre
    const maxBarsWidth = width - max_labels_width - max_value_labels_width,
      maxBarsValue = values.reduce((max, current) => max > current? max : current, 0)
    ;

    let barY = barsStrokeWidth / 2;
    values.forEach((v, idx) => {

      const barWidth = chartUtils.truncateDecimal((v / maxBarsValue * maxBarsWidth) - barsStrokeWidth),
        barX = toRight? max_labels_width : width - barWidth - max_labels_width,
        bar = svgCanvas.rect({
          x: chartUtils.truncateDecimal(barX),
          y: chartUtils.truncateDecimal(barY),
          width: barWidth,
          height: barsHeight,
          fill: colors[idx]?? '#ccc',
        })
          .radius(barsCornerRadius);

      if( barsStrokeWidth > 0 && barsStrokeColor) {
        bar.stroke({ color: barsStrokeColor, width: barsStrokeWidth });
      }

      if(useClasses && valClasses[idx]) {
        bar.addClass(valClasses[idx]);
      }

      // =>> riposizionamento value_labels_elements
      const thisValueLabel = value_labels_elements[idx];
      if(thisValueLabel) {
        thisValueLabel.ax(chartUtils.truncateDecimal(toRight
          ? max_labels_width + barWidth + textBarsGap
          : barX - textBarsGap
        ));
      }


      barY += barsHeight + barsGap + barsStrokeWidth;
    });

    if(!container) {
      return svgCanvas.svg();
    }


  } catch(e) {
    console.error( 'Charts → bars', e ); // eslint-disable-line
  }

}
