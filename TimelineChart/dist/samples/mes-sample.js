window.addEventListener("load", () => {
    const mesLegendData = {
        leftLegendItems: window.leftLegendDatasource,
        rightLegendItems: window.rightLegendDatasource
    };
    const mesLegend = MesLegend();
    mesLegend.create(document.getElementById("legend-container"), mesLegendData);
    mesLegend.render();
    const container = document.getElementById("tc-container");
    const mesChartData = {
        entities: window.barcodeEntities,
        sidePointEvents: window.machinePointEvents,
        globalRangeEvents: window.machineRangeEvents
    };
    const cellMinutes = 30;
    const cellWidth = 50;
    const cellHeight = 50;
    const mesChartOptions = {
        useHoverColor: true,
        mainTitle: "XXX H/L LH Line 03",
        subTitle: "Serial No.",
        headerTitle: "Time Line",
        chartStartTime: new Date(Date.parse("2020-01-01T00:00:00")),
        chartEndTime: new Date(Date.parse("2020-01-02T00:00:00")),
        timelineTitleHeight: cellHeight,
        timelineHeaderHeight: cellHeight,
        timelineCanvasHeight: cellHeight,
        timelineCanvasContentHeight: cellHeight / 2,
        cellMinutes: cellMinutes,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        cellContentHeight: cellHeight / 2,
        canAutoFit: true,
        hasHorizontalLine: true,
        hasVerticalLine: true,
    };
    const mesChart = MesChart();
    mesChart.create(container, mesChartData, mesChartOptions);
    mesChart.render();
});
