// This code contains a few snippets copy-pasted from internet forums and the like; apologies for the missing attributions
const eps = 0.0000001;
function between(a, b, c) {
    return a - eps <= b && b <= c + eps;
}
function segment_intersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    if (isNaN(x) || isNaN(y)) {
        return false;
    } else {
        if (x1 >= x2) {
            if (!between(x2, x, x1)) { return false; }
        } else {
            if (!between(x1, x, x2)) { return false; }
        }
        if (y1 >= y2) {
            if (!between(y2, y, y1)) { return false; }
        } else {
            if (!between(y1, y, y2)) { return false; }
        }
        if (x3 >= x4) {
            if (!between(x4, x, x3)) { return false; }
        } else {
            if (!between(x3, x, x4)) { return false; }
        }
        if (y3 >= y4) {
            if (!between(y4, y, y3)) { return false; }
        } else {
            if (!between(y3, y, y4)) { return false; }
        }
    }
    return { x: x, y: y };
}

const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const width = 1000 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const colors = ['#FF6633', '#00B3E6'];

let rload; // kOhm
let vplus; // V
let bias; // mA
let Vpk; // V
let pmax; // W

function displayData(data) {
    const ncurves = d3.max(data, d => +d['Curve']);
    const xtent = d3.extent(data, d => +d['Va (V)']);
    const y1tent = [0, d3.max(data, d => +d['Ia (mA)'])];
    const y2tent = [0, d3.max(data, d => +d['Is (mA)'])];
    const xaxis = d3.scaleLinear().domain(xtent).range([0, width]);
    const y1axis = d3.scaleLinear().domain(y1tent).range([height, 0]);
    const y2axis = d3.scaleLinear().domain(y2tent).range([height, 0]);
    const rdata = () => [[xtent[0], (vplus - xtent[0]) / rload], [vplus, 0]];

    function interpolateLoadPoint(Vg) {
        const i = data.findIndex(d => -d['Vg (V)'] >= Vg);
        if (i <= 0) { return null; }
        const csup = +data[i - 1]['Curve'];
        const Vgsup = -data[i - 1]['Vg (V)'];
        const curveSup = data.filter(d => +d['Curve'] === csup);
        const cinf = +data[i]['Curve'];
        const Vginf = -data[i]['Vg (V)'];
        const curveInf = data.filter(d => +d['Curve'] === cinf);
        const intrsSup = intersection(curveSup);
        const intrsInf = intersection(curveInf);
        const prop = (Vg - Vgsup) / (Vginf - Vgsup);
        const Va = intrsSup.x + prop * (intrsInf.x - intrsSup.x);
        const Ik = (intrsSup.y * (intrsInf.x - Va) + intrsInf.y * (Va - intrsSup.x)) / (intrsInf.x - intrsSup.x);
        return [Va, Ik];
    }

    // Data-dependent defaults & ranges
    const biasmax = +d3.max(data, d => +d['Ia (mA)']).toFixed(1);
    const vpkmax = +(d3.max(data, d => +d['Vg (V)']) - d3.min(data, d => +d['Vg (V)'])).toFixed(1);
    const vplusmax = +(d3.max(data, d => +d['Va (V)'])).toFixed(1);
    const pmaxmax = +((vplusmax * biasmax * .001).toFixed(1));
    vplus = +((9 * d3.max(data, d => +d['Va (V)'])) / 10).toFixed(0);
    pmax = pmaxmax / 5;
    rload = vplus / ((4 * biasmax) / 5);
    const rloadmax = rload * 20;
    const vgm = d3.median(data, d => +d['Vg (V)']);
    bias = +(interpolateLoadPoint(-vgm)[1]).toFixed(1);
    Vpk = +(vpkmax / 8).toFixed(1);

    const svg = d3.select('#loadline')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.append('path')
        .attr('id', 'gloadline')
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 1.5);

    function intersection(curvedata) {
        for (let i = 1; i < curvedata.length; i++) {
            const x1 = +curvedata[i - 1]['Va (V)'];
            const y1 = +curvedata[i - 1]['Ia (mA)'];
            const x2 = +curvedata[i]['Va (V)'];
            const y2 = +curvedata[i]['Ia (mA)'];
            const x3 = rdata()[0][0];
            const y3 = rdata()[0][1];
            const x4 = rdata()[1][0];
            const y4 = rdata()[1][1];
            const intrs = segment_intersection(x1, y1, x2, y2, x3, y3, x4, y4);
            if (intrs) {
                return intrs;
            }
        }
        return null;
    }

    svg.append('circle').attr('id', 'lowpoint').attr('fill', 'red').attr('stroke', 'red').attr('r', 10);
    svg.append('circle').attr('id', 'hipoint').attr('fill', 'red').attr('stroke', 'red').attr('r', 10);

    function interpolateGridPoint(V, I) {
        let Vgsup = 0.0;
        let Vginf = 0.0;
        let Isup = 0.0;
        let Iinf = 0.0;
        let c = 1;
        for (; c <= ncurves; c++) {
            const curvedata = data.filter(d => +d['Curve'] === c);
            const i = curvedata.findIndex(d => +d['Va (V)'] >= V);
            if (i <= 0) { return null; }
            const i1 = +curvedata[i - 1]['Ia (mA)'];
            const i2 = +curvedata[i]['Ia (mA)'];
            const v1 = +curvedata[i - 1]['Va (V)'];
            const v2 = +curvedata[i]['Va (V)'];
            const prop = (V - v1) / (v2 - v1);
            Isup = Iinf;
            Iinf = i1 + prop * (i2 - i1);
            Vgsup = Vginf;
            Vginf = +curvedata[i]['Vg (V)'];
            if (Iinf <= I) { break; }
        }

        const prop = (I - Iinf) / (Isup - Iinf);
        const Vg = Vginf + prop * (Vgsup - Vginf);
        const fmt = d3.format('.2f');
        d3.select('#output-va').text(fmt(V) + ' V');
        d3.select('#output-vg').text(fmt(Vg) + ' V');

        const Vglow = -(Vg + Vpk / 2);
        const Vghi = -(Vg - Vpk / 2);
        const poslow = interpolateLoadPoint(Vglow);
        const poshi = interpolateLoadPoint(Vghi);

        if (poslow)
            d3.select('#lowpoint').datum(poslow).attr('cx', d => xaxis(d[0])).attr('cy', d => y1axis(d[1]));
        if (poshi)
            d3.select('#hipoint').datum(poshi).attr('cx', d => xaxis(d[0])).attr('cy', d => y1axis(d[1]));

        if (poslow && poshi) {
            const outpk = poshi[0] - poslow[0];
            const ratio = outpk / Vpk;
            const gain = 20 * Math.log10(ratio);
            d3.select('#output-vpk').text(fmt(outpk) + ' V');
            d3.select('#output-gain').text(fmt(ratio) + ' (' + fmt(gain) + ' dB)');
            const ab = V - poslow[0];
            const bc = poshi[0] - V;
            const hd2 = Math.abs((100 * (ab - bc)) / (2 * (ab + bc)));
            d3.select('#output-disto').text(fmt(hd2) + ' %');
        } else {
            d3.select('#output-vpk').text('???');
            d3.select('#output-gain').text('???');
            d3.select('#output-disto').text('???');
        }

        svg.select('#biaspoint')
            .datum(bdata())
            .attr('cx', d => xaxis(d[0]))
            .attr('cy', d => y1axis(d[1]));
    }

    const bdata = () => [vplus - rload * bias, bias];

    svg.append('circle')
        .attr('id', 'biaspoint')
        .attr('fill', 'green')
        .attr('stroke', 'green')
        .attr('r', 10);

    interpolateGridPoint(bdata()[0], bdata()[1]);

    for (let c = 1; c <= ncurves; c++) {
        const curvedata = data.filter(d => +d['Curve'] === c);
        svg.append('path')
            .datum(curvedata)
            .attr('fill', 'none')
            .attr('stroke', colors[0])
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x(d => xaxis(d['Va (V)']))
                .y(d => y1axis(d['Ia (mA)'])));
        svg.append('path')
            .datum(curvedata)
            .attr('fill', 'none')
            .attr('stroke', colors[1])
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x(d => xaxis(d['Va (V)']))
                .y(d => y2axis(d['Is (mA)'])));
    }

    svg.append('path')
        .attr('id', 'pmax')
        .attr('fill', 'red')
        .attr('fill-opacity', 0.4)
        .attr('stroke', 'red')
        .attr('stroke-width', 1);

    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xaxis));
    svg.append('g')
        .call(d3.axisLeft(y1axis));
    svg.append('g')
        .attr('transform', 'translate(' + width + ',0)')
        .call(d3.axisRight(y2axis));

    const controls = d3.select('div#controls')
        .append('svg')
        .attr('width', 1000)
        .attr('height', 300)
        .append('g')
        .attr('transform', 'translate(30,30)');

    const load_slider = d3.sliderBottom()
        .min(0.1)
        .max(rloadmax)
        .step(0.1)
        .displayFormat(d3.format('.2f'))
        .width(300)
        .ticks(0)
        .default(rload)
        .on('onchange', rl => {
            rload = rl;
            interpolateGridPoint(bdata()[0], bdata()[1]);
            svg.select('#gloadline')
                .datum(rdata())
                .attr('d', d3.line()
                    .x(d => xaxis(d[0]))
                    .y(d => y1axis(d[1])));
        });

    const vplus_slider = d3.sliderBottom()
        .min(d3.min(data, d => +d['Va (V)']))
        .max(vplusmax)
        .step(1)
        .width(300)
        .ticks(0)
        .default(vplus)
        .on('onchange', v => {
            vplus = v;
            interpolateGridPoint(bdata()[0], bdata()[1]);
            svg.select('#gloadline')
                .datum(rdata())
                .attr('d', d3.line()
                    .x(d => xaxis(d[0]))
                    .y(d => y1axis(d[1])));
        });

    const bias_slider = d3.sliderBottom()
        .min(0.05)
        .max(biasmax)
        .step(0.05)
        .width(300)
        .ticks(0)
        .displayFormat(d3.format('.2f'))
        .default(bias)
        .on('onchange', b => {
            bias = b;
            interpolateGridPoint(bdata()[0], bdata()[1]);
        });

    const vpk_slider = d3.sliderBottom()
        .min(0.05)
        .max(vpkmax)
        .step(0.05)
        .width(300)
        .ticks(0)
        .displayFormat(d3.format('.2f'))
        .default(Vpk)
        .on('onchange', v => {
            Vpk = v;
            interpolateGridPoint(bdata()[0], bdata()[1]);
        });

    const pmax_slider = d3.sliderBottom()
        .min(0.1)
        .max(pmaxmax)
        .step(0.1)
        .width(300)
        .ticks(0)
        .displayFormat(d3.format('.2f'))
        .default(pmax)
        .on('onchange', p => {
            pmax = p;
            const power = d3.range(xtent[0], xtent[1], 1.0).map(v => [v, Math.min(y1tent[1], 1000 * (pmax / v))]);
            power.push([xtent[1], y1tent[1]]);
            power.push([xtent[0], y1tent[1]]);
            svg.select('#pmax')
                .datum(power)
                .attr('d', d3.line()
                    .x(d => xaxis(+d[0]))
                    .y(d => y1axis(+d[1])));
        });

    controls.append('g')
        .attr('transform', 'translate(30, 0)')
        .call(load_slider)
        .append('text').attr('x', -10).attr('y', -10).text('Load impedance (kOhm)');
    controls.append('g')
        .attr('transform', 'translate(30, 100)')
        .call(vplus_slider)
        .append('text').attr('x', -10).attr('y', -10).text('Supply voltage (V)');
    controls.append('g')
        .attr('transform', 'translate(500, 0)')
        .call(vpk_slider)
        .append('text').attr('x', -10).attr('y', -10).text('Input peak-to-peak (V)');
    controls.append('g')
        .attr('transform', 'translate(500, 100)')
        .call(bias_slider)
        .append('text').attr('x', -10).attr('y', -10).text('Bias current (mA)');
    controls.append('g')
        .attr('transform', 'translate(30, 200)')
        .call(pmax_slider)
        .append('text').attr('x', -10).attr('y', -10).text('Max dissipation (W)');

    load_slider.value(rload);
    vplus_slider.value(vplus);
    bias_slider.value(bias);
    vpk_slider.value(Vpk);
    pmax_slider.value(pmax);
}

function parseData(text) {
    d3.select('#loadline').selectAll('svg').remove();
    d3.select('#controls').selectAll('svg').remove();
    const lines = text.split(/[\r\n]+/g);
    const headers = lines[0].split(/\s\s+/);
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const fields = lines[i].split(/\s\s+/);
        if (fields.length !== headers.length) continue;
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = fields[j];
        }
        data.push(obj);
    }
    data.sort((a, b) => {
        const vgdiff = b['Vg (V)'] - a['Vg (V)'];
        if (vgdiff !== 0) return vgdiff;
        return a['Va (V)'] - b['Va (V)'];
    });
    let curve = 1;
    let vglast = data[0]['Vg (V)'];
    data.forEach(d => {
        if (+d['Vg (V)'] !== vglast) {
            curve++;
            vglast = +d['Vg (V)'];
        }
        d['Curve'] = curve;
    });
    displayData(data);
}

async function loadData() {
    const measurementId = document.getElementById('loadline').dataset.measurementId;
    const response = await fetch(`/m/${measurementId}/download`);
    if (!response.ok) return;
    const arrayBuffer = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const file = zip.file('anode_curves.utd');
    if (!file) return;
    const text = await file.async('text');
    parseData(text);
}

loadData();

