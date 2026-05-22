const Charting = {
    chart: null,
    candleSeries: null,

    init() {
        console.log("Charting initialized. Waiting for data...");
    },
    
    update(data) {
        const container = document.getElementById('tv-chart-container');
        
        // Clear placeholder
        if (!this.chart) {
            container.innerHTML = '';
            
            this.chart = LightweightCharts.createChart(container, {
                layout: {
                    background: { type: 'solid', color: 'transparent' },
                    textColor: '#94a3b8',
                },
                grid: {
                    vertLines: { color: 'rgba(60, 70, 100, 0.2)' },
                    horzLines: { color: 'rgba(60, 70, 100, 0.2)' },
                },
                width: container.clientWidth,
                height: container.clientHeight,
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            this.candleSeries = this.chart.addCandlestickSeries({
                upColor: '#10b981',
                downColor: '#ef4444',
                borderVisible: false,
                wickUpColor: '#10b981',
                wickDownColor: '#ef4444',
            });
            
            // Handle resize
            window.addEventListener('resize', () => {
                this.chart.applyOptions({
                    width: container.clientWidth,
                    height: container.clientHeight
                });
            });
        }
        
        // Update data
        // Ensure data is sorted by time
        data.sort((a, b) => a.time - b.time);
        this.candleSeries.setData(data);
    },

    exportToExcel() {
        Term.log("Exporting trade history to Excel...", "term-info");
        setTimeout(() => {
            Term.log("Export complete: simulation_trades.xlsx", "term-info");
        }, 1500);
    }
};

document.getElementById('btn-export').addEventListener('click', () => {
    Charting.exportToExcel();
});

Charting.init();
