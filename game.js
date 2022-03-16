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
    noteId: true
},
timeFocus = false;

function gaming() {
    if (spectral == null) {
        spectral = {
            block: null,
            blockMoves: [
                {x: 0, y: 0, deg: 360, endDeg: 0, alpha: 0, endAlpha: 1, bezier: {x1: 0.75, y1: 1, x2: 0.75, y2: 1}, startT: 0, width: 30, endWidth: 15, endT: 800},
                {endY: 3, deg: 0, endDeg: -180, endX: 12, endWidth: 15, startT: 800, endT: 1600},
                {endY: 0, endDeg: -90, endX: 0, endWidth: 15, startT: 1600, endT: 1800},
                {endY: 0, endDeg: 0, endX: 0, endWidth: 15, startT: 1800, endT: 1850},
                {endDeg: 360, endAlpha: 0, startT: 1900, endWidth: 50, endT: 2700}
            ],
            lines: [],
            lineMoves: [
                {line: 4, x: 0, y: -6, endX: 0, endY: 6, bezier: {x1: 0, y1: 0, x2: 0, y2: 1}, startT: 0, endT: 500}
            ],
            notes: [],
            noteMoves: [
                {line: 0, note: 0, x: 0, y: 20, endX: 0, endY: 5, startT: 1200, endT: 1350},
                {line: 1, note: 1, x: -5, y: 20, endX: 5, endY: 'down', startT: 1300, endT: 1450},
                {line: 0, note: 2, x: -5, y: 20, endX: 5, endY: 'down', type: 'drag', startT: 1700, endT: 1800},
                {line: 1, note: 3, x: -5, y: 20, endX: 5, endY: 'down', type: 'hold', height: 150, endHeight: 100, startT: 1650, endT: 1750},
                {line: 0, note: 4, x: -5, y: 20, endX: 5, endY: 'down', type: 'drag', startT: 1600, endT: 1700},
                {line: 3, note: 5, x: 0, y: 20, endX: 0, endY: 'down', startT: 1200, endT: 1400},
                {line: 2, note: 6, x: 0, y: 20, endX: 0, endY: 'down', startT: 1300, endT: 1450},
                {line: 2, note: 7, x: 0, y: 20, endX: 0, endY: 'down', startT: 1600, endT: 1700},
                {line: 4, note: 8, x: 0, y: 20, endX: 0, endY: 'down',bezier: {x1: 0, y1: 0, x2: 0, y2: 0.5} , startT: 800, endT: 1000},
                {line: 4, note: 9, x: 0, y: 0, endX: -30, endY: 0, startT: 0, endT: 100},
            ],
        }
    }
    function loadGame({music, bg = 'none', songName='?', author='unknown', tDfcy='EZ', dfcy='?'}) {
        audio = document.querySelector('#ui-time-audio');
        if (bg != 'none') {
            $('#bg').attr('src', '../' + bg);
            // $('#canvas').css('background-image', `url(../${bg})`);
        }
        // initCanvas
        cvs.width = 3000;
        cvs.height = 2250;
        if (settings.proportion == '16:9' || settings.proportion == undefined) {
            $('#canvas').css('width', $('body').height() / 9 * 16);
        } else {
            $('#canvas').css('width', $('body').height() / 3 * 4);
        }
        cvs = cvs.getContext('2d');
        cvs.transform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 1125);
        cvs.textAlign = 'center';
        cvs.textBaseline = 'bottom';
        cvs.font = '100px Phigros, Phigros cn, Tw Cen MT'
        cvs.save();
    }
    // init UI
    $('body>*').hide();
    $('#ui, #info, #bg, #blur').show();
    // init vars
    var cvs = document.getElementById('canvas');
    var lS = window.localStorage;
    var settings = JSON.parse('{"pmyc":0,"buttonSize":100,"OFBlur":true,"bgBlur":100,"OFAudio":true,"gameAudio":100,"uiAudio":100,"touchAudio":100,"OFDyfz":true,"OFFcApzsq":true,"OFEffect":true,"OFAutoPlay":false,"proportion":"4:3"}');
    let time = -300, startTime = 0, lineColor = '#ffffff',
    imgs = {
        tap: new Image(),
        drag: new Image(),
        hold: new Image()
    }
    loadGame({music: 'audio/Happy Life.mp3', bg: 'img/icon/icon.jpg'});
    imgs.tap.src = 'img/ui/Tap2.png';
    imgs.drag.src = 'img/ui/drag.png';
    imgs.hold.src = 'img/ui/Hold2.png';
    let gameLoad = false;
    document.body.onresize = () => {
        if (settings.proportion == '16:9' || settings.proportion == undefined) {
            $('#canvas').css('width', $('body').height() / 9 * 16);
        } else {
            $('#canvas').css('width', $('body').height() / 3 * 4);
        }
    }
    audio.oncanplaythrough = () => {
        if (!gameLoad) {
            console.log('loaded');
            gameLoad = true;
            function distance(x, y, endX, endY){
                return Math.sqrt(Math.abs(x - endX) ** 2 + Math.abs(y - endY) ** 2);
            }
            function addLine(x, y, deg, width, alpha) {
                $('#ui-display-lines>ul').append(`<li class="line canEdit" data-lineId="${spectral.lines.length}">line&nbsp;${spectral.lines.length}</li>`);
                spectral.lines.push(new line(x, y, deg, width, alpha));
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
                constructor(x = 0, y = 0, deg = 0, width = 10000, alpha = 1) {
                    this.x = x;
                    this.y = y;
                    this.deg = deg;
                    this.width = width;
                    this.alpha = alpha;
                }
                draw(id){
                    cvs.fillStyle = lineColor;
                    cvs.strokeColor = lineColor;
                    cvs.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2 + this.x * 100, 1125 + this.y * 100);
                    cvs.rotate(this.deg * Math.PI / 180);
                    cvs.globalAlpha = this.alpha;
                    cvs.fillRect(0 - this.width * 50, -4, this.width * 100, 8);
                    if (display.lineId) {
                        cvs.globalAlpha = 1;
                        cvs.fillText(String(id), 0, 0);
                    }
                    cvs.restore();
                }
                move({x = this.x, y = this.y, deg = this.deg, width = this.width, alpha = this.alpha, endX = 0, endY = 0, endDeg = 0, endWidth = 10000, endAlpha = 1, bezier = false, startT, endT} = {}) {
                    if (time <= endT) {
                        this.x = x;
                        this.y = y;
                        this.deg = deg;
                        this.width = width;
                        this.alpha = alpha;
                    }
                    if (time >= startT && time <= endT) {
                        if (!bezier) {
                            let vx = (endX - x) / (endT - startT);
                            let vy = (endY - y) / (endT - startT);
                            let vdeg = (endDeg - deg) / (endT - startT);
                            let vwidth = (endWidth - width) / (endT - startT);
                            let valpha = (endAlpha - alpha) / (endT - startT);
                            this.x = x + (time - startT) * vx;
                            this.y = y + (time - startT) * vy;
                            this.deg = deg + (time - startT) * vdeg;
                            this.width = width + (time - startT) * vwidth;
                            this.alpha = alpha + (time - startT) * valpha;
                        } else {
                            let t = (time - startT) / (endT - startT);
                            this.x = x + (endX - x) * (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            this.y = y + (endY - y) * (3 * ((1 - t) ** 2) * bezier.y1 * t + 3 * ((1 - t) ** 2) * bezier.y2 * t ** 2 + t ** 3);
                            this.deg = deg + (endDeg - deg) * (3 * ((1 - t) ** 2) * bezier.y1 * t + 3 * ((1 - t) ** 2) * bezier.y2 * t ** 2 + t ** 3);
                            this.width = width + (endWidth - width) * (3 * ((1 - t) ** 2) * bezier.y1 * t + 3 * ((1 - t) ** 2) * bezier.y2 * t ** 2 + t ** 3);
                            this.alpha = alpha + (endAlpha - alpha) * (3 * ((1 - t) ** 2) * bezier.y1 * t + 3 * ((1 - t) ** 2) * bezier.y2 * t ** 2 + t ** 3);
                        }
                    }
                    if (time > endT) {
                        this.x = endX;
                        this.y = endY;
                        this.deg = endDeg;
                        this.width = endWidth;
                        this.alpha = endAlpha;
                        return true;
                    }
                    return false;
                }
            }
            class note {
                constructor(line = 0, x = 0, y = 5000, type = 'tap', trueNote = false, bezier = false, height = 100) {
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
                        cvs.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2 + spectral.lines[this.line].x * 100, 1125 + spectral.lines[this.line].y * 100);
                        cvs.rotate(spectral.lines[this.line].deg * Math.PI / 180);
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
                }
                move({line, x = this.x, y = this.y, endX = this.x, endY = this.y, bezier=false, startT, endT, type = 'tap', height = this.height, endHeight = this.height} = {}) {
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
                        if (time <= endT) {
                            endY = 0;
                        } else if (this.y > -1.5 || (this.type == 'hold' && this.y > 0 - (endHeight) - 1.5)) {
                            let vy =  Math.abs((0 - y) / (endT - startT));
                            y = 0;
                            x = endX;
                            startT = endT;
                            if (this.type == 'hold') {
                                height = endHeight;
                                endY = 0 - (height) - 1.5;
                            } else {
                                endY = -1.5;
                            }
                            endT += Math.abs(endY) / vy;
                            bezier = false;
                        }
                        deleteNote = true;
                    }
                    if (line !== undefined) {
                        this.line = line;
                    }
                    if (time <= endT) {
                        this.x = x;
                        this.y = y;
                        this.over = false;
                    }
                    if (time < startT) {
                        this.over = true;
                    }
                    if (time >= startT && time <= endT) {
                        let vx = (endX - x) / (endT - startT);
                        let vy = (endY - y) / (endT - startT);
                        if (!bezier) {
                            let vx = (endX - x) / (endT - startT);
                            let vy = (endY - y) / (endT - startT);
                            this.x = x + (time - startT) * vx;
                            this.y = y + (time - startT) * vy;
                            if (this.type == 'hold') {
                                let vheight =  (endHeight - height) / (endT - startT);
                                this.height = height + (time - startT) * vheight;
                            }
                        } else {
                            let t = (time - startT) / (endT - startT);
                            this.x = x + (endX - x) * (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            this.y = y + (endY - y) * (3 * ((1 - t) ** 2) * bezier.y1 * t + 3 * ((1 - t) ** 2) * bezier.y2 * t ** 2 + t ** 3);
                            if (this.type == 'hold') {
                                this.height = height + (endHeight - height) * (3 * ((1 - t) ** 2) * bezier.y1 * t + 3 * ((1 - t) ** 2) * bezier.y2 * t ** 2 + t ** 3);
                            }
                        }
                    }
                    if (time > endT) {
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
                constructor(x = 0, y = 0, deg = 0, width = 1500, alpha = 1) {
                    this.x = x;
                    this.y = y;
                    this.deg = deg;
                    this.width = width;
                    this.alpha = alpha;
                }
                transformBlock() {
                    for (let i = 0; i < 4; i++) {
                        spectral.lines[i].width = this.width;
                        spectral.lines[i].alpha = this.alpha;
                    }
                    spectral.lines[0].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * this.deg);
                    spectral.lines[0].y = this.y - this.width / 2 * Math.cos(Math.PI / 180 * (0 - this.deg));
                    spectral.lines[0].deg = this.deg + 180;
                    spectral.lines[1].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (this.deg - 90));
                    spectral.lines[1].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * (this.deg + 90));
                    spectral.lines[1].deg = this.deg + 90;
                    spectral.lines[2].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (0 - this.deg));
                    spectral.lines[2].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * this.deg);
                    spectral.lines[2].deg = this.deg;
                    spectral.lines[3].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (this.deg + 90));
                    spectral.lines[3].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * (this.deg - 90));
                    spectral.lines[3].deg = this.deg - 90;
                }
                move({x = this.x, y = this.y, deg = this.deg, width = this.width, alpha = this.alpha, endX = 0, endY = 0, endDeg = 0, endWidth = 10000, endAlpha = 1, bezier=false, startT, endT} = {}) {
                    // console.log(x, y, deg, width, endX, endY, endDeg, endWidth, startT, endT);
                    if (time >= startT && time <= endT) {
                        if (!bezier) {
                            let vx = (endX - x) / (endT - startT);
                            let vy = (endY - y) / (endT - startT);
                            let vdeg = (endDeg - deg) / (endT - startT);
                            let vwidth = (endWidth - width) / (endT - startT);
                            let valpha = (endAlpha - alpha) / (endT - startT);
                            this.x = x + (time - startT) * vx;
                            this.y = y + (time - startT) * vy;
                            this.deg = deg + (time - startT) * vdeg;
                            this.width = width + (time - startT) * vwidth;
                            this.alpha = alpha + (time - startT) * valpha;
                        } else {
                            let t = (time - startT) / (endT - startT);
                            this.x = x + (endX - x) * (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            this.y = y + (endY - y) * (3 * ((1 - t) ** 2) * bezier.y1 * t + 3 * ((1 - t) ** 2) * bezier.y2 * t ** 2 + t ** 3);
                            this.deg = deg + (endDeg - deg) * (3 * ((1 - t) ** 2) * bezier.y1 * t + 3 * ((1 - t) ** 2) * bezier.y2 * t ** 2 + t ** 3);
                            this.width = width + (endWidth - width) * (3 * ((1 - t) ** 2) * bezier.y1 * t + 3 * ((1 - t) ** 2) * bezier.y2 * t ** 2 + t ** 3);
                            this.alpha = alpha + (endAlpha - alpha) * (3 * ((1 - t) ** 2) * bezier.y1 * t + 3 * ((1 - t) ** 2) * bezier.y2 * t ** 2 + t ** 3);
                        }
                    }
                    if (time > endT) {
                        this.x = endX;
                        this.y = endY;
                        this.deg = endDeg;
                        this.width = endWidth;
                        this.alpha = endAlpha;
                    }
                    this.transformBlock();
                }
            }
            class gameBoard {
                constructor() {
                    this.init();
                    this.process();
                    document.getElementById('ui-time-time').value = 0;
                }
                init() {
                    addNote(0, cvs, 0, 5000, 'tap', true);
                    for (let i = 0; i < 4; i++) {
                        addLine();
                    }
                    spectral.block = new block(cvs)
                }
                removeAll() {
                    removeLine(4, spectral.lines.length);
                    removeNote(0, spectral.notes.length);
                }
                // 动画循环（帧率）
                process(now){
                    //init time
                    if(!startTime){
                        startTime = now;
                    }
                    let seconds = (now - startTime) / 1000;
                    startTime = now;
                    if (seconds) {
                        time = audio.currentTime * 100;
                        if (!timeFocus) {
                            document.getElementById('ui-time-time').value = Math.floor(time);
                        }
                    }
                    cvs.clearRect(-10000, -10000, 20000, 20000);
                    for (let i = 0; i < spectral.blockMoves.length; i++) {
                        spectral.block.move({x: spectral.blockMoves[i].x, y: spectral.blockMoves[i].y, deg: spectral.blockMoves[i].deg, width: spectral.blockMoves[i].width, alpha: spectral.blockMoves[i].alpha, endX: spectral.blockMoves[i].endX, endY: spectral.blockMoves[i].endY, endDeg: spectral.blockMoves[i].endDeg, endWidth: spectral.blockMoves[i].endWidth, endAlpha: spectral.blockMoves[i].endAlpha, bezier: spectral.blockMoves[i].bezier, startT: spectral.blockMoves[i].startT, endT: spectral.blockMoves[i].endT});
                    }
                    for (let i = 0; i < spectral.lineMoves.length; i++) {
                        while (!spectral.lines[spectral.lineMoves[i].line]) {
                            addLine();
                        }
                        spectral.lines[spectral.lineMoves[i].line].move({x: spectral.lineMoves[i].x, y: spectral.lineMoves[i].y, deg: spectral.lineMoves[i].deg, width: spectral.lineMoves[i].width, alpha: spectral.lineMoves[i].alpha, endX: spectral.lineMoves[i].endX, endY: spectral.lineMoves[i].endY, endDeg: spectral.lineMoves[i].endDeg, endWidth: spectral.lineMoves[i].endWidth, endAlpha: spectral.lineMoves[i].endAlpha, bezier: spectral.lineMoves[i].bezier, startT: spectral.lineMoves[i].startT, endT: spectral.lineMoves[i].endT});
                    }
                    for (let i = 0; i < spectral.noteMoves.length; i++) {
                        while (!spectral.notes[spectral.noteMoves[i].note]) {
                            addNote(spectral.noteMoves[i].line, undefined, undefined, undefined, spectral.noteMoves[i].type);
                        }
                        spectral.notes[spectral.noteMoves[i].note].move({line: spectral.noteMoves[i].line, x: spectral.noteMoves[i].x, y: spectral.noteMoves[i].y, endX: spectral.noteMoves[i].endX, endY: spectral.noteMoves[i].endY, bezier: spectral.noteMoves[i].bezier, startT: spectral.noteMoves[i].startT, endT: spectral.noteMoves[i].endT, type: spectral.noteMoves[i].type, height: spectral.noteMoves[i].height, endHeight: spectral.noteMoves[i].endHeight});
                    }
                    for(var i = 0; i < 4;i++) {
                        if (display.block[i]) {
                            spectral.lines[i].draw(i);
                        }
                    }
                    for(var i = 4; i < spectral.lines.length; i++) {
                        spectral.lines[i].draw(i);
                    }
                    for(var i = 0; i < spectral.notes.length; i++) {
                        if (display.block[spectral.notes[i].line] || spectral.notes[i].line > 3) {
                            spectral.notes[i].draw(i);
                        }
                    }
                    // console.log('canvas refresh', now, startTime, seconds);
                    // 动画循环（帧率）
                    var gameLoop = window.requestAnimationFrame(this.process.bind(this));
                }
            }
            new gameBoard();
        }
    };
}