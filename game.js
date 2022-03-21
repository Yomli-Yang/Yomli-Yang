Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
var display = {
    block: [
        true,
        true,
        true,
        true
    ],
    tap: true,
    drag: true,
    hold: true,
    lineId: true,
    noteId: true,
    pointId: true,
    textId: true
},
timeFocus = false, gl = false, editLine = undefined, offset = 0;

function lineEdit(id = 0) {
    gl = true;
    editLine = id;
}

function cancelLineEdit() {
    gl = false;
    editLine = undefined;
}

function gaming() {
    // init vars
    var cvs = document.getElementById('canvas');
    var lS = window.localStorage;
    if (!lS.settings) {
        lS['settings'] = `{"pmyc":0,"buttonSize":100,"OFBlur": true,"bgBlur":100,"OFAudio":true,"gameAudio":100,"uiAudio":100,"touchAudio":100,"OFDyfz":true,"OFFcApzsq":true,"OFEffect":true,"OFAutoPlay":false,"listProportion":"16:9"}`;
    }
    var settings = JSON.parse(lS.settings);
    let time = -300, lastTime = 0, lineColor = '#ffffff',
    imgs = {
        tap: new Image(),
        drag: new Image(),
        hold: new Image()
    }
    if (!uploadSpectral) {
        spectral = {
            block: null,
            blockMoves: [
                {x: 0, y: 0, eulerAngle: 360, endEulerAngle: 0, color: {r: 255, g: 0, b: 255}, endColor: {r: 0, g: 255, b: 0}, alpha: 0, endAlpha: 1, bezier: {x1: 0.75, y1: 1, x2: 0.75, y2: 1}, startTime: 0, width: 30, endWidth: 15, endTime: 800},
                {endY: 3, eulerAngle: 0, endEulerAngle: -180, endX: 12, endWidth: 15, startTime: 800, endTime: 1600},
                {endY: 0, endEulerAngle: -90, endX: 0, endWidth: 15, startTime: 1600, endTime: 1800},
                {endY: 0, endEulerAngle: 0, endX: 0, endWidth: 15, startTime: 1800, endTime: 1850},
                {endColor: {r: 255, g: 255, b: 0}, startTime: 1850, endTime: 1850},
                {endEulerAngle: 360, endAlpha: 0, startTime: 1900, endWidth: 50, endTime: 2700}
            ],
            lines: [],
            lineMoves: [
                {line: 4, y: -6, endY: 6, bezier: {x1: 0, y1: 0, x2: 0, y2: 1}, startTime: 0, endTime: 500},
                {line: 4, color: {r: 255, g: 0, b: 0}, endColor: {r: 0, g: 255, b: 255}, bezier: {x1: 1, y1: 0, x2: 0, y2: 1}, startTime: 0, endTime: 500}
            ],
            notes: [],
            noteMoves: [
                {line: 0, note: 0, x: 0, y: 20, endX: 0, endY: 5, startTime: 1200, endTime: 1350},
                {line: 1, note: 1, x: -5, y: 20, endX: 5, endY: 'down', startTime: 1300, endTime: 1450},
                {line: 0, note: 2, x: -5, y: 20, endX: 5, endY: 'down', type: 'drag', startTime: 1700, endTime: 1800},
                {line: 1, note: 3, x: -5, y: 20, endX: 5, endY: 'down', type: 'hold', height: 150, endHeight: 100, startTime: 1650, endTime: 1750},
                {line: 0, note: 4, x: -5, y: 20, endX: 5, endY: 'down', type: 'drag', startTime: 1600, endTime: 1700},
                {line: 3, note: 5, x: 0, y: 20, endX: 0, endY: 'down', startTime: 1200, endTime: 1400},
                {line: 2, note: 6, x: 0, y: 20, endX: 0, endY: 'down', startTime: 1300, endTime: 1450},
                {line: 2, note: 7, x: 0, y: 20, endX: 0, endY: 'down', startTime: 1600, endTime: 1700},
                {line: 4, note: 8, x: 0, y: 20, endX: 0, endY: 'down',bezier: {x1: 0, y1: 0, x2: 0, y2: 0.5} , startTime: 800, endTime: 1000},
                {line: 4, note: 9, x: 0, y: 0, endX: -15, endY: 0, startTime: 0, endTime: 100},
            ],
            graphics: [],
            pointMoves: [
                {graph: 0, point: 0, x: 0, endX: 10, startTime: 0, endTime: 600},
                {graph: 0, point: 1, x: 0, endX: -10, startTime: 0, endTime: 600},
                {graph: 0, point: 2, y: 0, endY: -10, bezier: {x1: 0.5, y1: 0.2, x2: 0, y2: 1.3}, startTime: 0, endTime: 600},
                {graph: 0, point: 3, y: 0, endY: 10, bezier: {x1: 0.5, y1: 0.2, x2: 0, y2: 1.3}, startTime: 600, endTime: 800},
                {graph: 0, point: 3, color: {r: 255, g: 255, b: 255}, endColor: {r: 60, g: 50, b: 100}, startTime: 600, endTime: 800},
                {graph: 1, point: 0, y: 0, endY: -6, x: 0, endX: 4, bezier: {x1: 0.5, y1: 0.2, x2: 0, y2: 1.3}, startTime: 0, endTime: 600},
                {graph: 1, point: 1, y: 0, endY: 3, bezier: {x1: 0, y1: 0.2, x2: 0, y2: 1.3}, startTime: 0, endTime: 600},
                {graph: 1, point: 2, y: 0, endY: 3, bezier: {x1: 0, y1: 0.2, x2: 0, y2: 1.3}, startTime: 0, endTime: 600},
                {graph: 1, point: 3, x: 0, endX: -6, y: 0, endY: 4, color: {r: 255, g: 255, b: 255}, endColor: {r: 60, g: 200, b: 250}, close: false, startTime: 0, endTime: 600},
                {graph: 1, point: 2, endY: -1, bezier: {x1: 0, y1: 0, x2: 0.5, y2: 0.75}, startTime: 500, endTime: 1000},
            ],
            texts: [],
            textMoves: [
                {textId: 0, alpha: 0, endAlpha: 1, text: 'Hello World!', font: '100px Phigros, Phigros cn, Tw Cen MT', startTime: 0, endTime: 200},
                {textId: 0, x: 0, endX: -12, eulerAngle: 0, endEulerAngle: 25, color: {r: 255, g: 255, b: 255}, endColor: {r: 255, g: 200, b: 200}, text: 'Hello World', font: '90px Phigros, Phigros cn, Tw Cen MT', bezier: {x1: 0, y1: 0, x2: 0.5, y2: 0.75}, startTime: 200, endTime: 400}
            ]
        }
    } else {
        offset = settings.pmyc = uploadSpectral.offset;
        lS.settings = JSON.stringify(settings);
        spectral = {block: null, blockMoves: [], lines: [], lineMoves: [], notes: [], noteMoves: [], graphics: [], pointMoves: [], texts: [], textMoves: []};
        spectral.blockMoves = uploadSpectral.spectral.block;
        spectral.lineMoves = uploadSpectral.spectral.line
        spectral.noteMoves = uploadSpectral.spectral.note;
        spectral.pointMoves = uploadSpectral.spectral.point;
        spectral.textMoves = uploadSpectral.spectral.text;
    }
    function loadGame({music, bg = 'none', songName='?', author='unknown', tDfcy='EZ', dfcy='?'}) {
        audio = document.querySelector('#ui-time-audio');
        if (bg != 'none') {
            $('#bg').attr('src', '../' + bg);
            // $('#canvas').css('background-image', `url(../${bg})`);
        }
        // init offset
        if (settings.pmyc) {
            offset = settings.pmyc;
        }
        // init canvas
        cvs.width = 3000;
        cvs.height = 2250;
        if (settings.listProportion == '16:9' || settings.proportion == undefined) {
            $('#canvas').css('width', $('body').height() * 0.9 / 9 * 16);
        } else {
            $('#canvas').css('width', $('body').height() * 0.9 / 3 * 4);
        }
        cvs = cvs.getContext('2d');
        cvs.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 1125);
        cvs.textAlign = 'center';
        cvs.textBaseline = 'bottom';
        cvs.font = '100px Phigros, Phigros cn, Tw Cen MT'
        cvs.save();
    }
    // init UI
    $('body>*').hide();
    $('#ui, #info, #bg, #blur').show();
    loadGame({music: 'audio/Happy Life.mp3', bg: 'img/icon/icon.jpg'});
    imgs.tap.src = 'img/ui/Tap2.png';
    imgs.drag.src = 'img/ui/drag.png';
    imgs.hold.src = 'img/ui/Hold2.png';
    let gameLoad = false;
    document.body.onresize = () => {
        if (settings.listProportion == '16:9' || settings.listProportion == undefined) {
            $('#canvas').css('width', $('body').height() * 0.8 / 9 * 16);
        } else {
            $('#canvas').css('width', $('body').height() * 0.8 / 3 * 4);
        }
    };
    window.onstorage = () => {
        console.log('refresh');
        settings = JSON.parse(lS.settings);
        if (settings.listProportion == '16:9' || settings.listProportion == undefined) {
            $('#canvas').css('width', $('body').height() * 0.8 / 9 * 16);
        } else {
            $('#canvas').css('width', $('body').height() * 0.8 / 3 * 4);
        }
        if (settings.pmyc) {
            offset = settings.pmyc;
        }
    };
    audio.oncanplaythrough = () => {
        if (!gameLoad) {
            console.log('loaded');
            gameLoad = true;
            function distance(x, y, endX, endY){
                return Math.sqrt(Math.abs(x - endX) ** 2 + Math.abs(y - endY) ** 2);
            }
            function addLine(x, y, eulerAngle, width, alpha, color) {
                $('#ui-display-lines>ul').append(`<li class="line canEdit" data-lineId="${spectral.lines.length}">line&nbsp;${spectral.lines.length}</li>`);
                spectral.lines.push(new line(x, y, eulerAngle, width, alpha, color));
            }
            function addText(x, y, eulerAngle, _text, alpha, color) {
                // $('#ui-display-lines>ul').append(`<li class="line canEdit" data-lineId="${spectral.lines.length}">line&nbsp;${spectral.lines.length}</li>`);
                spectral.texts.push(new text(x, y, eulerAngle, _text, alpha, color));
            }
            function addgraph() {
                spectral.graphics.push([]);
            }
            function addPoint(graph = 0, x, y, alpha, color, close) {
                while(!spectral.graphics[graph]) {
                    addgraph();
                }
                spectral.graphics[graph].push(new point(graph, x, y, alpha, color, close));
            }
            function removeLine(from, to) {
                for (let i = from; i < to; i++) {  
                    $(`.line[data-lineId="${i}"]`).remove();
                }
                spectral.lines.remove(from, to);
            }
            function removeNote(from, to) {
                for (let i = from; i < to; i++) {  
                    $(`.note[data-noteId="${i}"]`).remove();
                }
                spectral.notes.remove(from, to);
            }
            function addNote(line, x, y, type, trueNote, height) {
                $('#ui-display-notes>ul').append(`<li class="note canEdit" data-noteId="${spectral.notes.length}">note&nbsp;${spectral.notes.length}</li>`);
                spectral.notes.push(new note(line, x, y, type, trueNote, height));
            }
            class line {
                constructor(x = 0, y = 0, eulerAngle = 0, width = 10000, alpha = 1, color = {r: 255, g: 255, b: 255}) {
                    this.x = x;
                    this.y = y;
                    this.eulerAngle = eulerAngle;
                    this.width = width;
                    this.alpha = alpha;
                    this.color = color;
                }
                draw(id){
                    cvs.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
                    cvs.strokeStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
                    if (gl) {
                        cvs.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 1725);
                    } else {
                        cvs.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2 + this.x * 100, 1125 + this.y * 100);
                        cvs.rotate(this.eulerAngle * Math.PI / 180);
                        cvs.globalAlpha = this.alpha;
                    }
                    cvs.fillRect(0 - this.width * 50, -4, this.width * 100, 8);
                    if (display.lineId) {
                        cvs.globalAlpha = 1;
                        cvs.fillText(String(id), 0, 0);
                    }
                    cvs.restore();
                }
                move({x = this.x, y = this.y, eulerAngle = this.eulerAngle, width = this.width, alpha = this.alpha, color = this.color, endX = this.x, endY = this.y, endEulerAngle = this.eulerAngle, endWidth = this.width, endAlpha = this.alpha, endColor = this.color, bezier = false, startTime, endTime} = {}) {
                    if (time <= endTime) {
                        this.x = x;
                        this.y = y;
                        this.eulerAngle = eulerAngle;
                        this.width = width;
                        this.alpha = alpha;
                        this.color.r = color.r;
                        this.color.g = color.g;
                        this.color.b = color.b;
                    }
                    if (time >= startTime && time <= endTime) {
                        if (!bezier) {
                            if (x != endX) {
                                let vx = (endX - x) / (endTime - startTime);
                                this.x = x + (time - startTime) * vx;
                            }
                            if (y != endY) {
                                let vy = (endY - y) / (endTime - startTime);
                                this.y = y + (time - startTime) * vy;
                            }
                            if (eulerAngle != endEulerAngle) {
                                let veulerAngle = (endEulerAngle - eulerAngle) / (endTime - startTime);
                                this.eulerAngle = eulerAngle + (time - startTime) * veulerAngle;
                            }
                            if (width != endWidth) {
                                let vwidth = (endWidth - width) / (endTime - startTime);
                                this.width = width + (time - startTime) * vwidth;
                            }
                            if (alpha != endAlpha) {
                                let valpha = (endAlpha - alpha) / (endTime - startTime);
                                this.alpha = alpha + (time - startTime) * valpha;
                            }
                            if (color.r != endColor.r) {
                                console.log(this.color.r, color.r, endColor.r);
                                let vcolorR = (endColor.r - color.r) / (endTime - startTime);
                                this.color.r = color.r + (time - startTime) * vcolorR;
                            }
                            if (color.g != endColor.g) {
                                let vcolorG = (endColor.g - color.g) / (endTime - startTime);
                                this.color.g = color.g + (time - startTime) * vcolorG;
                            }
                            if (color.b != endColor.b) {
                                let vcolorB = (endColor.b - color.b) / (endTime - startTime);
                                this.color.b = color.b + (time - startTime) * vcolorB;
                            }
                        } else {
                            const t = (time - startTime) / (endTime - startTime);
                            const BEZIER = (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            if (x != endX) {
                                this.x = x + (endX - x) * BEZIER;
                            }
                            if (y != endY) {
                                this.y = y + (endY - y) * BEZIER;
                            }
                            if (eulerAngle != endEulerAngle) {
                                this.eulerAngle = eulerAngle + (endEulerAngle - eulerAngle) * BEZIER;
                            }
                            if (width != endWidth) {
                                this.width = width + (endWidth - width) * BEZIER;
                            }
                            if (alpha != endAlpha) {
                                this.alpha = alpha + (endAlpha - alpha) * BEZIER;
                            }
                            if (color.r != endColor.r) {
                                this.color.r = color.r + (endColor.r - color.r) * BEZIER;
                            }
                            if (color.g != endColor.g) {
                                this.color.g = color.g + (endColor.g - color.g) * BEZIER;
                            }
                            if (color.b != endColor.b) {
                                this.color.b = color.b + (endColor.b - color.b) * BEZIER;
                            }
                        }
                    }
                    if (time > endTime) {
                        this.x = endX;
                        this.y = endY;
                        this.eulerAngle = endEulerAngle;
                        this.width = endWidth;
                        this.alpha = endAlpha;
                        this.color.r = endColor.r;
                        this.color.g = endColor.g;
                        this.color.b = endColor.b;
                        return true;
                    }
                    return false;
                }
            }
            class note {
                constructor(line = 0, x = 0, y = 5000, type = 'tap', trueNote = false, height = 100) {
                    this.line = line;
                    this.x = x;
                    this.y = y;
                    this.type = type;
                    this.over = false;
                    this.height = height;
                }
                draw(id) {
                    let noteImg;
                    if (!this.over && display[this.type]) {
                        if (spectral.lines[this.line] === undefined) {
                            addLine();
                        }
                        switch(this.type) {
                            case 'tap':
                                noteImg = imgs.tap;
                                break;
                            case 'drag':
                                noteImg = imgs.drag;
                                break;
                            case 'hold':
                                noteImg = imgs.hold;
                                break;
                        }
                        if (gl) {
                            if (this.line == editLine) {
                                cvs.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 1725);
                                cvs.globalAlpha = 1;
                                if (this.type == 'hold') {
                                    cvs.drawImage(noteImg, this.x * 100 - 150, 0 - (this.y * 100 + this.height * 100 - 12.5), 300, this.height * 100);
                                } else {
                                    cvs.drawImage(noteImg, this.x * 100 - 150, 0 - (this.y * 100 + 12.5), 300, 25);
                                }
                                if (display.noteId) {
                                    cvs.globalAlpha = 1;
                                    cvs.fillText(id, this.x * 100, 0 - (this.y * 100 + 12.5));
                                }
                                cvs.restore();
                            }
                        } else {
                            cvs.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2 + spectral.lines[this.line].x * 100, 1125 + spectral.lines[this.line].y * 100);
                            cvs.rotate(spectral.lines[this.line].eulerAngle * Math.PI / 180);
                            cvs.globalAlpha = 1;
                            if (this.type == 'hold') {
                                cvs.drawImage(noteImg, this.x * 100 - 150, 0 - (this.y * 100 + this.height * 100 - 12.5), 300, this.height * 100);
                            } else {
                                cvs.drawImage(noteImg, this.x * 100 - 150, 0 - (this.y * 100 + 12.5), 300, 25);
                            }
                            if (display.noteId) {
                                cvs.globalAlpha = 1;
                                cvs.fillStyle = '#ffffff';
                                cvs.fillText(id, this.x * 100, 0 - (this.y * 100 + 12.5));
                            }
                            cvs.restore();
                        }
                    }
                }
                move({line, x = this.x, y = this.y, endX = this.x, endY = this.y, bezier=false, startTime, endTime, type = 'tap', height = this.height, endHeight = this.height} = {}) {
                    let deleteNote = false;
                    switch(type) {
                        case 'tap':
                            this.type = 'tap';
                            break;
                        case 'drag':
                            this.type = 'drag';
                            break;
                        case 'hold':
                            this.type = 'hold';
                            break;
                    }
                    if (endY == 'down') {
                        if (time <= endTime) {
                            endY = 0;
                        } else if (this.y > -1.5 || (this.type == 'hold' && this.y > 0 - (endHeight) - 1.5)) {
                            let vy =  Math.abs((0 - y) / (endTime - startTime));
                            y = 0;
                            x = endX;
                            startTime = endTime;
                            if (this.type == 'hold') {
                                height = endHeight;
                                endY = 0 - (height) - 1.5;
                            } else {
                                endY = -1.5;
                            }
                            endTime += Math.abs(endY) / vy;
                            bezier = false;
                        }
                        deleteNote = true;
                    }
                    if (line !== undefined) {
                        this.line = line;
                    }
                    if (time <= endTime) {
                        this.x = x;
                        this.y = y;
                        this.over = false;
                    }
                    if (time < startTime) {
                        this.over = true;
                    }
                    if (time >= startTime && time <= endTime) {
                        if (!bezier) {
                            if (x != endX) {
                                let vx = (endX - x) / (endTime - startTime);
                                this.x = x + (time - startTime) * vx;
                            }
                            if (y != endY) {
                                let vy = (endY - y) / (endTime - startTime);
                                this.y = y + (time - startTime) * vy;
                            }
                            if (this.type == 'hold' && height != endHeight) {
                                let vheight =  (endHeight - height) / (endTime - startTime);
                                this.height = height + (time - startTime) * vheight;
                            }
                        } else {
                            const t = (time - startTime) / (endTime - startTime);
                            const BEZIER = (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            if (x != endX) {
                                this.x = x + (endX - x) * BEZIER;
                            }
                            if (y != endY) {
                                this.y = y + (endY - y) * BEZIER;
                            }
                            if (this.type == 'hold' && height != endHeight) {
                                this.height = height + (endHeight - height) * BEZIER;
                            }
                        }
                    }
                    if (time > endTime) {
                        this.x = endX;
                        this.y = endY;
                        if (deleteNote) {
                            this.over = true;
                        }
                    }
                    return false;
                }
            }
            class block {
                constructor(x = 0, y = 0, eulerAngle = 0, width = 1500, alpha = 1, color = {r: 255, g: 255, b: 255}) {
                    this.x = x;
                    this.y = y;
                    this.eulerAngle = eulerAngle;
                    this.width = width;
                    this.alpha = alpha;
                    this.color = color;
                }
                transformBlock() {
                    for (let i = 0; i < 4; i++) {
                        spectral.lines[i].width = this.width;
                        spectral.lines[i].alpha = this.alpha;
                        spectral.lines[i].color = this.color;
                    }
                    spectral.lines[0].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * this.eulerAngle);
                    spectral.lines[0].y = this.y - this.width / 2 * Math.cos(Math.PI / 180 * (0 - this.eulerAngle));
                    spectral.lines[0].eulerAngle = this.eulerAngle + 180;
                    spectral.lines[1].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (this.eulerAngle - 90));
                    spectral.lines[1].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * (this.eulerAngle + 90));
                    spectral.lines[1].eulerAngle = this.eulerAngle + 90;
                    spectral.lines[2].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (0 - this.eulerAngle));
                    spectral.lines[2].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * this.eulerAngle);
                    spectral.lines[2].eulerAngle = this.eulerAngle;
                    spectral.lines[3].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (this.eulerAngle + 90));
                    spectral.lines[3].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * (this.eulerAngle - 90));
                    spectral.lines[3].eulerAngle = this.eulerAngle - 90;
                }
                move({x = this.x, y = this.y, eulerAngle = this.eulerAngle, width = this.width, alpha = this.alpha, color = this.color, endX = this.x, endY = this.y, endEulerAngle = this.eulerAngle, endWidth = this.width, endAlpha = this.alpha, endColor = this.color, bezier=false, startTime, endTime} = {}) {
                    if (time <= endTime) {
                        this.x = x;
                        this.y = y;
                        this.width = width;
                        this.alpha = alpha;
                        this.color.r = color.r;
                        this.color.g = color.g;
                        this.color.b = color.b;
                    }
                    if (time >= startTime && time <= endTime) {
                        if (!bezier) {
                            if (x != endX) {
                                let vx = (endX - x) / (endTime - startTime);
                                this.x = x + (time - startTime) * vx;
                            }
                            if (y != endY) {
                                let vy = (endY - y) / (endTime - startTime);
                                this.y = y + (time - startTime) * vy;
                            }
                            if (eulerAngle != endEulerAngle) {
                                let veulerAngle = (endEulerAngle - eulerAngle) / (endTime - startTime);
                                this.eulerAngle = eulerAngle + (time - startTime) * veulerAngle;
                            }
                            if (width != endWidth) {
                                let vwidth = (endWidth - width) / (endTime - startTime);
                                this.width = width + (time - startTime) * vwidth;
                            }
                            if (alpha != endAlpha) {
                                let valpha = (endAlpha - alpha) / (endTime - startTime);
                                this.alpha = alpha + (time - startTime) * valpha;
                            }
                            if (color.r != endColor.r) {
                                console.log(this.color.r, color.r, endColor.r);
                                let vcolorR = (endColor.r - color.r) / (endTime - startTime);
                                this.color.r = color.r + (time - startTime) * vcolorR;
                            }
                            if (color.g != endColor.g) {
                                let vcolorG = (endColor.g - color.g) / (endTime - startTime);
                                this.color.g = color.g + (time - startTime) * vcolorG;
                            }
                            if (color.b != endColor.b) {
                                let vcolorB = (endColor.b - color.b) / (endTime - startTime);
                                this.color.b = color.b + (time - startTime) * vcolorB;
                            }
                        } else {
                            const t = (time - startTime) / (endTime - startTime);
                            const BEZIER = (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            if (x != endX) {
                                this.x = x + (endX - x) * BEZIER;
                            }
                            if (y != endY) {
                                this.y = y + (endY - y) * BEZIER;
                            }
                            if (eulerAngle != endEulerAngle) {
                                this.eulerAngle = eulerAngle + (endEulerAngle - eulerAngle) * BEZIER;
                            }
                            if (width != endWidth) {
                                this.width = width + (endWidth - width) * BEZIER;
                            }
                            if (alpha != endAlpha) {
                                this.alpha = alpha + (endAlpha - alpha) * BEZIER;
                            }
                            if (color.r != endColor.r) {
                                this.color.r = color.r + (endColor.r - color.r) * BEZIER;
                            }
                            if (color.g != endColor.g) {
                                this.color.g = color.g + (endColor.g - color.g) * BEZIER;
                            }
                            if (color.b != endColor.b) {
                                this.color.b = color.b + (endColor.b - color.b) * BEZIER;
                            }
                        }
                    }
                    if (time > endTime) {
                        this.x = endX;
                        this.y = endY;
                        this.eulerAngle = endEulerAngle;
                        this.width = endWidth;
                        this.alpha = endAlpha;
                        this.color.r = endColor.r;
                        this.color.g = endColor.g;
                        this.color.b = endColor.b;
                    }
                    this.transformBlock();
                }
            }
            class point {
                constructor(graph = 0 ,x = 0, y = 0, alpha = 1, color = {r: 255, g: 255, b: 255}, close = true) {
                    this.graph = graph;
                    this.x = x;
                    this.y = y;
                    this.alpha = alpha;
                    this.color = color;
                    this.close = close;
                }
                draw(id){
                    cvs.lineWidth = 8;
                    cvs.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 1125);
                    cvs.globalAlpha = this.alpha;
                    cvs.lineTo(this.x * 100, this.y * 100);
                    if (display.pointId) {
                        cvs.globalAlpha = 1;
                        cvs.fillStyle = '#ffffff';
                        cvs.fillText(String(id), this.x * 100, this.y * 100 + 100);
                    }
                    cvs.restore();
                }
                move({x = this.x, y = this.y, alpha = this.alpha, color = this.color, endX = this.x, endY = this.y, endAlpha = this.alpha, endColor = this.color, bezier = false, close = true, startTime, endTime} = {}) {
                    if (time <= endTime) {
                        this.x = x;
                        this.y = y;
                        this.alpha = alpha;
                        this.color.r = color.r;
                        this.color.g = color.g;
                        this.color.b = color.b;
                    }
                    if (time >= startTime && time <= endTime) {
                        this.close = close;
                        if (!bezier) {
                            if (x != endX) {
                                let vx = (endX - x) / (endTime - startTime);
                                this.x = x + (time - startTime) * vx;
                            }
                            if (y != endY) {
                                let vy = (endY - y) / (endTime - startTime);
                                this.y = y + (time - startTime) * vy;
                            }
                            if (alpha != endAlpha) {
                                let valpha = (endAlpha - alpha) / (endTime - startTime);
                                this.alpha = alpha + (time - startTime) * valpha;
                            }
                            if (color.r != endColor.r) {
                                let vcolorR = (endColor.r - color.r) / (endTime - startTime);
                                this.color.r = color.r + (time - startTime) * vcolorR;
                            }
                            if (color.g != endColor.g) {
                                let vcolorG = (endColor.g - color.g) / (endTime - startTime);
                                this.color.g = color.g + (time - startTime) * vcolorG;
                            }
                            if (color.b != endColor.b) {
                                let vcolorB = (endColor.b - color.b) / (endTime - startTime);
                                this.color.b = color.b + (time - startTime) * vcolorB;
                            }
                        } else {
                            const t = (time - startTime) / (endTime - startTime);
                            const BEZIER = (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            if (x != endX) {
                                this.x = x + (endX - x) * BEZIER;
                            }
                            if (y != endY) {
                                this.y = y + (endY - y) * BEZIER;
                            }
                            if (alpha != endAlpha) {
                                this.alpha = alpha + (endAlpha - alpha) * BEZIER;
                            }
                            if (color.r != endColor.r) {
                                this.color.r = color.r + (endColor.r - color.r) * BEZIER;
                            }
                            if (color.g != endColor.g) {
                                this.color.g = color.g + (endColor.g - color.g) * BEZIER;
                            }
                            if (color.b != endColor.b) {
                                this.color.b = color.b + (endColor.b - color.b) * BEZIER;
                            }
                        }
                    }
                    if (time > endTime) {
                        this.x = endX;
                        this.y = endY;
                        this.alpha = endAlpha;
                        this.close = close;
                        this.color.r = endColor.r;
                        this.color.g = endColor.g;
                        this.color.b = endColor.b;
                        return true;
                    }
                    return false;
                }
            }
            class text{
                constructor(x = 0, y = 0, eulerAngle = 0, text = '', font = '100px Phigros, Phigros cn, Tw Cen MT', alpha = 1, color = {r: 255, g: 255, b: 255}) {
                    this.x = x;
                    this.y = y;
                    this.eulerAngle = eulerAngle;
                    this.text = text;
                    this.font = font;
                    this.alpha = alpha;
                    this.color = color;
                }
                draw(id){
                    cvs.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
                    cvs.strokeStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
                    cvs.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2 + this.x * 100, 1125 + this.y * 100);
                    cvs.rotate(this.eulerAngle * Math.PI / 180);
                    cvs.globalAlpha = this.alpha;
                    cvs.font = this.font;
                    cvs.fillText(this.text, 0, 0);
                    cvs.font = '100px Phigros, Phigros cn, Tw Cen MT';
                    if (display.textId) {
                        cvs.globalAlpha = 1;
                        cvs.fillText(String(id), 0, 100);
                    }
                    cvs.restore();
                }
                move({x = this.x, y = this.y, eulerAngle = this.eulerAngle, text = this.text, font = this.font, alpha = this.alpha, color = this.color, endX = this.x, endY = this.y, endEulerAngle = this.eulerAngle, endAlpha = this.alpha, endColor = this.color, bezier = false, startTime, endTime} = {}) {
                    if (time <= endTime) {
                        this.x = x;
                        this.y = y;
                        this.eulerAngle = eulerAngle;
                        this.alpha = alpha;
                        this.color.r = color.r;
                        this.color.g = color.g;
                        this.color.b = color.b;
                    }
                    if (time >= startTime && time <= endTime) {
                        this.text = text;
                        this.font = font;
                        if (!bezier) {
                            if (x != endX) {
                                let vx = (endX - x) / (endTime - startTime);
                                this.x = x + (time - startTime) * vx;
                            }
                            if (y != endY) {
                                let vy = (endY - y) / (endTime - startTime);
                                this.y = y + (time - startTime) * vy;
                            }
                            if (eulerAngle != endEulerAngle) {
                                let veulerAngle = (endEulerAngle - eulerAngle) / (endTime - startTime);
                                this.eulerAngle = eulerAngle + (time - startTime) * veulerAngle;
                            }
                            if (alpha != endAlpha) {
                                let valpha = (endAlpha - alpha) / (endTime - startTime);
                                this.alpha = alpha + (time - startTime) * valpha;
                            }
                            if (color.r != endColor.r) {
                                console.log(this.color.r, color.r, endColor.r);
                                let vcolorR = (endColor.r - color.r) / (endTime - startTime);
                                this.color.r = color.r + (time - startTime) * vcolorR;
                            }
                            if (color.g != endColor.g) {
                                let vcolorG = (endColor.g - color.g) / (endTime - startTime);
                                this.color.g = color.g + (time - startTime) * vcolorG;
                            }
                            if (color.b != endColor.b) {
                                let vcolorB = (endColor.b - color.b) / (endTime - startTime);
                                this.color.b = color.b + (time - startTime) * vcolorB;
                            }
                        } else {
                            const t = (time - startTime) / (endTime - startTime);
                            const BEZIER = (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            if (x != endX) {
                                this.x = x + (endX - x) * BEZIER;
                            }
                            if (y != endY) {
                                this.y = y + (endY - y) * BEZIER;
                            }
                            if (eulerAngle != endEulerAngle) {
                                this.eulerAngle = eulerAngle + (endEulerAngle - eulerAngle) * BEZIER;
                            }
                            if (alpha != endAlpha) {
                                this.alpha = alpha + (endAlpha - alpha) * BEZIER;
                            }
                            if (color.r != endColor.r) {
                                this.color.r = color.r + (endColor.r - color.r) * BEZIER;
                            }
                            if (color.g != endColor.g) {
                                this.color.g = color.g + (endColor.g - color.g) * BEZIER;
                            }
                            if (color.b != endColor.b) {
                                this.color.b = color.b + (endColor.b - color.b) * BEZIER;
                            }
                        }
                    }
                    if (time > endTime) {
                        this.x = endX;
                        this.y = endY;
                        this.eulerAngle = endEulerAngle;
                        this.alpha = endAlpha;
                        this.text = text;
                        this.font = font;
                        this.color.r = endColor.r;
                        this.color.g = endColor.g;
                        this.color.b = endColor.b;
                        return true;
                    }
                    return false;
                }
            }
            class gameBoard {
                constructor() {
                    this.init();
                    this.process();
                }
                init() {
                    if (spectral == null) {
                        for (let i = 0; i < 4; i++) {
                            addLine();
                        }
                        spectral.block = new block();
                    } else {
                        $('#ui-display-lines>ul').empty();
                        spectral.notes = [];
                        spectral.lines = [];
                        for (let i = 0; i < 4; i++) {
                            addLine();
                        }
                        spectral.block = new block();
                    }
                }
                removeAll() {
                    removeLine(4, spectral.lines.length);
                    removeNote(0, spectral.notes.length);
                }
                // 动画循环（帧率）
                process(now){
                    //init time
                    if(!lastTime){
                        lastTime = now;
                    }
                    let seconds = (now - lastTime) / 1000;
                    lastTime = now;
                    if (seconds) {
                        time = audio.currentTime * 100 - offset;
                        if (!timeFocus) {
                            document.getElementById('ui-time-time').value = Math.floor(time + offset);
                        }
                    }
                    cvs.clearRect(-100000, -100000, 200000, 200000);
                    cvs.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 1125);
                    cvs.textAlign = 'center';
                    cvs.textBaseline = 'bottom';
                    cvs.font = '100px Phigros, Phigros cn, Tw Cen MT'
                    cvs.save();
                    for (let i = 0; i < spectral.blockMoves.length; i++) {
                        spectral.block.move({x: spectral.blockMoves[i].x, y: spectral.blockMoves[i].y, eulerAngle: spectral.blockMoves[i].eulerAngle, width: spectral.blockMoves[i].width, alpha: spectral.blockMoves[i].alpha, color: spectral.blockMoves[i].color, endX: spectral.blockMoves[i].endX, endY: spectral.blockMoves[i].endY, endEulerAngle: spectral.blockMoves[i].endEulerAngle, endWidth: spectral.blockMoves[i].endWidth, endAlpha: spectral.blockMoves[i].endAlpha, endColor: spectral.blockMoves[i].endColor, bezier: spectral.blockMoves[i].bezier, startTime: spectral.blockMoves[i].startTime, endTime: spectral.blockMoves[i].endTime});
                    }
                    for (let i = 0; i < spectral.textMoves.length; i++) {
                        while (!spectral.texts[spectral.textMoves[i].textId]) {
                            addText();
                        }
                        spectral.texts[spectral.textMoves[i].textId].move({x: spectral.textMoves[i].x, y: spectral.textMoves[i].y, eulerAngle: spectral.textMoves[i].eulerAngle, text: spectral.textMoves[i].text, font: spectral.textMoves[i].font, alpha: spectral.textMoves[i].alpha, color: spectral.textMoves[i].color, endX: spectral.textMoves[i].endX, endY: spectral.textMoves[i].endY, endEulerAngle: spectral.textMoves[i].endEulerAngle, endAlpha: spectral.textMoves[i].endAlpha, endColor: spectral.textMoves[i].endColor, bezier: spectral.textMoves[i].bezier, startTime: spectral.textMoves[i].startTime, endTime: spectral.textMoves[i].endTime});
                    }
                    for (let i = 0; i < spectral.lineMoves.length; i++) {
                        while (!spectral.lines[spectral.lineMoves[i].line]) {
                            addLine();
                        }
                        spectral.lines[spectral.lineMoves[i].line].move({x: spectral.lineMoves[i].x, y: spectral.lineMoves[i].y, eulerAngle: spectral.lineMoves[i].eulerAngle, width: spectral.lineMoves[i].width, alpha: spectral.lineMoves[i].alpha, color: spectral.lineMoves[i].color, endX: spectral.lineMoves[i].endX, endY: spectral.lineMoves[i].endY, endEulerAngle: spectral.lineMoves[i].endEulerAngle, endWidth: spectral.lineMoves[i].endWidth, endAlpha: spectral.lineMoves[i].endAlpha, endColor: spectral.lineMoves[i].endColor, bezier: spectral.lineMoves[i].bezier, startTime: spectral.lineMoves[i].startTime, endTime: spectral.lineMoves[i].endTime});
                    }
                    for (let i = 0; i < spectral.noteMoves.length; i++) {
                        while (!spectral.notes[spectral.noteMoves[i].note]) { //如果没有对应id的判定线，则添加
                            addNote(spectral.noteMoves[i].line, undefined, undefined, undefined, spectral.noteMoves[i].type);
                        }
                        spectral.notes[spectral.noteMoves[i].note].move({line: spectral.noteMoves[i].line, x: spectral.noteMoves[i].x, y: spectral.noteMoves[i].y, endX: spectral.noteMoves[i].endX, endY: spectral.noteMoves[i].endY, bezier: spectral.noteMoves[i].bezier, startTime: spectral.noteMoves[i].startTime, endTime: spectral.noteMoves[i].endTime, type: spectral.noteMoves[i].type, height: spectral.noteMoves[i].height, endHeight: spectral.noteMoves[i].endHeight});
                    }
                    for (let i = 0; i < spectral.pointMoves.length; i++) {
                        while(!spectral.graphics[spectral.pointMoves[i].graph]) {
                            addgraph();
                        }
                        while (!spectral.graphics[spectral.pointMoves[i].graph][spectral.pointMoves[i].point]) {
                            addPoint(spectral.pointMoves[i].graph);
                        }
                        spectral.graphics[spectral.pointMoves[i].graph][spectral.pointMoves[i].point].move({x: spectral.pointMoves[i].x, y: spectral.pointMoves[i].y, alpha: spectral.pointMoves[i].alpha, color: spectral.pointMoves[i].color, endX: spectral.pointMoves[i].endX, endY: spectral.pointMoves[i].endY, endAlpha: spectral.pointMoves[i].endAlpha, endColor: spectral.pointMoves[i].endColor, bezier: spectral.pointMoves[i].bezier, close: spectral.pointMoves[i].close, startTime: spectral.pointMoves[i].startTime, endTime: spectral.pointMoves[i].endTime});
                    }
                    for(var i = 0; i < spectral.graphics.length; i++) {
                        cvs.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 1125);
                        cvs.beginPath();
                        cvs.moveTo(spectral.graphics[i][0].x * 100, spectral.graphics[i][0].y * 100)
                        for (let j = 0; j < spectral.graphics[i].length; j++) {
                            spectral.graphics[i][j].draw(i + '-' + j);
                        }
                        cvs.fillStyle = `rgb(${spectral.graphics[i][spectral.graphics[i].length - 1].color.r}, ${spectral.graphics[i][spectral.graphics[i].length - 1].color.g}, ${spectral.graphics[i][spectral.graphics[i].length - 1].color.b})`;
                        cvs.strokeStyle = `rgb(${spectral.graphics[i][spectral.graphics[i].length - 1].color.r}, ${spectral.graphics[i][spectral.graphics[i].length - 1].color.g}, ${spectral.graphics[i][spectral.graphics[i].length - 1].color.b})`;
                        if (spectral.graphics[i][spectral.graphics[i].length - 1].close) {
                            cvs.closePath();
                        }
                        cvs.stroke();
                    }
                    for(var i = 0; i < spectral.texts.length; i++) {
                        spectral.texts[i].draw(i);
                    }
                    if (gl) {
                        spectral.lines[editLine].draw(editLine);
                    } else {
                        for(var i = 0; i < 4;i++) {
                            if (display.block[i]) {
                                spectral.lines[i].draw(i);
                            }
                        }
                        for(var i = 4; i < spectral.lines.length; i++) {
                            spectral.lines[i].draw(i);
                        }
                    }
                    for(var i = 0; i < spectral.notes.length; i++) {
                        if (display.block[spectral.notes[i].line] || spectral.notes[i].line > 3) {
                            spectral.notes[i].draw(i);
                        }
                    }
                    // console.log('canvas refresh', now, lastTime, seconds);
                    // 动画循环（帧率）
                    var gameLoop = window.requestAnimationFrame(this.process.bind(this));
                }
            }
            new gameBoard();
        }
    };
}
gaming();