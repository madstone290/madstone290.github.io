const TimelineChart = function () {
    const CLS_ROOT = "tc-root";
    const CLS_TIMELINE_TITLE = "tc-timeline-title";
    const CLS_TIMELINE_HEADER_BOX = "tc-timeline-header-box";
    const CLS_TIMELINE_HEADER = "tc-timeline-header";
    const CLS_TIMELINE_CANVAS_BOX = "tc-timeline-canvas-box";
    const CLS_TIMELINE_CANVAS = "tc-timeline-canvas";
    const CLS_TIMELINE_HEADER_ITEM = "tc-timeline-header-item";
    const CLS_TIMELINE = "tc-timeline";
    const CLS_LEFT_PANEL = "tc-left-panel";
    const CLS_MAIN_PANEL = "tc-main-panel";
    const CLS_MAIN_TITLE = "tc-maintitle";
    const CLS_SUBTITLE = "tc-subtitle";
    const CLS_ENTITY_LIST_BOX = "tc-entity-list-box";
    const CLS_MAIN_CANVAS_BOX = "tc-main-canvas-box";
    const CLS_MAIN_CANVAS = "tc-main-canvas";
    const CLS_ENTITY_LIST_ITEM = "tc-entity-list-item";
    const CLS_TIMELINE_CANVAS_ITEM = "tc-timeline-canvas-item";
    const CLS_MAIN_CANVAS_ITEM = "tc-main-canvas-item";
    const CLS_HLINE = "tc-hline";
    const CLS_VLINE = "tc-vline";
    /**
     * 타임라인차트 엘리먼트
     */
    const TC_ELEMENT_HTML = `
        <div class="${CLS_ROOT}">
            <div class="${CLS_LEFT_PANEL}">
                <div class="${CLS_MAIN_TITLE}"></div>
                <div class="${CLS_SUBTITLE}"></div>
                <div class="${CLS_ENTITY_LIST_BOX}"></div>
            </div>
            <div class="${CLS_MAIN_PANEL}">
                <div class="${CLS_TIMELINE}">
                    <div class="${CLS_TIMELINE_TITLE}"></div>
                    <div class="${CLS_TIMELINE_HEADER_BOX}">
                        <div class="${CLS_TIMELINE_HEADER}"></div>
                    </div>
                    <div class="${CLS_TIMELINE_CANVAS_BOX}">
                        <div class="${CLS_TIMELINE_CANVAS}"></div>
                    </div>

                </div>
                <div class="${CLS_MAIN_CANVAS_BOX}">
                    <div class="${CLS_MAIN_CANVAS}">
                    </div>
                </div>
            </div>
        </div>
        `;
    const Z_INDEX_ENTITY_POINT_EVENT = 3;
    const Z_INDEX_ENTITY_RANGE_EVENT = 2;
    const Z_INDEX_GLOBAL_RANGE_EVENT = 1;
    /* Layout
    |---------------|-------------------|
    | main title    | timeline title    |
    |---------------|-------------------|
    |               | timeline header   |
    | sub title     |-------------------|
    |               | timeline canvas   |
    |---------------|-------------------|
    |               |                   |
    | entity list   | main canvas       |
    |               |                   |
    |---------------|-------------------|
    */
    /* Options */
    /**
     * 차트의 시작 시간. 렌더링 시작시간과 다를 수 있다.
     */
    let _chartStartTime;
    /**
     * 차트의 종료 시간. 렌더링 시작시간과 다를 수 있다.
     */
    let _chartEndTime;
    /**
     * 차트 렌더링 시작 시간
     */
    let _chartRenderStartTime;
    /**
     * 차트 렌더링 종료 시간
     */
    let _chartRenderEndTime;
    /**
     * 차트 좌우 공백을 채울 셀 개수. 좌/우측에 각각 적용된다.
     */
    let _paddingCellCount = 2;
    /**
     * 셀 시간. 분 단위.
     */
    let _cellMinutes;
    /**
     * 메인 캔버스 셀 컨텐츠 비율. 0~1
     */
    let _mainCanvasContentRatio;
    /**
     * 타임라인 캔버스 셀 컨텐츠 비율. 0~1
     */
    let _timelineCanvasContentRatio;
    /**
     * 헤더 셀 개수. (시작시간 - 종료시간) / 셀시간
     */
    let _headerCellCount;
    /**
     * 캔버스 가로선 표시 여부
     */
    let _hasHorizontalLine;
    /**
     * 캔버스 세로선 표시 여부
     */
    let _hasVertialLine;
    /**
     * 캔버스 자동 맞춤 여부. true일 경우 캔버스의 빈 공간을 없앤다.
     */
    let _canAutoFit;
    /**
     * 셀 너비 조절 단위. 마우스 휠을 이용해 셀 크기를 조절할 때 사용한다.
     */
    let _resizeWidthstep;
    /**
     * 셀 높이 조절 단위. 마우스 휠을 이용해 셀 크기를 조절할 때 사용한다.
     */
    let _resizeHeightStep;
    /**
     * 리사이즈에서 허용하는 최소 셀 너비. 설정값이 없는 경우 기본 셀너비와 동일하다.
     */
    let _minCellWidth;
    /**
     * 리사이즈에서 허용하는 최대 셀 너비.
     */
    let _maxCellWidth;
    /**
     * 리사이즈에서 허용하는 최소 셀 높이. 설정값이 없는 경우 기본 셀높이와 동일하다.
     */
    let _minCellHeight;
    /**
     * 리사이즈에서 허용하는 최대 셀 높이.
     */
    let _maxCellHeight;
    /**
     * 헤더 시간 포맷 함수
     */
    let _headerTimeFormat;
    /**
     * 헤더 셀 렌더러
     */
    let _headerCellRender;
    /**
     * 타임라인 포인트 이벤트 렌더러
     */
    let _timelinePointEventRender;
    /**
     * 엔티티 포인트 이벤트 렌더러
     */
    let _entityPointEventRender;
    /**
     * 엔티티 레인지 이벤트 렌더러
     */
    let _entityRangeEventRender;
    /**
     * 글로벌 레인지 이벤트 렌더러
     */
    let _globalRangeEventRender;
    /* 데이터 */
    /**
     * 엔티티 리스트
     */
    let _entities;
    /**
     * 타임라인 포인트 이벤트 리스트
     */
    let _timelinePointEvents;
    /**
     * 글로벌 레인지 이벤트 리스트
     */
    let _globalRangeEvents;
    /* Html Elements */
    let _rootElement;
    let _mainTitleElement;
    let _subTitleElement;
    let _timelineTitleElement;
    let _entityListBoxElement;
    let _timelineHeaderBoxElement;
    let _timelineHeaderElement;
    let _timelineCanvasBoxElement;
    let _timelineCanvasElement;
    let _mainCanvasBoxElement;
    let _mainCanvasElement;
    const dateTimeService = function () {
        function toMinutes(time) {
            return time / (60 * 1000);
        }
        function toTime(minutes) {
            return minutes * 60 * 1000;
        }
        return {
            toMinutes,
            toTime
        };
    }();
    const cssService = function () {
        const VAR_CELL_WIDTH = "--tc-cell-width";
        const VAR_CELL_HEIGHT = "--tc-cell-height";
        const VAR_CELL_CONTENT_HEIGHT = "--tc-cell-content-height";
        const VAR_SCROLL_WIDTH = "--tc-scroll-width";
        const VAR_CHART_HEIGHT = "--tc-height";
        const VAR_CHART_WIDTH = "--tc-width";
        const VAR_TIMELINE_TITLE_HEIGHT = "--tc-timeline-title-height";
        const VAR_TIMELINE_HEADER_HEIGHT = "--tc-timeline-header-height";
        const VAR_TIMELINE_CANVAS_HEIGHT = "--tc-timeline-canvas-height";
        const VAR_TIMELINE_CANVAS_CONTENT_HEIGHT = "--tc-timeline-canvas-content-height";
        function getVariable(name) {
            return getComputedStyle(_rootElement).getPropertyValue(name);
        }
        function setVariable(name, value) {
            _rootElement.style.setProperty(name, value);
        }
        function setChartWidth(width) {
            setVariable(VAR_CHART_WIDTH, `${width}px`);
        }
        function getChartHeight() { return parseInt(getVariable(VAR_CHART_HEIGHT)); }
        function setChartHeight(height) { setVariable(VAR_CHART_HEIGHT, `${height}px`); }
        function getTimelineTitleHeight() { return parseInt(getVariable(VAR_TIMELINE_TITLE_HEIGHT)); }
        function setTimeLineTitleHeight(height) { setVariable(VAR_TIMELINE_TITLE_HEIGHT, `${height}px`); }
        function getTimelineHeaderHeight() { return parseInt(getVariable(VAR_TIMELINE_HEADER_HEIGHT)); }
        function setTimelineHeaderHeight(height) { setVariable(VAR_TIMELINE_HEADER_HEIGHT, `${height}px`); }
        function getTimelineCanvasHeight() { return parseInt(getVariable(VAR_TIMELINE_CANVAS_HEIGHT)); }
        function setTimelineCanvasHeight(height) { setVariable(VAR_TIMELINE_CANVAS_HEIGHT, `${height}px`); }
        function getTimelineCanvasContentHeight() { return parseInt(getVariable(VAR_TIMELINE_CANVAS_CONTENT_HEIGHT)); }
        function setTimelineCanvasContentHeight(height) { setVariable(VAR_TIMELINE_CANVAS_CONTENT_HEIGHT, `${height}px`); }
        function getTimelineHeight() { return getTimelineTitleHeight() + getTimelineHeaderHeight() + getTimelineCanvasHeight(); }
        function getCellWidth() { return parseInt(getVariable(VAR_CELL_WIDTH)); }
        function setCellWidth(width) { setVariable(VAR_CELL_WIDTH, `${width}px`); }
        function getCellHeight() { return parseInt(getVariable(VAR_CELL_HEIGHT)); }
        function setCellHeight(height) { setVariable(VAR_CELL_HEIGHT, `${height}px`); }
        function getCellContentHeight() { return parseInt(getVariable(VAR_CELL_CONTENT_HEIGHT)); }
        function setCellContentHeight(height) { setVariable(VAR_CELL_CONTENT_HEIGHT, `${height}px`); }
        function getScrollWidth() { return parseInt(getVariable(VAR_SCROLL_WIDTH)); }
        return {
            getVariable,
            setChartWidth,
            getChartHeight,
            setChartHeight,
            getTimelineTitleHeight,
            setTimeLineTitleHeight,
            getTimelineHeaderHeight,
            setTimelineHeaderHeight,
            getTimelineCanvasHeight,
            setTimelineCanvasHeight,
            getTimelineCanvasContentHeight,
            setTimelineCanvasContentHeight,
            getTimelineHeight,
            getCellWidth,
            setCellWidth,
            getCellHeight,
            setCellHeight,
            getCellContentHeight,
            setCellContentHeight,
            getScrollWidth
        };
    }();
    /**
     * 차트 엘리먼트를 생성한다.
     * @param container
     */
    function create(container, data, options) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(TC_ELEMENT_HTML, 'text/html');
        const element = doc.body.firstChild;
        container.appendChild(element);
        _rootElement = container.getElementsByClassName(CLS_ROOT)[0];
        _mainTitleElement = container.getElementsByClassName(CLS_MAIN_TITLE)[0];
        _subTitleElement = container.getElementsByClassName(CLS_SUBTITLE)[0];
        _timelineTitleElement = container.getElementsByClassName(CLS_TIMELINE_TITLE)[0];
        _entityListBoxElement = container.getElementsByClassName(CLS_ENTITY_LIST_BOX)[0];
        _timelineHeaderBoxElement = container.getElementsByClassName(CLS_TIMELINE_HEADER_BOX)[0];
        _timelineHeaderElement = container.getElementsByClassName(CLS_TIMELINE_HEADER)[0];
        _timelineCanvasBoxElement = container.getElementsByClassName(CLS_TIMELINE_CANVAS_BOX)[0];
        _timelineCanvasElement = container.getElementsByClassName(CLS_TIMELINE_CANVAS)[0];
        _mainCanvasBoxElement = container.getElementsByClassName(CLS_MAIN_CANVAS_BOX)[0];
        _mainCanvasElement = container.getElementsByClassName(CLS_MAIN_CANVAS)[0];
        // 컨테이너 크기에 맞춰 차트 크기를 조정한다.
        cssService.setChartWidth(container.clientWidth);
        cssService.setChartHeight(container.clientHeight);
        setData(data);
        setOptions(options);
    }
    function setOptions(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        _mainTitleElement.innerText = options.mainTitle;
        _subTitleElement.innerText = options.subTitle;
        _timelineTitleElement.innerText = options.headerTitle;
        _cellMinutes = options.cellMinutes;
        _chartStartTime = options.chartStartTime;
        _chartEndTime = options.chartEndTime;
        _chartRenderStartTime = new Date(options.chartStartTime.getTime() - dateTimeService.toTime(_cellMinutes * _paddingCellCount));
        _chartRenderEndTime = new Date(options.chartEndTime.getTime() + dateTimeService.toTime(_cellMinutes * _paddingCellCount));
        _hasHorizontalLine = options.hasHorizontalLine;
        _hasVertialLine = options.hasVerticalLine;
        _canAutoFit = options.canAutoFit;
        _resizeWidthstep = options.cellWidth / 10;
        _resizeHeightStep = options.cellHeight / 10;
        _minCellWidth = (_a = options.minCellWidth) !== null && _a !== void 0 ? _a : options.cellWidth;
        _maxCellWidth = (_b = options.maxCellWidth) !== null && _b !== void 0 ? _b : options.cellWidth * ((_c = options.maxResizeScale) !== null && _c !== void 0 ? _c : 3);
        _minCellHeight = (_d = options.minCellHeight) !== null && _d !== void 0 ? _d : options.cellHeight;
        _maxCellHeight = (_e = options.maxCellHeight) !== null && _e !== void 0 ? _e : options.cellHeight * ((_f = options.maxResizeScale) !== null && _f !== void 0 ? _f : 3);
        cssService.setTimeLineTitleHeight((_g = options.timelineTitleHeight) !== null && _g !== void 0 ? _g : 40);
        cssService.setTimelineHeaderHeight((_h = options.timelineHeaderHeight) !== null && _h !== void 0 ? _h : 40);
        const timelineCanvasHeight = (_j = options.timelineCanvasHeight) !== null && _j !== void 0 ? _j : 40;
        _timelineCanvasContentRatio = (_k = options.timelineCanvasContentHeightRatio) !== null && _k !== void 0 ? _k : 0.6;
        const timelineCanvasContentHeight = timelineCanvasHeight * _timelineCanvasContentRatio;
        cssService.setTimelineCanvasHeight(timelineCanvasHeight);
        cssService.setTimelineCanvasContentHeight(timelineCanvasContentHeight);
        const cellWidth = (_l = options.cellWidth) !== null && _l !== void 0 ? _l : 80;
        const cellHeight = (_m = options.cellHeight) !== null && _m !== void 0 ? _m : 40;
        _mainCanvasContentRatio = (_o = options.cellContentHeightRatio) !== null && _o !== void 0 ? _o : 0.6;
        const cellContentHeight = cellHeight * _mainCanvasContentRatio;
        cssService.setCellWidth(cellWidth);
        cssService.setCellHeight(cellHeight);
        cssService.setCellContentHeight(cellContentHeight);
        _headerTimeFormat = (_p = options.headerTimeFormat) !== null && _p !== void 0 ? _p : ((time) => { return time.toLocaleString(); });
        _headerCellRender = options.headerCellRender;
        _timelinePointEventRender = options.timelinePointEventRender;
        _entityRangeEventRender = options.entityRangeEventRender;
        _entityPointEventRender = options.entityPointEventRender;
        _globalRangeEventRender = options.globalRangeEventRender;
    }
    function setData(data) {
        const { entities, sidePointEvents: timelinePointEvents, globalRangeEvents } = data;
        _entities = entities;
        _timelinePointEvents = timelinePointEvents;
        _globalRangeEvents = globalRangeEvents;
    }
    /**
     * 차트를 그린다.
     */
    function render() {
        initLayout();
        drawTimelineCanvas();
        drawEntityList();
        drawMainCanvas();
    }
    /**
     * 설정값에 맞춰 레이아웃을 초기화한다.
     */
    function initLayout() {
        let time = _chartRenderStartTime;
        let end = _chartRenderEndTime;
        _headerCellCount = 0;
        while (time < end) {
            if (_headerCellRender != null) {
                const containerElement = document.createElement("div");
                _timelineHeaderElement.appendChild(containerElement);
                containerElement.classList.add(CLS_TIMELINE_HEADER_ITEM);
                _headerCellRender(time, containerElement);
            }
            else {
                const div = document.createElement("div");
                div.innerText = _headerTimeFormat(time);
                ;
                div.classList.add(CLS_TIMELINE_HEADER_ITEM);
                _timelineHeaderElement.appendChild(div);
            }
            time = new Date(time.getTime() + dateTimeService.toTime(_cellMinutes));
            _headerCellCount++;
        }
        resetCanvasSize();
        _mainCanvasBoxElement.addEventListener("scroll", (e) => {
            _timelineHeaderBoxElement.scrollLeft = _mainCanvasBoxElement.scrollLeft;
            _timelineCanvasBoxElement.scrollLeft = _mainCanvasBoxElement.scrollLeft;
        });
        _mainCanvasBoxElement.addEventListener("scroll", (e) => {
            _entityListBoxElement.scrollTop = _mainCanvasBoxElement.scrollTop;
        });
        _mainCanvasElement.addEventListener("mousemove", (e) => {
            if (e.buttons === 1) {
                _mainCanvasBoxElement.scrollLeft -= e.movementX;
                _mainCanvasBoxElement.scrollTop -= e.movementY;
            }
        });
        _mainCanvasElement.addEventListener("mousedown", (e) => {
            document.body.style.cursor = "pointer";
        });
        _mainCanvasElement.addEventListener("mouseup", (e) => {
            document.body.style.cursor = "default";
        });
        _mainCanvasElement.addEventListener("wheel", (e) => {
            resizeCanvasWhenWheel(_mainCanvasElement, e);
        });
        _timelineCanvasElement.addEventListener("wheel", (e) => {
            resizeCanvasWhenWheel(_timelineCanvasElement, e);
        });
        // prevent default zoom
        document.body.addEventListener("wheel", (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        }, {
            passive: false
        });
        // change cursor when ctrl key is pressed
        document.body.addEventListener("keydown", (e) => {
            if (e.ctrlKey) {
                document.body.style.cursor = "pointer";
            }
        });
        // restore cursor when ctrl key is released
        document.body.addEventListener("keyup", (e) => {
            document.body.style.cursor = "default";
        });
    }
    /**
     * 휠이벤트 발생시 캔버스 리사이징을 수행한다.
     * @param canvasElement
     * @param e
     * @returns
     */
    function resizeCanvasWhenWheel(canvasElement, e) {
        if (e.ctrlKey) {
            let pivotPoint = { x: 0, y: 0 }; // 리사이징 기준위치. 마우스 커서가 위치한 셀의 좌표.
            // 대상 엘리먼트에 따라 pivotPoint를 다르게 계산한다.
            if (e.target == canvasElement) {
                pivotPoint.x = e.offsetX;
                pivotPoint.y = e.offsetY;
            }
            else if (e.target.parentElement.parentElement == canvasElement) {
                pivotPoint.x = e.target.parentElement.offsetLeft + e.offsetX;
                pivotPoint.y = e.target.parentElement.offsetTop + e.offsetY;
            }
            else {
                return;
            }
            if (e.deltaY > 0) {
                sizeDownCanvas(pivotPoint.x, pivotPoint.y);
            }
            else {
                sizeUpCanvas(pivotPoint.x, pivotPoint.y);
            }
        }
    }
    /**
     * 캔버스 크기를 재조정한다.
     */
    function resetCanvasSize() {
        /**
         * main canvas에만 스크롤을 표시한다.
         * timeline header와 timeline canvas는 main canvas 수평스크롤과 동기화한다.
         * entity list는 main canvas 수직스크롤과 동기화한다.
         */
        const canvasWidth = cssService.getCellWidth() * _headerCellCount;
        const chartHeight = cssService.getChartHeight();
        const timelineHeight = cssService.getTimelineHeight();
        const scrollWidth = cssService.getScrollWidth();
        const providedCanvasHeight = chartHeight - timelineHeight - scrollWidth;
        const requiredCanvasHeight = cssService.getCellHeight() * _entities.length;
        let canvasHeight = requiredCanvasHeight;
        // 필요한 높이가 제공된 높이보다 작을 경우 높이를 맞춘다.
        if (_canAutoFit && requiredCanvasHeight < providedCanvasHeight) {
            cssService.setChartHeight(timelineHeight + scrollWidth + canvasHeight);
        }
        _timelineHeaderElement.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;
        _timelineCanvasElement.style.width = `${canvasWidth + cssService.getScrollWidth()}px`;
        _mainCanvasElement.style.width = `${canvasWidth}px`;
        _mainCanvasElement.style.height = `${canvasHeight}px`;
    }
    /**
     * 엔티티 리스트를 그린다.
     */
    function drawEntityList() {
        const canvasHeight = _mainCanvasElement.scrollHeight;
        const cellHeight = cssService.getCellHeight();
        const lineCount = Math.floor(canvasHeight / cellHeight);
        for (let i = 0; i < lineCount; i++) {
            const div = document.createElement("div");
            _entityListBoxElement.appendChild(div);
            div.classList.add(CLS_ENTITY_LIST_ITEM);
            const entity = _entities[i];
            if (entity == null)
                continue;
            div.innerText = entity.name;
        }
    }
    /**
     * 타임라인 캔버스를 그린다.
     */
    function drawTimelineCanvas() {
        _timelineCanvasElement.replaceChildren();
        if (_hasVertialLine)
            drawTimelineVertialLines();
        if (_timelinePointEvents != null && _timelinePointEvents.length > 0) {
            for (const event of _timelinePointEvents) {
                drawTimelinePointEvent(event);
            }
        }
    }
    function drawTimelineVertialLines() {
        const canvasWidth = _timelineCanvasElement.scrollWidth;
        const cellWidth = cssService.getCellWidth();
        const lineCount = Math.floor(canvasWidth / cellWidth);
        for (let i = 0; i < lineCount - 1; i++) {
            const line = document.createElement("div");
            line.classList.add(CLS_VLINE);
            line.style.left = `${cellWidth * (i + 1)}px`;
            line.style.height = `${_timelineCanvasElement.scrollHeight}px`;
            _timelineCanvasElement.appendChild(line);
        }
    }
    function drawTimelinePointEvent(event) {
        const containerElement = document.createElement("div");
        _timelineCanvasElement.appendChild(containerElement);
        const center = dateTimeService.toMinutes(event.time.valueOf() - _chartRenderStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const top = (cssService.getTimelineCanvasHeight() - cssService.getTimelineCanvasContentHeight()) / 2 - 1;
        const width = cssService.getTimelineCanvasContentHeight();
        containerElement.style.left = `${center - (width / 2)}px`;
        containerElement.style.top = `${top}px`;
        containerElement.classList.add(CLS_TIMELINE_CANVAS_ITEM);
        _timelinePointEventRender(event, _timelineCanvasElement, containerElement);
    }
    /**
     * 메인 캔버스를 그린다.
     */
    function drawMainCanvas() {
        _mainCanvasElement.replaceChildren();
        if (_hasHorizontalLine)
            drawHorizontalLines();
        if (_hasVertialLine)
            drawVertialLines();
        let rowIndex = 0;
        for (const entity of _entities) {
            drawEntityRangeEvents(entity, rowIndex);
            drawEntityPointEvents(entity, rowIndex);
            rowIndex++;
        }
        if (_globalRangeEvents != null && _globalRangeEvents.length > 0) {
            for (const event of _globalRangeEvents) {
                drawGlobalEvent(event, _globalRangeEventRender);
            }
        }
    }
    function drawVertialLines() {
        const canvasWidth = _mainCanvasElement.scrollWidth;
        const cellWidth = cssService.getCellWidth();
        const lineCount = Math.floor(canvasWidth / cellWidth);
        // 
        for (let i = 0; i < lineCount - 1; i++) {
            const line = document.createElement("div");
            line.classList.add(CLS_VLINE);
            line.style.left = `${cellWidth * (i + 1)}px`;
            line.style.height = `${_mainCanvasElement.scrollHeight}px`;
            _mainCanvasElement.appendChild(line);
        }
    }
    function drawHorizontalLines() {
        const canvasHeight = _mainCanvasElement.scrollHeight;
        const cellHeight = cssService.getCellHeight();
        const lineCount = Math.floor(canvasHeight / cellHeight);
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement("div");
            line.classList.add(CLS_HLINE);
            line.style.top = `${cellHeight * (i + 1) - 1}px`;
            line.style.width = `${_mainCanvasElement.scrollWidth}px`;
            _mainCanvasElement.appendChild(line);
        }
    }
    function drawEntityRangeEvents(entity, rowIndex) {
        if (entity.rangeEvents == null || entity.rangeEvents.length == 0)
            return;
        for (const event of entity.rangeEvents) {
            drawLocalRangeEvent(event, rowIndex, _entityRangeEventRender);
        }
    }
    function drawLocalRangeEvent(event, rowIndex, render) {
        const containerElement = document.createElement("div");
        containerElement.classList.add(CLS_MAIN_CANVAS_ITEM);
        _mainCanvasElement.appendChild(containerElement);
        const left = dateTimeService.toMinutes(event.start.valueOf() - _chartRenderStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const width = cssService.getCellWidth() * dateTimeService.toMinutes(event.end.valueOf() - event.start.valueOf()) / _cellMinutes;
        const top = (cssService.getCellHeight() * rowIndex)
            + (cssService.getCellHeight() - cssService.getCellContentHeight()) / 2
            - 1;
        containerElement.style.left = `${left}px`;
        containerElement.style.top = `${top}px`;
        containerElement.style.width = `${width}px`;
        containerElement.style.zIndex = `${Z_INDEX_ENTITY_RANGE_EVENT} `;
        containerElement.addEventListener("click", (e) => {
        });
        render(event, _mainCanvasElement, containerElement);
    }
    function drawEntityPointEvents(entity, rowIndex) {
        if (entity.pointEvents == null || entity.pointEvents.length == 0)
            return;
        for (const event of entity.pointEvents) {
            drawLocalPointEvent(event, rowIndex, _entityPointEventRender);
        }
    }
    /**
     * 포인트 이벤트를 그린다. 이벤트 시간을 중심으로 엘리먼트가 위치한다.
     * @param event
     * @param rowIndex
     */
    function drawLocalPointEvent(event, rowIndex, render) {
        const containerElement = document.createElement("div");
        _mainCanvasElement.appendChild(containerElement);
        const center = dateTimeService.toMinutes(event.time.valueOf() - _chartRenderStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const top = (cssService.getCellHeight() * rowIndex) + ((cssService.getCellHeight() - cssService.getCellContentHeight()) / 2) - 1;
        const width = cssService.getCellContentHeight();
        containerElement.style.left = `${center - (width / 2)}px`;
        containerElement.style.top = `${top}px`;
        containerElement.style.zIndex = `${Z_INDEX_ENTITY_POINT_EVENT} `;
        containerElement.classList.add(CLS_MAIN_CANVAS_ITEM);
        render(event, _mainCanvasElement, containerElement);
    }
    function drawGlobalEvent(event, render) {
        const containerElement = document.createElement("div");
        _mainCanvasElement.appendChild(containerElement);
        const left = dateTimeService.toMinutes(event.start.valueOf() - _chartRenderStartTime.valueOf()) * cssService.getCellWidth() / _cellMinutes;
        const width = cssService.getCellWidth() * dateTimeService.toMinutes(event.end.valueOf() - event.start.valueOf()) / _cellMinutes;
        containerElement.style.left = `${left}px`;
        containerElement.style.top = "0px";
        containerElement.style.width = `${width}px`;
        containerElement.style.height = "100%";
        containerElement.style.zIndex = `${Z_INDEX_GLOBAL_RANGE_EVENT} `;
        containerElement.classList.add(CLS_MAIN_CANVAS_ITEM);
        render(event, _mainCanvasElement, containerElement);
    }
    /**
     * 셀 너비 변경을 통해 캔버스 크기를 조정한다.
     * @param cellWidth 셀 너비
     * @param cellHeight 셀 높이
     * @param pivotPointX 스크롤 x기준 위치
     * @param pivotPointY 스크롤 y기준 위치
     */
    function resizeCanvas(cellWidth, cellHeight, pivotPointX, pivotPointY) {
        if (cellWidth < _minCellWidth || cellHeight < _minCellHeight) {
            return;
        }
        if (cellHeight > _maxCellHeight || cellWidth > _maxCellWidth) {
            return;
        }
        // 리사이징 후 스크롤 위치 계산
        let scrollLeft = _mainCanvasBoxElement.scrollLeft;
        if (pivotPointX) {
            const scrollOffset = pivotPointX - scrollLeft;
            const prevCellWidth = cssService.getCellWidth();
            const newPivotPointX = pivotPointX * cellWidth / prevCellWidth; // 기준점까지의 거리
            scrollLeft = newPivotPointX - scrollOffset;
        }
        let scrollTop = _mainCanvasBoxElement.scrollTop;
        if (pivotPointY) {
            const scrollOffset = pivotPointY - scrollTop;
            const prevCellHeight = cssService.getCellHeight();
            const newPivotPointY = pivotPointY * cellHeight / prevCellHeight; // 기준점까지의 거리
            scrollTop = newPivotPointY - scrollOffset;
        }
        cssService.setCellWidth(cellWidth);
        cssService.setCellHeight(cellHeight);
        cssService.setCellContentHeight(cellHeight * _mainCanvasContentRatio);
        resetCanvasSize();
        drawTimelineCanvas();
        drawMainCanvas();
        // keep scroll position
        _mainCanvasBoxElement.scrollLeft = scrollLeft;
        _mainCanvasBoxElement.scrollTop = scrollTop;
    }
    function sizeUpCanvas(pivotPointX, pivotPointY) {
        const cellWidth = cssService.getCellWidth();
        const cellHeight = cssService.getCellHeight();
        resizeCanvas(cellWidth + _resizeWidthstep, cellHeight + _resizeHeightStep, pivotPointX, pivotPointY);
    }
    function sizeDownCanvas(pivotPointX, pivotPointY) {
        const cellWidth = cssService.getCellWidth();
        const cellHeight = cssService.getCellHeight();
        resizeCanvas(cellWidth - _resizeWidthstep, cellHeight - _resizeHeightStep, pivotPointX, pivotPointY);
    }
    return {
        create,
        render,
    };
};
